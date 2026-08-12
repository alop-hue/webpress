import "server-only";

import { TEMPLATES } from "@/lib/templates";

export async function GET() {
  return Response.json({
    templates: TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      description: t.description,
      tags: t.tags,
      pages: t.pages.length,
    })),
  });
}