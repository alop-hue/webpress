import { describe, expect, it } from "vitest";
import { cssForRules, stepValue } from "@/lib/editor/styling";

describe("styling", () => {
  it("emits base rules", () => {
    const css = cssForRules([{ uid: "e1", bp: "base", prop: "padding", value: "12px" }]);
    expect(css).toContain(".wp-el-e1 { padding: 12px }");
  });

  it("wraps responsive rules in media queries", () => {
    const css = cssForRules([
      { uid: "e1", bp: "tablet", prop: "gap", value: "8px" },
      { uid: "e1", bp: "mobile", prop: "font-size", value: "14px" },
    ]);
    expect(css).toContain("@media (min-width: 768px) and (max-width: 1023px)");
    expect(css).toContain("@media (min-width: 0px) and (max-width: 767px)");
  });

  it("merges multiple props for the same uid/bp", () => {
    const css = cssForRules([
      { uid: "e1", bp: "base", prop: "color", value: "red" },
      { uid: "e1", bp: "base", prop: "font-size", value: "16px" },
    ]);
    expect(css).toContain("color: red; font-size: 16px");
  });

  it("steps numeric values with units", () => {
    expect(stepValue("fontSize", "14px", 1)).toBe("15px");
    expect(stepValue("lineHeight", "1.4", 1)).toBe("1.5");
  });
});
