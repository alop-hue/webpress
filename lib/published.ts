import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getPublishedSite(code: string) {
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("published_sites")
    .select("code,version,pages,assets,settings,checks,project_id,updated_at")
    .eq("code", code)
    .maybeSingle();
  return site;
}