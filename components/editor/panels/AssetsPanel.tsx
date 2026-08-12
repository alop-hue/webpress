/**
 * Assets: upload, list, copy URL, delete.
 */
"use client";

import { useRef, useState } from "react";
import { useEditor } from "../store";
import { useWorkspace } from "../workspace-context";
import { api } from "@/lib/http";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui";
import { cn, formatBytes } from "@/lib/utils";
import { FileText, Trash2 } from "lucide-react";

export function AssetsPanel() {
  const assets = useEditor((s) => s.assets);
  const assetUrlBase = useEditor((s) => s.assetUrlBase);
  const projectId = useEditor((s) => s.projectId);
  const ctx = useWorkspace();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const supabase = createClient();
    try {
      for (const file of Array.from(files)) {
        const path = `assets/${file.name}`;
        const { error } = await supabase.storage.from("assets").upload(`${projectId}/${path}`, file, { upsert: true });
        if (error) throw new Error(error.message);
        let width: number | null = null;
        let height: number | null = null;
        if (file.type.startsWith("image/")) {
          try {
            const dims = await imageSize(file);
            width = dims.width;
            height = dims.height;
          } catch { /* non-fatal */ }
        }
        await api(`/api/projects/${projectId}/assets`, {
          method: "POST",
          body: JSON.stringify({ name: file.name, path, size: file.size, mime: file.type || "application/octet-stream", width, height }),
        });
      }
      toast("Uploaded", "ok");
      await ctx.refresh();
    } catch (e: any) {
      toast(`Upload failed: ${e?.message ?? "unknown"}`, "bad");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const insertImage = async (a: { path: string; name: string }) => {
    const url = `${assetUrlBase}/${a.path}`;
    const html = `<img src="${url}" alt="${a.name.replace(/\.\w+$/, "")}" style="max-width:100%;height:auto">`;
    const st = useEditor.getState();
    const f = st.files[st.currentFile];
    if (!f) return;
    const next = /<\/body>/i.test(f.content) ? f.content.replace(/<\/body>/i, `${html}\n</body>`) : f.content + html;
    st.setFileContent(f.path, next, { dirty: true });
    await ctx.flushSave();
    toast("Image inserted", "ok");
  };

  const copyUrl = async (a: { path: string; name: string }) => {
    await navigator.clipboard.writeText(`${assetUrlBase}/${a.path}`).catch(() => {});
    toast("URL copied", "ok");
  };

  const remove = async (a: { path: string; name: string }) => {
    if (!window.confirm(`Delete ${a.name}?`)) return;
    try {
      await api(`/api/projects/${projectId}/assets?path=${encodeURIComponent(a.path)}`, { method: "DELETE" });
      toast("Deleted", "ok");
      await ctx.refresh();
    } catch (e: any) {
      toast(e?.message ?? "Could not delete", "bad");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
        <h2 className="text-[12px] font-semibold">Assets</h2>
        <Button size="sm" loading={uploading} onClick={() => inputRef.current?.click()}>Upload</Button>
        <input ref={inputRef} type="file" multiple accept="image/*,video/*,audio/*,.svg,.pdf,.zip" className="hidden" onChange={(e) => upload(e.target.files)} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {assets.length === 0 && (
          <p className="px-2 py-6 text-center text-[12px] leading-relaxed text-ink-muted">
            Upload images, video or files. Everything is stored in your project's asset library and referenced by public URL.
          </p>
        )}
        <div className="grid grid-cols-2 gap-2">
          {assets.map((a) => {
            const isImg = a.mime.startsWith("image/");
            return (
              <div key={a.path} className="group overflow-hidden rounded-lg border border-line">
                <div className="flex h-20 items-center justify-center overflow-hidden bg-black/[.04] dark:bg-white/[.06]">
                  {isImg ? (
                    <img src={`${assetUrlBase}/${a.path}`} alt={a.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <FileText size={22} strokeWidth={1.6} className="text-ink-muted" />
                  )}
                </div>
                <div className="p-1.5">
                  <p className="truncate text-[10.5px] font-medium" title={a.name}>{a.name}</p>
                  <p className="text-[9.5px] text-ink-muted">{formatBytes(a.size)}</p>
                  <div className="mt-1 flex gap-1">
                    <button onClick={() => insertImage(a)} title="Insert into page" className={cn("flex-1 cursor-pointer rounded px-1 py-0.5 text-[9.5px] font-medium text-accent hover:bg-accent-soft", !isImg && "hidden")}>
                      Insert
                    </button>
                    <button onClick={() => copyUrl(a)} title="Copy URL" className="flex-1 cursor-pointer rounded px-1 py-0.5 text-[9.5px] text-ink-muted hover:bg-black/5 dark:hover:bg-white/10">
                      URL
                    </button>
                    <button onClick={() => remove(a)} title="Delete" className="cursor-pointer rounded p-1 text-ink-muted hover:bg-bad/15 hover:text-bad">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function imageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });
}
