# AI Agents

The AI system lets the user chat with an agent that **inspects the real project
and produces editable drafts**, plus an orchestration layer that spawns
specialized sub-agents for inspection. Everything is streamed to the UI as
Server-Sent Events (`/api/projects/[id]/agents`).

## Flow

```
User prompt ("Make the hero more premium")
   │
   ▼
/agents (SSE) ──► lib/ai/agent.ts
   │               ├─ buildContext(snapshot)   (lib/ai/context.ts)
   │               ├─ [non-chat runs] spawn sub-agents in parallel:
   │               │    UI, Code, Accessibility, SEO, Performance, Security
   │               │    → findings injected into the main agent's context
   │               ├─ main agent loop (max 10 tool rounds):
   │               │    list_files · read_file · write_file · run_checks
   │               │    write_file ⇒ DRAFT (never written directly)
   │               └─ returns { drafts, summary }
   │
   ▼
UI shows summary + per-file diffs (lib/editor/diff.ts)
   │
   ▼  user clicks Apply
/agents/apply ─► writes files (upsert/delete), creates a version (kind: agent)
```

## Tools

| Tool | Effect |
| --- | --- |
| `list_files` | List files with sizes + pages/components |
| `read_file` | Read a file's content (truncated at 40 KB) |
| `write_file` | **Create a draft** edit — user must approve; refuses secrets (`sk-`, `ghp_`, private keys) and oversize files |
| `run_checks` | Run the static QA suite (SEO/a11y/links/security) against the current draft state |

## Safety model

- **Drafts, not writes.** The agent only produces `DraftEdit[]`. The user
  reviews per-run diffs in the AI panel and clicks **Apply** (or Discard).
- **Permissions** (`agent_settings.permissions`): read, edit, runTests,
  deleteFiles, deploy. Dangerous operations default to `"ask"`.
- **Secret guard**: any `write_file` containing known secret patterns is
  rejected.
- **Undo**: applying a run creates a labeled version, so the whole operation
  can be rolled back from History.
- Provider keys never enter site files — they're stored encrypted
  (`ai_credentials`, AES-256-GCM via `lib/crypto.ts`) or in env vars.

## Sub-agents

Six inspectors run in parallel for `generate`/`improve`/`qa` runs: **UI**, **Code**,
**Accessibility**, **SEO**, **Performance**, **Security**. Each receives a digest
of the project and returns JSON issues; the main agent treats them as
advisory input and fixes what is real. Their status is streamed to the panel
(`Thinking… Inspecting homepage…`).

## Providers

`lib/ai/providers.ts` abstracts the model backend. It resolves the user's
chosen provider/model (OpenRouter, OpenAI, Anthropic, Gemini, DeepSeek, Groq,
xAI, Together, Mistral), finds an API key (env var first, then encrypted
user credential), and normalizes OpenAI-compatible + Anthropic API shapes into
one `complete()` interface.

## Static QA (`lib/qa/`)

Independent of the LLM, the QA suite runs deterministic checks: broken links,
missing titles/descriptions/OG tags, heading hierarchy, alt text, unlabeled
inputs, duplicate IDs, `javascript:` links, non-HTTPS links, dangerous JS
patterns, exposed secrets, and oversized files. Results are stored in
`test_runs` and synced into the `suggestions` improvement center (with
one-click auto-fixes where possible). Browser QA (`lib/qa/playwright.ts`) adds
real rendering checks: console errors, page errors, and layout sanity per
viewport.
