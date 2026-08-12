import { describe, expect, it } from "vitest";
import { wrapComponent, cleanComponentHtml, componentTag, replaceComponentInstances } from "@/lib/editor/components";

describe("components", () => {
  it("wraps html with a component marker", () => {
    const w = wrapComponent("<section>Hi</section>", "Hero Section");
    expect(w).toContain('data-wp-component="hero-section"');
    expect(w).toContain("<section>Hi</section>");
  });

  it("cleans editor-only attributes", () => {
    const clean = cleanComponentHtml('<div data-wp-el="e123" class="x wp-sel">Hi</div>');
    expect(clean).not.toContain("data-wp-el");
    expect(clean).not.toContain("wp-sel");
    expect(clean).toContain("class=\"x\"");
  });

  it("replaces all instances of a component", () => {
    const page = `<div data-wp-component="nav">A</div><p>mid</p><div data-wp-component="nav">B</div>`;
    const replaced = replaceComponentInstances(page, "nav", "<div data-wp-component=\"nav\">NEW</div>");
    expect(replaced).toContain("<p>mid</p>");
    expect(replaced.match(/data-wp-component="nav"/g)).toHaveLength(2);
    expect(replaced).not.toContain(">A</div>");
    expect(replaced).not.toContain(">B</div>");
  });

  it("produces a valid tag", () => {
    expect(componentTag("My Pricing Card!")).toBe('data-wp-component="my-pricing-card"');
  });
});
