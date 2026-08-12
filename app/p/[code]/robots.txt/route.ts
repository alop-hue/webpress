import { getPublishedSite } from "@/lib/published";

export const revalidate = 30;

export async function GET(_: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const site = await getPublishedSite(code);
  if (!site) return new Response("User-agent: *\nDisallow: /");
  const base = process.env.NEXT_PUBLIC_APP_URL ?? `https://${process.env.VERCEL_URL ?? "localhost:3000"}`;
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${base}/p/${code}/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain" },
  });
}