/**
 * Reusable component utilities: extract a DOM subtree into a component
 * definition, and wrap component HTML for insertion into pages.
 */

export interface ComponentDef {
  name: string;
  html: string;
  css: string;
  js: string;
  props?: Record<string, string>;
}

/** Wrap bare section HTML so it can be re-synced by the host: */
export function wrapComponent(html: string, name: string): string {
  const safe = name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase().replace(/^-+|-+$/g, "");
  return `<div data-wp-component="${safe}">\n${html}\n</div>`;
}

/** Strip editor system attributes before storing into a component */
export function cleanComponentHtml(html: string): string {
  return html
    .replace(/\sdata-wp-el="[^"]*"/g, "")
    .replace(/\sdata-wp-selected/g, "")
    .replace(/\swp-sel/g, "")
    .trim();
}

export function componentTag(name: string): string {
  return `data-wp-component="${name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase().replace(/^-+|-+$/g, "")}"`;
}

export function findComponentInstance(html: string, name: string): string | null {
  const tag = componentTag(name);
  const i = html.indexOf(tag);
  if (i < 0) return null;
  const open = html.lastIndexOf("<", i);
  const close = html.indexOf("</", i);
  const end = html.indexOf("</div>", close);
  return end >= 0 ? html.slice(open, end + 6) : null;
}

/** Replace all instances of a component with new content (handles nested divs) */
export function replaceComponentInstances(html: string, name: string, newHtml: string): string {
  const tag = componentTag(name);
  let out = html;
  let from = 0;
  let guard = 0;
  while (guard++ < 50) {
    const i = out.indexOf(tag, from);
    if (i < 0) break;
    const open = out.lastIndexOf("<", i);
    const end = findWrapperEnd(out, open);
    if (open < 0 || end < 0) break;
    out = out.slice(0, open) + newHtml + out.slice(end);
    from = open + newHtml.length;
  }
  return out;
}

/** Depth-scan from a wrapper's opening <div to its matching </div> */
function findWrapperEnd(out: string, open: number): number {
  let depth = 0;
  let pos = open;
  while (pos < out.length) {
    const no = out.indexOf("<div", pos);
    const nc = out.indexOf("</div>", pos);
    if (no === -1 && nc === -1) return -1;
    if (nc === -1 || (no !== -1 && no < nc)) {
      depth++;
      pos = no + 4;
    } else {
      depth--;
      pos = nc + 6;
      if (depth === 0) return pos;
    }
  }
  return -1;
}