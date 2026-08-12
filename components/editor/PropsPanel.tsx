"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useEditor } from "./store";
import { cn } from "@/lib/utils";
import type { StyleRule } from "@/lib/editor/styling";

export interface CanvasApi {
  rpc: (method: string, ...args: unknown[]) => Promise<any>;
  saveSnapshot: () => Promise<void>;
}

export const CanvasApiCtx = createContext<CanvasApi | null>(null);
export const useCanvasApi = () => useContext(CanvasApiCtx);

export function cssFromRules(rules: StyleRule[]): string {
  return rules
    .map((r) => {
      const body = `.wp-el-${r.uid} { ${r.prop}: ${r.value}; }`;
      if (r.bp === "base") return body;
      const mq = r.bp === "tablet" ? "@media (min-width: 768px) and (max-width: 1023px)" : "@media (max-width: 767px)";
      return `${mq} { ${body} }`;
    })
    .join("\n");
}

/** Parse rules back out of a serialized #wp-el-styles block */
export function rulesFromCss(css: string): StyleRule[] {
  const rules: StyleRule[] = [];
  const mediaRe = /@media\s*\([^)]*max-width:\s*(\d+)px[^)]*\)\s*\{([^}]*\.wp-el-[^}]*})/g;
  const plainRe = /^([^@][^}]*\.wp-el-[^}]*})/gm;
  const parseBlock = (block: string, bp: "base" | "tablet" | "mobile") => {
    const uidRe = /\.wp-el-([A-Za-z0-9]+)\s*\{([^}]+)\}/g;
    for (const m of block.matchAll(uidRe)) {
      const uid = m[1];
      for (const kv of m[2].split(";")) {
        const i = kv.indexOf(":");
        if (i > 0) rules.push({ uid, bp, prop: kv.slice(0, i).trim(), value: kv.slice(i + 1).trim() });
      }
    }
  };
  for (const m of css.matchAll(mediaRe)) {
    parseBlock(m[2], (m[1] as unknown as string) >= "768" ? "tablet" : "mobile");
  }
  const rest = css.replace(mediaRe, "");
  for (const m of rest.matchAll(plainRe)) parseBlock(m[1], "base");
  return rules;
}

const commitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && (e.target as HTMLInputElement).blur();

const FONT_WEIGHTS = [
  ["", "Default"], ["300", "Light 300"], ["400", "Regular 400"], ["500", "Medium 500"],
  ["600", "Semibold 600"], ["700", "Bold 700"], ["800", "Extra bold 800"],
];

export function PropsPanel({ onSaveAsComponent }: { onSaveAsComponent: () => void }) {
  const sel = useEditor((s) => s.selection);
  const rules = useEditor((s) => s.rules);
  const bp = useEditor((s) => s.breakpoint);
  const canvas = useCanvasApi();
  const [open, setOpen] = useState<Record<string, boolean>>({ layout: true, spacing: true });
  const [uid, setUid] = useState<string | null>(null);

  const currentBp: "base" | "tablet" | "mobile" = bp === "desktop" ? "base" : bp;

  useEffect(() => {
    let dead = false;
    setUid(null);
    if (sel && canvas) {
      canvas
        .rpc("ensure-uid", sel.path)
        .then((u) => !dead && setUid(u as string))
        .catch(() => {});
    }
    return () => {
      dead = true;
    };
  }, [sel?.path]);

  if (!sel) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-lg">👆</div>
        <p className="text-[12.5px] leading-relaxed text-ink-muted">
          Select any element on the canvas to edit its content, styles, spacing and responsive behavior.
        </p>
        <p className="text-[11px] text-ink-muted/70">Tip: double-click text to edit it inline.</p>
      </div>
    );
  }

  const ruleVal = (prop: string) => rules.find((r) => r.uid === uid && r.bp === currentBp && r.prop === prop)?.value ?? "";

  const setRule = (prop: string, value: string) => {
    if (!uid) return;
    const st = useEditor.getState();
    st.ruleUpdate(uid, currentBp, prop, value);
    canvas?.rpc("sync-styles", cssFromRules(st.rules));
    canvas?.saveSnapshot();
  };

  const removeRule = (prop: string) => {
    if (!uid) return;
    const st = useEditor.getState();
    st.ruleRemove(uid, prop);
    canvas?.rpc("sync-styles", cssFromRules(st.rules));
    canvas?.saveSnapshot();
  };

  const run = (fn: () => Promise<unknown>) => fn().then(() => canvas?.saveSnapshot()).catch(() => {});

  const section = (id: string, label: string, children: React.ReactNode, openByDefault?: boolean) => (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((o) => ({ ...o, [id]: !o[id] }))}
        className="flex w-full cursor-pointer items-center justify-between px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted hover:text-ink"
      >
        {label}
        <span className="text-[9px]">{open[id] ?? openByDefault ? "▾" : "▸"}</span>
      </button>
      {(open[id] ?? openByDefault) && <div className="space-y-2 px-3.5 pb-3.5">{children}</div>}
    </div>
  );

  const dim = (label: string, children: React.ReactNode) => (
    <div className="flex items-center gap-2">
      <span className="w-[76px] shrink-0 text-[11.5px] text-ink-muted">{label}</span>
      <div className="flex min-w-0 flex-1 items-center gap-1.5">{children}</div>
    </div>
  );

  const num = (prop: string, unit = "px", step = 1, min?: number) => (
    <input
      key={`${uid}-${prop}-${currentBp}`}
      type="number"
      step={step}
      min={min}
      className="inp h-8"
      placeholder="—"
      value={ruleVal(prop)}
      onChange={(e) => setRule(prop, `${e.target.value}${unit}`)}
      onKeyDown={commitOnEnter}
    />
  );

  const color = (prop: string) => (
    <input type="color" className="size-8 cursor-pointer rounded-md border border-line" value={ruleVal(prop) || "#000000"} onChange={(e) => setRule(prop, e.target.value)} />
  );

  const selClasses = sel.classes ?? [];

  return (
    <div className="h-full overflow-y-auto pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface/95 px-3.5 py-2.5 backdrop-blur">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold">{sel.component || sel.tag}</div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="rounded bg-black/5 px-1.5 py-px font-mono text-[10px] text-ink-muted dark:bg-white/10">{sel.tag}</span>
            {sel.id && <span className="rounded bg-accent-soft px-1.5 py-px font-mono text-[10px] text-accent">#{sel.id}</span>}
            {sel.component && <span className="rounded bg-ok/10 px-1.5 py-px font-mono text-[10px] text-ok">component</span>}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <MiniBtn label="↑" title="Move up" onClick={() => run(() => canvas!.rpc("move", sel.path, "up"))} />
          <MiniBtn label="↓" title="Move down" onClick={() => run(() => canvas!.rpc("move", sel.path, "down"))} />
          <MiniBtn label="⧉" title="Duplicate" onClick={() => run(() => canvas!.rpc("duplicate", sel.path))} />
          <MiniBtn danger label="✕" title="Delete" onClick={() => run(() => canvas!.rpc("delete", sel.path))} />
        </div>
      </div>

      {sel.raw && (
        <div className="border-b border-line bg-warn/10 px-3.5 py-3">
          <p className="text-[12px] font-medium text-[color:var(--warning)]">Custom-code region</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-ink-muted">
            Marked with data-wp-raw — preserved verbatim. Edit this element in Code mode.
          </p>
        </div>
      )}

      {section("Content", "Content", (
        <>
          {sel.editable && (
            <button
              className="w-full cursor-pointer rounded-lg border border-line bg-surface px-3 py-2 text-left text-[12.5px] font-medium hover:border-accent/50"
              onClick={() => run(() => canvas!.rpc("focus-text", sel.path))}
            >
              ✏️ Edit text inline
            </button>
          )}
          {sel.tag === "a" && (
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-ink-muted">Link destination</span>
              <input className="inp" defaultValue={sel.href} placeholder="/about or https://…"
                onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== sel.href) run(() => canvas!.rpc("set-attr", sel.path, "href", v)); }}
                onKeyDown={commitOnEnter} />
            </label>
          )}
          {sel.tag === "img" && (
            <>
              <label className="block">
                <span className="mb-1 block text-[11px] font-medium text-ink-muted">Image URL</span>
                <input className="inp" defaultValue={sel.src} placeholder="https://…"
                  onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== sel.src) run(() => canvas!.rpc("set-attr", sel.path, "src", v)); }}
                  onKeyDown={commitOnEnter} />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-medium text-ink-muted">Alt text</span>
                <input className="inp" placeholder="Describe the image"
                  onBlur={(e) => { const v = e.target.value.trim(); if (v) run(() => canvas!.rpc("set-attr", sel.path, "alt", v)); }}
                  onKeyDown={commitOnEnter} />
              </label>
            </>
          )}
          {sel.tag === "button" && (
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-ink-muted">Button text</span>
              <input className="inp" defaultValue={sel.text}
                onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== sel.text) run(() => canvas!.rpc("set-text", sel.path, v)); }}
                onKeyDown={commitOnEnter} />
            </label>
          )}
          {sel.raw === false && sel.editable === false && (
            <p className="text-[11.5px] leading-relaxed text-ink-muted">
              This element holds structured content — edit children individually or use Code mode.
            </p>
          )}
        </>
      ))}

      {!sel.raw && section("Layout", "Layout", (
        <>
          {dim("Display", (
            <select className="sel" value={sel.display || "block"} onChange={(e) => setRule("display", e.target.value)}>
              <option value="block">Block</option>
              <option value="flex">Flex</option>
              <option value="inline-flex">Inline flex</option>
              <option value="grid">Grid</option>
              <option value="inline-block">Inline</option>
            </select>
          ))}
          {["flex", "inline-flex", "grid"].includes(sel.display || "") && (
            <>
              {dim("Direction", (
                <select className="sel" onChange={(e) => setRule("flex-direction", e.target.value)}>
                  <option value="row">Row</option>
                  <option value="column">Column</option>
                  <option value="row-reverse">Row reverse</option>
                  <option value="column-reverse">Column reverse</option>
                </select>
              ))}
              {dim("Align", (
                <select className="sel" onChange={(e) => setRule("align-items", e.target.value)}>
                  <option value="stretch">Stretch</option>
                  <option value="center">Center</option>
                  <option value="flex-start">Start</option>
                  <option value="flex-end">End</option>
                  <option value="baseline">Baseline</option>
                </select>
              ))}
              {dim("Justify", (
                <select className="sel" onChange={(e) => setRule("justify-content", e.target.value)}>
                  <option value="flex-start">Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End</option>
                  <option value="space-between">Between</option>
                  <option value="space-around">Around</option>
                  <option value="space-evenly">Evenly</option>
                </select>
              ))}
              {dim("Gap", (<>{num("gap")}<Unit></Unit></>))}
            </>
          )}
          {dim("Width", (<>{num("width", "px", 8)}<Unit></Unit></>))}
          {dim("Max width", (<>{num("max-width", "px", 8)}<Unit></Unit></>))}
          {dim("Min height", (<>{num("min-height", "px", 8)}<Unit></Unit></>))}
        </>
      ), true)}

      {!sel.raw && section("Spacing", "Spacing", (
        <>
          {(["padding-top", "padding-right", "padding-bottom", "padding-left"] as const).map((p) => (
            dim(p.replace("padding-", "Pad "), (<>{num(p)}<Unit></Unit></>))
          ))}
          {(["margin-top", "margin-bottom"] as const).map((p) => (
            dim(p.replace("margin-", "Margin "), (<>{num(p)}<Unit></Unit></>))
          ))}
          {dim("Radius", (<>{num("border-radius")}<Unit></Unit></>))}
          <button className="cursor-pointer text-[11px] font-medium text-ink-muted hover:text-accent" onClick={() => removeRule("padding-top")}>
            Reset spacing overrides
          </button>
        </>
      ), true)}

      {!sel.raw && section("Typography", "Typography", (
        <>
          {dim("Size", (<>{num("font-size")}<Unit></Unit></>))}
          {dim("Weight", (
            <select className="sel" value={ruleVal("font-weight")} onChange={(e) => setRule("font-weight", e.target.value)}>
              {FONT_WEIGHTS.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          ))}
          {dim("Line height", (<>{num("line-height", "", 0.1, 1)}</>))}
          {dim("Tracking", (<>{num("letter-spacing", "px", 0.1)}<Unit></Unit></>))}
        </>
      ))}

      {!sel.raw && section("Colors", "Colors", (
        <>
          {dim("Text", color("color"))}
          {dim("Background", color("background-color"))}
          {["button", "a"].includes(sel.tag) && dim("Radius", (<>{num("border-radius")}<Unit></Unit></>))}
        </>
      ))}

      {section("Responsive", "Responsive", (
        <>
          <p className="text-[11.5px] leading-relaxed text-ink-muted">
            Edit <b>{currentBp}</b> styles now. Switch devices to add overrides for that range — media queries are generated automatically.
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {(["base", "tablet", "mobile"] as const).map((b) => (
              <button
                key={b}
                className={cn(
                  "cursor-pointer rounded-md px-2 py-1.5 text-[11px] font-medium capitalize transition-colors",
                  currentBp === b ? "bg-accent text-white" : "bg-black/5 text-ink-muted hover:bg-black/10 dark:bg-white/10"
                )}
                onClick={() => useEditor.getState().set({ breakpoint: b === "base" ? "desktop" : b })}
              >
                {b === "base" ? "Desktop" : b}
              </button>
            ))}
          </div>
        </>
      ))}

      {section("Actions", "Actions", (
        <div className="flex flex-wrap gap-1.5">
          <ActionBtn onClick={() => run(() => canvas!.rpc("duplicate", sel.path))}>⧉ Duplicate</ActionBtn>
          <ActionBtn danger onClick={() => run(() => canvas!.rpc("delete", sel.path))}>🗑 Delete</ActionBtn>
          <ActionBtn onClick={onSaveAsComponent}>🧩 Save as component</ActionBtn>
          {selClasses.length > 0 && (
            <span className="text-[10.5px] leading-relaxed text-ink-muted">
              Classes: {selClasses.map((c) => c.startsWith("wp-el-") ? <b key={c} className="text-accent">{c}</b> : c).join(", ")}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function MiniBtn({ label, title, onClick, danger }: { label: string; title: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-md px-1.5 py-1 text-[12px] hover:bg-black/5 dark:hover:bg-white/10",
        danger ? "text-bad" : "text-ink-muted"
      )}
    >
      {label}
    </button>
  );
}

function Unit() {
  return <span className="shrink-0 text-[10px] text-ink-muted">px</span>;
}

function ActionBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium transition-colors",
        danger ? "border-bad/30 text-bad hover:bg-bad/10" : "hover:border-accent/50 hover:text-accent"
      )}
    >
      {children}
    </button>
  );
}