import "server-only";

import { getAuthedProject } from "@/lib/api/guard";
import { json, errorResponse, AppError } from "@/lib/errors";
import { runStaticAndStore } from "@/lib/qa/runner";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const results = await runStaticAndStore(id);
    return json({ ok: true, count: results.length });
  } catch (e) {
    return errorResponse(e);
  }
}