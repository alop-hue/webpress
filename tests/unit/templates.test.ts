import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/templates";
import { pageToPath } from "@/lib/editor/fs";
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
          if (!href.startsWith("/") && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("mailto:") && href !== "") {
            const base = href.split("#")[0];
            const target = base === "index.html" ? "/" : "/" + base.replace(/\.html$/, "");
            expect(routes.has(target), `${t.id}:${f.path} → ${href}`).toBe(true);
          }
        }
      }
    }
  });
});
