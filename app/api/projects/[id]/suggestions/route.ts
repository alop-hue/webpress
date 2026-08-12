import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { json, errorResponse, AppError } from "@/lib/errors";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ suggestions: data });
  } catch (e) {
    return errorResponse(e);
  }
}

const PatchSchema = z.object({
  status: z.enum(["open", "fixed", "ignored"]),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const body = PatchSchema.safeParse(await req.json());
    if (!body.success) throw new AppError("Invalid status", "ERR_VALIDATION", 400);
    const { searchParams } = new URL(req.url);
    const sid = searchParams.get("id");
    if (!sid) throw new AppError("Missing suggestion id", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    const { error } = await supabase
      .from("suggestions")
      .update({ status: body.data.status })
      .eq("project_id", id)
      .eq("id", sid);
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}