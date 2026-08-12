/**
 * Asset metadata CRUD plus storage operations against the assets bucket.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false });
    if (error) throw new AppError(error.message, "ERR_DB");
    const urlBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${id}`;
    return json({ assets: data, urlBase });
  } catch (e) {
    return errorResponse(e);
  }
}

const AssetSchema = z.object({
  name: z.string().max(180),
  path: z.string().max(300),
  size: z.number().int().max(50_000_000),
  mime: z.string().max(100),
  width: z.number().int().nullable().optional(),
  height: z.number().int().nullable().optional(),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const body = AssetSchema.safeParse(await req.json());
    if (!body.success) throw new AppError("Invalid asset", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("assets")
      .upsert(
        { project_id: id, ...body.data },
        { onConflict: "project_id,path" }
      )
      .select("*")
      .single();
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ asset: data }, 201);
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
    await supabase.storage.from("assets").remove([`${id}/${path}`]);
    await supabase.from("assets").delete().eq("project_id", id).eq("path", path);
    return json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}