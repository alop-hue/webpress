import "server-only";

import { createClient } from "@/lib/supabase/server";
import { json } from "@/lib/errors";
import { z } from "zod";
import { rateLimit } from "@/lib/security";

export const runtime = "nodejs";

const EventSchema = z.object({
  path: z.string().max(300).default("/"),
  referrer: z.string().max(300).default(""),
  ua: z.string().max(300).default(""),
  device: z.string().max(20).default("unknown"),
});

/** Public beacon — anonymous, rate limited, signed check optional */
export async function POST(req: Request, ctx: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await ctx.params;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
    const rl = rateLimit(`analytics:${ip}:${code}`, 60, 60_000);
    if (!rl.ok) return json({ ok: true }, 202);

    const body = EventSchema.safeParse(await req.json().catch(() => ({ path: "/" })));
    const supabase = await createClient();
    // only record known site codes (public insert allowed, but validate)
    const { data: site } = await supabase.from("published_sites").select("project_id").eq("code", code).maybeSingle();
    if (site) {
      const { error } = await supabase.from("analytics_events").insert({
        site_code: code,
        path: body.success ? body.data.path : "/",
        referrer: body.success ? body.data.referrer : "",
        ua: body.success ? body.data.ua : "",
        device: body.success ? body.data.device : "unknown",
      });
      if (error) console.error("analytics insert", error.message);
    }
    return json({ ok: true }, 202);
  } catch {
    return json({ ok: true }, 202);
  }
}