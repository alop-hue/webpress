/**
 * Reusable components: list, insert, delete.
 */
"use client";

import { useState } from "react";
import { useEditor } from "../store";
import { useWorkspace } from "../workspace-context";
import { api } from "@/lib/http";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { cn } from "@/lib/utils";

export function ComponentsPanel() {
  const components = useEditor((s) => s.components);
  const ctx = useWorkspace();
  const { toast } = useToast();
  const [editName, setEditName] = useState<string | null>(null);
  const [editHtml, setEditHtml] = useState("");
  const [busy, setBusy] = useState(false);

  const saveEdit = async () => {
    if (!editName) return;
    setBusy(true);
    try {
      await api(`/api/projects/${useEditor.getState().projectId}/components?name=${encodeURIComponent(editName)}`, {
        method: "PATCH",
        body: JSON.stringify({ name: editName, html: editHtml }),
      });
      toast(`Updated "${editName}" template`, "ok");
      setEditName(null);
      await ctx.refresh();
    } catch (e: any) {
      toast(e?.message ?? "Could not save component", "bad");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (name: string) => {
    if (!window.confirm(`Delete component "${name}"? Existing instances on pages are kept.`)) return;
    try {
      await api(`/api/projects/${useEditor.getState().projectId}/components?name=${encodeURIComponent(name)}`, { method: "DELETE" });
      toast("Component deleted", "ok");
      await ctx.refresh();
    } catch (e: any) {
      toast(e?.message ?? "Could not delete", "bad");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
        <h2 className="text-[12px] font-semibold">Components</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {components.length === 0 && (
          <div className="px-2 py-6 text-center">
            <p className="text-[12px] leading-relaxed text-ink-muted">
              Reusable blocks for your site.
            </p>
            <p className="mt-2 text-[11.5px] text-ink-muted/80">
              Select an element in Visual mode → <b>Save as component</b> to create one.
            </p>
          </div>
        )}
        {components.map((c) => (
          <div key={c.name} className="group mb-1.5 rounded-lg border border-line p-2.5 transition-colors hover:border-accent/40">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[12.5px] font-semibold">{c.name}</span>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => ctx.insertComponent(c.name)}
                  className="cursor-pointer rounded-md px-2 py-1 text-[10.5px] font-medium text-accent hover:bg-accent-soft"
                >
                  Insert
                </button>
                <button
                  onClick={() => { setEditName(c.name); setEditHtml(c.html); }}
                  title="Edit template"
                  className="hidden cursor-pointer rounded-md px-1.5 py-1 text-[11px] text-ink-muted hover:bg-black/5 dark:hover:bg-white/10 group-hover:inline-block"
                >
                  ✎
                </button>
                <button
                  onClick={() => remove(c.name)}
                  title="Delete"
                  className="hidden cursor-pointer rounded-md px-1.5 py-1 text-[11px] text-ink-muted hover:bg-bad/15 hover:text-bad group-hover:inline-block"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="mt-0.5 line-clamp-1 font-mono text-[10px] text-ink-muted">{c.html.slice(0, 90)}</p>
          </div>
        ))}
      </div>

      <Dialog
        open={!!editName}
        onClose={() => setEditName(null)}
        title={`Edit "${editName}" template`}
        wide
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditName(null)}>Cancel</Button>
            <Button variant="primary" loading={busy} onClick={saveEdit}>Save template</Button>
          </>
        }
      >
        <p className={cn("mb-2 text-[11.5px] leading-relaxed text-ink-muted")}>
          New instances use this template. Instances already in pages keep their content (update them by editing the page HTML).
        </p>
        <textarea
          value={editHtml}
          onChange={(e) => setEditHtml(e.target.value)}
          rows={12}
          spellCheck={false}
          className="w-full resize-y rounded-lg border border-line bg-bg px-3 py-2 font-mono text-[11.5px] leading-relaxed text-ink outline-none focus:border-accent"
        />
      </Dialog>
    </div>
  );
}
