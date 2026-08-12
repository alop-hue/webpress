/**
 * Public sub-page of a published site (e.g. /p/abc123/about).
 */
import { getPublishedSite, extractHead, normalizeRoute } from "@/lib/published";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 30;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string; slug: string[] }>;
}): Promise<Metadata> {
  const { code, slug } = await params;
  const site = await getPublishedSite(code);
  if (!site || !site.pages) return {};
  const route = normalizeRoute("/" + slug.join("/"));
  const html = site.pages[route] ?? site.pages[route + "/"];
  if (!html) return {};
  const { title, desc, ogImage, canonical } = extractHead(html as string);
  return {
    title: { absolute: title || "Published site" },
    description: desc,
    alternates: { canonical },
    openGraph: { title: title || undefined, description: desc, type: "website", url: canonical, images: ogImage ? [{ url: ogImage }] : undefined },
    twitter: { card: "summary_large_image", title: title || undefined, description: desc, images: ogImage ? [ogImage] : undefined },
  };
}

export default async function PublicSiteSubPage({
  params,
}: {
  params: Promise<{ code: string; slug: string[] }>;
}) {
  const { code, slug } = await params;
  const site = await getPublishedSite(code);
  if (!site || !site.pages) notFound();
  // normalize ".html"/"index" suffixes so template links like menu.html and
  // guides/index resolve to their stored route keys
  const route = normalizeRoute("/" + slug.join("/"));
  const html = site.pages[route] ?? site.pages[route + "/"];
  if (!html) notFound();

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html as string }}
      suppressHydrationWarning
    />
  );
}
