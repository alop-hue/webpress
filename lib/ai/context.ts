import type { AgentSnapshot } from "./agent";

/** Structured project context for the agent — design system, files, routes. */
export function buildContext(snap: AgentSnapshot): string {
  const lines: string[] = [];
  lines.push("## PROJECT CONTEXT (Webpress)");
  lines.push(`Site name: ${snap.settings.siteName || "Untitled site"}`);
  lines.push("");

  const files = snap.files.filter((f) => f.kind === "file");
  lines.push(`## FILES (${files.length})`);
  lines.push(files.map((f) => `- ${f.path}`).join("\n") || "- (empty)");
  lines.push("");

  lines.push("## PAGES");
  lines.push(
    snap.pages.map((p) => `- ${p.path} — ${p.title}`).join("\n") || "- (none)"
  );
  lines.push("");

  if (snap.components.length) {
    lines.push("## REUSABLE COMPONENTS");
    lines.push(snap.components.map((c) => `- ${c.name}`).join("\n"));
    lines.push("");
  }

  // css summary: class inventory + design tokens
  const cssFiles = files.filter((f) => f.path.endsWith(".css"));
  if (cssFiles.length) {
    lines.push("## DESIGN SYSTEM (from CSS files)");
    const colorRe = /(--[\w-]+\s*:\s*#[0-9a-fA-F]{3,8}|#[0-9a-fA-F]{6}\b)/g;
    const colors = new Set<string>();
    const fontRe = /font-family\s*:\s*([^;}]+)/g;
    const fonts = new Set<string>();
    for (const f of cssFiles) {
      for (const m of f.content.matchAll(colorRe)) colors.add(m[1]);
      for (const m of f.content.matchAll(fontRe)) fonts.add(m[1].trim());
    }
    if (colors.size) lines.push("Colors: " + [...colors].slice(0, 24).join(", "));
    if (fonts.size) lines.push("Fonts: " + [...fonts].slice(0, 6).join(", "));
    lines.push("");
  }

  lines.push(
    "Editing rules: keep the document well-formed and the design consistent. Visualized elements carry data-wp-el attributes (style hooks) — preserve them when editing HTML."
  );
  return lines.join("\n");
}