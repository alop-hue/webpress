import "server-only";

import { chromium, type Browser, type Page } from "playwright-core";
import { buildSite } from "@/lib/editor/build";
import { type FileEntry } from "@/lib/editor/fs";
import { createServer, type Server } from "http";
import { AddressInfo } from "net";

export interface BrowserCheck {
  id: string;
  category: string;
  severity: "ok" | "info" | "warning" | "error";
  title: string;
  detail: string;
  page?: string;
}

export interface BrowserRunOptions {
  files: FileEntry[];
  pages: { path: string; title: string; description: string; og_image: string }[];
  settings: { siteName?: string; favicon?: string; analytics?: boolean };
  viewports?: string[];
  artifactsDir?: string;
}

const DEVICES: Record<string, { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

export async function runBrowserChecks(opts: BrowserRunOptions): Promise<{
  results: BrowserCheck[];
  artifacts: string[];
}> {
  const results: BrowserCheck[] = [];
  const artifacts: string[] = [];
  let browser: Browser | undefined;
  const viewports = opts.viewports ?? ["desktop", "tablet", "mobile"];

  const built = buildSite(opts.files, opts.pages, opts.settings, "testsite", "http://localhost:3999");
  const server: Server = createServer((req, res) => {
      const url = new URL(req.url ?? "/", "http://localhost:3999");
      let path = decodeURIComponent(url.pathname);
      if (path.startsWith("/p/testsite")) path = path.slice("/p/testsite".length) || "/";
      const page = built.pages[path] ?? built.pages["/"];
      if (page) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(page);
      } else {
        res.writeHead(404);
        res.end("Not found");
      }
    });
  try {
    await new Promise<void>((resolve) => server.listen(3999, resolve));
    const addr = server.address() as AddressInfo;

    browser = await chromium.launch({ headless: true });

    const routes = Object.keys(built.pages);
    for (const route of routes) {
      for (const vp of viewports) {
        const d = DEVICES[vp] ?? DEVICES.desktop;
        const ctx = await browser.newContext({ viewport: d });
        const page: Page = await ctx.newPage();
        const consoleErrors: string[] = [];
        const pageErrors: string[] = [];
        const failed: string[] = [];
        page.on("console", (m) => {
          if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300));
        });
        page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 300)));
        page.on("requestfailed", (r) => failed.push(`${r.url().slice(0, 120)} (${r.failure()?.errorText})`));

        try {
          await page.goto(`http://localhost:${addr.port}/p/testsite${route}`, { waitUntil: "networkidle", timeout: 30000 });
          await page.waitForTimeout(300);

          if (consoleErrors.length) {
            results.push({
              id: `console-${route}-${vp}`,
              category: "content",
              severity: "error",
              title: `Console errors on ${route} (${vp})`,
              detail: consoleErrors.slice(0, 3).join(" · "),
              page: route,
            });
          }
          for (const pe of pageErrors.slice(0, 3)) {
            results.push({
              id: `pageerror-${route}-${vp}`,
              category: "content",
              severity: "error",
              title: `JavaScript error on ${route} (${vp})`,
              detail: pe,
              page: route,
            });
          }
          if (failed.length) {
            results.push({
              id: `failed-req-${route}-${vp}`,
              category: "link",
              severity: "error",
              title: `Failed requests on ${route} (${vp})`,
              detail: failed.slice(0, 3).join(" · "),
              page: route,
            });
          }

          // horizontal overflow
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          if (overflow > 2) {
            results.push({
              id: `overflow-${route}-${vp}`,
              category: "content",
              severity: vp === "desktop" ? "warning" : "error",
              title: `Horizontal overflow of ${overflow}px on ${route} (${vp})`,
              detail: "Content extends beyond the viewport width. Check fixed widths, grids, and large images.",
              page: route,
            });
          }

          // images
          const imgIssue = await page.evaluate(() => {
            const issues: string[] = [];
            for (const img of Array.from(document.images)) {
              if (!img.complete || img.naturalWidth === 0) issues.push(`Failed to load: ${img.src.slice(0, 80)}`);
            }
            return issues;
          });
          if (imgIssue.length) {
            results.push({
              id: `img-fail-${route}-${vp}`,
              category: "link",
              severity: "error",
              title: `Images failed to load on ${route}`,
              detail: imgIssue.slice(0, 3).join(" · "),
              page: route,
            });
          }

          // sticky nav sanity + nav click-through
          if (route === "/" && vp === "desktop") {
            const navLink = page.locator("a[href]").first();
            try {
              await navLink.click({ timeout: 3000 });
              await page.waitForTimeout(400);
            } catch {
              /* ignore */
            }
          }

          // tap targets on mobile
          if (vp === "mobile") {
            const small = await page.evaluate(() => {
              const bad: string[] = [];
              for (const el of Array.from(document.querySelectorAll("a,button"))) {
                const r = el.getBoundingClientRect();
                const style = getComputedStyle(el as Element);
                if (style.display === "none" || style.visibility === "hidden") continue;
                if (r.width < 36 || r.height < 36) bad.push(`${el.tagName.toLowerCase()} ${(r.width).toFixed(0)}x${r.height.toFixed(0)}px: "${(el.textContent || "").trim().slice(0, 20)}"`);
              }
              return bad.slice(0, 5);
            });
            if (small.length) {
              results.push({
                id: `tap-target-${route}`,
                category: "accessibility",
                severity: "warning",
                title: `${small.length} small touch targets on ${route}`,
                detail: small.join(" · "),
                page: route,
              });
            }
          }

          // contrast spot-check on main heading text vs background (heuristic)
          if (vp === "desktop") {
            const contrast = await page.evaluate(() => {
              const h1 = document.querySelector("h1");
              if (!h1) return null;
              const cs = getComputedStyle(h1);
              const bg = document.body;
              const bgc = getComputedStyle(bg).backgroundColor;
              const rgb = (c: string) => {
                const m = c.match(/(\d+),\s*(\d+),\s*(\d+)/);
                return m ? [+m[1], +m[2], +m[3]] : (c === "transparent" ? [255, 255, 255] : null);
              };
              const f = rgb(cs.color);
              const b = rgb(bgc);
              if (!f || !b) return null;
              const lum = (x: number[]) => x.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
              const L1 = 0.2126 * lum(f)[0] + 0.7152 * lum(f)[1] + 0.0722 * lum(f)[2];
              const L2 = 0.2126 * lum(b)[0] + 0.7152 * lum(b)[1] + 0.0722 * lum(b)[2];
              return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
            });
            if (contrast !== null && contrast < 3) {
              results.push({
                id: `contrast-h1-${route}`,
                category: "accessibility",
                severity: "warning",
                title: `H1 contrast on ${route} is low (≈${contrast.toFixed(1)}:1)`,
                detail: "Main heading text does not contrast enough with the background. Increase the difference.",
                page: route,
              });
            }
          }
        } catch (e) {
          results.push({
            id: `load-${route}-${vp}`,
            category: "content",
            severity: "error",
            title: `Failed to render ${route} (${vp})`,
            detail: String(e).slice(0, 300),
            page: route,
          });
        } finally {
          await ctx.close();
        }
      }
    }
  } finally {
    if (browser) await browser.close();
    if (server) await new Promise((r) => server.close(r));
  }
  return { results, artifacts };
}