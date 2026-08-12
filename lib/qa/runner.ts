import "server-only";

import { createClient } from "@/lib/supabase/server";
import { runStaticChecks, summarize, type CheckResult } from "./static";
import { runBrowserChecks } from "./playwright";
import type { FileEntry } from "@/lib/editor/fs";

export interface ProjectSnapshot {
  files: FileEntry[];
  pages: { path: string; title: string; description: string; og_image: string }[];
  settings: { siteName?: string; favicon?: string; analytics?: boolean };
}

export async function loadProjectSnapshot(projectId: string): Promise<ProjectSnapshot> {
  const supabase = await createClient();
  const [filesRes, pagesRes, projRes] = await Promise.all([
    supabase.from("project_files").select("path,content,kind,mime").eq("project_id", projectId),
    supabase.from("pages").select("path,title,description,og_image").eq("project_id", projectId),
    supabase.from("projects").select("settings").eq("id", projectId).single(),
  ]);
  const files = (filesRes.data ?? []).filter((f: any) => f.kind === "file") as FileEntry[];
  const pages = (pagesRes.data ?? []) as ProjectSnapshot["pages"];
  const settings = (projRes.data?.settings ?? {}) as ProjectSnapshot["settings"];
  return { files, pages, settings };
}

export async function runStaticAndStore(projectId: string): Promise<CheckResult[]> {
  const supabase = await createClient();
  const snap = await loadProjectSnapshot(projectId);
  const results = runStaticChecks(snap.files, snap.pages);
  const summary = summarize(results);

  await supabase
    .from("test_runs")
    .insert({ project_id: projectId, kind: "static", status: summary.passed ? "passed" : "failed", results, summary });

  // sync suggestions
  const { data: existing } = await supabase.from("suggestions").select("id,title,status").eq("project_id", projectId);
  const open = new Map((existing ?? []).filter((s) => s.status === "open").map((s) => [s.title, s.id]));

  for (const r of results) {
    if (r.severity === "ok") continue;
    const title = `${r.category}: ${r.title}`;
    if (open.has(title)) {
      open.delete(title);
      continue;
    }
    await supabase
      .from("suggestions")
      .insert({
        project_id: projectId,
        category: r.category,
        severity: r.severity === "error" ? "error" : r.severity === "warning" ? "warning" : "info",
        title,
        detail: r.detail,
        fix: r.fix ?? null,
        source: "check",
      })
      .select();
  }
  // close suggestions whose issue no longer exists
  for (const [title, id] of open) {
    await supabase.from("suggestions").update({ status: "fixed" }).eq("id", id);
  }
  return results;
}

export async function runBrowserAndStore(projectId: string): Promise<{ passed: boolean; count: number }> {
  const supabase = await createClient();
  const snap = await loadProjectSnapshot(projectId);
  const { results } = await runBrowserChecks(snap);
  const summary = summarize(results as CheckResult[]);
  await supabase
    .from("test_runs")
    .insert({
      project_id: projectId,
      kind: "browser",
      status: summary.passed ? "passed" : "failed",
      results,
      summary,
    });
  return { passed: summary.passed, count: results.length };
}

export { summarize };