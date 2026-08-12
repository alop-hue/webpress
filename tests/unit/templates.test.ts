import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/templates";
import { pageToPath } from "@/lib/editor/fs";
import { buildSite } from "@/lib/editor/build";
import { parse } from "node-html-parser";

describe("templates", () => {
  it("has at least two templates", () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(2);
  });

  it("every page route has a backing file", () => {
    for (const t of TEMPLATES) {
      const paths = new Set(t.files.filter((f) => f.kind === "file").map((f) => f.path));
      for (const p of t.pages) {
        expect(paths.has(pageToPath(p.path)), `${t.id}: missing file for ${p.path}`).toBe(true);
      }
    }
  });

  it("page files are valid documents with title + h1", () => {
    for (const t of TEMPLATES) {
      for (const f of t.files) {
        if (!f.path.endsWith(".html")) continue;
        const doc = parse(f.content);
        expect(doc.querySelector("title")?.textContent?.trim().length, `${t.id}:${f.path} title`).toBeGreaterThan(3);
        expect(doc.querySelector("h1")?.textContent?.trim().length, `${t.id}:${f.path} h1`).toBeGreaterThan(0);
        expect(doc.querySelector('meta[name="viewport"]'), `${t.id}:${f.path} viewport`).toBeTruthy();
      }
    }
  });

  it("css files exist for every template", () => {
    for (const t of TEMPLATES) {
      expect(t.files.some((f) => f.path === "css/style.css"), `${t.id} css`).toBe(true);
    }
  });

  it("internal links resolve within the template", () => {
    for (const t of TEMPLATES) {
      const routes = new Set(t.pages.map((p) => p.path));
      for (const f of t.files) {
        if (!f.path.endsWith(".html")) continue;
        const doc = parse(f.content);
        for (const a of doc.querySelectorAll("a")) {
          const href = a.getAttribute("href") ?? "";
          if (!href.startsWith("/") && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:") && href !== "") {
            const base = href.split("#")[0];
            const target = base === "index.html" ? "/" : "/" + base.replace(/\.html$/, "");
            expect(routes.has(target), `${t.id}:${f.path} → ${href}`).toBe(true);
          }
        }
      }
    }
  });

  it("every declared page builds into the published site", () => {
    for (const t of TEMPLATES) {
      const meta = t.pages.map((p) => ({ ...p, og_image: "" }));
      const built = buildSite(t.files, meta, {}, "test1", "https://x.example");
      const expected = new Set(t.pages.map((p) => p.path));
      const actual = new Set(Object.keys(built.pages));
      for (const r of expected) {
        expect(actual.has(r), `${t.id}: missing built page for ${r} (warnings: ${built.warnings.join("; ")})`).toBe(true);
      }
    }
  });

  it("every template builds into styled, self-contained published pages", () => {
    for (const t of TEMPLATES) {
      const meta = t.pages.map((p) => ({ ...p, og_image: "" }));
      const built = buildSite(t.files, meta, {}, "test1", "https://x.example");
      for (const [route, html] of Object.entries(built.pages)) {
        const doc = parse(html);
        expect(doc.querySelector("title")?.textContent?.trim().length, `${t.id}:${route} title`).toBeGreaterThan(3);
        expect(doc.querySelector('meta[name="viewport"]'), `${t.id}:${route} viewport`).toBeTruthy();
        // css/js inlined so /p/[code] renders styled without asset routes
        expect(doc.querySelectorAll("style[data-webpress=inline]").length, `${t.id}:${route} inline css`).toBeGreaterThan(0);
        // no project-relative stylesheet links that would 404
        for (const l of doc.querySelectorAll("link[rel=stylesheet]")) {
          const href = l.getAttribute("href") ?? "";
          expect(/^(https?:)?\/\//.test(href), `${t.id}:${route} → ${href}`).toBe(true);
        }
      }
    }
  });
});
