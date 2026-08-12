/**
 * AI agent endpoint: streams an agent run as Server-Sent Events (logs, sub-agent status, drafts).
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, errorResponse } from "@/lib/errors";
import { runAgent } from "@/lib/ai/agent";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const RunSchema = z.object({
  prompt: z.string().min(3).max(2000),
  kind: z.enum(["chat", "generate", "improve", "qa"]).default("chat"),
});

function sse(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const { user, project } = await getAuthedProject(id);
    const body = RunSchema.safeParse(await req.json());
    if (!body.success) throw new AppError("Invalid prompt", "ERR_VALIDATION", 400);
    const supabase = await createClient();

    // permissions
    const { data: agentSettings } = await supabase
      .from("agent_settings")
      .select("permissions")
      .eq("user_id", user.id)
      .maybeSingle();
    const perms = agentSettings?.permissions ?? { read: true, edit: true, runTests: true, deleteFiles: "ask", deploy: "ask" };

    // snapshot state
    const { data: files } = await supabase.from("project_files").select("path,content,kind").eq("project_id", id);
    const { data: pages } = await supabase.from("pages").select("path,title,description").eq("project_id", id);
    const { data: components } = await supabase.from("components").select("name,html,css").eq("project_id", id);
    const settings = (project.settings ?? {}) as { siteName?: string };

    // agent run record
    const { data: run } = await supabase
      .from("agent_runs")
      .insert({
        project_id: id,
        kind: body.data.kind,
        prompt: body.data.prompt,
        status: "running",
        messages: [],
      })
      .select("id,status")
      .single();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const enc = new TextEncoder();
        const send = (d: unknown) => controller.enqueue(enc.encode(sse(d)));
        try {
          const { drafts, summary } = await runAgent({
            userId: user.id,
            projectId: id,
            snapshot: {
              files: (files ?? []).map((f: any) => ({ path: f.path, content: f.content, kind: f.kind })),
              pages: pages ?? [],
              components: components ?? [],
              settings,
            },
            prompt: body.data.prompt,
            kind: body.data.kind,
            perms: {
              read: !!perms.read,
              edit: !!perms.edit,
              runTests: !!perms.runTests,
              deleteFiles: perms.deleteFiles ?? "ask",
            },
            onEvent: (e) => send(e),
          });
          // persist drafts per run
          if (run) {
            await supabase
              .from("agent_runs")
              .update({
                files_changed: drafts,
                result: { summary: summary.slice(0, 4000) },
                status: drafts.length ? "waiting_approval" : "done",
              })
              .eq("id", run.id);
          }
          send({ t: "done", runId: run?.id, files: drafts, summary });
        } catch (e: unknown) {
          if (run) {
            await supabase.from("agent_runs").update({ status: "failed", result: { error: String(e) } }).eq("id", run.id);
          }
          const msg = e instanceof AppError ? e.message : e instanceof Error ? e.message : String(e);
          send({ t: "error", s: msg });
          send({ t: "done", error: msg });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}