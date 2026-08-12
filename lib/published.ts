import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getPublishedSite(code: string) {
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("published_sites")
    .select("code,version,pages,assets,settings,checks,project_id,updated_at")
    .eq("code", code)
    .maybeSingle();
  return site;
}

/** Pull the site's own <title>/<meta>/OG tags out of its HTML so the tab, social cards and SEO match the site. */
export function extractHead(html: string) {
  const title =
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
  const desc =
    html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1];
  const ogImage =
    html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']*)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*property=["']og:image["']/i)?.[1];
  const canonical =
    html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1] ||
    html.match(/<link[^>]+href=["']([^"']*)["'][^>]*rel=["']canonical["']/i)?.[1];
  return { title, desc, ogImage, canonical };
}

/** Normalize a published-path (e.g. "/menu.html" or "/guides/index") to its stored route key ("/menu" or "/guides"). */
export function normalizeRoute(route: string): string {
  let r = route.split(/[?#]/)[0].replace(/\.html$/i, "");
  if (r.endsWith("/index")) r = r.slice(0, -6) || "/";
  if (!r.startsWith("/")) r = "/" + r;
  return r;
}