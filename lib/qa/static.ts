import "server-only";

import { parse, type HTMLElement } from "node-html-parser";
import { extname, isPageFile, pathToPage, type FileEntry } from "@/lib/editor/fs";
import { findDangerousJs, findSecrets } from "@/lib/security";

export type Severity = "ok" | "info" | "warning" | "error";

export interface CheckResult {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  detail: string;
  fix?: { targetPath: string; newContent: string };
}

export interface RunSummary {
  errors: number;
  warnings: number;
  info: number;
  ok: number;
  passed: boolean;
}

export function runStaticChecks(files: FileEntry[], pages: { path: string; title: string }[]): CheckResult[] {
  const results: CheckResult[] = [];
  const byPath = new Map(files.map((f) => [f.path, f.content]));
  const htmlFiles = files.filter((f) => isPageFile(f.path));
  const pageMeta = new Map(pages.map((p) => [p.path, p.title]));
  const routeSet = new Set(htmlFiles.map((f) => pathToPage(f.path)));

  const fixHtml = (targetPath: string, fn: (doc: HTMLElement) => void) => {
    const raw = byPath.get(targetPath) ?? "";
    let doc: HTMLElement;
    try {
      doc = parse(raw);
    } catch {
      return null;
    }
    fn(doc);
    const html = doc.querySelector("html");
    return html ? "<!DOCTYPE html>\n" + html.toString() : null;
  };

  const withFix = (targetPath: string, fn: (doc: HTMLElement) => void) => {
    const fixed = fixHtml(targetPath, fn);
    return fixed ? { targetPath, newContent: fixed } : undefined;
  };

  let orphan = 0;
  const uniqId = (prefix: string) => `${prefix}-${++orphan}`;

  for (const f of htmlFiles) {
    const content = f.content || "";
    let doc: HTMLElement;
    try {
      doc = parse(content);
    } catch {
      results.push({
        id: `parse-${f.path}`,
        category: "content",
        severity: "error",
        title: `${f.path} has invalid HTML`,
        detail: "The HTML parser failed. Fix the markup in Code mode.",
      });
      continue;
    }
    const head = doc.querySelector("head");
    const body = doc.querySelector("body");
    const route = pathToPage(f.path);

    // SEO
    const titleEl = head?.querySelector("title");
    const title = titleEl?.textContent?.trim() ?? "";
    const metaTitle = pageMeta.get(route ?? "") || "";
    if (!title && !metaTitle) {
      results.push({
        id: uniqId(`title-${f.path}`),
        category: "seo",
        severity: "error",
        title: `Page ${route || f.path} has no title`,
        detail: "Add a <title> or set the page title in Pages settings. Titles appear in search results and browser tabs.",
        fix: withFix(f.path, (d) => {
          const h = d.querySelector("head") || d;
          if (!h.querySelector("title")) h.appendChild(parse("<title>Untitled page</title>"));
        }),
      });
    } else if ((title || metaTitle).length < 10) {
      results.push({
        id: `title-short-${f.path}`,
        category: "seo",
        severity: "warning",
        title: `Title on ${route || f.path} is very short`,
        detail: "Titles under 10 characters give search engines little context. Aim for 30–60 characters.",
      });
    } else if ((title || metaTitle).length > 70) {
      results.push({
        id: `title-long-${f.path}`,
        category: "seo",
        severity: "info",
        title: `Title on ${route || f.path} may be truncated`,
        detail: "Titles longer than ~70 characters get cut off in search results.",
      });
    }
    const desc = head?.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "";
    if (!desc) {
      results.push({
        id: `desc-${f.path}`,
        category: "seo",
        severity: "warning",
        title: `Page ${route || f.path} has no meta description`,
        detail: "Add a description of 50–160 characters to improve click-through from search results.",
      });
    }
    if (!head?.querySelector('meta[property="og:title"]')) {
      results.push({
        id: `og-${f.path}`,
        category: "seo",
        severity: "info",
        title: `Page ${route || f.path} is missing Open Graph tags`,
        detail: "OG tags control how the page looks when shared on social platforms. They are added automatically on publish.",
      });
    }

    // Accessibility
    if (!doc.querySelector("html")?.getAttribute("lang")) {
      results.push({
        id: uniqId(`lang-${f.path}`),
        category: "accessibility",
        severity: "warning",
        title: `<html> is missing a lang attribute`,
        detail: "Screen readers use lang to choose pronunciation and translation tools to detect language.",
        fix: withFix(f.path, (d) => d.querySelector("html")?.setAttribute("lang", "en")),
      });
    }
    const h1s = body?.querySelectorAll("h1") ?? [];
    if (h1s.length === 0) {
      results.push({
        id: `h1-${f.path}`,
        category: "accessibility",
        severity: "warning",
        title: `Page ${route || f.path} has no H1 heading`,
        detail: "Every page should have exactly one main heading so search engines and screen readers understand the page.",
      });
    } else if (h1s.length > 1) {
      results.push({
        id: `h1-many-${f.path}`,
        category: "accessibility",
        severity: "warning",
        title: `Page ${route || f.path} has ${h1s.length} H1 headings`,
        detail: "Multiple H1s weaken the page outline. Use exactly one H1 and structure the rest as H2/H3.",
      });
    }
    const imgs = body?.querySelectorAll("img") ?? [];
    for (const img of imgs) {
      if (!img.getAttribute("alt") && img.getAttribute("alt") !== "") {
        results.push({
          id: uniqId(`alt-${f.path}`),
          category: "accessibility",
          severity: "warning",
          title: `Image without alt text on ${route || f.path}`,
          detail: "Add alt text describing the image. Use alt=\"\" for decorative images so screen readers skip them.",
        });
      }
    }
    const headings = body?.querySelectorAll("h1,h2,h3,h4,h5,h6") ?? [];
    const levels = headings.map((h) => parseInt(h.tagName[1]));
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) {
        results.push({
          id: `heading-skip-${f.path}-${i}`,
          category: "accessibility",
          severity: "info",
          title: `Heading hierarchy skips a level on ${route || f.path}`,
          detail: `A ${levels[i - 1] === 1 ? "H1" : "H" + levels[i - 1]} is followed by an H${levels[i]}. Use H${Math.min(levels[i - 1] + 1, 6)} instead.`,
        });
        break;
      }
    }
    const emptyButtons = body?.querySelectorAll("button")?.filter((b) => !(b.textContent ?? "").trim()) ?? [];
    if (emptyButtons.length) {
      results.push({
        id: `btn-empty-${f.path}`,
        category: "accessibility",
        severity: "warning",
        title: `${emptyButtons.length} button(s) with no visible text on ${route || f.path}`,
        detail: "Empty buttons are unusable for many people. Add text or an aria-label.",
      });
    }
    const inputs = body?.querySelectorAll("input,textarea,select") ?? [];
    const unlabeled = inputs.filter((i) => {
      const id = i.getAttribute("id");
      return !i.getAttribute("aria-label") && !i.getAttribute("placeholder") && (!id || !body?.querySelector(`label[for="${id}"]`));
    });
    if (unlabeled.length) {
      results.push({
        id: `input-label-${f.path}`,
        category: "accessibility",
        severity: "warning",
        title: `${unlabeled.length} form field(s) without labels on ${route || f.path}`,
        detail: "Every form field needs a <label>, aria-label or placeholder so assistive tech can name it.",
      });
    }

    // Content / structure
    const ids = new Map<string, number>();
    body?.querySelectorAll("[id]").forEach((el) => {
      const v = el.getAttribute("id")!;
      ids.set(v, (ids.get(v) ?? 0) + 1);
    });
    for (const [id, n] of ids) {
      if (n > 1) {
        results.push({
          id: `dup-id-${f.path}-${id}`,
          category: "content",
          severity: "warning",
          title: `Duplicate id "${id}" on ${route || f.path}`,
          detail: "IDs must be unique. Duplicates break anchor links and form labels.",
        });
      }
    }

    // Links
    const links = body?.querySelectorAll("a") ?? [];
    for (const a of links) {
      const href = a.getAttribute("href") ?? "";
      if (!href || href.startsWith("#")) continue;
      if (/^javascript:/i.test(href)) {
        results.push({
          id: `js-link-${f.path}`,
          category: "security",
          severity: "error",
          title: `javascript: link on ${route || f.path}`,
          detail: `Avoid javascript: URLs — replace with a real destination: ${href.slice(0, 40)}`,
        });
        continue;
      }
      if (/^https?:\/\//i.test(href) && !/^https:\/\//i.test(href)) {
        results.push({
          id: `http-link-${f.path}`,
          category: "security",
          severity: "warning",
          title: `Non-HTTPS link on ${route || f.path}`,
          detail: `${href.slice(0, 60)} — upgrade to https:// to avoid mixed-content blocks and security warnings.`,
        });
        continue;
      }
      if (!/^([a-z]+:|mailto:|tel:|data:|javascript:|\/\/)/i.test(href)) {
        // normalize "index.html" -> "/", "pricing.html" -> "/pricing", "./about.html#x" -> "/about", "/pricing" stays "/pricing"
        const clean = href.split(/[?#]/)[0].replace(/^\.\//, "").replace(/\.html$/, "");
        const target = clean === "" || clean === "index" ? "/" : clean.startsWith("/") ? clean : "/" + clean;
        if (!routeSet.has(target)) {
          results.push({
            id: uniqId(`broken-${f.path}`),
            category: "link",
            severity: "error",
            title: `Broken link on ${route || f.path} → ${target.slice(0, 40)}`,
            detail: "The page this link points to does not exist in the project.",
          });
        }
      }
    }

    // Performance
    if (content.length > 500_000) {
      results.push({
        id: `big-html-${f.path}`,
        category: "performance",
        severity: "warning",
        title: `${f.path} is ${(content.length / 1024).toFixed(0)} KB`,
        detail: "Large HTML files slow down the page. Consider splitting into components.",
      });
    }
    const inlineScripts = body?.querySelectorAll("script:not([src])") ?? [];
    for (const s of inlineScripts) {
      const code = s.textContent ?? "";
      const danger = findDangerousJs(code);
      for (const d of danger) {
        results.push({
          id: `danger-${f.path}-${d.kind}`,
          category: "security",
          severity: "warning",
          title: `${d.kind} detected in ${f.path}`,
          detail: `Common source of XSS vulnerabilities: ${d.snippet}`,
        });
      }
    }
  }

  // CSS size
  for (const f of files) {
    if (extname(f.path) === "css" && f.content.length > 150_000) {
      results.push({
        id: `css-big-${f.path}`,
        category: "performance",
        severity: "warning",
        title: `${f.path} is ${(f.content.length / 1024).toFixed(0)} KB`,
        detail: "Very large stylesheets delay first paint. Delete unused rules or split by page.",
      });
    }
  }

  // Secrets anywhere
  const allCode = files
    .filter((f) => f.kind === "file" && /\.(html|css|js|json|txt|md)$/.test(f.path))
    .map((f) => f.content);
  for (const f of files) {
    if (!/\.(html|css|js|json|txt|md)$/.test(f.path)) continue;
    const secrets = findSecrets(f.content);
    for (const s of secrets) {
      results.push({
        id: `secret-${f.path}-${s.kind}`,
        category: "security",
        severity: "error",
        title: `Possible ${s.kind} exposed in ${f.path}`,
        detail: `Found ${s.snippet}. Public sites expose this to the world — move it to an environment variable.`,
      });
    }
  }

  return dedupe(results);
}

function dedupe(results: CheckResult[]): CheckResult[] {
  const seen = new Map<string, CheckResult>();
  for (const r of results) {
    const base = r.id.replace(/-\d+$/, "");
    const existing = seen.get(base);
    if (!existing) {
      seen.set(base, { ...r, id: base });
    } else if (existing.category === r.category && existing.severity === r.severity) {
      existing.detail = `${existing.detail} (also: ${r.detail})`;
    }
  }
  return [...seen.values()];
}

export function summarize(results: CheckResult[]): RunSummary {
  const s = { errors: 0, warnings: 0, info: 0, ok: 0 };
  for (const r of results) {
    if (r.severity === "error") s.errors++;
    else if (r.severity === "warning") s.warnings++;
    else if (r.severity === "info") s.info++;
    else s.ok++;
  }
  return { ...s, passed: s.errors === 0 && s.warnings <= 20 };
}