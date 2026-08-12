"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditor } from "./store";
import { buildSrcdoc } from "@/lib/editor/canvas-agent";
import { cssFromRules } from "./PropsPanel";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";
import type { CanvasApi } from "./PropsPanel";

interface Msg {
  type: string;
  id?: number;
  ok?: boolean;
  result?: unknown;
  error?: string;
  [k: string]: unknown;
}

export function VisualCanvas({
  onNeedsSave,
  registerApi,
  reloadSignal,
}: {
  onNeedsSave: (doc: string) => void;
  registerApi: (api: CanvasApi | null) => void;
  reloadSignal: number;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pending = useRef(new Map<number, { resolve: (v: any) => void; reject: (e: any) => void }>());
  const idSeq = useRef(1);
  const { toast } = useToast();
  const store = useEditor();
  const breakpoint = useEditor((s) => s.breakpoint);
  const currentFile = useEditor((s) => s.currentFile);
  const mode = useEditor((s) => s.mode);

  const rpc = useCallback((method: string, ...args: unknown[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      const id = idSeq.current++;
      pending.current.set(id, { resolve, reject });
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) {
        reject(new Error("canvas not ready"));
        pending.current.delete(id);
        return;
      }
      iframe.contentWindow.postMessage({ type: "wp.rpc", id, method, args }, "*");
      setTimeout(() => {
        if (pending.current.has(id)) {
          pending.current.delete(id);
          reject(new Error(`canvas op timed out: ${method}`));
        }
      }, 8000);
    });
  }, []);

  const saveSnapshot = useCallback(async () => {
    try {
      const doc = await rpc("snapshot");
      if (typeof doc === "string" && doc.length > 100) onNeedsSave(doc);
    } catch {
      /* canvas mid-reload — the next state event saves */
    }
  }, [rpc, onNeedsSave]);

  // Register the canvas API for panels (PropsPanel etc.)
  useEffect(() => {
    registerApi({ rpc, saveSnapshot });
    return () => registerApi(null);
  }, [registerApi, rpc, saveSnapshot]);

  // Build the srcdoc once per (file, external-reload). Self-saves never rebuild.
  const [built, setBuilt] = useState<{ key: string; srcDoc: string } | null>(null);
  const rules = useEditor((s) => s.rules);
  useEffect(() => {
    const content = store.files[currentFile]?.content ?? "";
    const srcDoc = buildSrcdoc(content, cssFromRules(rules), store.files);
    setBuilt({ key: `${currentFile}:${reloadSignal}:${srcDoc.length}:${hash(srcDoc)}`, srcDoc });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFile, reloadSignal, store.files]);
  const styleCss = useMemo(() => cssFromRules(rules), [rules]);

  useEffect(() => {
    if (mode !== "visual") return;
    const onMsg = async (e: MessageEvent) => {
      const msg = e.data as Msg;
      if (!msg || typeof msg !== "object" || typeof msg.type !== "string" || !msg.type.startsWith("wp")) return;
      switch (msg.type) {
        case "wp.rpc-res": {
          const id = msg.id as number;
          const p = pending.current.get(id);
          if (!p) return;
          pending.current.delete(id);
          if (msg.ok) p.resolve(msg.result);
          else p.reject(new Error(String(msg.error ?? "canvas error")));
          return;
        }
        case "wp.ready":
          rpc("sync-styles", styleCss).catch(() => {});
          return;
        case "wp.select":
          store.set({ selection: msg as any });
          return;
        case "wp.clear":
          store.set({ selection: null });
          return;
        case "wp.toast":
          toast(String(msg.text ?? ""), "accent");
          return;
        case "wp.text":
        case "wp.state":
          store.set({ selection: null });
          saveSnapshot();
          return;
        case "wp.action": {
          const action = msg.action as string;
          if (action === "delete") {
            const ok = window.confirm("Delete this element? Undo is available via history.");
            if (ok) {
              try {
                await rpc("delete", msg.path);
              } catch {
                /* noop */
              }
              saveSnapshot();
            }
          } else if (action === "move") {
            try {
              await rpc("move", msg.path, msg.dir);
            } catch {
              /* noop */
            }
            saveSnapshot();
          }
          return;
        }
        case "wp.linkclick":
          return; // ignore navigation inside the canvas
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [rpc, saveSnapshot, styleCss, store, toast, mode]);

  const isDesktop = breakpoint === "desktop";
  const frameW = isDesktop ? "100%" : breakpoint === "tablet" ? 768 : 375;
  const frameH = isDesktop ? "100%" : breakpoint === "tablet" ? 1024 : 812;

  return (
    <div
      className={cn(
        "flex h-full items-start justify-center overflow-auto px-5 py-4",
        isDesktop ? "bg-[#d6d6da] dark:bg-[#101013]" : "bg-[#f2f2f3] dark:bg-[#17171b]"
      )}
    >
      <div
        className="wp-fade shrink-0 overflow-hidden rounded-lg border border-black/20 shadow-2xl transition-[width,height] duration-200"
        style={{ width: frameW, height: frameH, maxWidth: "100%", maxHeight: "100%" }}
      >
        {built ? (
          <iframe
            key={built.key}
            ref={iframeRef}
            title="Canvas"
            onLoad={() => rpc("sync-styles", styleCss).catch(() => {})}
            srcDoc={built.srcDoc}
            className="h-full w-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        ) : null}
      </div>
    </div>
  );
}

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
