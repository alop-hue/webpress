import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";

export const runtime = "nodejs";

/** List deployments for a project (newest first) */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("deployments")
      .select("id,code,version,status,stage,url,meta,error,created_at,updated_at,project_id")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ deployments: data });
  } catch (e) {
    return errorResponse(e);
  }
}
