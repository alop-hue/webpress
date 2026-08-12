/**
 * Components panel: user's reusable components + the 100-piece pre-made Library.
 */
"use client";

import { useMemo, useState } from "react";
import { useEditor } from "../store";
import { useWorkspace } from "../workspace-context";
import { api } from "@/lib/http";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { cn } from "@/lib/utils";
import { LIBRARY_CATEGORIES, LIBRARY_COMPONENTS, libraryPreviewDoc, searchLibrary } from "@/lib/editor/component-library";
import { Library, Package, Pencil, Plus, Search, Trash2, X } from "lucide-react";

type Tab = "mine" | "library";

export function ComponentsPanel() {
  const components = useEditor((s) => s.components);
  const ctx = useWorkspace();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("mine");
  const [editName, setEditName] = useState<string | null>(null);
  const [editHtml, setEditHtml] = useState("");
  const [busy, setBusy] = useState(false);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [preview, setPreview] = useState<null | { id: string; name: string; doc: string }>(null);
  const [inserting, setInserting] = useState<string | null>(null);

  const library = useMemo(() => searchLibrary(query, category ?? undefined), [query, category]);

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

  const insertLibrary = async (id: string) => {
    setInserting(id);
    try {
      await ctx.insertLibrary(id);
      setPreview(null);
    } catch (e: any) {
      toast(e?.message ?? "Could not insert component", "bad");
    } finally {
      setInserting(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
        <h2 className="text-[12px] font-semibold">Components</h2>
      </div>

      {/* tabs */}
      <div className="flex gap-1 border-b border-line px-2 py-1.5">
        {(
          [
            { id: "mine", label: "Mine", icon: Package },
            { id: "library", label: `Library (${LIBRARY_COMPONENTS.length})`, icon: Library },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] font-medium transition-colors",
              tab === t.id ? "bg-accent text-white" : "text-ink-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
            )}
          >
            <t.icon size={13} strokeWidth={1.8} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {tab === "mine" ? (
          <>
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
                      className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[10.5px] font-medium text-accent hover:bg-accent-soft"
                    >
                      <Plus size={11} strokeWidth={2.2} /> Insert
                    </button>
                    <button
                      onClick={() => { setEditName(c.name); setEditHtml(c.html); }}
                      title="Edit template"
                      className="hidden cursor-pointer rounded-md p-1 text-ink-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/10 group-hover:inline-flex"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => remove(c.name)}
                      title="Delete"
                      className="hidden cursor-pointer rounded-md p-1 text-ink-muted hover:bg-bad/15 hover:text-bad group-hover:inline-flex"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <p className="mt-0.5 line-clamp-1 font-mono text-[10px] text-ink-muted">{c.html.slice(0, 90)}</p>
              </div>
            ))}
          </>
        ) : (
          <>
            {/* search */}
            <div className="relative mb-2">
              <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 100 components…"
                className="inp h-8 pl-8"
              />
            </div>
            {/* category chips */}
            <div className="mb-2 flex flex-wrap gap-1">
              <button
                onClick={() => setCategory(null)}
                className={cn(
                  "cursor-pointer rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition-colors",
                  category === null ? "border-accent bg-accent-soft text-accent" : "border-line text-ink-muted hover:border-accent/40"
                )}
              >
                All
              </button>
              {LIBRARY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(category === cat.id ? null : cat.id)}
                  className={cn(
                    "cursor-pointer rounded-full border px-2.5 py-1 text-[10.5px] font-medium capitalize transition-colors",
                    category === cat.id ? "border-accent bg-accent-soft text-accent" : "border-line text-ink-muted hover:border-accent/40"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <p className="mb-2 px-0.5 text-[10.5px] text-ink-muted">
              {library.length} component{library.length === 1 ? "" : "s"}
            </p>

            {library.length === 0 && (
              <div className="px-2 py-8 text-center text-[12px] text-ink-muted">
                No components match “{query}”.
              </div>
            )}

            <div className="space-y-1.5">
              {library.map((c) => (
                <div key={c.id} className="rounded-lg border border-line p-2.5 transition-colors hover:border-accent/40">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block truncate text-[12.5px] font-semibold">{c.name}</span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-ink-muted">{c.description}</span>
                      <span className="mt-1 inline-block rounded-full bg-black/5 px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wide text-ink-muted dark:bg-white/10">
                        {c.category}
                      </span>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      <button
                        onClick={() => setPreview({ id: c.id, name: c.name, doc: libraryPreviewDoc(c) })}
                        title="Preview"
                        className="cursor-pointer rounded-md px-2 py-1 text-[10.5px] font-medium text-ink-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => insertLibrary(c.id)}
                        disabled={inserting === c.id}
                        className="flex cursor-pointer items-center gap-1 rounded-md bg-accent px-2 py-1 text-[10.5px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                      >
                        {inserting === c.id ? (
                          <span className="size-3 animate-spin rounded-full border-[1.5px] border-white/40 border-t-white" />
                        ) : (
                          <Plus size={11} strokeWidth={2.2} />
                        )}
                        Insert
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* preview dialog */}
      <Dialog
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview ? `Preview — ${preview.name}` : ""}
        wide
        footer={
          preview ? (
            <>
              <Button variant="ghost" onClick={() => setPreview(null)}>
                <X size={14} /> Close
              </Button>
              <Button variant="primary" loading={inserting === preview.id} onClick={() => insertLibrary(preview.id)}>
                <Plus size={14} /> Insert into page
              </Button>
            </>
          ) : null
        }
      >
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <iframe
            key={preview?.id}
            title={`${preview?.name ?? ""} preview`}
            srcDoc={preview?.doc}
            sandbox="allow-scripts"
            className="h-[320px] w-full"
          />
        </div>
      </Dialog>

      {/* edit template dialog */}
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
