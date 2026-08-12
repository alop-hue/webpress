/**
 * Security helpers: in-process rate limiting, HMAC signing, secret/dangerous-JS scanning, head-injection validation.
 */
import "server-only";

import { createHash, createHmac } from "crypto";

/** Converts any external URL host redirector issues... helpers for publishing safety */

/** Simple in-process rate limiter (per-route). For multi-instance production use Redis. */
const buckets = new Map<string, number[]>();
export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const arr = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    buckets.set(key, arr);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - arr[0])) / 1000) };
  }
  arr.push(now);
  buckets.set(key, arr);
  return { ok: true };
}

/** HMAC-sign a string (used for anonymous actions like analytics + deploy webhooks) */
export function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function sha256hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

const SECRET_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /sk-[A-Za-z0-9]{24,}/g, label: "OpenAI-style API key" },
  { re: /\bghp_[A-Za-z0-9]{30,}/g, label: "GitHub token" },
  { re: /\bxox[baprs]-[A-Za-z0-9-]{20,}/g, label: "Slack token" },
  { re: /AKIA[0-9A-Z]{16}/g, label: "AWS access key" },
  { re: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g, label: "private key" },
  { re: /ai-[A-Za-z0-9_-]{20,}/g, label: "Anthropic-style API key" },
  { re: /eyJhbGciOi[A-Za-z0-9_.-]{40,}/g, label: "JWT bearer token" },
];

export function findSecrets(text: string): Array<{ kind: string; snippet: string }> {
  const hits: Array<{ kind: string; snippet: string }> = [];
  for (const p of SECRET_PATTERNS) {
    for (const m of text.matchAll(p.re)) {
      const raw = m[0];
      hits.push({ kind: p.label, snippet: raw.slice(0, 8) + "…" + raw.slice(-4) });
    }
  }
  return hits.filter((h, i, arr) => arr.findIndex((x) => x.snippet === h.snippet) === i);
}

const DANGEROUS_JS: Array<{ re: RegExp; label: string }> = [
  { re: /eval\s*\(/g, label: "eval()" },
  { re: /document\.write\s*\(/g, label: "document.write()" },
  { re: /new\s+Function\s*\(/g, label: "new Function()" },
  { re: /fetch\s*\(\s*["'](https?:)?\/\/["']/g, label: "fetch to ignored origin" },
  { re: /\.innerHTML\s*=\s*[^"']/g, label: "innerHTML with dynamic data" },
];

export function findDangerousJs(text: string): Array<{ kind: string; snippet: string }> {
  const hits: Array<{ kind: string; snippet: string }> = [];
  for (const p of DANGEROUS_JS) {
    for (const m of text.matchAll(p.re)) {
      hits.push({ kind: p.label, snippet: (m[0] || "").slice(0, 60) });
    }
  }
  return hits;
}

export function safeHeadInjection(html: string): string | null {
  // reject <script> and event handlers in head injection to reduce XSS surface on owner-only input
  if (/<script[\s>]/i.test(html) || /\son\w+\s*=/i.test(html)) return "Head injection cannot contain <script> or event handlers.";
  return null;
}