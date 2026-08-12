import { describe, expect, it } from "vitest";
import { findSecrets, findDangerousJs, rateLimit } from "@/lib/security";

describe("security", () => {
  it("detects API keys and tokens", () => {
    const hits = findSecrets("key = sk-ABCdefGHIjklMNOpqrSTUvWXyZ0123456789 and token ghp_abcdefghijklmnopqrstuvwxyzABCDEFG");
    expect(hits.length).toBeGreaterThanOrEqual(2);
  });

  it("detects private keys", () => {
    const hits = findSecrets("-----BEGIN RSA PRIVATE KEY-----\nMIIE");
    expect(hits.some((h) => h.kind.includes("private key"))).toBe(true);
  });

  it("flags dangerous JS patterns", () => {
    const hits = findDangerousJs("eval(userInput); document.write('<b>')");
    expect(hits.some((h) => h.kind === "eval()")).toBe(true);
    expect(hits.some((h) => h.kind === "document.write()")).toBe(true);
  });

  it("rate limits within a window", () => {
    expect(rateLimit("t", 2, 1000).ok).toBe(true);
    expect(rateLimit("t", 2, 1000).ok).toBe(true);
    const third = rateLimit("t", 2, 1000);
    expect(third.ok).toBe(false);
    expect(third.retryAfter).toBeGreaterThan(0);
  });
});
