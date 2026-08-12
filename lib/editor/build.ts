import "server-only";

import { parse, type HTMLElement } from "node-html-parser";
import { extname, isPageFile, pageToPath, pathToPage, type FileEntry } from "./fs";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  og_image: string;
}

export interface BuildSettings {
  siteName?: string;
  favicon?: string;
  analytics?: boolean;
  customHead?: string;
}

export interface BuildResult {
  pages: Record<string, string>; // route -> full html document
  manifest: string[]; // files used
  sitemap: string;
  robots: string;
  warnings: string[];
}

const ANALYTICS_SNIPPET = `<script>(function(){var d=document;function track(){try{var r=new XMLHttpRequest();r.open("POST","/api/analytics/{{CODE}}",true);r.setRequestHeader("Content-Type","application/json");r.send(JSON.stringify({path:location.pathname,referrer:d.referrer.slice(0,300),ua:navigator.userAgent.slice(0,300),device:innerWidth<768?"mobile":innerWidth<1200?"tablet":"desktop"}));}catch(e){}}if(d.readyState==="complete"){track()}else{d.addEventListener("DOMContentLoaded",track)}})();</script>`;

export function buildSite(
  files: FileEntry[],
  pages: PageMeta[],
  settings: BuildSettings,
  siteCode = "",
  baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
): BuildResult {
  const byPath = new Map(files.filter((f) => f.kind === "file").map((f) => [f.path, f.content]));
  const pageMetas = new Map(pages.map((p) => [p.path, p]));
  const result: BuildResult = { pages: {}, manifest: [], sitemap: "", robots: "", warnings: [] };

  const cssFiles = [...byPath.keys()]
    .filter((p) => extname(p) === "css")
    .sort()
    .map((p) => `../${p}`);
  const jsFiles = [...byPath.keys()]
    .filter((p) => extname(p) === "js")
    .sort()
    .map((p) => `../${p}`);

  const pageFiles = files.filter((f) => isPageFile(f.path));
  for (const pf of pageFiles) {
    const route = pathToPage(pf.path);
    if (!route) continue;
    result.manifest.push(pf.path);
    const raw = pf.content || "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"></head><body></body></html>";
    const doc = parse(raw);
    const htmlEl = doc.querySelector("html");
    if (!htmlEl) {
      result.warnings.push(`${pf.path}: missing <html> element`);
      continue;
    }
    if (!htmlEl.getAttribute("lang")) htmlEl.setAttribute("lang", "en");

    let head = doc.querySelector("head") as HTMLElement | null;
    const body = doc.querySelector("body");
    if (!head || !body) {
      result.warnings.push(`${pf.path}: missing <head> or <body>`);
      continue;
    }

    const meta = pageMetas.get(route);
    // Title
    const titleEl = head.querySelector("title");
    if (meta?.title) {
      if (titleEl) titleEl.textContent = meta.title;
      else {
        const t = parse(`<title></title>`);
        head.appendChild(t.querySelector("title")!);
        (head.querySelector("title") as HTMLElement).textContent = meta.title;
      }
    }
    // Description
    setMeta(head, "name", "description", meta?.description);
    // Open Graph
    setMeta(head, "property", "og:title", meta?.title);
    setMeta(head, "property", "og:description", meta?.description);
    setMeta(head, "property", "og:type", "website");
    setMeta(head, "property", "og:url", `${baseUrl}/p/${siteCode}${route}`);
    if (meta?.og_image) setMeta(head, "property", "og:image", meta.og_image);
    setMeta(head, "name", "twitter:card", "summary");
    // Canonical
    const canonical = ensureMeta(head, "link", "rel", "canonical");
    if (canonical) canonical.setAttribute("href", `${baseUrl}/p/${siteCode}${route}`);
    // Viewport
    if (!head.querySelector('meta[name="viewport"]')) {
      const vp = parse('<meta name="viewport" content="width=device-width, initial-scale=1">');
      head.appendChild(vp.querySelector("meta")!);
    }
    // Favicon
    if (settings.favicon) {
      const existing = head.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
      if (existing) existing.setAttribute("href", settings.favicon);
      else {
        const l = parse('<link rel="icon" href="' + settings.favicon + '">');
        head.appendChild(l.querySelector("link")!);
      }
    }
    // CSS + JS links
    for (const c of cssFiles) {
      const link = parse(`<link rel="stylesheet" href="${c}">`);
      head.appendChild(link.querySelector("link")!);
    }
    for (const j of jsFiles) {
      const s = parse(`<script src="${j}" defer></script>`);
      head.appendChild(s.querySelector("script")!);
    }
    // custom head injection
    if (settings.customHead) {
      head.appendChild(parse(settings.customHead));
    }
    // analytics
    if (settings.analytics && siteCode) {
      const sn = parse(ANALYTICS_SNIPPET.replace("{{CODE}}", siteCode));
      head.appendChild(sn.querySelector("script")!);
    }

    // normalize: exact doctype + html
    const html = doc.querySelector("html")!;
    result.pages[route] = "<!DOCTYPE html>\n" + html.toString();
  }

  const routes = Object.keys(result.pages).sort();
  result.sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes
      .map(
        (r) =>
          `  <url><loc>${baseUrl}/p/${siteCode}${r}</loc><changefreq>weekly</changefreq></url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  result.robots =
    `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/p/${siteCode}/sitemap.xml\n`;

  return result;
}

function setMeta(
  head: HTMLElement,
  attr: string,
  key: string,
  value?: string
) {
  const el = head.querySelector(`meta[${attr}="${key}"]`);
  if (!value) {
    el?.remove();
    return;
  }
  if (el) el.setAttribute("content", value);
  else {
    const m = parse(`<meta ${attr}="${key}" content="">`);
    const node = m.querySelector("meta") as HTMLElement;
    node.setAttribute("content", value);
    head.appendChild(node);
  }
}

function ensureMeta(
  head: HTMLElement,
  tag: string,
  attr: string,
  key: string
): HTMLElement | null {
  const existing = head.querySelector(`${tag}[${attr}="${key}"]`) as HTMLElement | null;
  if (existing) return existing;
  const n = parse(`<${tag} ${attr}="${key}"></${tag}>`);
  const node = n.querySelector(tag) as HTMLElement | null;
  if (node) head.appendChild(node);
  return node;
}