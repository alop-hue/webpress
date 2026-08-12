/**
 * Reusable component CRUD (unique per project + name).
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";
import { z } from "zod";

export const runtime = "nodejs";

const ComponentSchema = z.object({
  name: z.string().min(1).max(60),
  html: z.string(),
  css: z.string().max(200_000).optional(),
  js: z.string().max(200_000).optional(),
});

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const supabase = await createClient();
    const { data, error } = await supabase.from("components").select("*").eq("project_id", id).order("name");
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ components: data });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const body = ComponentSchema.safeParse(await req.json());
    if (!body.success) throw new AppError(body.error.issues[0]?.message ?? "Invalid component", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("components")
      .upsert(
        { project_id: id, ...body.data },
        { onConflict: "project_id,name" }
      )
      .select("*")
      .single();
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ component: data }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const body = ComponentSchema.partial().safeParse(await req.json());
    if (!body.success) throw new AppError("Invalid component", "ERR_VALIDATION", 400);
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (!name || !body.data.name) throw new AppError("Missing name", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("components")
      .update(body.data)
      .eq("project_id", id)
      .eq("name", name)
      .select("*")
      .single();
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ component: data });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (!name) throw new AppError("Missing name", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    const { error } = await supabase.from("components").delete().eq("project_id", id).eq("name", name);
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}