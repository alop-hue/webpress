import { describe, expect, it } from "vitest";
import {
  LIBRARY_CATEGORIES,
  LIBRARY_COMPONENTS,
  findLibraryComponent,
  libraryPreviewDoc,
  searchLibrary,
} from "@/lib/editor/component-library";

describe("component library", () => {
  it("contains exactly 100 pre-made components", () => {
    expect(LIBRARY_COMPONENTS).toHaveLength(100);
  });

  it("has unique ids", () => {
    const ids = LIBRARY_COMPONENTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every component has a valid category from the known list", () => {
    const cats = new Set<string>(LIBRARY_CATEGORIES.map((c) => c.id));
    for (const c of LIBRARY_COMPONENTS) expect(cats.has(c.category)).toBe(true);
  });

  it("every component ships html, css and a name", () => {
    for (const c of LIBRARY_COMPONENTS) {
      expect(c.html.length).toBeGreaterThan(0);
      expect(c.css.length).toBeGreaterThan(0);
      expect(c.name.length).toBeGreaterThan(0);
      expect(c.description.length).toBeGreaterThan(0);
    }
  });

  it("html/css/js are self-contained and tag-balanced", () => {
    const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
    for (const c of LIBRARY_COMPONENTS) {
      // stack-based balance check: tolerant of multiline tags and quoted attributes
      const stack: string[] = [];
      let i = 0;
      const s = c.html;
      while (i < s.length) {
        const lt = s.indexOf("<", i);
        if (lt === -1) break;
        const gt = s.indexOf(">", lt + 1);
        if (gt === -1) break;
        const raw = s.slice(lt + 1, gt).trim();
        i = gt + 1;
        if (!raw || raw.startsWith("!") || raw.startsWith("?")) continue;
        if (raw.startsWith("/")) {
          const name = raw.slice(1).trim().split(/[\s/]+/)[0].toLowerCase();
          expect(stack.pop()).toBe(name);
        } else {
          const name = raw.split(/[\s/]+/)[0].toLowerCase();
          const selfClosing = raw.endsWith("/") || VOID.has(name);
          if (!selfClosing) stack.push(name);
        }
      }
      expect(stack).toEqual([]);
      // css braces are balanced
      const openB = (c.css.match(/{/g) ?? []).length;
      const closeB = (c.css.match(/}/g) ?? []).length;
      expect(openB).toBe(closeB);
    }
  });

  it("findLibraryComponent resolves by id", () => {
    expect(findLibraryComponent("hero-split")?.id).toBe("hero-split");
    expect(findLibraryComponent("button-primary")?.id).toBe("button-primary");
    expect(findLibraryComponent("nope")).toBeUndefined();
  });

  it("searchLibrary filters by query and category", () => {
    expect(searchLibrary("pricing").length).toBeGreaterThan(0);
    const forms = searchLibrary("", "forms");
    expect(forms.length).toBeGreaterThan(0);
    for (const f of forms) expect(f.category).toBe("forms");
    expect(searchLibrary("zzzzz-no-match")).toHaveLength(0);
  });

  it("builds a standalone preview document", () => {
    const c = findLibraryComponent("button-primary")!;
    const doc = libraryPreviewDoc(c);
    expect(doc).toContain("<!DOCTYPE html>");
    expect(doc).toContain(c.html);
    expect(doc).toContain("<style>");
  });
});
