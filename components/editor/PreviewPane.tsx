"use client";

import { useMemo } from "react";
import { useEditor } from "./store";
import { cn } from "@/lib/utils";
import { inlineProjectAssets } from "@/lib/editor/canvas-agent";

export function PreviewPane() {
  const currentFile = useEditor((s) => s.currentFile);
  const breakpoint = useEditor((s) => s.breakpoint);
  const files = useEditor((s) => s.files);
  const doc = useEditor((s) => s.files[s.currentFile]?.content ?? "");
  const isDesktop = breakpoint === "desktop";

  const html = useMemo(() => (doc ? inlineProjectAssets(doc, files) : ""), [doc, files]);

  const blobUrl = useMemo(() => {
    if (!html) return null;
    try {
      return URL.createObjectURL(new Blob([html], { type: "text/html" }));
    } catch {
      return null;
    }
  }, [html]);

  const openNewTab = () => {
    if (blobUrl) window.open(blobUrl, "_blank");
  };

  return (
    <div
      className={cn(
        "flex h-full items-start justify-center overflow-auto px-5 py-4",
        isDesktop ? "bg-[#d6d6da] dark:bg-[#101013]" : "bg-[#f2f2f3] dark:bg-[#17171b]"
      )}
    >
      <div className="wp-fade shrink-0 overflow-hidden rounded-lg border border-black/20 bg-white shadow-2xl transition-[width,height] duration-200"
        style={{
          width: isDesktop ? "100%" : breakpoint === "tablet" ? 768 : 375,
          height: isDesktop ? "100%" : breakpoint === "tablet" ? 1024 : 812,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <iframe
          key={currentFile + html.length}
          title="Preview"
          srcDoc={html}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-forms allow-popups"
        />
      </div>
      {blobUrl && (
        <button
          onClick={openNewTab}
          className="fixed bottom-4 right-4 z-20 cursor-pointer rounded-lg border border-line bg-surface px-3 py-2 text-[12px] font-medium shadow-lg transition-colors hover:border-accent/50 hover:text-accent"
        >
          ↗ Open in new tab
        </button>
      )}
    </div>
  );
}
