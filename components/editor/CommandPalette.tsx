"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEditor } from "./store";
import { useWorkspace } from "./workspace-context";
import { cn } from "@/lib/utils";

interface Cmd {
  id: string;
  group: string;
  label: string;
  hint?: string;
  run: () => void;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const store = useEditor();
  const ctx = useWorkspace();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const commands = useMemo<Cmd[]>(() => {
    const s = useEditor.getState();
    const set = (p: Partial<typeof s>) => useEditor.setState(p);
    const list: Cmd[] = [
      { id: "publish", group: "Actions", label: "Publish site", hint: "⌘P", run: () => ctx.setPublishOpen(true) },
      { id: "export", group: "Actions", label: "Export project as files", run: ctx.exportProject },
      { id: "run-static", group: "Actions", label: "Run static checks", run: () => set({ leftNav: "tests" }) },
      { id: "save", group: "Actions", label: "Save now", run: () => ctx.flushSave() },
      { id: "visual", group: "Modes", label: "Visual mode", hint: "⌘1", run: () => set({ mode: "visual" }) },
      { id: "code", group: "Modes", label: "Code mode", hint: "⌘2", run: () => set({ mode: "code" }) },
      { id: "preview", group: "Modes", label: "Preview mode", hint: "⌘3", run: () => set({ mode: "preview" }) },
      { id: "dark", group: "Actions", label: "Toggle dark mode", run: toggleDark },
      { id: "new-page", group: "Actions", label: "Create new page", run: () => {
          set({ leftNav: "pages" });
          window.dispatchEvent(new CustomEvent("wp:new-page"));
        } },
      { id: "new-file", group: "Actions", label: "Create new file", run: () => {
          set({ leftNav: "files" });
          window.dispatchEvent(new CustomEvent("wp:new-file"));
        } },
      { id: "ai", group: "Actions", label: "Open AI agent", run: () => set({ rightPanel: "ai" }) },
    ];
    for (const p of s.pages) list.push({ id: `page-${p.path}`, group: "Pages", label: `Open page ${p.path}`, hint: p.title, run: () => ctx.openPage(p.path) });
    for (const f of Object.values(s.files)) {
      if (f.kind !== "file") continue;
      list.push({ id: `file-${f.path}`, group: "Files", label: `Open ${f.path}`, run: () => { useEditor.getState().addTab(f.path); set({ mode: "code" }); } });
    }
    for (const c of s.components) list.push({ id: `comp-${c.name}`, group: "Components", label: `Insert component ${c.name}`, run: () => ctx.insertComponent(c.name) });
    return list;
  }, [ctx]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return commands.slice(0, 30);
    return commands.filter((c) => (c.label + " " + c.group + " " + (c.hint ?? "")).toLowerCase().includes(ql)).slice(0, 30);
  }, [q, commands]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
      else if (e.key === "Enter" && filtered[idx]) { filtered[idx].run(); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, idx, onClose]);

  if (!open) return null;

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-[14vh]">
      <div className="fixed inset-0 bg-black/45 wp-fade" onClick={onClose} aria-hidden />
      <div className="wp-pop relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0); }}
            placeholder="Search pages, files, components, commands…"
            className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-ink-muted/60"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">esc</kbd>
        </div>
        <div className="max-h-[46vh] overflow-y-auto py-1.5">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-center text-[12.5px] text-ink-muted">No matches for “{q}”</p>
          )}
          {filtered.map((c, i) => {
            const showGroup = c.group !== lastGroup;
            lastGroup = c.group;
            return (
              <div key={c.id}>
                {showGroup && <p className="px-4 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted/70">{c.group}</p>}
                <button
                  onClick={() => { c.run(); onClose(); }}
                  onMouseEnter={() => setIdx(i)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2 text-left text-[13px]",
                    i === idx ? "bg-accent-soft text-ink" : "text-ink"
                  )}
                >
                  <span className="truncate">{c.label}</span>
                  {c.hint && <span className="shrink-0 text-[11px] text-ink-muted">{c.hint}</span>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function toggleDark() {
  const root = document.documentElement;
  const dark = !root.classList.contains("dark");
  root.classList.toggle("dark", dark);
  localStorage.setItem("wp-theme", dark ? "dark" : "light");
}
