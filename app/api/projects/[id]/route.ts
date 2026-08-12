/**
 * Single project: get, update (name/description/settings/status), or delete.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";
import { z } from "zod";

export const runtime = "nodejs";

export type ProjectRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  template: string;
  status: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  owner_id: string;
};

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const { project } = await getAuthedProject(id);
    return json({ project });
  } catch (e) {
    return errorResponse(e);
  }
}

const PatchSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  description: z.string().max(400).optional(),
  settings: z.record(z.unknown()).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const { user } = await getAuthedProject(id);
    const body = PatchSchema.safeParse(await req.json());
    if (!body.success)
      throw new AppError(body.error.issues[0]?.message ?? "Invalid input", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .update({ ...body.data, owner_id: user.id })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ project: data });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const supabase = await createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}