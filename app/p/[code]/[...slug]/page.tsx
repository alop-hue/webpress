import { getPublishedSite } from "@/lib/published";
import { notFound } from "next/navigation";

export const revalidate = 30;
export const dynamicParams = true;

export default async function PublicSiteSubPage({
  params,
}: {
  params: Promise<{ code: string; slug: string[] }>;
}) {
  const { code, slug } = await params;
  const site = await getPublishedSite(code);
  if (!site || !site.pages) notFound();
  const route = "/" + slug.join("/");
  const html = site.pages[route] ?? site.pages[route + "/"];
  if (!html) notFound();

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html as string }}
      suppressHydrationWarning
    />
  );
}