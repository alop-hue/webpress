import { describe, expect, it } from "vitest";
import { diffLines, diffStats, compactDiff } from "@/lib/editor/diff";

describe("diff", () => {
  it("finds added and removed lines", () => {
    const rows = diffLines("a\nb\nc", "a\nB\nc");
    expect(rows).toContainEqual({ type: "del", text: "b" });
    expect(rows).toContainEqual({ type: "add", text: "B" });
    expect(rows).toContainEqual({ type: "same", text: "a" });
  });

  it("detects a brand new file", () => {
    const rows = diffLines("", "hello\nworld");
    const stats = diffStats(rows);
    expect(stats.adds).toBe(2);
    expect(stats.dels).toBe(0);
  });

  it("compacts long unchanged runs", () => {
    const a = Array.from({ length: 40 }, (_, i) => `line ${i}`).join("\n");
    const rows = compactDiff(diffLines(a, a), 4);
    const same = rows.filter((r) => r.type === "same");
    expect(same.length).toBeLessThan(12);
    expect(rows.some((r) => r.text.includes("unchanged"))).toBe(true);
  });
});
