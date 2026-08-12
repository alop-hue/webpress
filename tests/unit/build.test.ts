import { describe, expect, it } from "vitest";
import { buildSite, type PageMeta } from "@/lib/editor/build";
import { parse } from "node-html-parser";

const files = [
  { path: "index.html", kind: "file" as const, content: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><h1>Home</h1></body></html>` },
  { path: "about.html", kind: "file" as const, content: `<!DOCTYPE html><html lang="en"><head></head><body><h1>About</h1></body></html>` },
  { path: "css/style.css", kind: "file" as const, content: "body{color:#000}" },
  { path: "js/app.js", kind: "file" as const, content: "console.log(1)" },
];

const pages: PageMeta[] = [
  { path: "/", title: "Home — Acme", description: "Acme home", og_image: "" },
  { path: "/about", title: "About — Acme", description: "About Acme", og_image: "" },
];

describe("buildSite", () => {
  it("renders every page as a full document", () => {
    const built = buildSite(files, pages, { siteName: "Acme" }, "Ab12cd", "https://wp.example.com");
    expect(Object.keys(built.pages)).toEqual(["/", "/about"]);
    const doc = parse(built.pages["/"]);
    expect(doc.querySelector("h1")?.textContent).toBe("Home");
    expect(doc.querySelector("title")?.textContent).toBe("Home — Acme");
  });

  it("injects SEO meta, canonical, viewport, lang and css/js links", () => {
    const built = buildSite(files, pages, {}, "Ab12cd", "https://wp.example.com");
    const doc = parse(built.pages["/about"]);
    expect(doc.querySelector("html")?.getAttribute("lang")).toBe("en");
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe("About Acme");
    expect(doc.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe("About — Acme");
    expect(doc.querySelector('meta[name="viewport"]')).toBeTruthy();
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://wp.example.com/p/Ab12cd/about");
    const links = doc.querySelectorAll("link[rel=stylesheet]").map((l) => l.getAttribute("href"));
    expect(links).toContain("../css/style.css");
    const scripts = doc.querySelectorAll("script[src]").map((s) => s.getAttribute("src"));
    expect(scripts).toContain("../js/app.js");
  });

  it("generates sitemap and robots", () => {
    const built = buildSite(files, pages, {}, "Ab12cd", "https://wp.example.com");
    expect(built.sitemap).toContain("https://wp.example.com/p/Ab12cd/");
    expect(built.sitemap).toContain("<urlset");
    expect(built.robots).toContain("Sitemap: https://wp.example.com/p/Ab12cd/sitemap.xml");
  });

  it("warns when html structure is broken", () => {
    const bad = buildSite([{ path: "index.html", kind: "file", content: "<div>no html tag</div>" }], pages, {}, "x");
    expect(bad.warnings.length).toBeGreaterThan(0);
  });
});
