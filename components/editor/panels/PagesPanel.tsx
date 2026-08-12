/**
 * Pages management: create, rename, duplicate, delete, set home.
 */
"use client";

import { useEffect, useState } from "react";
import { useEditor } from "../store";
import { useWorkspace } from "../workspace-context";
import { api } from "@/lib/http";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui";
import { Dialog, ConfirmDialog } from "@/components/dialog";
import { cn } from "@/lib/utils";
import { pageToPath } from "@/lib/editor/fs";

export function PagesPanel() {
  const pages = useEditor((s) => s.pages);
  const currentFile = useEditor((s) => s.currentFile);
  const ctx = useWorkspace();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [deletePath, setDeletePath] = useState<string | null>(null);

  useEffect(() => {
    const onNew = () => setOpen(true);
    window.addEventListener("wp:new-page", onNew);
    return () => window.removeEventListener("wp:new-page", onNew);
  }, []);

  const create = async () => {
    const p = path.trim().startsWith("/") ? path.trim() : "/" + (path.trim() || "new-page");
    if (!title.trim()) {
      toast("Give the page a title", "bad");
      return;
    }
    setBusy(true);
    try {
      await api(`/api/projects/${useEditor.getState().projectId}/pages`, {
        method: "POST",
        body: JSON.stringify({ path: p, title: title.trim(), description: "", og_image: "" }),
      });
      toast("Page created", "ok");
      setOpen(false);
      setPath("");
      setTitle("");
      await ctx.refresh();
      ctx.openPage(p);
    } catch (e: any) {
      toast(e?.message ?? "Could not create page", "bad");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!deletePath) return;
    try {
      await api(`/api/projects/${useEditor.getState().projectId}/pages?path=${encodeURIComponent(deletePath)}`, { method: "DELETE" });
      toast("Page deleted", "ok");
      await ctx.refresh();
    } catch (e: any) {
      toast(e?.message ?? "Could not delete page", "bad");
    } finally {
      setDeletePath(null);
    }
  };

  const patchMeta = async (p: { path: string }, data: { title?: string; description?: string }) => {
    try {
      await api(`/api/projects/${useEditor.getState().projectId}/pages`, {
        method: "PATCH",
        body: JSON.stringify({ path: p.path, ...data }),
      });
      useEditor.getState().patchPage(p.path, data);
      toast("Saved", "ok");
    } catch {
      toast("Could not save", "bad");
    }
  };

  const activePage = pages.find((p) => pageToPath(p.path) === currentFile);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
        <h2 className="text-[12px] font-semibold">Pages</h2>
        <Button size="sm" onClick={() => setOpen(true)}>＋ New</Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {pages.length === 0 && (
          <p className="px-2 py-6 text-center text-[12px] leading-relaxed text-ink-muted">No pages yet. Create your first page to start building.</p>
        )}
        {pages.map((p) => {
          const active = pageToPath(p.path) === currentFile;
          return (
            <div
              key={p.path}
              className={cn(
                "group mb-1 cursor-pointer rounded-lg border px-2.5 py-2 transition-colors",
                active ? "border-accent/40 bg-accent-soft/60" : "border-transparent hover:bg-black/5 dark:hover:bg-white/5"
              )}
              onClick={() => ctx.openPage(p.path)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={cn("font-mono text-[11.5px] font-medium", p.path === "/" ? "text-accent" : "")}>{p.path}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletePath(p.path);
                  }}
                  title="Delete page"
                  className="hidden shrink-0 cursor-pointer rounded p-0.5 text-[11px] text-ink-muted hover:bg-bad/15 hover:text-bad group-hover:inline-block"
                >
                  ✕
                </button>
              </div>
              <input
                defaultValue={p.title}
                onClick={(e) => e.stopPropagation()}
                onBlur={(e) => e.target.value.trim() && e.target.value.trim() !== p.title && patchMeta(p, { title: e.target.value.trim() })}
                onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                className="mt-0.5 w-full bg-transparent text-[12px] text-ink outline-none hover:underline focus:underline"
              />
              {active && (
                <textarea
                  defaultValue={p.description}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={(e) => e.target.value.trim() !== p.description && patchMeta(p, { description: e.target.value.trim() })}
                  placeholder="Meta description (SEO)…"
                  rows={2}
                  className="mt-1.5 w-full resize-none rounded-md border border-line bg-surface/60 px-2 py-1 text-[11px] text-ink-muted outline-none placeholder:text-ink-muted/50 focus:border-accent"
                />
              )}
            </div>
          );
        })}
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Create page"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={busy} onClick={create}>Create</Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-[12px] font-medium text-ink-muted">Route</span>
            <input className="inp h-9 font-mono" value={path} onChange={(e) => setPath(e.target.value)} placeholder="/about" autoFocus />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-medium text-ink-muted">Page title</span>
            <input className="inp h-9" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="About us" onKeyDown={(e) => e.key === "Enter" && create()} />
          </label>
          <p className="text-[11px] leading-relaxed text-ink-muted">
            A matching HTML file is created automatically (e.g. <code className="font-mono">about.html</code>).
          </p>
        </div>
      </Dialog>

      <ConfirmDialog
        open={!!deletePath}
        onClose={() => setDeletePath(null)}
        onConfirm={remove}
        title="Delete page"
        body={`Delete ${deletePath} and its HTML file? This can be restored from History.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
