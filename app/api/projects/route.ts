import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getUserId } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";
import { TEMPLATES } from "@/lib/templates";
import { slugify } from "@/lib/utils";
import { z } from "zod";

export const runtime = "nodejs";

const CreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  template: z.string().optional(),
  description: z.string().max(400).optional(),
});

export async function GET() {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id,name,slug,description,template,status,settings,updated_at,created_at,owner_id")
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw new AppError(error.message, "ERR_DB");
    return json({ projects: data });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    const body = CreateSchema.safeParse(await req.json());
    if (!body.success)
      throw new AppError(body.error.issues[0]?.message ?? "Invalid input", "ERR_VALIDATION", 400);
    const { name, template, description } = body.data;
    const supabase = await createClient();

    const baseSlug = slugify(name);
    let slug = baseSlug;
    for (let i = 2; i < 20; i++) {
      const { data: clash } = await supabase.from("projects").select("id").eq("slug", slug).maybeSingle();
      if (!clash) break;
      slug = `${baseSlug}-${i}`;
    }

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        owner_id: userId,
        name,
        slug,
        description: description ?? "",
        template: template ?? "blank",
        settings: { siteName: name },
      })
      .select("id")
      .single();
    if (error) throw new AppError(error.message, "ERR_DB");

    // seed template files
    if (template && template !== "blank") {
      const def = TEMPLATES.find((t) => t.id === template);
      if (def) {
        const files = def.files.map((f) => ({
          project_id: project.id,
          path: f.path,
          kind: f.kind,
          mime: f.mime ?? "text/plain",
          content: f.content,
          size: f.content.length,
        }));
        const pages = def.pages.map((p) => ({
          project_id: project.id,
          path: p.path,
          title: p.title,
          description: p.description,
          is_home: p.path === "/",
        }));
        const { error: fErr } = await supabase.from("project_files").insert(files);
        const { error: pErr } = await supabase.from("pages").insert(pages);
        if (fErr || pErr) throw new AppError(fErr?.message || pErr?.message || "seed failed", "ERR_DB");
      }
    }

    // initial version snapshot
    const { data: files } = await supabase
      .from("project_files")
      .select("path,content")
      .eq("project_id", project.id);
    await supabase.from("versions").insert({
      project_id: project.id,
      number: 1,
      kind: "auto",
      label: "Project created",
      files,
    });

    return json({ project }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}