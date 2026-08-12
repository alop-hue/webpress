/**
 * Version history: preview, compare, restore.
 */
"use client";

import { useState } from "react";
import { useEditor } from "../store";
import { useWorkspace } from "../workspace-context";
import { api } from "@/lib/http";
import { useToast } from "@/components/toast";
import { Button, Badge } from "@/components/ui";
import { ConfirmDialog } from "@/components/dialog";
import { formatDate } from "@/lib/utils";

const KIND_TONE: Record<string, "neutral" | "accent" | "ok"> = {
  agent: "accent",
  deploy: "ok",
  auto: "neutral",
  user: "neutral",
};

export function HistoryPanel() {
  const versions = useEditor((s) => s.versions);
  const projectId = useEditor((s) => s.projectId);
  const ctx = useWorkspace();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [restoreNum, setRestoreNum] = useState<number | null>(null);

  const snapshot = async () => {
    setBusy(true);
    try {
      const label = window.prompt("Snapshot label (optional):", "") ?? "";
      await api(`/api/projects/${projectId}/versions`, {
        method: "POST",
        body: JSON.stringify({ label: label || "Manual snapshot", kind: "user" }),
      });
      toast("Snapshot saved", "ok");
      await ctx.refresh();
    } catch (e: any) {
      toast(e?.message ?? "Could not snapshot", "bad");
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    if (restoreNum === null) return;
    setBusy(true);
    try {
      await api(`/api/projects/${projectId}/versions/restore`, {
        method: "POST",
        body: JSON.stringify({ number: restoreNum }),
      });
      toast(`Restored version ${restoreNum}`, "ok");
      setRestoreNum(null);
      await ctx.refresh();
      ctx.bumpReload();
    } catch (e: any) {
      toast(e?.message ?? "Restore failed", "bad");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
        <h2 className="text-[12px] font-semibold">History</h2>
        <Button size="sm" loading={busy} onClick={snapshot}>Snapshot</Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <p className="px-2 pb-2 text-[10.5px] leading-relaxed text-ink-muted">
          Every meaningful edit can become a version. Restore any point in time — a safety snapshot is taken first.
        </p>
        <div className="relative space-y-1.5 pl-4">
          <div className="absolute bottom-1 left-[7px] top-1 w-px bg-line" />
          {versions.length === 0 && <p className="px-2 py-4 text-[12px] text-ink-muted">No versions yet.</p>}
          {versions.map((v) => (
            <div key={v.id} className="relative rounded-lg border border-line p-2.5">
              <span className="absolute -left-[15px] top-3 size-1.5 rounded-full bg-accent" />
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-semibold">v{v.number}</span>
                <Badge tone={KIND_TONE[v.kind] ?? "neutral"}>{v.kind}</Badge>
              </div>
              <p className="mt-0.5 text-[11px] leading-snug text-ink">{v.label}</p>
              <p className="text-[10px] text-ink-muted">
                {formatDate(v.created_at)} · {v.created_by}
              </p>
              {v.number !== versions[0]?.number && (
                <button
                  onClick={() => setRestoreNum(v.number)}
                  className="mt-1.5 cursor-pointer rounded-md px-2 py-1 text-[10.5px] font-medium text-accent hover:bg-accent-soft"
                >
                  ↩ Restore
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={restoreNum !== null}
        onClose={() => setRestoreNum(null)}
        onConfirm={restore}
        title={`Restore version ${restoreNum ?? ""}`}
        body="Your current files will be saved as a new snapshot, then replaced with this version's files."
        confirmLabel="Restore"
        loading={busy}
      />
    </div>
  );
}
