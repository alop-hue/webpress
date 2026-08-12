/**
 * Shared constants: app metadata, breakpoints, site-code alphabet, editor attribute names, AI provider registry.
 */
export const APP_NAME = "Webpress";
export const APP_TAGLINE = "The modern WordPress alternative";

export const BREAKPOINTS = {
  desktop: { label: "Desktop", width: 1440, height: 900 },
  tablet: { label: "Tablet", width: 768, height: 1024 },
  mobile: { label: "Mobile", width: 375, height: 812 },
} as const;

export type BreakpointId = keyof typeof BREAKPOINTS;

export const SITE_CODE_LENGTH = 6;
export const SITE_CODE_ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const STYLE_TAG_ID = "wp-el-styles";
export const EDITOR_ATTR_PREFIX = "data-wp-el";
export const SECTION_ATTR = "data-wp-section";
export const COMPONENT_ATTR = "data-wp-component";
export const RAW_ATTR = "data-wp-raw";

export const MAX_FILE_BYTES = 2048 * 1024; // 2MB per file
export const MAX_ASSET_BYTES = 50 * 1024 * 1024;

export const SUGGESTION_CATEGORIES = [
  "seo",
  "accessibility",
  "performance",
  "security",
  "content",
  "design",
  "link",
] as const;

export const AI_PROVIDERS = [
  { id: "openrouter", label: "OpenRouter", defaultModel: "deepseek/deepseek-chat" },
  { id: "openai", label: "OpenAI", defaultModel: "gpt-4o-mini" },
  { id: "anthropic", label: "Anthropic", defaultModel: "claude-sonnet-4-5" },
  { id: "google", label: "Google Gemini", defaultModel: "gemini-2.0-flash" },
  { id: "deepseek", label: "DeepSeek", defaultModel: "deepseek-chat" },
  { id: "groq", label: "Groq", defaultModel: "llama-3.3-70b-versatile" },
  { id: "xai", label: "xAI Grok", defaultModel: "grok-3" },
  { id: "together", label: "Together", defaultModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo" },
  { id: "mistral", label: "Mistral", defaultModel: "mistral-large-latest" },
] as const;

export type ProviderId = (typeof AI_PROVIDERS)[number]["id"];