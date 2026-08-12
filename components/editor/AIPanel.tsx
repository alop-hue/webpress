/**
 * AI chat panel: streams agent runs, shows sub-agent activity, and lets the user review/apply drafts.
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditor } from "./store";
import { useWorkspace } from "./workspace-context";
import { api } from "@/lib/http";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { diffLines, compactDiff, diffStats, type DiffRow } from "@/lib/editor/diff";

interface Draft {
  path: string;
  reason: string;
  newContent: string;
  added?: boolean;
  deleted?: boolean;
}

interface LogLine {
  id: number;
  text: string;
  tone?: "muted" | "accent" | "ok" | "bad";
}

const QUICK_PROMPTS = [
  { label: "✨ Improve this site", prompt: "Inspect the project and improve the overall design, structure and polish. Fix real issues you find.", kind: "improve" },
  { label: "🎯 Fix the mobile layout", prompt: "Fix the mobile layout: check the responsive behavior and make the site look great on phones.", kind: "improve" },
  { label: "🛡️ Check security & SEO", prompt: "Audit the site for security issues and SEO problems, then fix what you can.", kind: "improve" },
  { label: "🖼 Make the hero premium", prompt: "Make the hero section look more premium and modern.", kind: "improve" },
];

export function AIPanel() {
  const projectId = useEditor((s) => s.projectId);
  const ctx = useWorkspace();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [runId, setRunId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [logs]);

  const addLog = useCallback((text: string, tone?: LogLine["tone"]) => {
    setLogs((l) => [...l, { id: ++idRef.current, text, tone }]);
  }, []);

  const run = useCallback(
    async (prompt: string, kind: string) => {
      if (!prompt.trim() || running) return;
      setRunning(true);
      setDrafts([]);
      setRunId(null);
      setLogs([{ id: ++idRef.current, text: prompt, tone: "accent" }]);
      try {
        const res = await fetch(`/api/projects/${projectId}/agents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, kind }),
        });
        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message ?? `Request failed (${res.status})`);
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buf.indexOf("\n\n")) >= 0) {
            const chunk = buf.slice(0, nl);
            buf = buf.slice(nl + 2);
            const line = chunk.split("\n").find((l) => l.startsWith("data: "));
            if (!line) continue;
            let evt: any;
            try {
              evt = JSON.parse(line.slice(6));
            } catch {
              continue;
            }
            handleEvent(evt);
          }
        }
      } catch (e: any) {
        addLog(`✕ ${e?.message ?? String(e)}`, "bad");
        addLog("Tip: add an AI provider key in Settings → AI to enable the agent.", "muted");
      } finally {
        setRunning(false);
      }
    },
    [projectId, running, addLog]
  );

  const handleEvent = useCallback(
    (evt: any) => {
      switch (evt.t) {
        case "log":
          addLog(evt.s ?? "", "muted");
          break;
        case "sub":
          addLog(`• ${evt.name}: ${evt.status === "running" ? "working…" : "done"}`, "muted");
          break;
        case "checks":
          addLog(`✓ Static checks: ${evt.checks?.map((c: any) => c.title).join("; ").slice(0, 160) ?? "done"}`, "ok");
          break;
        case "msg":
          addLog(evt.s ?? "", "accent");
          break;
        case "draft":
          break;
        case "done":
          if (evt.error) {
            addLog(`✕ ${evt.error}`, "bad");
          } else if (evt.files?.length) {
            setDrafts(evt.files);
            setRunId(evt.runId ?? null);
            addLog(`✍️ ${evt.files.length} change(s) ready for review — review the diff and apply.`, "ok");
          } else {
            addLog(evt.summary ? `✓ ${evt.summary.slice(0, 400)}` : "✓ Done", "ok");
          }
          break;
        case "error":
          addLog(`✕ ${evt.s ?? "Agent error"}`, "bad");
          break;
      }
    },
    [addLog]
  );

  const applyDrafts = async () => {
    if (!runId) return;
    setApplying(true);
    try {
      await api(`/api/projects/${projectId}/agents/apply`, { method: "POST", body: JSON.stringify({ runId }) });
      toast("Changes applied — new version created", "ok");
      setDrafts([]);
      setRunId(null);
      await ctx.refresh();
      useEditor.getState().set({ mode: "visual" });
    } catch (e: any) {
      toast(e?.message ?? "Apply failed", "bad");
    } finally {
      setApplying(false);
    }
  };

  const currentFile = useEditor((s) => s.currentFile);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[14px]">✨</span>
          <div>
            <div className="text-[12.5px] font-semibold leading-tight">AI Agent</div>
            <div className="text-[10px] text-ink-muted">Inspects your files, drafts changes, you approve</div>
          </div>
        </div>
        <button
          onClick={() => useEditor.setState({ leftNav: "settings" })}
          title="AI settings"
          className="cursor-pointer rounded-md p-1.5 text-[12px] text-ink-muted transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
        >
          ⚙️
        </button>
      </div>

      <div ref={logRef} className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-3">
        {logs.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-lg">🤖</div>
            <p className="max-w-[220px] text-[12px] leading-relaxed text-ink-muted">
              Ask the agent to improve your site. Changes are drafted as diffs for your approval — nothing is applied silently.
            </p>
          </div>
        )}
        {logs.map((l) => (
          <p
            key={l.id}
            className={cn(
              "wp-fade whitespace-pre-wrap break-words rounded-lg px-2.5 py-1.5 text-[12px] leading-relaxed",
              l.tone === "accent" && "bg-accent-soft text-ink",
              l.tone === "ok" && "bg-ok/10 text-[color:var(--success)]",
              l.tone === "bad" && "bg-bad/10 text-bad",
              (!l.tone || l.tone === "muted") && "text-ink-muted"
            )}
          >
            {l.text}
          </p>
        ))}
        {running && (
          <div className="flex items-center gap-2 px-1 py-1 text-[11.5px] text-ink-muted">
            <span className="wp-drift">●</span> Agent working…
          </div>
        )}
      </div>

      {drafts.length > 0 && (
        <div className="max-h-[42%] overflow-y-auto border-t border-line bg-surface p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              {drafts.length} draft change{drafts.length > 1 ? "s" : ""} — review before applying
            </p>
            <Button size="sm" variant="primary" loading={applying} onClick={applyDrafts}>
              Apply all
            </Button>
          </div>
          {drafts.map((d) => {
            const current = useEditor.getState().files[d.path]?.content ?? "";
            const isOpen = expanded === d.path;
            return (
              <div key={d.path} className="mb-1.5 rounded-lg border border-line">
                <button
                  onClick={() => setExpanded(isOpen ? null : d.path)}
                  className="flex w-full cursor-pointer items-center justify-between gap-2 px-2.5 py-2 text-left"
                >
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[11.5px] font-medium">{d.path}</div>
                    <div className="truncate text-[10.5px] text-ink-muted">{d.reason}</div>
                  </div>
                  <span className="shrink-0 text-[10px] text-ink-muted">{isOpen ? "▾" : "▸"}</span>
                </button>
                {isOpen && <DiffPreview a={current} b={d.newContent} />}
              </div>
            );
          })}
        </div>
      )}

      <div className="border-t border-line p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q.label}
              disabled={running}
              onClick={() => run(q.prompt, q.kind)}
              className="cursor-pointer rounded-full border border-line px-2.5 py-1 text-[10.5px] text-ink-muted transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-40"
            >
              {q.label}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(input, "chat");
            setInput("");
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                run(input, "chat");
                setInput("");
              }
            }}
            rows={2}
            disabled={running}
            placeholder={currentFile ? `Ask about your site, e.g. "Make the hero more premium"` : "Type a request…"}
            className="inp min-h-[52px] flex-1 resize-none py-2 disabled:opacity-60"
          />
          <Button type="submit" variant="primary" size="md" loading={running} disabled={!input.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

function DiffPreview({ a, b }: { a: string; b: string }) {
  const rows = useMemo(() => compactDiff(diffLines(a, b), 3), [a, b]);
  const stats = useMemo(() => diffStats(rows as DiffRow[]), [rows]);
  if (!a) {
    return (
      <div className="border-t border-line bg-ok/5 px-3 py-2">
        <p className="text-[11px] font-medium text-[color:var(--success)]">New file · {stats.adds} lines</p>
        <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap text-[10.5px] leading-relaxed text-ink-muted">{b.slice(0, 1600)}</pre>
      </div>
    );
  }
  return (
    <div className="border-t border-line bg-bg px-2 py-1.5">
      <p className="px-1 pb-1 text-[10px] font-medium text-ink-muted">
        +{stats.adds} −{stats.dels}
      </p>
      <pre className="max-h-48 overflow-auto text-[10.5px] leading-relaxed">
        {rows.map((r, i) => (
          <div
            key={i}
            className={cn(
              "whitespace-pre-wrap px-1",
              r.type === "add" && "bg-ok/15 text-[color:var(--success)]",
              r.type === "del" && "bg-bad/15 text-bad line-through decoration-bad/50",
              r.type === "same" && "text-ink-muted/70"
            )}
          >
            {r.type === "add" ? "+ " : r.type === "del" ? "− " : "  "}
            {r.text || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}
