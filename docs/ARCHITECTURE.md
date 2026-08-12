# Architecture

Webpress is a Next.js 16 (App Router, TypeScript) application. It is a single
deployable web app: the editor, the API, and the public published sites all run
in one process.

## High-level data flow

```
┌────────────────────────────────────────────────────────────────────┐
│ Browser                                                              │
│  /signup /login   → Supabase Auth (email/password)                   │
│  /projects        → project dashboard (server components)            │
│  /editor/[id]     → EditorWorkspace (client)                         │
│                       ├─ VisualCanvas  (sandboxed iframe + agent)    │
│                       ├─ CodeEditor    (CodeMirror 6)                │
│                       ├─ AIPanel       (SSE chat with agent)         │
│                       └─ panels/*      (pages, files, deploy, …)     │
│  /p/[code]         → public published site (no login)                │
└──────────────┬───────────────────────────────────────────────────────┘
               │ fetch (JSON / SSE)        │ static render
               ▼                           ▼
┌──────────────────────────────┐  ┌───────────────────────────────────┐
│ Next.js API routes           │  │ /p/[code] pages read              │
│  app/api/...                 │  │ published_sites snapshot from      │
│  (auth via Supabase session) │  │ Supabase and render it as a full   │
└──────────────┬───────────────┘  │ standalone HTML document          │
               │                  └───────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────┐
│ Supabase (Postgres + Auth + Storage)          │
│  projects, project_files, pages, components,  │
│  assets, deployments, published_sites,        │
│  versions, test_runs, suggestions,            │
│  agent_runs, agent_settings, ai_credentials,  │
│  analytics_events                             │
│  buckets: assets (private), publish (public)  │
└──────────────────────────────────────────────┘
```

## Key design decisions

- **The file tree is the source of truth.** Every project is a set of real
  files (`project_files`): `index.html`, `css/style.css`, `js/app.js`, etc.
  The visual editor and the code editor both edit these files, so the two
  modes stay in sync by construction.
- **The visual canvas edits the real document.** `VisualCanvas` renders the
  page inside a sandboxed `iframe srcdoc` and injects `canvas-agent.ts`, a
  small script that makes the DOM selectable/editable and relays mutations
  back to the host via `postMessage`. The host serializes the DOM back into
  the file and autosaves.
- **Style changes are class-based, not inline.** The visual editor assigns
  each styled element a `data-wp-el="uid"` and writes `.wp-el-<uid>` rules
  into a `<style id="wp-el-styles">` tag in the document head (see
  `lib/editor/styling.ts`). This survives code edits and stays cascade-friendly.
- **Publishing is a real static build.** `buildSite` in `lib/editor/build.ts`
  parses every HTML page, injects SEO metadata, inlines project CSS/JS
  (so `/p/[code]` renders without extra asset routes), rewrites relative links
  to absolute `/p/[code]/...` paths, and produces `sitemap.xml` + `robots.txt`.
  The result is stored atomically in `published_sites` keyed by a short public
  code, and a zip of the whole export is uploaded to the `publish` storage bucket.
- **AI edits are transactional.** The agent produces *drafts* (file diffs)
  that the user reviews and approves per run before anything is written to the
  project (`lib/ai/agent.ts` + `/agents/apply`).
- **Security boundaries.** User HTML/JS only ever executes inside the editor's
  sandboxed iframe (no `allow-same-origin`) or on the public site page itself —
  never inside privileged server code. The QA/static and deploy paths only parse
  HTML, they never execute project scripts.

## Folders at a glance

| Path | Purpose |
| --- | --- |
| `app/` | Next.js routes: API (`app/api`), pages, public sites (`app/p`) |
| `components/` | React UI. `components/editor/` is the editor workspace |
| `lib/` | Framework-free logic: editor core, AI, QA, templates, supabase, security |
| `db/migrations/` | PostgreSQL schema for Supabase |
| `tests/` | Vitest unit tests + Playwright E2E |
| `docs/` | This documentation |

See [CODE-MAP.md](./CODE-MAP.md) for a file-by-file walkthrough.
