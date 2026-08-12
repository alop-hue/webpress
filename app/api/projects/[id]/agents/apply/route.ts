/**
 * Applies the approved draft edits of an agent run and creates a version.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";
import { z } from "zod";
import { runStaticAndStore } from "@/lib/qa/runner";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const { user } = await getAuthedProject(id);
    const body = z.object({ runId: z.string() }).safeParse(await req.json());
    if (!body.success) throw new AppError("Missing run id", "ERR_VALIDATION", 400);
    const supabase = await createClient();

    const { data: run } = await supabase
      .from("agent_runs")
      .select("id,files_changed,prompt,status")
      .eq("project_id", id)
      .eq("id", body.data.runId)
      .single();
    if (!run) throw new AppError("Agent run not found", "ERR_NOT_FOUND", 404);
    if (run.status !== "waiting_approval")
      throw new AppError("This run has no pending changes", "ERR_STATE", 400);
    const drafts: Array<{ path: string; reason: string; newContent: string; added?: boolean; deleted?: boolean }> =
      run.files_changed ?? [];
    if (!drafts.length) throw new AppError("No changes to apply", "ERR_STATE", 400);

    for (const d of drafts) {
      if (d.deleted) {
        await supabase.from("project_files").delete().eq("project_id", id).eq("path", d.path);
        continue;
      }
      await supabase.from("project_files").upsert(
        {
          project_id: id,
          path: d.path,
          content: d.newContent,
          kind: "file",
          mime: d.path.endsWith(".css") ? "text/css" : d.path.endsWith(".js") ? "text/javascript" : "text/html",
          size: d.newContent.length,
        },
        { onConflict: "project_id,path" }
      );
    }

    // version snapshot (agent)
    const { data: files } = await supabase.from("project_files").select("path,content").eq("project_id", id);
    const { data: maxRow } = await supabase
      .from("versions")
      .select("number")
      .eq("project_id", id)
      .order("number", { ascending: false })
      .limit(1)
      .maybeSingle();
    await supabase.from("versions").insert({
      project_id: id,
      number: (maxRow?.number ?? 0) + 1,
      kind: "agent",
      label: `AI: ${(run.prompt || "changes").slice(0, 80)}`,
      files: files?.map((f) => ({ path: f.path, content: f.content })) ?? [],
      created_by: user.email ?? "agent",
    });

    await supabase.from("agent_runs").update({ status: "applied" }).eq("id", run.id);

    // re-run static checks so suggestions stay fresh
    let checks: Awaited<ReturnType<typeof runStaticAndStore>> | null = null;
    try {
      checks = await runStaticAndStore(id);
    } catch {
      /* non-fatal */
    }
    return json({ ok: true, checks: checks?.length ?? 0 });
  } catch (e) {
    return errorResponse(e);
  }
}