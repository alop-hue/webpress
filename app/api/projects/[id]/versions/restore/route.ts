import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";
import { z } from "zod";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const { user } = await getAuthedProject(id);
    const body = z.object({ number: z.number().int().positive() }).safeParse(await req.json());
    if (!body.success) throw new AppError("Invalid version", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    const { data: version } = await supabase
      .from("versions")
      .select("number,files")
      .eq("project_id", id)
      .eq("number", body.data.number)
      .single();
    if (!version) throw new AppError("Version not found", "ERR_NOT_FOUND", 404);

    // keep current as a snapshot before restoring
    const { data: current } = await supabase.from("project_files").select("path,content").eq("project_id", id);
    const { data: maxRow } = await supabase
      .from("versions")
      .select("number")
      .eq("project_id", id)
      .order("number", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (current?.length) {
      await supabase.from("versions").insert({
        project_id: id,
        number: (maxRow?.number ?? 0) + 1,
        kind: "user",
        label: `Before restore of v${body.data.number}`,
        files: current.map((f) => ({ path: f.path, content: f.content })),
        created_by: user.email ?? "user",
      });
    }
    const snapshot: Array<{ path: string; content: string }> = version.files ?? [];
    for (const f of snapshot) {
      await supabase.from("project_files").upsert(
        {
          project_id: id,
          path: f.path,
          content: f.content,
          kind: "file",
          mime: f.path.endsWith(".css") ? "text/css" : f.path.endsWith(".js") ? "text/javascript" : "text/html",
          size: f.content.length,
        },
        { onConflict: "project_id,path" }
      );
    }
    const keep = new Set(snapshot.map((f) => f.path));
    const { data: allFiles } = await supabase.from("project_files").select("path").eq("project_id", id);
    for (const f of allFiles ?? []) {
      if (!keep.has(f.path)) await supabase.from("project_files").delete().eq("project_id", id).eq("path", f.path);
    }
    return json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}