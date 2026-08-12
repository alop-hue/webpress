/**
 * Page metadata CRUD; keeps the backing HTML file in sync when pages are created or deleted.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";
import { pageToPath } from "@/lib/editor/fs";
import { z } from "zod";

export const runtime = "nodejs";

const PageSchema = z.object({
  path: z.string(),
  title: z.string().max(120),
  description: z.string().max(500),
  og_image: z.string().max(500),
});

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("project_id", id)
      .order("path");
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ pages: data });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const body = PageSchema.safeParse(await req.json());
    if (!body.success) throw new AppError("Invalid page", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    const path = body.data.path.startsWith("/") ? body.data.path : "/" + body.data.path;
    // ensure a backing file exists
    const filePath = pageToPath(path);
    const { data: existingFile } = await supabase
      .from("project_files")
      .select("content")
      .eq("project_id", id)
      .eq("path", filePath)
      .maybeSingle();
    if (!existingFile) {
      await supabase.from("project_files").insert({
        project_id: id,
        path: filePath,
        kind: "file",
        mime: "text/html",
        content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${body.data.title}</title>\n</head>\n<body>\n\n</body>\n</html>`,
        size: 160,
      });
    }
    const { data, error } = await supabase
      .from("pages")
      .upsert(
        {
          project_id: id,
          path,
          title: body.data.title,
          description: body.data.description,
          og_image: body.data.og_image,
          is_home: path === "/",
        },
        { onConflict: "project_id,path" }
      )
      .select("*")
      .single();
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ page: data }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const body = PageSchema.partial().safeParse(await req.json());
    if (!body.success) throw new AppError("Invalid page", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pages")
      .update(body.data)
      .eq("project_id", id)
      .eq("path", body.data.path ?? "__none__")
      .select("*")
      .single();
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ page: data });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    if (!path) throw new AppError("Missing path", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    await supabase.from("pages").delete().eq("project_id", id).eq("path", path);
    await supabase.from("project_files").delete().eq("project_id", id).eq("path", pageToPath(path));
    return json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}