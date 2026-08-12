import "server-only";

import { getAuthedProject } from "@/lib/api/guard";
import { json, errorResponse } from "@/lib/errors";
import { runBrowserAndStore } from "@/lib/qa/runner";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await getAuthedProject(id);
    const res = await runBrowserAndStore(id);
    return json({ ok: true, ...res });
  } catch (e) {
    return errorResponse(e);
  }
}