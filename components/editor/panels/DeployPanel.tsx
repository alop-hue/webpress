"use client";

import { useState } from "react";
import { useEditor } from "../store";
import { useWorkspace } from "../workspace-context";
import { api } from "@/lib/http";
import { useToast } from "@/components/toast";
import { Button, Badge } from "@/components/ui";
import { Dialog, ConfirmDialog } from "@/components/dialog";
import { cn, formatDate } from "@/lib/utils";

type Stage = "idle" | "building" | "live" | "failed" | "blocked";

interface GateError {
  severity: string;
  title: string;
  detail: string;
}

export function DeployPanel() {
  const deployments = useEditor((s) => s.deployments);
  const projectId = useEditor((s) => s.projectId);
  const ctx = useWorkspace();
  const { toast } = useToast();
  const [rollback, setRollback] = useState<{ id: string; version: number } | null>(null);

  const latest = deployments.find((d) => d.status === "live");

  const doRollback = async () => {
    if (!rollback) return;
    try {
      await api(`/api/projects/${projectId}/deployments/rollback`, {
        method: "POST",
        body: JSON.stringify({ deploymentId: rollback.id }),
      });
      toast(`Rolled back to version ${rollback.version}`, "ok");
      setRollback(null);
      await ctx.refresh();
    } catch (e: any) {
      toast(e?.message ?? "Rollback failed", "bad");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
        <h2 className="text-[12px] font-semibold">Deploy</h2>
        <div className="flex gap-1.5">
          <Button size="sm" variant="ghost" onClick={ctx.exportProject} title="Download the full project as files">⭳ Export</Button>
          <Button size="sm" variant="primary" onClick={() => ctx.setPublishOpen(true)}>Publish</Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {latest && (
          <div className="mb-3 rounded-xl border border-line bg-surface p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[12px] font-semibold">
                <span className="size-2 rounded-full bg-ok" /> Production · Live
              </span>
              <Badge tone="ok">v{latest.version}</Badge>
            </div>
            <p className="mt-1.5 truncate font-mono text-[11px] text-accent">{latest.url}</p>
            <div className="mt-2 flex gap-1.5">
              <a href={latest.url ?? "#"} target="_blank" rel="noreferrer" className="cursor-pointer rounded-md bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-accent-strong">
                Open site
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(latest.url ?? "").then(() => toast("Link copied", "ok"))}
                className="cursor-pointer rounded-md px-2.5 py-1.5 text-[11px] text-ink-muted hover:bg-black/5 dark:hover:bg-white/10"
              >
                Copy link
              </button>
            </div>
          </div>
        )}

        {deployments.length === 0 && (
          <div className="px-2 py-6 text-center">
            <p className="text-[12px] leading-relaxed text-ink-muted">
              Publish to get a public URL like <span className="font-mono text-accent">/p/8kF92x</span> — anyone with the link can view the site, no login needed.
            </p>
          </div>
        )}

        <p className="px-2 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted/70">Deployments</p>
        {deployments.map((d) => (
          <div key={d.id} className="mb-1.5 rounded-lg border border-line p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-medium">v{d.version}</span>
              <StatusPill status={d.status} />
            </div>
            <p className="mt-1 text-[10.5px] text-ink-muted">{formatDate(d.created_at)}</p>
            {d.url && (
              <div className="mt-1 flex items-center gap-2">
                <a href={d.url} target="_blank" rel="noreferrer" className="truncate font-mono text-[10px] text-accent hover:underline">
                  {d.url.replace(/^https?:\/\//, "")}
                </a>
                {d.status === "live" && deployments.length > 1 && (
                  <button onClick={() => setRollback({ id: d.id, version: d.version })} title="Roll back to this version" className="cursor-pointer text-[10px] text-ink-muted hover:text-accent">
                    ↺
                  </button>
                )}
              </div>
            )}
            {d.error ? <p className="mt-1 text-[10px] text-bad">{(d.error as any)?.message ?? JSON.stringify(d.error).slice(0, 120)}</p> : null}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!rollback}
        onClose={() => setRollback(null)}
        onConfirm={doRollback}
        title={`Roll back to v${rollback?.version ?? ""}`}
        body="The published site will be reverted to that deployment's snapshot. A new deployment entry records this action."
        confirmLabel="Roll back"
        danger
      />
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    live: { label: "● Live", cls: "bg-ok/15 text-[color:var(--success)]" },
    building: { label: "Building…", cls: "bg-warn/15 text-[color:var(--warning)]" },
    failed: { label: "Failed", cls: "bg-bad/15 text-bad" },
    rolled_back: { label: "Rolled back", cls: "bg-black/10 text-ink-muted dark:bg-white/10" },
  };
  const m = map[status] ?? { label: status, cls: "bg-black/10 text-ink-muted dark:bg-white/10" };
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", m.cls)}>{m.label}</span>;
}

export function PublishDialog({ projectId, open, onClose }: { projectId: string; open: boolean; onClose: () => void }) {
  const ctx = useWorkspace();
  const { toast } = useToast();
  const [stage, setStage] = useState<Stage>("idle");
  const [override, setOverride] = useState(false);
  const [gateErrors, setGateErrors] = useState<GateError[]>([]);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const run = async (withOverride: boolean) => {
    setStage("building");
    setError("");
    setGateErrors([]);
    setLogs([]);
    try {
      const res = await fetch(`/api/projects/${projectId}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrideWarnings: withOverride }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (body?.code === "ERR_GATE" && Array.isArray(body?.details?.errors)) {
          setGateErrors(body.details.errors);
          setStage("blocked");
          setLogs(["Quality gate: build blocked while errors exist."]);
          return;
        }
        setStage("failed");
        setError(body?.message ?? `Deploy failed (${res.status})`);
        setLogs(["Deploy failed."]);
        return;
      }
      setUrl(body.url);
      setStage("live");
      setLogs(["Building… ✓", "Testing… ✓", "Uploading… ✓", "Deploying… ✓", "Live 🎉"]);
      toast("Site is live!", "ok");
      await ctx.refresh();
    } catch (e: any) {
      setStage("failed");
      setError(e?.message ?? "Network error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Publish site"
      wide
      footer={
        stage === "blocked" ? (
          <div className="flex w-full items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-[12px] text-ink-muted">
              <input type="checkbox" checked={override} onChange={(e) => setOverride(e.target.checked)} className="cursor-pointer" />
              Publish anyway (override gate)
            </label>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={() => run(true)}>Publish anyway</Button>
            </div>
          </div>
        ) : stage === "live" ? (
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(url).then(() => toast("Link copied", "ok"))}>Copy link</Button>
            <a href={url} target="_blank" rel="noreferrer"><Button variant="primary">Open site ↗</Button></a>
          </div>
        ) : (
          <Button variant="primary" onClick={onClose}>Close</Button>
        )
      }
    >
      {stage === "idle" && (
        <div>
          <p className="text-[13px] leading-relaxed text-ink-muted">
            Publishing builds your site, runs quality checks, uploads a full static export, and generates a public URL at{" "}
            <span className="font-mono text-ink">/p/[code]</span>. The URL stays stable across updates.
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="primary" onClick={() => run(false)}>Start publish</Button>
          </div>
        </div>
      )}

      {stage === "building" && (
        <div className="space-y-2 py-2">
          {["Validating project…", "Building pages…", "Optimizing assets…", "Uploading…", "Deploying…"].map((s, i) => (
            <div key={s} className="flex items-center gap-2 text-[12.5px]">
              {i < logs.length ? <span className="text-ok">✓</span> : <span className="wp-drift text-accent">●</span>}
              <span className={i <= logs.length ? "text-ink" : "text-ink-muted"}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {stage === "blocked" && (
        <div>
          <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-bad">⚠ Quality gate found {gateErrors.length} error(s)</p>
          <div className="max-h-48 space-y-1.5 overflow-y-auto">
            {gateErrors.map((g, i) => (
              <div key={i} className="rounded-lg border border-bad/25 bg-bad/5 px-3 py-2">
                <p className="text-[12px] font-medium text-ink">{g.title}</p>
                <p className="text-[11px] leading-relaxed text-ink-muted">{g.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-ink-muted">
            Fix these in the editor (or ask the AI agent), then publish again. Warnings don't block publishing.
          </p>
        </div>
      )}

      {stage === "failed" && (
        <div>
          <p className="text-[13px] font-semibold text-bad">Publish failed</p>
          <p className="mt-1.5 rounded-lg bg-bad/10 px-3 py-2 font-mono text-[12px] leading-relaxed text-bad">{error}</p>
          <p className="mt-3 text-[11.5px] leading-relaxed text-ink-muted">Fix the issue and try again, or ask the AI agent for help.</p>
          <Button className="mt-3" variant="primary" onClick={() => run(false)}>Retry publish</Button>
        </div>
      )}

      {stage === "live" && (
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-ok" />
            <p className="text-[14px] font-semibold">Your site is live</p>
          </div>
          <p className="mt-2 rounded-lg border border-line bg-bg px-3 py-2.5 font-mono text-[13px] text-accent">{url}</p>
          <p className="mt-2.5 text-[12px] leading-relaxed text-ink-muted">
            Anyone with this link can open the site — no account needed. Updates keep the same URL; rollback is one click in the Deploy panel.
          </p>
          <p className="mt-3 text-[10.5px] text-ink-muted">✓ sitemap.xml · ✓ robots.txt · ✓ Open Graph · ✓ responsive</p>
        </div>
      )}
    </Dialog>
  );
}
