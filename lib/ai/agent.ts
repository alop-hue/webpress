/**
 * Main AI agent: builds context, spawns inspection sub-agents, and runs a tool loop that produces user-approved draft edits.
 */
import "server-only";

import { complete, type ChatMessage, type ToolCall, type ToolSpec } from "./providers";
import { buildContext } from "./context";
import { runStaticChecks } from "@/lib/qa/static";
import { parse, type HTMLElement } from "node-html-parser";

export interface AgentFile {
  path: string;
  content: string;
  kind: "file" | "folder";
}

export interface AgentSnapshot {
  files: AgentFile[];
  pages: { path: string; title: string; description: string }[];
  components: { name: string; html: string; css: string }[];
  settings: { siteName?: string };
}

export interface DraftEdit {
  path: string;
  reason: string;
  newContent: string;
  added?: boolean;
  deleted?: boolean;
}

export interface AgentEvent {
  t: "log" | "sub" | "draft" | "msg" | "done" | "error" | "checks";
  s?: string;
  name?: string;
  status?: string;
  path?: string;
  runId?: string;
  files?: DraftEdit[];
  checks?: Array<{ severity: string; title: string }>;
  draft?: DraftEdit;
}

const MAX_TOOL_ROUNDS = 10;

const SUB_AGENTS: Array<{ key: string; label: string; system: string }> = [
  {
    key: "ui",
    label: "UI agent",
    system:
      "You are the UI agent. Review this website project for: spacing rhythm, typography, visual hierarchy, alignment, responsive layout issues, and visual consistency. Report concrete issues with file paths and line-level hints. JSON only: {\"issues\":[{\"severity\":\"critical|major|minor\",\"title\":\"...\",\"detail\":\"...\",\"file\":\"...\"}]}",
  },
  {
    key: "code",
    label: "Code agent",
    system:
      "You are the code agent. Find bugs, broken markup, duplicated code, maintainability problems, and likely runtime errors in this HTML/CSS/JS project. JSON only: {\"issues\":[{\"severity\":\"critical|major|minor\",\"title\":\"...\",\"detail\":\"...\",\"file\":\"...\"}]}",
  },
  {
    key: "a11y",
    label: "Accessibility agent",
    system:
      "You are the accessibility agent. Check WCAG issues: keyboard navigation, contrast, alt text, semantic HTML, focus states, labels. JSON only: {\"issues\":[{\"severity\":\"critical|major|minor\",\"title\":\"...\",\"detail\":\"...\",\"file\":\"...\"}]}",
  },
  {
    key: "seo",
    label: "SEO agent",
    system:
      "You are the SEO agent. Check titles, meta descriptions, structured data, heading semantics, Open Graph, and indexing problems. JSON only: {\"issues\":[{\"severity\":\"critical|major|minor\",\"title\":\"...\",\"detail\":\"...\",\"file\":\"...\"}]}",
  },
  {
    key: "perf",
    label: "Performance agent",
    system:
      "You are the performance agent. Check for large images, unused css, excessive JS, render-blocking resources, missing lazy loading, heavy assets. JSON only: {\"issues\":[{\"severity\":\"critical|major|minor\",\"title\":\"...\",\"detail\":\"...\",\"file\":\"...\"}]}",
  },
  {
    key: "security",
    label: "Security agent",
    system:
      "You are the security agent. Check for unsafe scripts, XSS risks, dangerous HTML, insecure external resources, exposed secrets, unsafe iframes. JSON only: {\"issues\":[{\"severity\":\"critical|major|minor\",\"title\":\"...\",\"detail\":\"...\",\"file\":\"...\"}]}",
  },
];

const TOOLS: ToolSpec[] = [
  {
    name: "list_files",
    description: "List all files in the project (with sizes).",
    parameters: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "read_file",
    description: "Read a file's full content; large files are truncated.",
    parameters: {
      type: "object",
      properties: { path: { type: "string", description: "Path inside the project, e.g. index.html" } },
      required: ["path"],
      additionalProperties: false,
    },
  },
  {
    name: "write_file",
    description:
      "Create or replace a file's content. This is a DRAFT: the user reviews a diff before it is saved. Add data-wp-el=\"uid\" attrs when adding styles via classes; keep the document valid HTML.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Path inside the project, e.g. index.html or css/style.css" },
        content: { type: "string", description: "The full new file content" },
        reason: { type: "string", description: "Why this change is needed (shown to the user)" },
      },
      required: ["path", "content", "reason"],
      additionalProperties: false,
    },
  },
  {
    name: "run_checks",
    description: "Run the built-in static quality checks (SEO, a11y, links, security) and return the failures.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
  },
];

export async function runAgent(opts: {
  userId: string;
  projectId: string;
  snapshot: AgentSnapshot;
  prompt: string;
  kind: "chat" | "generate" | "improve" | "qa";
  perms: { read: boolean; edit: boolean; runTests: boolean; deleteFiles: "ask" | "allow" | "deny" };
  onEvent: (e: AgentEvent) => void;
}): Promise<{ runId: string; drafts: DraftEdit[]; summary: string }> {
  const { userId, prompt, onEvent } = opts;
  const store = new Map<string, AgentFile>();
  for (const f of opts.snapshot.files) store.set(f.path, f);
  const drafts: DraftEdit[] = [];
  const appliedPaths = new Set<string>();

  const ctx = buildContext(opts.snapshot);

  const writeFile = (path: string, content: string, reason: string): string => {
    if (!opts.perms.edit) return "ERROR: You do not have edit permission. Stop proposing file writes.";
    const secretHits = ["sk-", "ghp_", "-----BEGIN"].filter((x) => content.includes(x));
    if (secretHits.length) return `ERROR: Refusing draft — the content contains an exposed secret pattern (${secretHits.join(", ")}). Never put secrets in site files.`;
    if (content.length > 1_500_000) return "ERROR: File too large (1.5MB cap).";
    const existing = store.get(path);
    if (existing && existing.content === content) return "OK (unchanged)";
    store.set(path, { path, content, kind: "file" });
    const existingDraft = drafts.find((d) => d.path === path && !d.deleted);
    if (existingDraft) existingDraft.newContent = content;
    else drafts.push({ path, reason, newContent: content, added: !existing });
    appliedPaths.add(path);
    onEvent({ t: "draft", path, draft: { path, reason, newContent: content, added: !existing } });
    return `OK: drafted ${path}. The user must approve before it is saved.`;
  };

  const listFiles = () =>
    JSON.stringify({
      files: [...store.values()].map((f) => ({ path: f.path, size: f.content.length })),
      pages: opts.snapshot.pages.map((p) => p.path),
      components: opts.snapshot.components.map((c) => c.name),
    });

  const readFile = (path: string): string => {
    const f = store.get(path);
    if (!f) return "ERROR: file not found";
    return f.content.length > 40000 ? f.content.slice(0, 40000) + `\n…[truncated ${f.content.length} chars]` : f.content;
  };

  const runChecks = () => {
    const results = runStaticChecks(
      [...store.values()].filter((f) => f.kind === "file"),
      opts.snapshot.pages
    );
    const failures = results.filter((r) => r.severity !== "ok").map((r) => ({ severity: r.severity, title: r.title, detail: r.detail }));
    onEvent({
      t: "checks",
      checks: failures.map((f) => ({ severity: f.severity, title: f.title })),
    });
    return JSON.stringify(failures.length ? failures : [{ severity: "ok", title: "All static checks pass", detail: "" }]);
  };

  // ---- sub-agents (parallel inspection) ----
  const subFindings: string[] = [];
  if (opts.kind !== "chat") {
    const fileDigest = [...store.values()]
      .filter((f) => f.kind === "file")
      .slice(0, 14)
      .map((f) => {
        const isHtml = f.path.endsWith(".html");
        const core = isHtml ? extractText(f.content) : f.content.slice(0, 2500);
        return `### ${f.path}\n${core}\n`;
      })
      .join("\n");
    onEvent({ t: "log", s: "Spawning inspection sub-agents…" });
    const perms = opts.perms;
    const results = await Promise.allSettled(
      SUB_AGENTS.map(async (sub) => {
        onEvent({ t: "sub", name: sub.label, status: "running" });
        const res = await complete(userId, [{ role: "system", content: sub.system }, { role: "user", content: `Project files:\n${fileDigest}` }], { maxTokens: 2000, temperature: 0.2 });
        onEvent({ t: "sub", name: sub.label, status: "done" });
        return `[${sub.label}]\n${res.text.slice(0, 3000)}`;
      })
    );
    for (const r of results) subFindings.push(r.status === "fulfilled" ? r.value : `[sub-agent failed: ${String(r.reason).slice(0, 200)}]`);
  }

  // ---- main agent loop ----
  const systemMessages: ChatMessage[] = [
    { role: "system", content: ctx },
    {
      role: "system",
      content:
        "You are the Webpress builder agent. You edit the user's real website files to fulfill their request. Rules:\n" +
        "1. Use tools to inspect files first. Never invent file contents.\n" +
        "2. write_file creates DRAFT edits — the user approves via the diff UI. Good drafts = minimal, surgical, high-quality changes.\n" +
        "3. Keep the design system (colors, fonts, spacing, existing classes) consistent.\n" +
        "4. Always keep valid HTML/CSS/JS. When you write HTML pages, include <meta charset>, <meta name=viewport>, title, description, semantic landmarks, an h1, alt text on images, and skip links.\n" +
        "5. When you add styles to elements, add class-style rules inside <style> or the css files. Prefer editing CSS files over inline styles.\n" +
        "6. Respect prefers-reduced-motion: wrap animations in a media query.\n" +
        "7. Never add external dependencies unless the user asks. No tracking pixels.\n" +
        "8. You may delete files only if truly needed; otherwise keep the file tree clean and minimal.",
    },
  ];
  if (subFindings.length) {
    systemMessages.push({
      role: "system",
      content: `Independent expert findings (verify before trusting, fix what's real):\n${subFindings.join("\n\n")}`,
    });
  }
  const messages: ChatMessage[] = [...systemMessages, { role: "user", content: prompt }];

  let rounds = 0;
  let finalText = "";
  for (; rounds < MAX_TOOL_ROUNDS; rounds++) {
    const res = await complete(userId, messages, { tools: TOOLS, maxTokens: 8000 });
    finalText = res.text || finalText;
    if (!res.toolCalls.length) break;
    const toolResults: ChatMessage[] = [];
    for (const tc of res.toolCalls) {
      onEvent({ t: "log", s: `Tool: ${tc.name}(${tc.args.path ?? tc.args.file ?? ""})` });
      let out: string;
      try {
        out = executeTool(tc, { listFiles, readFile, writeFile, runChecks, perms: opts.perms });
      } catch (e) {
        out = `ERROR: ${String(e).slice(0, 200)}`;
      }
      toolResults.push({ role: "tool", toolCallId: tc.id, content: out.slice(0, 4000) });
    }
    messages.push({ role: "assistant", content: res.text || "", toolCallId: undefined });
    messages.push(...toolResults);
  }
  if (rounds >= MAX_TOOL_ROUNDS) finalText += "\n\n(Stopped after the safety cap of tool rounds.)";

  onEvent({ t: "msg", s: finalText.slice(0, 2000) });
  return { runId: "", drafts, summary: finalText };
}

function executeTool(
  tc: ToolCall,
  env: {
    listFiles: () => string;
    readFile: (p: string) => string;
    writeFile: (p: string, c: string, r: string) => string;
    runChecks: () => string;
    perms: { read: boolean; edit: boolean; deleteFiles: "ask" | "allow" | "deny" };
  }
): string {
  switch (tc.name) {
    case "list_files":
      return env.listFiles();
    case "read_file":
      return env.readFile(String(tc.args.path ?? ""));
    case "write_file":
      return env.writeFile(String(tc.args.path ?? ""), String(tc.args.content ?? ""), String(tc.args.reason ?? ""));
    case "run_checks":
      return env.runChecks();
    default:
      return `ERROR: unknown tool ${tc.name}`;
  }
}

function extractText(html: string): string {
  try {
    const doc = parse(html);
    doc.querySelectorAll("script,style").forEach((n) => n.remove());
    const body = doc.querySelector("body");
    const sel: HTMLElement[] = body ? [body] : [doc];
    let out = "";
    const walk = (el: HTMLElement, depth: number) => {
      if (depth > 14) return;
      const tag = el.tagName?.toLowerCase?.() ?? "";
      if (tag === "script" || tag === "style" || tag === "template") return;
      if (tag && !["p", "h1", "h2", "h3", "h4", "a", "button", "li", "img", "section", "div", "span"].includes(tag) && tag !== "div") return;
      const txt = el.textContent?.trim?.() ?? "";
      const imgAlt = tag === "img" ? ` [img:${el.getAttribute("src") ?? ""}]` : "";
      if (txt && txt.length < 180) out += `${"  ".repeat(depth)}<${tag}> ${txt.slice(0, 150)}${imgAlt}\n`;
      for (const ch of el.childNodes ?? []) {
        if (ch.nodeType === 1) walk(ch as HTMLElement, depth + 1);
      }
    };
    for (const s of sel) walk(s, 0);
    return out.slice(0, 24000);
  } catch {
    return html.slice(0, 12000);
  }
}