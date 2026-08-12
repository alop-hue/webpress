/**
 * Visual styling system.
 * Each styled element gets data-wp-el="<uid>". Host keeps a record of
 * style props per uid (base + per-breakpoint) and compiles them into the
 * #wp-el-styles stylesheet inside the canvas. Class-based, so it survives
 * code edits (CSS lives in the document head) and stays cascade-friendly.
 */
import { clamp } from "@/lib/utils";

export type BreakpointKey = "base" | "tablet" | "mobile";

export interface ElementStyle {
  uid: string;
  [bp: string]: Record<string, string> | string;
}

export interface StyleRule {
  uid: string;
  bp: BreakpointKey;
  prop: string;
  value: string;
}

export const BREAKPOINT_RANGES: Record<BreakpointKey, { min: number; max: number }> = {
  base: { min: 1024, max: Number.MAX_SAFE_INTEGER },
  tablet: { min: 768, max: 1023 },
  mobile: { min: 0, max: 767 },
};

export function cssForRules(rules: StyleRule[]): string {
  const byBp: Record<BreakpointKey, Map<string, Record<string, string>>> = {
    base: new Map(),
    tablet: new Map(),
    mobile: new Map(),
  };
  for (const r of rules) {
    let m = byBp[r.bp].get(r.uid);
    if (!m) {
      m = {};
      byBp[r.bp].set(r.uid, m);
    }
    m[r.prop] = r.value;
  }
  const parts: string[] = [];
  const emit = (bp: BreakpointKey, uid: string, props: Record<string, string>) => {
    const body = Object.entries(props)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");
    const rule = `.wp-el-${uid} { ${body} }`;
    if (bp === "base") return rule;
    const { min, max } = BREAKPOINT_RANGES[bp];
    return `@media (min-width: ${min}px) and (max-width: ${max}px) { ${rule} }`;
  };
  for (const [uid, props] of byBp.base) parts.push(emit("base", uid, props));
  for (const [uid, props] of byBp.tablet) parts.push(emit("tablet", uid, props));
  for (const [uid, props] of byBp.mobile) parts.push(emit("mobile", uid, props));
  return parts.join("\n");
}

export const UNIT_PROPS: Record<string, { unit?: string; step?: number; min?: number; max?: number }> = {
  paddingTop: { unit: "px", step: 4, min: 0, max: 200 },
  paddingRight: { unit: "px", step: 4, min: 0, max: 200 },
  paddingBottom: { unit: "px", step: 4, min: 0, max: 200 },
  paddingLeft: { unit: "px", step: 4, min: 0, max: 200 },
  marginTop: { unit: "px", step: 4, min: 0, max: 200 },
  marginRight: { unit: "px", step: 4, min: 0, max: 200 },
  marginBottom: { unit: "px", step: 4, min: 0, max: 200 },
  marginLeft: { unit: "px", step: 4, min: 0, max: 200 },
  fontSize: { unit: "px", step: 1, min: 8, max: 96 },
  lineHeight: { unit: "", step: 0.1, min: 1, max: 2.5 },
  borderRadius: { unit: "px", step: 2, min: 0, max: 64 },
  gap: { unit: "px", step: 4, min: 0, max: 120 },
  width: { unit: "px", step: 8, min: 0, max: 2000 },
  maxWidth: { unit: "px", step: 8, min: 0, max: 2000 },
  minHeight: { unit: "px", step: 8, min: 0, max: 2000 },
  opacity: { unit: "", step: 0.05, min: 0, max: 1 },
  letterSpacing: { unit: "px", step: 0.1, min: -2, max: 8 },
  flexGrow: { unit: "", step: 0.5, min: 0, max: 4 },
  top: { unit: "px", step: 4, min: 0, max: 1000 },
  left: { unit: "px", step: 4, min: 0, max: 1000 },
  right: { unit: "px", step: 4, min: 0, max: 1000 },
  bottom: { unit: "px", step: 4, min: 0, max: 1000 },
};

export function numericStep(prop: string, value: string): { n: number; unit: string } | null {
  const m = /^(-?[\d.]+)([a-z%]*)$/i.exec(String(value).trim());
  if (!m) return null;
  return { n: parseFloat(m[1]), unit: m[2] };
}

export function stepValue(prop: string, current: string, delta: number): string | null {
  const cfg = UNIT_PROPS[prop];
  if (!cfg) return null;
  const cur = numericStep(prop, current) || { n: parseFloat(current) || 0, unit: cfg.unit || "" };
  let n = cur.n + (cfg.step ?? 1) * delta;
  if (cfg.min !== undefined) n = clamp(n, cfg.min, cfg.max ?? n);
  return n % 1 === 0 ? `${n}${cfg.unit ?? ""}` : `${n.toFixed(1)}${cfg.unit ?? ""}`;
}