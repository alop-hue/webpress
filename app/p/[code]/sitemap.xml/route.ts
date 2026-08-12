/**
 * Serves a published site's sitemap.xml.
 */
import { getPublishedSite } from "@/lib/published";

export const revalidate = 30;

export async function GET(_: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const site = await getPublishedSite(code);
  if (!site) return new Response("<?xml version=\"1.0\"?><urlset/>", { headers: { "Content-Type": "application/xml" } });
  const pages = (site.pages ?? {}) as Record<string, string>;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? `https://${process.env.VERCEL_URL ?? "localhost:3000"}`;
  const urls = Object.keys(pages)
    .map((p) => `  <url><loc>${base}/p/${code}${p}</loc><changefreq>weekly</changefreq></url>`)
    .join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { "Content-Type": "application/xml" },
  });
}