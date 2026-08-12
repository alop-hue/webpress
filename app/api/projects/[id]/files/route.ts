/**
 * Project files: list all, bulk-save, and single-file autosave against project_files.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";
import { validatePath, type FileEntry } from "@/lib/editor/fs";
import { z } from "zod";

export const runtime = "nodejs";

const FileWrite = z.object({
  path: z.string(),
  content: z.string().max(1_500_000),
  kind: z.enum(["file", "folder"]).default("file"),
  mime: z.string().optional(),
  deleted: z.boolean().optional(),
});

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_files")
      .select("path,content,kind,mime,size,updated_at")
      .eq("project_id", id);
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ files: data });
  } catch (e) {
    return errorResponse(e);
  }
}

/** Bulk save: upserts provided files, deletes marked ones, removes empty folders. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const body = z.object({ files: z.array(FileWrite).max(200) }).safeParse(await req.json());
    if (!body.success) throw new AppError("Invalid file payload", "ERR_VALIDATION", 400);
    const supabase = await createClient();

    for (const f of body.data.files) {
      const v = validatePath(f.path);
      if (v) throw new AppError(`${f.path}: ${v}`, "ERR_VALIDATION", 400);
      if (f.deleted) {
        await supabase.from("project_files").delete().eq("project_id", id).eq("path", f.path);
        continue;
      }
      if (f.kind === "file") {
        const { error } = await supabase.from("project_files").upsert(
          {
            project_id: id,
            path: f.path,
            content: f.content,
            kind: "file",
            mime: f.mime ?? "text/html",
            size: f.content.length,
          },
          { onConflict: "project_id,path" }
        );
        if (error) throw new AppError(error.message, "ERR_DB");
      }
    }
    return json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}

/** Save a single file (used by code editor autosave) */
export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const body = FileWrite.safeParse(await req.json());
    if (!body.success) throw new AppError("Invalid file payload", "ERR_VALIDATION", 400);
    const f = body.data;
    const v = validatePath(f.path);
    if (v) throw new AppError(v, "ERR_VALIDATION", 400);
    const supabase = await createClient();
    const { error } = await supabase.from("project_files").upsert(
      {
        project_id: id,
        path: f.path,
        content: f.content,
        kind: "file",
        mime: f.mime ?? "text/html",
        size: f.content.length,
      },
      { onConflict: "project_id,path" }
    );
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}