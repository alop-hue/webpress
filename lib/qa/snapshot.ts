/**
 * Loads a project snapshot (files/pages/settings) without importing playwright, so deploy bundles stay lean.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { FileEntry } from "@/lib/editor/fs";

export interface ProjectSnapshot {
  files: FileEntry[];
  pages: { path: string; title: string; description: string; og_image: string }[];
  settings: { siteName?: string; favicon?: string; analytics?: boolean };
}

/** Load the current files/pages/settings of a project. Kept free of playwright imports so it can run in deploy paths. */
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
