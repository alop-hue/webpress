/**
 * Analytics dashboard data for the project owner.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";

export const runtime = "nodejs";

/** Aggregated analytics for a project (from live deployment codes) */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const supabase = await createClient();
    const { data: deps } = await supabase
      .from("deployments")
      .select("code")
      .eq("project_id", id)
      .eq("status", "live")
      .order("created_at", { ascending: false });
    const codes = (deps ?? []).map((d) => d.code);
    if (!codes.length) return json({ stats: null });

    const weekAgo = new Date(Date.now() - 14 * 86400_000).toISOString();
    const { data: events } = await supabase
      .from("analytics_events")
      .select("path,device,referrer,ua,created_at")
      .in("site_code", codes)
      .gte("created_at", weekAgo);

    const rows = events ?? [];
    const byDay = new Map<string, number>();
    const byPath = new Map<string, number>();
    const byDevice = new Map<string, number>();
    const byRef = new Map<string, number>();
    const uniques = new Set<string>(); // coarse: day+ua proxy
    for (const e of rows) {
      const day = (e.created_at ?? "").slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
      byPath.set(e.path || "/", (byPath.get(e.path || "/") ?? 0) + 1);
      byDevice.set(e.device || "unknown", (byDevice.get(e.device || "unknown") ?? 0) + 1);
      const ref = e.referrer ? new URL(e.referrer).hostname : "direct";
      byRef.set(ref, (byRef.get(ref) ?? 0) + 1);
      uniques.add(`${day}|${(e.ua ?? "").slice(0, 40)}${e.path}`);
    }
    return json({
      stats: {
        total: rows.length,
        uniques: uniques.size,
        days: [...byDay.entries()].sort().map(([day, n]) => ({ day, n })),
        paths: [...byPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10),
        devices: [...byDevice.entries()].sort((a, b) => b[1] - a[1]),
        referrers: [...byRef.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
