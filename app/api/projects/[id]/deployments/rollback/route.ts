import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 300;

/** Rollback: restore the published snapshot of a previous deployment */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const body = z.object({ deploymentId: z.string() }).safeParse(await req.json());
    if (!body.success) throw new AppError("Missing deployment id", "ERR_VALIDATION", 400);
    const supabase = await createClient();

    const { data: target } = await supabase
      .from("deployments")
      .select("*")
      .eq("project_id", id)
      .eq("id", body.data.deploymentId)
      .single();
    if (!target) throw new AppError("Deployment not found", "ERR_NOT_FOUND", 404);
    if (target.status !== "live") throw new AppError("Only live deployments can be promoted back", "ERR_STATE", 400);

    const { data: site } = await supabase
      .from("published_sites")
      .select("*")
      .eq("code", target.code)
      .single();
    if (!site) throw new AppError("No published snapshot for that deployment", "ERR_NOT_FOUND", 404);

    const { data: current } = await supabase
      .from("deployments")
      .select("*")
      .eq("project_id", id)
      .eq("status", "live")
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (current && current.id !== target.id) {
      await supabase.from("deployments").update({ status: "rolled_back" }).eq("id", current.id);
    }
    const version = (current?.version ?? 0) + 1;
    const { data: dep } = await supabase
      .from("deployments")
      .insert({
        project_id: id,
        code: target.code,
        version,
        status: "live",
        stage: "live",
        url: current?.url ?? null,
        meta: { rolledBackTo: target.version },
      })
      .select("*")
      .single();
    await supabase
      .from("published_sites")
      .update({ deployment_id: dep.id, version, pages: site.pages, assets: site.assets, settings: site.settings, checks: site.checks })
      .eq("code", target.code);
    return json({ ok: true, deployment: dep });
  } catch (e) {
    return errorResponse(e);
  }
}