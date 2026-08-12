/**
 * Pre-made component library — 100 ready-to-insert HTML/CSS/JS blocks.
 * Aggregates the category files into a single searchable list.
 */
import type { LibraryComponent } from "./types";
import { BASICS } from "./basics";
import { CARDS } from "./cards";
import { FORMS } from "./forms";
import { NAVIGATION } from "./navigation";
import { SECTIONS } from "./sections";
import { WIDGETS } from "./widgets";

export const LIBRARY_COMPONENTS: LibraryComponent[] = [
  ...BASICS,
  ...CARDS,
  ...FORMS,
  ...NAVIGATION,
  ...SECTIONS,
  ...WIDGETS,
];

export const LIBRARY_CATEGORIES = [
  { id: "basics", label: "Basics" },
  { id: "cards", label: "Cards" },
  { id: "forms", label: "Forms" },
  { id: "navigation", label: "Navigation" },
  { id: "sections", label: "Sections" },
  { id: "widgets", label: "Widgets" },
] as const;

export function findLibraryComponent(id: string): LibraryComponent | undefined {
  return LIBRARY_COMPONENTS.find((c) => c.id === id);
}

export function searchLibrary(query: string, category?: string): LibraryComponent[] {
  const q = query.trim().toLowerCase();
  return LIBRARY_COMPONENTS.filter((c) => {
    if (category && c.category !== category) return false;
    if (!q) return true;
    return (c.name + " " + c.description).toLowerCase().includes(q);
  });
}

/** Markup for a full standalone document preview of a library component. */
export function libraryPreviewDoc(comp: LibraryComponent): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${comp.css}</style>
<style>body{margin:0;padding:32px;background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}</style>
</head>
<body>${comp.html}</body>
</html>`;
}
