import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";
import { runStaticChecks, summarize, type CheckResult } from "@/lib/qa/static";
import { loadProjectSnapshot } from "@/lib/qa/runner";
import { buildSite } from "@/lib/editor/build";
import { z } from "zod";
import { zipSync, strToU8 } from "fflate";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomCode(len = 6): string {
  let out = "";
  for (let i = 0; i < len; i++) out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return out;
}

async function uniqueCode(supabase: any): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const code = randomCode(6);
    const { data } = await supabase.from("deployments").select("code").eq("code", code).maybeSingle();
    if (!data) return code;
  }
  throw new AppError("Could not mint a unique site code — retry", "ERR_COLLISION");
}

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

const DeploySchema = z.object({
  overrideWarnings: z.boolean().optional(),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const { project } = await getAuthedProject(id);
    const body = DeploySchema.safeParse(await req.json());
    const supabase = await createClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `${req.headers.get("x-forwarded-proto") ?? "http"}://${req.headers.get("host") ?? "localhost:3000"}`;

    // 1. quality gate
    const snap = await loadProjectSnapshot(id);
    if (!snap.files.length) throw new AppError("Project has no files yet — add a page first.", "ERR_EMPTY", 400);
    const checks = runStaticChecks(snap.files, snap.pages);
    const summary = summarize(checks);
    const errors = checks.filter((c) => c.severity === "error");
    if (errors.length && !body.data?.overrideWarnings) {
      throw new AppError(
        `Quality gate blocked: ${summary.errors} error(s). ${errors[0]?.title ?? ""} — fix them (AI can help) or override with "Publish anyway".`,
        "ERR_GATE",
        400,
        {
          errors: errors.map((e: CheckResult) => ({ severity: e.severity, title: e.title, detail: e.detail })),
          summary,
        }
      );
    }

    // 2. previous deployment (for version bump + rollback base)
    const { data: prev } = await supabase
      .from("deployments")
      .select("*")
      .eq("project_id", id)
      .eq("status", "live")
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();
    const code = prev?.code ?? (await uniqueCode(supabase));
    const version = (prev?.version ?? 0) + 1;

    const dep = {
      project_id: id,
      code,
      version,
      status: "building",
      stage: "build",
    };
    const { data: deployment, error: dErr } = await supabase.from("deployments").insert(dep).select("*").single();
    if (dErr) throw new AppError(dErr.message, "ERR_DB");

    try {
      // 3. build
      const built = buildSite(snap.files, snap.pages, snap.settings, code, baseUrl);

      // 4. assets manifest
      const { data: assets } = await supabase.from("assets").select("path,name").eq("project_id", id);
      const assetUrls = (assets ?? []).map((a: any) => ({
        path: a.path,
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${id}/${a.path}`,
      }));

      // 5. zip archive (full static export) into publish bucket
      const entries: Record<string, Uint8Array> = {};
      for (const [route, html] of Object.entries(built.pages)) {
        entries[route === "/" ? "index.html" : route.slice(1) + ".html"] = strToU8(html);
      }
      entries["sitemap.xml"] = strToU8(built.sitemap);
      entries["robots.txt"] = strToU8(built.robots);
      for (const f of snap.files) {
        if (f.kind === "file" && !entries[f.path]) entries[f.path] = strToU8(f.content);
      }
      const zip = zipSync(entries, { level: 6 });
      const { error: upErr } = await supabase.storage
        .from("publish")
        .upload(`sites/${code}/site.zip`, zip, { contentType: "application/zip", upsert: true });
      if (upErr) throw new AppError(`Upload failed: ${upErr.message}`, "ERR_UPLOAD", 500);

      // 6. published snapshot (atomic)
      const { error: psErr } = await supabase.from("published_sites").upsert(
        {
          code,
          project_id: id,
          deployment_id: deployment.id,
          version,
          pages: built.pages,
          assets: assetUrls,
          settings: snap.settings,
          checks: {
            errors: summary.errors,
            warnings: summary.warnings,
            passed: summary.passed || body.data?.overrideWarnings,
          },
        },
        { onConflict: "code" }
      );
      if (psErr) throw new AppError(psErr.message, "ERR_DB");

      // 7. mark live
      await supabase
        .from("deployments")
        .update({ status: "live", stage: "live", url: `${baseUrl}/p/${code}`, meta: { checks: summary } })
        .eq("id", deployment.id);
      await supabase
        .from("projects")
        .update({ status: "published" })
        .eq("id", id);

      return json({
        ok: true,
        deployment: { ...deployment, code, version, status: "live", url: `${baseUrl}/p/${code}` },
        url: `${baseUrl}/p/${code}`,
        checks: { errors: summary.errors, warnings: summary.warnings },
      });
    } catch (e) {
      await supabase.from("deployments").update({ status: "failed", error: { message: String(e) } }).eq("id", deployment.id);
      throw e;
    }
  } catch (e) {
    return errorResponse(e);
  }
}