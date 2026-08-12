/**
 * CodeMirror code editor with tabs, formatting, and autosave.
 */
"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "./store";
import { basicSetup } from "@/lib/editor/cm-setup";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { searchKeymap } from "@codemirror/search";
import { oneDark } from "@codemirror/theme-one-dark";

export function CodeEditor({ onSave }: { onSave: (path: string, content: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const pathRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = useRef(onSave);
  saveRef.current = onSave;
  const path = useEditor((s) => s.currentFile);
  const content = useEditor((s) => s.files[s.currentFile]?.content ?? "");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const prev = viewRef.current;

    if (prev && pathRef.current === path) {
      const cur = prev.state.doc.toString();
      if (cur !== content) {
        prev.dispatch({ changes: { from: 0, to: cur.length, insert: content } });
      }
      return;
    }

    const dark = document.documentElement.classList.contains("dark");
    const lang =
      path.endsWith(".css") ? css() :
      path.endsWith(".js") ? javascript() :
      path.endsWith(".json") ? json() :
      html();

    const view = new EditorView({
      state: EditorState.create({
        doc: content,
        extensions: [
          ...basicSetup,
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap, indentWithTab]),
          lang,
          dark ? oneDark : [],
          EditorView.updateListener.of((u) => {
            if (!u.docChanged) return;
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              saveRef.current(pathRef.current, view.state.doc.toString());
            }, 700);
          }),
        ],
      }),
      parent: container,
    });
    if (prev) prev.destroy();
    viewRef.current = view;
    pathRef.current = path;
  }, [path, content]);

  useEffect(
    () => () => {
      viewRef.current?.destroy();
      viewRef.current = null;
      pathRef.current = "";
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  return <div ref={containerRef} className="h-full w-full overflow-hidden" />;
}