import { describe, expect, it } from "vitest";
import {
  normalizePath,
  pathToPage,
  pageToPath,
  buildTree,
  dirname,
  basename,
  extname,
  isPageFile,
  validatePath,
} from "@/lib/editor/fs";

describe("fs", () => {
  it("normalizes paths", () => {
    expect(normalizePath("a//b\\c/")).toBe("a/b/c");
    expect(normalizePath("/index.html")).toBe("index.html");
  });

  it("maps routes to file paths and back", () => {
    expect(pathToPage("index.html")).toBe("/");
    expect(pathToPage("about.html")).toBe("/about");
    expect(pathToPage("blog/post.html")).toBe("/blog/post");
    expect(pageToPath("/")).toBe("index.html");
    expect(pageToPath("/about")).toBe("about.html");
    expect(pageToPath("/blog/post")).toBe("blog/post.html");
  });

  it("builds a folder tree", () => {
    const tree = buildTree([
      { path: "index.html", content: "", kind: "file" },
      { path: "css/style.css", content: "", kind: "file" },
      { path: "js/app.js", content: "", kind: "file" },
    ]);
    expect(tree.map((n) => n.name)).toEqual(["css", "js", "index.html"]); // folders first, then files
    expect(tree[0].children[0].name).toBe("style.css");
  });

  it("classifies page files", () => {
    expect(isPageFile("index.html")).toBe(true);
    expect(isPageFile("css/style.css")).toBe(false);
    expect(isPageFile("components/nav.html")).toBe(false);
  });

  it("rejects unsafe paths", () => {
    expect(validatePath("../../etc/passwd")).toBeTruthy();
    expect(validatePath("/abs")).toBeTruthy();
    expect(validatePath("a b")).toBeNull();
    expect(validatePath("css/style.css")).toBeNull();
  });

  it("handles basic helpers", () => {
    expect(dirname("a/b/c.html")).toBe("a/b");
    expect(basename("a/b/c.html")).toBe("c.html");
    expect(extname("a/b/c.html")).toBe("html");
  });
});
