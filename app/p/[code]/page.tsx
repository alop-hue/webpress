import { getPublishedSite } from "@/lib/published";
import { notFound } from "next/navigation";

export const revalidate = 30;
export const dynamicParams = true;

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