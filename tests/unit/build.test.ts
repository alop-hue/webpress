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

  it("injects SEO meta, canonical, viewport, lang and inlines css/js", () => {
    const built = buildSite(files, pages, {}, "Ab12cd", "https://wp.example.com");
    const doc = parse(built.pages["/about"]);
    expect(doc.querySelector("html")?.getAttribute("lang")).toBe("en");
    expect(doc.querySelector('meta[name="description"]')?.getAttribute("content")).toBe("About Acme");
    expect(doc.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe("About — Acme");
    expect(doc.querySelector('meta[name="viewport"]')).toBeTruthy();
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://wp.example.com/p/Ab12cd/about");
    // project css/js are inlined (no relative links that would 404 on /p/[code])
    expect(doc.querySelectorAll("link[rel=stylesheet]")).toHaveLength(0);
    const style = doc.querySelector("style[data-webpress=inline]");
    expect(style?.textContent).toContain("body{color:#000}");
    const script = doc.querySelector("script[data-webpress=inline]");
    expect(script?.textContent).toContain("console.log(1)");
  });

  it("rewrites internal relative links to absolute /p/[code] paths", () => {
    const filesWithLinks = [
      { path: "index.html", kind: "file" as const, content: `<html><head></head><body><a href="menu.html">Menu</a><a href="./about.html#team">About</a><a href="https://ext.example/x">Ext</a><a href="#top">Top</a><img src="img/logo.png"><a href="mailto:hi@x.com">Mail</a></body></html>` },
      { path: "menu.html", kind: "file" as const, content: `<html><head></head><body><h1>Menu</h1><a href="index.html">Home</a></body></html>` },
    ];
    const nestedFiles = [
      ...filesWithLinks,
      { path: "posts/essay.html", kind: "file" as const, content: `<html><head></head><body><h1>Essay</h1><a href="index.html">Home</a><a href="../menu.html">Menu</a></body></html>` },
    ];
    const built = buildSite(nestedFiles, [...pages, { path: "/posts/essay", title: "Essay", description: "", og_image: "" }], {}, "Ab12cd", "https://wp.example.com");
    const home = parse(built.pages["/"]);
    const hrefs = home.querySelectorAll("a[href]").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/p/Ab12cd/menu");
    expect(hrefs).toContain("/p/Ab12cd/about#team");
    expect(hrefs).toContain("https://ext.example/x");
    expect(hrefs).toContain("#top");
    expect(hrefs).toContain("mailto:hi@x.com");
    expect(home.querySelector("img")?.getAttribute("src")).toBe("/p/Ab12cd/img/logo.png");
    const menu = parse(built.pages["/menu"]);
    expect(menu.querySelector("a[href]")?.getAttribute("href")).toBe("/p/Ab12cd/");
    const essay = parse(built.pages["/posts/essay"]);
    const essayHrefs = essay.querySelectorAll("a[href]").map((a) => a.getAttribute("href"));
    expect(essayHrefs).toContain("/p/Ab12cd/"); // bare index.html from a nested page → home
    expect(essayHrefs).toContain("/p/Ab12cd/menu"); // ../menu.html from a nested page
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
