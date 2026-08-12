/**
 * Editor shell: hydration, debounced autosave, visual undo, keyboard shortcuts, and panel layout.
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditor } from "./store";
import { CanvasApiCtx, PropsPanel, type CanvasApi } from "./PropsPanel";
import { WorkspaceCtxValue, type WorkspaceCtx } from "./workspace-context";
import { VisualCanvas } from "./VisualCanvas";
import { CodeEditor } from "./CodeEditor";
import { PreviewPane } from "./PreviewPane";
import { AIPanel } from "./AIPanel";
import { CommandPalette } from "./CommandPalette";
import { SidebarNav } from "./SidebarNav";
import { PagesPanel } from "./panels/PagesPanel";
import { ComponentsPanel } from "./panels/ComponentsPanel";
import { AssetsPanel } from "./panels/AssetsPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { HistoryPanel } from "./panels/HistoryPanel";
import { TestsPanel } from "./panels/TestsPanel";
import { DeployPanel, PublishDialog } from "./panels/DeployPanel";
import { SettingsPanel } from "./panels/SettingsPanel";
import { AnalyticsPanel } from "./panels/AnalyticsPanel";
import { api } from "@/lib/http";
import { useToast } from "@/components/toast";
import { Button, Spinner } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { cn } from "@/lib/utils";
import { pageToPath, type FileEntry } from "@/lib/editor/fs";
import { cleanComponentHtml, wrapComponent } from "@/lib/editor/components";

export default function EditorWorkspace({ projectId }: { projectId: string }) {
  const store = useEditor();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [canvasApi, setCanvasApi] = useState<CanvasApi | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [saveCompOpen, setSaveCompOpen] = useState(false);
  const [compName, setCompName] = useState("");

  const reloadSignalRef = useRef(0);
  const undoStack = useRef<Array<{ path: string; doc: string; at: number }>>([]);
  const dirtyRef = useRef<Record<string, boolean>>({});
  dirtyRef.current = store.dirty;

  const storeRef = useRef(store);
  storeRef.current = store;

  // ---------- hydration ----------
  const refresh = useCallback(async () => {
    const [proj, files, pages, comps, assets, deps, vers, sugg] = await Promise.allSettled([
      api<{ project: { id: string; name: string; slug: string; settings: Record<string, any> } }>(`/api/projects/${projectId}`),
      api<{ files: FileEntry[] }>(`/api/projects/${projectId}/files`),
      api<{ pages: any[] }>(`/api/projects/${projectId}/pages`),
      api<{ components: any[] }>(`/api/projects/${projectId}/components`),
      api<{ assets: any[]; urlBase: string }>(`/api/projects/${projectId}/assets`),
      api<{ deployments: any[] }>(`/api/projects/${projectId}/deployments`),
      api<{ versions: any[] }>(`/api/projects/${projectId}/versions`),
      api<{ suggestions: any[] }>(`/api/projects/${projectId}/suggestions`),
    ]);
    const fileMap: Record<string, FileEntry> = {};
    const ok = <T,>(r: PromiseSettledResult<T>): T | null => (r.status === "fulfilled" ? r.value : null);
    for (const f of ok(files)?.files ?? []) fileMap[f.path] = f;
    // Never clobber locally-dirty files with server state (unsaved edits win)
    const local = useEditor.getState();
    for (const [path, isDirty] of Object.entries(local.dirty)) {
      if (isDirty && local.files[path]) fileMap[path] = local.files[path];
    }
    useEditor.setState({
      projectId,
      project: ok(proj)?.project ?? null,
      files: fileMap,
      pages: ok(pages)?.pages ?? [],
      components: ok(comps)?.components ?? [],
      assets: ok(assets)?.assets ?? [],
      assetUrlBase: ok(assets)?.urlBase ?? "",
      deployments: ok(deps)?.deployments ?? [],
      versions: ok(vers)?.versions ?? [],
      suggestions: ok(sugg)?.suggestions ?? [],
      loaded: true,
    });
    const failed = [proj, files, pages, comps, assets, deps, vers, sugg].filter((r) => r.status === "rejected").length;
    if (failed > 0) {
      const reason = [proj, files, pages, comps, assets, deps, vers, sugg].find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
      toast(`Loaded with ${failed} section(s) unavailable: ${String(reason?.reason ?? "").slice(0, 80)}`, "bad");
    }
  }, [projectId, toast]);

  useEffect(() => {
    refresh()
      .catch((e) => toast(e?.message ?? "Failed to load project", "bad"))
      .finally(() => setLoading(false));
  }, [refresh, toast]);

  // ---------- autosave ----------
  const flushSave = useCallback(async () => {
    const dirty = dirtyRef.current;
    const paths = Object.keys(dirty).filter((p) => dirty[p]);
    if (!paths.length) return;
    setSaving(true);
    try {
      const payload = paths.map((p) => ({
        path: p,
        content: storeRef.current.files[p]?.content ?? "",
        kind: "file" as const,
      }));
      await api(`/api/projects/${projectId}/files`, { method: "POST", body: JSON.stringify({ files: payload }) });
      const cleared = { ...dirtyRef.current };
      for (const p of paths) delete cleared[p];
      dirtyRef.current = cleared;
      useEditor.setState({ dirty: cleared });
      setLastSavedAt(Date.now());
    } catch {
      toast("Autosave failed — will retry", "bad");
    } finally {
      setSaving(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    const dirtyPaths = Object.keys(store.dirty).filter((p) => store.dirty[p]);
    if (!dirtyPaths.length) return;
    const t = setTimeout(() => flushSave(), 1400);
    return () => clearTimeout(t);
  }, [store.dirty, flushSave]);

  // ---------- visual undo ----------
  const onNeedsSave = useCallback((doc: string) => {
    const path = storeRef.current.currentFile;
    const stack = undoStack.current;
    const now = Date.now();
    if (stack.length && stack[stack.length - 1].path === path && now - stack[stack.length - 1].at < 500) {
      stack[stack.length - 1] = { path, doc, at: now };
    } else {
      stack.push({ path, doc, at: now });
      if (stack.length > 40) stack.shift();
    }
    storeRef.current.setFileContent(path, doc, { dirty: true });
  }, []);

  const undo = useCallback(() => {
    const stack = undoStack.current;
    if (stack.length < 2) {
      toast("Nothing to undo", "accent");
      return;
    }
    stack.pop(); // current state
    const prev = stack[stack.length - 1];
    if (!prev || prev.path !== storeRef.current.currentFile) {
      toast("Nothing to undo for this page", "accent");
      stack.push(prev!);
      return;
    }
    storeRef.current.setFileContent(prev.path, prev.doc, { dirty: true });
    reloadSignalRef.current++;
    toast("Undid last change", "ok");
  }, [toast]);

  const bumpReload = useCallback(() => {
    reloadSignalRef.current++;
  }, []);

  // ---------- page / component ops ----------
  const openPage = useCallback((path: string) => {
    const file = pageToPath(path);
    useEditor.getState().addTab(file);
    useEditor.getState().set({ mode: "visual" });
  }, []);

  const saveAsComponent = useCallback(async () => {
    const sel = useEditor.getState().selection;
    if (!sel || !canvasApi) return;
    const html = await canvasApi.rpc("get-html", sel.path).catch(() => null);
    if (!html) {
      toast("Could not read the selected element", "bad");
      return;
    }
    setCompName(sel.tag || "component");
    setSaveCompOpen(true);
    (window as any).__wpSaveHtml = html;
  }, [canvasApi, toast]);

  const doSaveComponent = useCallback(async () => {
    const name = compName.trim();
    if (!name) return;
    const html = ((window as any).__wpSaveHtml ?? "") as string;
    try {
      await api(`/api/projects/${projectId}/components`, {
        method: "POST",
        body: JSON.stringify({ name, html: cleanComponentHtml(html), css: "", js: "" }),
      });
      toast(`Saved "${name}" as a reusable component`, "ok");
      setSaveCompOpen(false);
      await refresh();
    } catch (e: any) {
      toast(e?.message ?? "Could not save component", "bad");
    }
  }, [compName, projectId, refresh, toast]);

  const insertComponent = useCallback(async (name: string) => {
    const comp = storeRef.current.components.find((c) => c.name === name);
    if (!comp) return;
    const html = wrapComponent(comp.html, name);
    if (storeRef.current.mode === "visual" && canvasApi) {
      await canvasApi.rpc("insert", html, null, "end").catch(() => false);
      await canvasApi.saveSnapshot();
    } else {
      const f = storeRef.current.files[storeRef.current.currentFile];
      if (!f) return;
      const next = /<\/body>/i.test(f.content)
        ? f.content.replace(/<\/body>/i, `${html}\n</body>`)
        : f.content + html;
      storeRef.current.setFileContent(f.path, next, { dirty: true });
      await flushSave();
    }
    toast(`Inserted "${name}"`, "ok");
  }, [canvasApi, flushSave, toast]);

  const exportProject = useCallback(() => {
    window.open(`/api/projects/${projectId}/export`, "_blank");
  }, [projectId]);

  const ctx: WorkspaceCtx = useMemo(
    () => ({
      refresh,
      openPage,
      insertComponent,
      saveAsComponent,
      bumpReload,
      setPublishOpen,
      exportProject,
      flushSave,
    }),
    [refresh, openPage, insertComponent, saveAsComponent, bumpReload, exportProject, flushSave]
  );

  // ---------- keyboard shortcuts ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        flushSave();
        return;
      }
      if (mod && e.key.toLowerCase() === "z") {
        if (storeRef.current.mode === "visual") {
          e.preventDefault();
          undo();
        }
        return;
      }
      if (mod && e.key.toLowerCase() === "1") storeRef.current.set({ mode: "visual" });
      if (mod && e.key.toLowerCase() === "2") storeRef.current.set({ mode: "code" });
      if (mod && e.key.toLowerCase() === "3") storeRef.current.set({ mode: "preview" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flushSave, undo]);

  // ---------- render ----------
  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center gap-3 text-ink-muted">
        <Spinner /> Opening workspace…
      </div>
    );
  }

  const mode = store.mode;
  const dirtyCount = Object.keys(store.dirty).filter((p) => store.dirty[p]).length;
  const rightPanel = store.rightPanel;

  return (
    <WorkspaceCtxValue.Provider value={ctx}>
      <CanvasApiCtx.Provider value={canvasApi}>
        <div className="flex h-dvh flex-col overflow-hidden bg-bg text-ink">
          {/* Top bar */}
          <TopBar
            projectName={store.project?.name ?? "Project"}
            mode={mode}
            breakpoint={store.breakpoint}
            saving={saving}
            dirtyCount={dirtyCount}
            lastSavedAt={lastSavedAt}
            onPalette={() => setPaletteOpen(true)}
            onPublish={() => setPublishOpen(true)}
            onAi={() =>
              useEditor.setState({ rightPanel: store.rightPanel === "ai" ? "props" : "ai", leftNav: store.leftNav })
            }
            rightPanel={rightPanel}
          />

          <div className="flex min-h-0 flex-1">
            {/* Left sidebar: rail + active panel */}
            <SidebarNav />

            {/* Main area */}
            <main className="relative flex min-w-0 flex-1 flex-col">
              {mode === "visual" && (
                <VisualCanvas onNeedsSave={onNeedsSave} registerApi={setCanvasApi} reloadSignal={reloadSignalRef.current} />
              )}
              {mode === "code" && (
                <div className="flex h-full min-h-0 flex-col">
                  <TabStrip />
                  <div className="min-h-0 flex-1">
                    <CodeEditor onSave={(path, content) => useEditor.getState().setFileContent(path, content, { dirty: true })} />
                  </div>
                </div>
              )}
              {mode === "preview" && <PreviewPane />}
            </main>

            {/* Right panel */}
            <aside className="hidden w-[300px] shrink-0 flex-col border-l border-line bg-surface md:flex">
              {rightPanel === "ai" ? (
                <AIPanel />
              ) : rightPanel === "props" ? (
                <PropsPanel onSaveAsComponent={saveAsComponent} />
              ) : (
                <div className="flex flex-1 items-center justify-center text-[12px] text-ink-muted">
                  Open the AI panel to get started
                </div>
              )}
            </aside>
          </div>
        </div>

        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <PublishDialog projectId={projectId} open={publishOpen} onClose={() => setPublishOpen(false)} />

        <Dialog
          open={saveCompOpen}
          onClose={() => setSaveCompOpen(false)}
          title="Save as reusable component"
          footer={
            <>
              <Button variant="ghost" onClick={() => setSaveCompOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={doSaveComponent}>Save component</Button>
            </>
          }
        >
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-medium text-ink-muted">Component name</span>
            <input
              className="inp h-9"
              value={compName}
              onChange={(e) => setCompName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSaveComponent()}
              autoFocus
              placeholder="e.g. PricingCard"
            />
          </label>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-muted">
            The selected element becomes a reusable component. Insert it from the Components panel — instances stay independent,
            and editing the component updates its template.
          </p>
        </Dialog>
      </CanvasApiCtx.Provider>
    </WorkspaceCtxValue.Provider>
  );
}

function TabStrip() {
  const openTabs = useEditor((s) => s.openTabs);
  const currentFile = useEditor((s) => s.currentFile);
  const dirty = useEditor((s) => s.dirty);
  return (
    <div className="flex h-9 items-end gap-px overflow-x-auto border-b border-line bg-surface/80 px-2">
      {openTabs.map((t) => {
        const name = t.split("/").pop() ?? t;
        const active = t === currentFile;
        return (
          <button
            key={t}
            onClick={() => useEditor.getState().addTab(t)}
            onAuxClick={(e) => e.button === 1 && useEditor.getState().closeTab(t)}
            className={cn(
              "group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-t-md border-x border-t px-3 py-1.5 text-[12px] font-medium transition-colors",
              active ? "border-line bg-bg text-ink" : "border-transparent text-ink-muted hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            {name}
            {dirty[t] && <span className="size-1.5 rounded-full bg-accent" />}
            <span
              role="button"
              aria-label={`Close ${name}`}
              onClick={(e) => {
                e.stopPropagation();
                useEditor.getState().closeTab(t);
              }}
              className="ml-0.5 hidden rounded p-px text-ink-muted/60 hover:bg-black/10 hover:text-ink group-hover:inline-block"
            >
              ×
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TopBar({
  projectName,
  mode,
  breakpoint,
  saving,
  dirtyCount,
  lastSavedAt,
  onPalette,
  onPublish,
  onAi,
  rightPanel,
}: {
  projectName: string;
  mode: "visual" | "code" | "preview";
  breakpoint: string;
  saving: boolean;
  dirtyCount: number;
  lastSavedAt: number | null;
  onPalette: () => void;
  onPublish: () => void;
  onAi: () => void;
  rightPanel: string;
}) {
  const set = useEditor((s) => s.set);
  const devices = [
    { id: "desktop", label: "🖥", title: "Desktop" },
    { id: "tablet", label: "📱", title: "Tablet" },
    { id: "mobile", label: "📲", title: "Mobile" },
  ] as const;

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-line bg-surface px-3">
      <div className="flex min-w-0 items-center gap-2">
        <a href="/projects" title="Back to projects" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-ink-muted transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5m0 0 6-6m-6 6 6 6" /></svg>
        </a>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold leading-tight">{projectName}</div>
          <div className="flex items-center gap-1 text-[10.5px] text-ink-muted">
            {saving || dirtyCount > 0 ? (
              <span className="flex items-center gap-1"><span className="wp-drift">●</span> Saving…</span>
            ) : (
              <span>Saved{lastSavedAt ? ` ${timeLabel(lastSavedAt)}` : ""}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-line bg-bg p-0.5">
        {(["visual", "code", "preview"] as const).map((m) => (
          <button
            key={m}
            onClick={() => set({ mode: m })}
            className={cn(
              "cursor-pointer rounded-md px-3 py-1 text-[12px] font-medium capitalize transition-colors",
              mode === m ? "bg-accent text-white" : "text-ink-muted hover:text-ink"
            )}
          >
            {m === "visual" ? "Visual" : m === "code" ? "Code" : "Preview"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        {(mode === "visual" || mode === "preview") && (
          <div className="mr-1 flex items-center gap-0.5 rounded-lg border border-line bg-bg p-0.5">
            {devices.map((d) => (
              <button
                key={d.id}
                title={d.title}
                onClick={() => set({ breakpoint: d.id })}
                className={cn(
                  "cursor-pointer rounded-md px-1.5 py-1 text-[13px] leading-none transition-colors",
                  breakpoint === d.id ? "bg-accent-soft" : "opacity-55 hover:opacity-100"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={onPalette}
          title="Command palette (⌘K)"
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[12px] text-ink-muted transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
        >
          <span>⌘K</span>
        </button>
        <button
          onClick={onAi}
          title="AI agent"
          className={cn(
            "cursor-pointer rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
            rightPanel === "ai"
              ? "border-accent bg-accent-soft text-accent"
              : "border-line text-ink-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
          )}
        >
          ✨ AI
        </button>
        <Button variant="primary" size="sm" onClick={onPublish}>
          Publish
        </Button>
      </div>
    </header>
  );
}

function timeLabel(ts: number): string {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 5) return "now";
  if (s < 60) return `${s}s ago`;
  return `${Math.round(s / 60)}m ago`;
}
