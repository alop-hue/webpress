/**
 * Public homepage of a published site — renders the stored HTML snapshot with SEO metadata, no login required.
 */
import { getPublishedSite, extractHead } from "@/lib/published";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 30;
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const site = await getPublishedSite(code);
  if (!site || !site.pages || !site.pages["/"]) return {};
  const { title, desc, ogImage, canonical } = extractHead(site.pages["/"] as string);
  return {
    title: { absolute: title || "Published site" }, // site's own title, no platform suffix
    description: desc,
    alternates: { canonical },
    openGraph: { title: title || undefined, description: desc, type: "website", url: canonical, images: ogImage ? [{ url: ogImage }] : undefined },
    twitter: { card: "summary_large_image", title: title || undefined, description: desc, images: ogImage ? [ogImage] : undefined },
  };
}

export default async function PublicSitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const site = await getPublishedSite(code);
  if (!site || !site.pages || !site.pages["/"]) notFound();
  const html = site.pages["/"] as string;

  return (
    <div
      // server-rendered user HTML — served as-is, like any static host
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  );
}
