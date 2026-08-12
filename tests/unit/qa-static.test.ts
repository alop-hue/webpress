import { describe, expect, it } from "vitest";
import { runStaticChecks, summarize } from "@/lib/qa/static";

const pages = [{ path: "/", title: "Home" }];

function doc(html: string) {
  return [{ path: "index.html", kind: "file" as const, content: html }];
}

describe("runStaticChecks", () => {
  it("flags missing title when no page meta supplies one", () => {
    const r = runStaticChecks(doc(`<!DOCTYPE html><html><head></head><body></body></html>`), []);
    expect(r.some((c) => c.category === "seo" && c.severity === "error" && c.title.includes("no title"))).toBe(true);
  });

  it("accepts a title supplied by page meta", () => {
    const r = runStaticChecks(doc(`<!DOCTYPE html><html><head></head><body></body></html>`), pages);
    expect(r.some((c) => c.category === "seo" && c.severity === "error" && c.title.includes("no title"))).toBe(false);
  });

  it("flags images without alt text", () => {
    const r = runStaticChecks(doc(`<html><head><title>T</title></head><body><img src="x.png"></body></html>`), pages);
    expect(r.some((c) => c.category === "accessibility" && c.title.includes("alt text"))).toBe(true);
  });

  it("flags broken internal links", () => {
    const r = runStaticChecks(doc(`<html><head><title>T</title></head><body><a href="/pricing">P</a></body></html>`), pages);
    expect(r.some((c) => c.category === "link" && c.severity === "error" && c.title.includes("Broken link"))).toBe(true);
  });

  it("accepts .html links that resolve to real pages", () => {
    const files = [
      { path: "index.html", kind: "file" as const, content: `<html><head><title>T</title></head><body><a href="index.html">Home</a><a href="pricing.html">Pricing</a><a href="./about.html#x">About</a></body></html>` },
      { path: "pricing.html", kind: "file" as const, content: `<html><head><title>P</title></head><body></body></html>` },
      { path: "about.html", kind: "file" as const, content: `<html><head><title>A</title></head><body></body></html>` },
    ];
    const r = runStaticChecks(files, [{ path: "/", title: "Home" }, { path: "/pricing", title: "P" }, { path: "/about", title: "A" }]);
    expect(r.filter((c) => c.category === "link" && c.severity === "error")).toHaveLength(0);
  });

  it("flags .html links to missing pages", () => {
    const r = runStaticChecks(doc(`<html><head><title>T</title></head><body><a href="missing.html">X</a></body></html>`), pages);
    expect(r.some((c) => c.category === "link" && c.severity === "error" && c.title.includes("Broken link"))).toBe(true);
  });

  it("accepts root-relative links to existing routes", () => {
    const files = [
      { path: "index.html", kind: "file" as const, content: `<html><head><title>T</title></head><body><a href="/pricing">P</a><a href="/">Home</a></body></html>` },
      { path: "pricing.html", kind: "file" as const, content: `<html><head><title>P</title></head><body></body></html>` },
    ];
    const r = runStaticChecks(files, [{ path: "/", title: "Home" }, { path: "/pricing", title: "P" }]);
    expect(r.filter((c) => c.category === "link" && c.severity === "error")).toHaveLength(0);
  });

  it("flags javascript: links", () => {
    const r = runStaticChecks(doc(`<html><head><title>T</title></head><body><a href="javascript:alert(1)">x</a></body></html>`), pages);
    expect(r.some((c) => c.category === "security" && c.severity === "error")).toBe(true);
  });

  it("flags exposed secrets", () => {
    const r = runStaticChecks(doc(`<html><head><title>T</title><script>const k="sk-ABCDEFGHIJKLMNOPQRSTUVWXYZ123456";</script></head><body></body></html>`), pages);
    expect(r.some((c) => c.category === "security" && c.title.includes("API key"))).toBe(true);
  });

  it("flags missing lang + h1", () => {
    const r = runStaticChecks(doc(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Home</title></head><body></body></html>`), pages);
    expect(r.some((c) => c.title.includes("lang"))).toBe(true);
    expect(r.some((c) => c.title.includes("H1"))).toBe(true);
  });

  it("summarizes severity counts", () => {
    const s = summarize([]);
    expect(s.passed).toBe(true);
  });
});
