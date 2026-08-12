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
      .from("versions")
      .select("id,number,kind,label,summary,created_by,created_at,project_id")
      .eq("project_id", id)
      .order("number", { ascending: false })
      .limit(100);
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ versions: data });
  } catch (e) {
    return errorResponse(e);
  }
}

const CreateVersion = z.object({
  label: z.string().max(160).optional(),
  kind: z.enum(["user", "agent", "auto"]).default("auto"),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const { user } = await getAuthedProject(id);
    const body = CreateVersion.safeParse(await req.json());
    const supabase = await createClient();
    const { data: files } = await supabase
      .from("project_files")
      .select("path,content")
      .eq("project_id", id);
    if (!files) throw new AppError("Could not snapshot files", "ERR_DB");
    const { data: maxRow } = await supabase
      .from("versions")
      .select("number")
      .eq("project_id", id)
      .order("number", { ascending: false })
      .limit(1)
      .maybeSingle();
    const number = (maxRow?.number ?? 0) + 1;
    const { data: version, error } = await supabase
      .from("versions")
      .insert({
        project_id: id,
        number,
        kind: body.success ? body.data.kind : "auto",
        label: body.success && body.data.label ? body.data.label : "Snapshot",
        files: files.map((f) => ({ path: f.path, content: f.content })),
        created_by: user.email ?? "user",
      })
      .select("*")
      .single();
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ version }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}