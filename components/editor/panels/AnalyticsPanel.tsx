/**
 * Visit analytics for the project's published sites.
 */
"use client";

import { useEffect, useState } from "react";
import { useEditor } from "../store";
import { api } from "@/lib/http";
import { Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Stats {
  total: number;
  uniques: number;
  days: Array<{ day: string; n: number }>;
  paths: Array<[string, number]>;
  devices: Array<[string, number]>;
  referrers: Array<[string, number]>;
}

export function AnalyticsPanel() {
  const projectId = useEditor((s) => s.projectId);
  const [stats, setStats] = useState<Stats | null | undefined>(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ stats: Stats | null }>(`/api/projects/${projectId}/analytics`)
      .then((r) => setStats(r.stats))
      .catch(() => setError("Could not load analytics"));
  }, [projectId]);

  if (error) return <PanelShell><p className="text-[12px] text-ink-muted">{error}</p></PanelShell>;
  if (stats === undefined) return <PanelShell><div className="flex items-center gap-2 text-ink-muted"><Spinner className="size-4" /> Loading…</div></PanelShell>;
  if (stats === null) {
    return (
      <PanelShell>
        <p className="text-[12px] leading-relaxed text-ink-muted">
          No published site yet. Once you publish, visits are tracked automatically (anonymously, with rate limiting).
        </p>
      </PanelShell>
    );
  }

  const maxDay = Math.max(1, ...stats.days.map((d) => d.n));
  const totalRefs = stats.referrers.reduce((a, [, n]) => a + n, 0);

  return (
    <PanelShell>
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Visits" value={stats.total} />
        <Stat label="Unique (est.)" value={stats.uniques} />
      </div>

      <p className="mb-1.5 mt-4 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted/70">Last 14 days</p>
      <div className="flex h-20 items-end gap-1">
        {stats.days.slice(-14).map((d) => (
          <div key={d.day} className="group relative flex flex-1 flex-col items-center justify-end" title={`${d.day}: ${d.n}`}>
            <div
              className={cn("w-full rounded-t-sm transition-all", d.n ? "bg-accent/80 hover:bg-accent" : "bg-black/10 dark:bg-white/10")}
              style={{ height: `${Math.max(4, (d.n / maxDay) * 100)}%` }}
            />
          </div>
        ))}
        {stats.days.length === 0 && <p className="self-center text-[11px] text-ink-muted">No visits recorded yet.</p>}
      </div>

      {stats.paths.length > 0 && (
        <>
          <p className="mb-1.5 mt-4 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted/70">Top pages</p>
          <List rows={stats.paths} max={stats.paths[0]?.[1] ?? 1} />
        </>
      )}
      {stats.devices.length > 0 && (
        <>
          <p className="mb-1.5 mt-4 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted/70">Devices</p>
          <List rows={stats.devices} max={stats.devices[0]?.[1] ?? 1} />
        </>
      )}
      {stats.referrers.length > 0 && (
        <>
          <p className="mb-1.5 mt-4 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted/70">Referrers</p>
          <List rows={stats.referrers} max={totalRefs} />
        </>
      )}
    </PanelShell>
  );
}

function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-3 py-2.5">
        <h2 className="text-[12px] font-semibold">Analytics</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="mt-0.5 text-[22px] font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function List({ rows, max }: { rows: Array<[string, number]>; max: number }) {
  return (
    <div className="space-y-1">
      {rows.map(([k, n]) => (
        <div key={k} className="flex items-center gap-2">
          <span className="w-24 truncate text-[11px] text-ink-muted">{k}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[.07] dark:bg-white/[.09]">
            <div className="h-full rounded-full bg-accent/70" style={{ width: `${(n / max) * 100}%` }} />
          </div>
          <span className="w-7 text-right text-[10.5px] font-medium">{n}</span>
        </div>
      ))}
    </div>
  );
}
