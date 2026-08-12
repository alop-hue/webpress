/**
 * File explorer for code mode: create folders/files, rename, delete.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditor } from "../store";
import { useWorkspace } from "../workspace-context";
import { api } from "@/lib/http";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui";
import { buildTree, dirname, extname, validatePath } from "@/lib/editor/fs";
import { cn } from "@/lib/utils";

export function FilesPanel() {
  const files = useEditor((s) => s.files);
  const currentFile = useEditor((s) => s.currentFile);
  const ctx = useWorkspace();
  const { toast } = useToast();
  const [newOpen, setNewOpen] = useState(false);
  const [newPath, setNewPath] = useState("");

  useEffect(() => {
    const onNew = () => setNewOpen(true);
    window.addEventListener("wp:new-file", onNew);
    return () => window.removeEventListener("wp:new-file", onNew);
  }, []);

  const tree = useMemo(() => {
    const entries = Object.values(files).map((f) => ({ path: f.path, content: f.content ?? "", kind: f.kind === "folder" ? ("folder" as const) : ("file" as const), mime: f.mime }));
    return buildTree(entries);
  }, [files]);

  const createFile = async () => {
    const p = newPath.trim();
    const err = validatePath(p);
    if (err || !p) {
      toast(err ?? "Enter a path", "bad");
      return;
    }
    try {
      const content = p.endsWith(".html")
        ? `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${p}</title>\n</head>\n<body>\n\n</body>\n</html>`
        : p.endsWith(".css")
          ? `/* ${p} */\n`
          : p.endsWith(".js")
            ? `// ${p}\n`
            : "";
      const projectId = useEditor.getState().projectId;
      await api(`/api/projects/${projectId}/files`, { method: "PUT", body: JSON.stringify({ path: p, content, kind: "file" }) });
      toast("File created", "ok");
      setNewOpen(false);
      setNewPath("");
      await ctx.refresh();
      useEditor.getState().addTab(p);
      useEditor.getState().set({ mode: "code" });
    } catch (e: any) {
      toast(e?.message ?? "Could not create file", "bad");
    }
  };

  const rename = async (path: string) => {
    const next = window.prompt("Rename to:", path);
    if (!next || next === path) return;
    if (validatePath(next)) {
      toast("Invalid name", "bad");
      return;
    }
    const st = useEditor.getState();
    const content = st.files[path]?.content ?? "";
    try {
      await api(`/api/projects/${st.projectId}/files`, {
        method: "POST",
        body: JSON.stringify({
          files: [
            { path, deleted: true },
            { path: next, content, kind: "file", mime: st.files[path]?.mime },
          ],
        }),
      });
      toast("Renamed", "ok");
      await ctx.refresh();
    } catch (e: any) {
      toast(e?.message ?? "Could not rename", "bad");
    }
  };

  const remove = async (path: string) => {
    if (!window.confirm(`Delete ${path}?`)) return;
    try {
      await api(`/api/projects/${useEditor.getState().projectId}/files`, {
        method: "POST",
        body: JSON.stringify({ files: [{ path, deleted: true }] }),
      });
      toast("Deleted", "ok");
      await ctx.refresh();
    } catch (e: any) {
      toast(e?.message ?? "Could not delete", "bad");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
        <h2 className="text-[12px] font-semibold">Files</h2>
        <Button size="sm" onClick={() => setNewOpen(true)}>＋</Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {tree.length === 0 && <p className="px-2 py-6 text-center text-[12px] text-ink-muted">No files yet.</p>}
        {tree.map((n) => (
          <TreeItem key={n.path} node={n} depth={0} currentFile={currentFile} onRename={rename} onDelete={remove} />
        ))}
        <div className="mt-3 rounded-lg border border-dashed border-line p-2 text-[10.5px] leading-relaxed text-ink-muted">
          Real files — HTML, CSS, JS. Visual edits and code edits stay in sync; custom code is preserved.
        </div>
      </div>

      {newOpen && (
        <div className="border-t border-line p-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-ink-muted">File path</span>
            <div className="flex gap-1.5">
              <input className="inp h-8 font-mono" value={newPath} onChange={(e) => setNewPath(e.target.value)} placeholder="css/extra.css" autoFocus
                onKeyDown={(e) => e.key === "Enter" && createFile()} />
              <Button size="sm" onClick={createFile}>Create</Button>
            </div>
          </label>
          <button onClick={() => setNewOpen(false)} className="mt-1 cursor-pointer text-[11px] text-ink-muted hover:text-ink">Cancel</button>
        </div>
      )}
    </div>
  );
}

function TreeItem({
  node,
  depth,
  currentFile,
  onRename,
  onDelete,
}: {
  node: { path: string; name: string; kind: "file" | "folder"; children: any[] };
  depth: number;
  currentFile: string;
  onRename: (p: string) => void;
  onDelete: (p: string) => void;
}) {
  const [open, setOpen] = useState(depth < 2);
  const active = node.kind === "file" && node.path === currentFile;
  const ext = extname(node.path);
  const icon = node.kind === "folder" ? (open ? "▾" : "▸") : ext === "html" ? "🟠" : ext === "css" ? "🔵" : ext === "js" ? "🟡" : "⚪";

  if (node.kind === "folder") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          style={{ paddingLeft: depth * 12 + 4 }}
          className="flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1 text-left text-[12px] text-ink-muted hover:bg-black/5 dark:hover:bg-white/5"
        >
          <span className="w-3 text-[9px]">{icon}</span>
          <span className="truncate font-medium">{node.name}</span>
        </button>
        {open &&
          node.children.map((c) => (
            <TreeItem key={c.path} node={c} depth={depth + 1} currentFile={currentFile} onRename={onRename} onDelete={onDelete} />
          ))}
      </div>
    );
  }

  return (
    <div className="group relative">
      <button
        onClick={() => { useEditor.getState().addTab(node.path); useEditor.getState().set({ mode: "code" }); }}
        style={{ paddingLeft: depth * 12 + 4 }}
        className={cn(
          "flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1 text-left text-[12px] transition-colors",
          active ? "bg-accent-soft text-ink" : "text-ink-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/5"
        )}
      >
        <span className="w-3 text-[8.5px]">{icon}</span>
        <span className="truncate font-mono">{node.name}</span>
      </button>
      <div className="absolute right-1 top-0.5 hidden gap-0.5 group-hover:flex">
        <button onClick={() => onRename(node.path)} title="Rename" className="cursor-pointer rounded p-0.5 text-[10px] text-ink-muted hover:bg-black/10 dark:hover:bg-white/15">✎</button>
        <button onClick={() => onDelete(node.path)} title="Delete" className="cursor-pointer rounded p-0.5 text-[10px] text-ink-muted hover:bg-bad/20 hover:text-bad">✕</button>
      </div>
    </div>
  );
}
