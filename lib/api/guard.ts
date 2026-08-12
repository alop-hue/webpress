/**
 * API route auth guard: resolves the signed-in user and their owned project, else 401/404.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/errors";
import type { User } from "@supabase/supabase-js";

export async function getAuthedProject(
  projectId: string
): Promise<{ user: User; project: any }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not signed in", "ERR_AUTH", 401);
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();
  if (!project) throw new AppError("Project not found", "ERR_NOT_FOUND", 404);
  return { user, project };
}

export async function getUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not signed in", "ERR_AUTH", 401);
  return user.id;
}