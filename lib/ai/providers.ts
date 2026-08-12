/**
 * AI provider layer: resolves credentials and normalizes OpenAI-compatible and Anthropic APIs into one interface.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { decryptSecret } from "@/lib/crypto";
import { AI_PROVIDERS, type ProviderId } from "@/lib/constants";
import { AppError } from "@/lib/errors";

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  toolCallId?: string;
}

export interface ToolSpec {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface CompleteResult {
  text: string;
  toolCalls: ToolCall[];
}

const ENV_KEYS: Record<ProviderId, string> = {
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

const ENDPOINTS: Record<ProviderId, { base: string; anthropic?: boolean }> = {
  openrouter: { base: "https://openrouter.ai/api/v1" },
  openai: { base: "https://api.openai.com/v1" },
  anthropic: { base: "https://api.anthropic.com/v1", anthropic: true },
  google: { base: "https://generativelanguage.googleapis.com/v1beta/openai" },
  deepseek: { base: "https://api.deepseek.com/v1" },
  groq: { base: "https://api.groq.com/openai/v1" },
  xai: { base: "https://api.x.ai/v1" },
  together: { base: "https://api.together.xyz/v1" },
  mistral: { base: "https://api.mistral.ai/v1" },
};

export interface ResolvedCreds {
  provider: ProviderId;
  model: string;
  apiKey: string;
  base: string;
  anthropic: boolean;
}

export async function resolveCredentials(userId: string): Promise<ResolvedCreds> {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("agent_settings")
    .select("provider,model")
    .eq("user_id", userId)
    .single();
  const provider = (settings?.provider as ProviderId) || process.env.WEBPRESS_DEFAULT_PROVIDER || "openrouter";
  if (!AI_PROVIDERS.some((p) => p.id === provider)) throw new AppError("Unknown AI provider", "ERR_AI_PROVIDER", 400);

  let apiKey = (process.env[ENV_KEYS[provider]] ?? "").trim();
  if (!apiKey) {
    const { data: cred } = await supabase
      .from("ai_credentials")
      .select("encrypted_key")
      .eq("user_id", userId)
      .eq("provider", provider)
      .single();
    if (cred?.encrypted_key) {
      try {
        apiKey = decryptSecret(cred.encrypted_key);
      } catch {
        apiKey = "";
      }
    }
  }
  if (!apiKey) {
    const providerLabel = AI_PROVIDERS.find((p) => p.id === provider)?.label ?? provider;
    throw new AppError(
      `No API key for ${providerLabel}. Add one in AI Settings (opens in ~30s), or set ${ENV_KEYS[provider]}.`,
      "ERR_AI_KEY",
      400
    );
  }
  const def = AI_PROVIDERS.find((p) => p.id === provider)!;
  return {
    provider,
    model: (settings?.model as string) || process.env.WEBPRESS_DEFAULT_MODEL || def.defaultModel,
    apiKey,
    base: ENDPOINTS[provider].base,
    anthropic: !!ENDPOINTS[provider].anthropic,
  };
}

export async function complete(
  userId: string,
  messages: ChatMessage[],
  opts: { tools?: ToolSpec[]; maxTokens?: number; temperature?: number } = {}
): Promise<CompleteResult> {
  const creds = await resolveCredentials(userId);
  const maxTokens = opts.maxTokens ?? 8000;

  if (creds.anthropic) return completeAnthropic(creds, messages, opts.tools, maxTokens);
  return completeOpenAiCompat(creds, messages, opts.tools, maxTokens);
}

export function streamText(
  userId: string,
  messages: ChatMessage[],
  onDelta: (text: string) => void,
  opts: { tools?: ToolSpec[]; maxTokens?: number } = {}
): Promise<CompleteResult> {
  return complete(userId, messages, { ...opts, temperature: 0.7 }).then((r) => {
    if (r.text) onDelta(r.text);
    return r;
  });
}

async function pushOpenAi(creds: ResolvedCreds, body: unknown, signal?: AbortSignal): Promise<Response> {
  const res = await fetch(`${creds.base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creds.apiKey}`,
      ...(creds.provider === "openrouter" ? { "HTTP-Referer": "https://webpress.app", "X-Title": "Webpress" } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = parseProviderError(text, res.status);
    throw new AppError(msg, "ERR_AI_PROVIDER", 502);
  }
  return res;
}

async function completeOpenAiCompat(
  creds: ResolvedCreds,
  messages: ChatMessage[],
  tools: ToolSpec[] | undefined,
  maxTokens: number
): Promise<CompleteResult> {
  const body: Record<string, unknown> = {
    model: creds.model,
    max_tokens: maxTokens,
    messages: messages.map((m) => (m.role === "tool" ? { role: "tool", content: m.content, tool_call_id: m.toolCallId } : { role: m.role, content: m.content })),
  };
  if (tools?.length) {
    body.tools = tools.map((t) => ({ type: "function", function: { name: t.name, description: t.description, parameters: t.parameters } }));
  }
  const res = await pushOpenAi(creds, body);
  const data = await res.json();
  const choice = data.choices?.[0];
  const msg = choice?.message ?? {};
  const content = typeof msg.content === "string" ? msg.content : Array.isArray(msg.content) ? msg.content.map((c: any) => c?.text ?? "").join("") : "";
  const toolCalls: ToolCall[] = (msg.tool_calls ?? []).map((tc: any) => ({
    id: tc.id,
    name: tc.function?.name ?? "",
    args: safeJson(tc.function?.arguments),
  }));
  return { text: content ?? "", toolCalls };
}

async function completeAnthropic(
  creds: ResolvedCreds,
  messages: ChatMessage[],
  tools: ToolSpec[] | undefined,
  maxTokens: number
): Promise<CompleteResult> {
  const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
  const rest: ChatMessage[] = messages.filter((m) => m.role !== "system");
  const body: Record<string, unknown> = {
    model: creds.model,
    max_tokens: maxTokens,
    messages: rest.map((m) => {
      if (m.role === "tool") return { role: "user", content: [{ type: "tool_result", tool_use_id: m.toolCallId, content: m.content }] };
      return { role: m.role, content: m.content };
    }),
  };
  if (system) body.system = system;
  if (tools?.length) {
    body.tools = tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.parameters }));
  }
  const res = await fetch(`${creds.base}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": creds.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new AppError(parseProviderError(text, res.status), "ERR_AI_PROVIDER", 502);
  }
  const data = await res.json();
  const text = (data.content ?? [])
    .filter((c: any) => c.type === "text")
    .map((c: any) => c.text)
    .join("");
  const toolCalls = (data.content ?? [])
    .filter((c: any) => c.type === "tool_use")
    .map((c: any) => ({ id: c.id, name: c.name, args: c.input ?? {} }));
  return { text, toolCalls };
}

function safeJson(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === "object") return raw as Record<string, unknown>;
  try {
    return JSON.parse(String(raw ?? "{}"));
  } catch {
    return {};
  }
}

function parseProviderError(text: string, status: number): string {
  try {
    const j = JSON.parse(text);
    const m = j?.error?.message || j?.message || "";
    if (m) return m.slice(0, 300);
  } catch {
    /* not json */
  }
  if (status === 401) return "The AI provider rejected the API key (401). Check it in AI Settings.";
  if (status === 429) return "The AI provider rate-limited the request (429). Wait a moment and retry.";
  return `AI provider error (${status}): ${text.slice(0, 200)}`;
}