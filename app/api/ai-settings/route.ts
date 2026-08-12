/**
 * AI settings: provider/model/permissions plus encrypted API-key storage.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getUserId } from "@/lib/api/guard";
import { AppError, json, errorResponse } from "@/lib/errors";
import { z } from "zod";
import { encryptSecret } from "@/lib/crypto";
import { AI_PROVIDERS } from "@/lib/constants";

export const runtime = "nodejs";

const ENV_KEYS: Record<string, string> = {
  openrouter: "OPENROUTER_API_KEY",
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  google: "GEMINI_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  groq: "GROQ_API_KEY",
  xai: "XAI_API_KEY",
  together: "TOGETHER_API_KEY",
  mistral: "MISTRAL_API_KEY",
};

export async function GET() {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data: settings } = await supabase.from("agent_settings").select("*").eq("user_id", userId).maybeSingle();
    const { data: creds } = await supabase
      .from("ai_credentials")
      .select("provider,label,encrypted_key")
      .eq("user_id", userId);
    const hasEnvKey = new Map<string, boolean>();
    for (const p of AI_PROVIDERS) {
      const k = ENV_KEYS[p.id];
      hasEnvKey.set(p.id, !!process.env[k]);
    }
    return json({
      settings:
        settings ?? {
          provider: process.env.WEBPRESS_DEFAULT_PROVIDER ?? "openrouter",
          model: process.env.WEBPRESS_DEFAULT_MODEL ?? "",
          permissions: { read: true, edit: true, runTests: true, deleteFiles: "ask", deploy: "ask", installPackages: "ask" },
        },
      providers: AI_PROVIDERS.map((p) => ({
        id: p.id,
        label: p.label,
        defaultModel: p.defaultModel,
        configured: hasEnvKey.get(p.id) || (creds ?? []).some((c) => c.provider === p.id),
      })),
    });
  } catch (e) {
    return errorResponse(e);
  }
}

const SettingsSchema = z.object({
  provider: z.string().min(1),
  model: z.string().max(120),
  permissions: z.record(z.unknown()).optional(),
});

export async function PUT(req: Request) {
  try {
    const userId = await getUserId();
    const body = SettingsSchema.safeParse(await req.json());
    if (!body.success) throw new AppError("Invalid settings", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    await supabase.from("agent_settings").upsert(
      { user_id: userId, provider: body.data.provider, model: body.data.model, permissions: body.data.permissions ?? {} },
      { onConflict: "user_id" }
    );
    return json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}

const CredSchema = z.object({
  provider: z.string().min(1),
  key: z.string().min(8).max(500),
});

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    const body = CredSchema.safeParse(await req.json());
    if (!body.success) throw new AppError("Invalid key", "ERR_VALIDATION", 400);
    if (!AI_PROVIDERS.some((p) => p.id === body.data.provider))
      throw new AppError("Unknown provider", "ERR_VALIDATION", 400);
    const supabase = await createClient();
    await supabase.from("ai_credentials").upsert(
      { user_id: userId, provider: body.data.provider, encrypted_key: encryptSecret(body.data.key.trim()) },
      { onConflict: "user_id,provider" }
    );
    return json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}