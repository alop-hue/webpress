"use client";

import { useState } from "react";
import { useEditor } from "../store";
import { useWorkspace } from "../workspace-context";
import { api } from "@/lib/http";
import { useToast } from "@/components/toast";
import { Button, Badge, Spinner } from "@/components/ui";

const SEV_TONE = { error: "bad", warning: "warn", info: "neutral" } as const;

export function TestsPanel() {
  const suggestions = useEditor((s) => s.suggestions);
  const projectId = useEditor((s) => s.projectId);
  const ctx = useWorkspace();
  const { toast } = useToast();
  const [staticRun, setStaticRun] = useState(false);
  const [browserRun, setBrowserRun] = useState(false);
  const [browserMsg, setBrowserMsg] = useState("");

  const runStatic = async () => {
    setStaticRun(true);
    try {
      const res = await api<{ ok: boolean; count: number }>(`/api/projects/${projectId}/tests`, { method: "POST" });
      toast(`Static checks: ${res.count} findings synced`, "ok");
      await ctx.refresh();
    } catch (e: any) {
      toast(e?.message ?? "Checks failed", "bad");
    } finally {
      setStaticRun(false);
    }
  };

  const runBrowser = async () => {
    setBrowserRun(true);
    setBrowserMsg("Launching headless Chromium — checks every page at 3 viewports. This takes ~30–60s.");
    try {
      const res = await api<{ ok: boolean; passed: boolean; count: number }>(`/api/projects/${projectId}/tests/browser`, { method: "POST" });
      setBrowserMsg(`Browser suite finished: ${res.passed ? "passed" : "issues found"} (${res.count} checks).`);
      toast(res.passed ? "Browser tests passed" : "Browser tests found issues", res.passed ? "ok" : "bad");
    } catch (e: any) {
      setBrowserMsg(`Browser suite error: ${e?.message ?? "unknown"}`);
      toast("Browser tests failed to run", "bad");
    } finally {
      setBrowserRun(false);
    }
  };

  const setSuggestionStatus = async (id: string, status: "fixed" | "ignored") => {
    try {
      await api(`/api/projects/${projectId}/suggestions?id=${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      useEditor.setState({ suggestions: useEditor.getState().suggestions.map((s) => (s.id === id ? { ...s, status } : s)) });
      toast(status === "fixed" ? "Marked as fixed" : "Ignored", "ok");
    } catch {
      toast("Could not update", "bad");
    }
  };

  const applyFix = async (s: { id: string; fix: { targetPath: string; newContent: string } | null }) => {
    if (!s.fix) return;
    try {
      await api(`/api/projects/${projectId}/files`, {
        method: "POST",
        body: JSON.stringify({ files: [{ path: s.fix.targetPath, content: s.fix.newContent, kind: "file" }] }),
      });
      await setSuggestionStatus(s.id, "fixed");
      toast("Fix applied", "ok");
      await ctx.refresh();
      ctx.bumpReload();
    } catch (e: any) {
      toast(e?.message ?? "Fix failed", "bad");
    }
  };

  const open = suggestions.filter((s) => s.status === "open");
  const done = suggestions.filter((s) => s.status !== "open");

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-3 py-2.5">
        <h2 className="text-[12px] font-semibold">Tests & checks</h2>
        <div className="mt-2 flex gap-1.5">
          <Button size="sm" loading={staticRun} onClick={runStatic}>⚡ Static</Button>
          <Button size="sm" variant="outline" loading={browserRun} onClick={runBrowser}>🌐 Browser</Button>
        </div>
        {browserMsg && <p className="mt-2 text-[10.5px] leading-relaxed text-ink-muted">{browserMsg}</p>}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <p className="px-2 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted/70">
          Improve website · {open.length} open
        </p>
        {open.length === 0 && (
          <p className="px-2 py-4 text-[12px] leading-relaxed text-ink-muted">
            No open suggestions. Run checks to scan for SEO, accessibility, performance and security issues — the AI agent can fix them for you.
          </p>
        )}
        {open.map((s) => (
          <div key={s.id} className="mb-1.5 rounded-lg border border-line p-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[12px] font-medium leading-snug">{s.title}</p>
                <p className="mt-0.5 text-[10.5px] leading-relaxed text-ink-muted">{s.detail}</p>
              </div>
              <Badge tone={SEV_TONE[s.severity]}>{s.severity}</Badge>
            </div>
            <div className="mt-1.5 flex gap-1.5">
              {s.fix && (
                <button onClick={() => applyFix(s)} className="cursor-pointer rounded-md bg-accent px-2 py-1 text-[10.5px] font-semibold text-white hover:bg-accent-strong">
                  Fix
                </button>
              )}
              <button onClick={() => setSuggestionStatus(s.id, "ignored")} className="cursor-pointer rounded-md px-2 py-1 text-[10.5px] text-ink-muted hover:bg-black/5 dark:hover:bg-white/10">
                Ignore
              </button>
            </div>
          </div>
        ))}

        {done.length > 0 && (
          <>
            <p className="px-2 pb-1.5 pt-3 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted/70">Resolved · {done.length}</p>
            {done.slice(0, 8).map((s) => (
              <div key={s.id} className="mb-1 flex items-center gap-2 rounded-lg px-2 py-1.5 opacity-60">
                <span className="text-[11px]">{s.status === "fixed" ? "✓" : "—"}</span>
                <span className="truncate text-[11.5px] text-ink-muted">{s.title}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
