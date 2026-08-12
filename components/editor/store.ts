"use client";

import { create } from "zustand";
import type { StyleRule } from "@/lib/editor/styling";
import type { FileEntry } from "@/lib/editor/fs";

export type EditorMode = "visual" | "code" | "preview";
export type BreakpointId = "desktop" | "tablet" | "mobile";

export interface PageRow {
  id: string;
  path: string;
  title: string;
  description: string;
  og_image: string;
  is_home: boolean;
}

export interface ComponentRow {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
}

export interface AssetRow {
  id: string;
  name: string;
  path: string;
  size: number;
  mime: string;
}

export interface DeploymentRow {
  id: string;
  code: string;
  version: number;
  status: string;
  stage: string;
  url: string | null;
  error: unknown;
  meta: Record<string, unknown>;
  created_at: string;
}

export interface SuggestionRow {
  id: string;
  category: string;
  severity: "info" | "warning" | "error";
  title: string;
  detail: string;
  fix: { targetPath: string; newContent: string } | null;
  status: "open" | "fixed" | "ignored";
}

export interface VersionRow {
  id: string;
  number: number;
  kind: string;
  label: string;
  summary: string;
  created_by: string;
  created_at: string;
}

export interface SelectionInfo {
  tag: string;
  id: string;
  classes: string[];
  text: string;
  href: string;
  src: string;
  raw: boolean;
  component: string;
  rect: { x: number; y: number; width: number; height: number };
  path: number[];
  editable: boolean;
  display: string;
}

interface EditorStore {
  projectId: string;
  project: { id: string; name: string; slug: string; settings: Record<string, any> } | null;
  loaded: boolean;
  files: Record<string, FileEntry>;
  pages: PageRow[];
  components: ComponentRow[];
  assets: AssetRow[];
  assetUrlBase: string;
  deployments: DeploymentRow[];
  versions: VersionRow[];
  suggestions: SuggestionRow[];

  mode: EditorMode;
  breakpoint: BreakpointId;
  currentFile: string;
  openTabs: string[];
  dirty: Record<string, boolean>;
  selection: SelectionInfo | null;
  rules: StyleRule[];
  savedDocAt: string; // hash of last-saved visual doc

  leftNav: string; // pages | components | assets | files | history | tests | deploy | settings | analytics
  rightPanel: "props" | "ai" | "none";

  set: (p: Partial<EditorStore>) => void;
  pushFiles: (files: FileEntry[]) => void;
  setFileContent: (path: string, content: string, opts?: { dirty?: boolean; save?: boolean }) => void;
  removeFiles: (paths: string[]) => void;
  addTab: (path: string) => void;
  closeTab: (path: string) => void;
  patchPage: (path: string, data: Partial<PageRow>) => void;
  ruleUpdate: (uid: string, bp: "base" | "tablet" | "mobile", prop: string, value: string) => void;
  ruleRemove: (uid: string, prop?: string) => void;
  resetRules: (rules: StyleRule[]) => void;
}

export const useEditor = create<EditorStore>((set, get) => ({
  projectId: "",
  project: null,
  loaded: false,
  files: {},
  pages: [],
  components: [],
  assets: [],
  assetUrlBase: "",
  deployments: [],
  versions: [],
  suggestions: [],
  mode: "visual",
  breakpoint: "desktop",
  currentFile: "index.html",
  openTabs: ["index.html"],
  dirty: {},
  selection: null,
  rules: [],
  savedDocAt: "",
  leftNav: "pages",
  rightPanel: "props",

  set: (p) => set(p),

  pushFiles: (files) => {
    const next = { ...get().files };
    for (const f of files) next[f.path] = { ...next[f.path], ...f };
    set({ files: next });
  },
  setFileContent: (path, content, opts = {}) => {
    const f = get().files[path];
    if (!f) return;
    const urlBase = get().assetUrlBase;
    const next = { ...get().files, [path]: { ...f, content } };
    set({
      files: next,
      dirty: { ...get().dirty, [path]: opts.dirty ?? true },
      loaded: get().loaded,
      assetUrlBase: urlBase,
    });
  },
  removeFiles: (paths) => {
    const files = { ...get().files };
    for (const p of paths) delete files[p];
    set({ files });
  },
  addTab: (path) => {
    const tabs = get().openTabs.includes(path) ? get().openTabs : [...get().openTabs, path];
    set({ openTabs: tabs, currentFile: path });
  },
  closeTab: (path) => {
    const tabs = get().openTabs.filter((t) => t !== path);
    let current = get().currentFile;
    if (current === path) current = tabs[tabs.length - 1] ?? "";
    set({ openTabs: tabs, currentFile: current });
  },
  patchPage: (path, data) => {
    set({ pages: get().pages.map((p) => (p.path === path ? { ...p, ...data } : p)) });
  },
  ruleUpdate: (uid, bp, prop, value) => {
    const rules = get().rules.filter((r) => !(r.uid === uid && r.prop === prop));
    rules.push({ uid, bp, prop, value });
    set({ rules });
  },
  ruleRemove: (uid, prop) => {
    const rules = get().rules.filter((r) => !(r.uid === uid && (!prop || r.prop === prop)));
    set({ rules });
  },
  resetRules: (rules) => set({ rules }),
}));