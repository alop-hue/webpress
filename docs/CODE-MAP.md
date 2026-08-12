# Code Map

A file-by-file walkthrough of the codebase. Every file also carries a short
header comment at the top of the source explaining its job.

## Root

| File | What it does |
| --- | --- |
| `middleware.ts` | Edge middleware: refreshes the Supabase session and guards `/projects` + `/editor` behind login (delegates to `lib/supabase/middleware.ts`). |
| `next.config.ts` | Next.js config. |
| `package.json` | Scripts: `dev`, `build`, `typecheck`, `test`, `test:e2e`. |
| `playwright.config.ts` | E2E runner config. |
| `AGENTS.md` | Instructions for AI coding agents working on this repo. |

## `app/` — routes

| File | What it does |
| --- | --- |
| `layout.tsx` | Root layout: fonts, theme provider, toast provider. |
| `page.tsx` | Landing page. |
| `login/page.tsx`, `signup/page.tsx` | Auth pages wrapping `components/auth-form.tsx`. |
| `projects/page.tsx` | Projects dashboard (server-rendered shell). |
| `projects/new/page.tsx` | New-site wizard page. |
| `editor/[id]/page.tsx` | Editor entry: loads the project and mounts `EditorWorkspace`. |
| `p/[code]/page.tsx` | Public homepage of a published site (renders the stored snapshot HTML). |
| `p/[code]/[...slug]/page.tsx` | Public sub-page of a published site. |
| `p/[code]/sitemap.xml/route.ts`, `p/[code]/robots.txt/route.ts` | SEO files for published sites. |
| `auth/callback/route.ts` | Completes email-confirmation / recovery links (token_hash or code exchange). |
| `api/projects/route.ts` | List/create projects; creation seeds template files + pages + a v1 version. |
| `api/projects/[id]/route.ts` | Get / update / delete one project. |
| `api/projects/[id]/files/route.ts` | List files, bulk save, single-file autosave (upserts into `project_files`). |
| `api/projects/[id]/pages/route.ts` | Page CRUD; creating a page also creates its backing HTML file. |
| `api/projects/[id]/components/route.ts` | Reusable component CRUD. |
| `api/projects/[id]/assets/route.ts` | Asset metadata + storage upload/delete. |
| `api/projects/[id]/versions/route.ts` | Version list + manual snapshot creation. |
| `api/projects/[id]/versions/restore/route.ts` | Restore files from a version snapshot. |
| `api/projects/[id]/deploy/route.ts` | Publish pipeline (quality gate → build → zip → live snapshot). |
| `api/projects/[id]/deployments/route.ts` | Deployment history. |
| `api/projects/[id]/deployments/rollback/route.ts` | Promote a previous live deployment back. |
| `api/projects/[id]/tests/route.ts` | Run + store static QA checks. |
| `api/projects/[id]/tests/browser/route.ts` | Run browser QA (Playwright). |
| `api/projects/[id]/suggestions/route.ts` | Improvement suggestions list + status updates. |
| `api/projects/[id]/agents/route.ts` | SSE agent run endpoint. |
| `api/projects/[id]/agents/apply/route.ts` | Apply approved agent drafts + create a version. |
| `api/projects/[id]/analytics/route.ts` | Owner analytics data. |
| `api/projects/[id]/export/route.ts` | Download the project as a zip. |
| `api/ai-settings/route.ts` | AI provider/model/permissions + encrypted credential storage. |
| `api/templates/route.ts` | Public template catalog. |
| `api/analytics/[code]/route.ts` | Public, rate-limited analytics beacon. |

## `lib/` — core logic (framework-free)

| File | What it does |
| --- | --- |
| `lib/constants.ts` | App name, breakpoints, site-code alphabet, editor attribute names, AI provider registry. |
| `lib/utils.ts` | `cn`, time formatting, `slugify`, random codes, clamp, truncate. |
| `lib/errors.ts` | `AppError`, `errorResponse`, `json` — the API error contract. |
| `lib/http.ts` | Client fetch wrapper with unified error handling. |
| `lib/crypto.ts` | AES-256-GCM encrypt/decrypt for stored AI keys. |
| `lib/security.ts` | Rate limiter, HMAC signing, secret detection, dangerous-JS detection, head-injection validation. |
| `lib/published.ts` | Server helpers: load published site by code, extract `<head>` metadata, route normalization. |
| `lib/api/guard.ts` | Auth guard for API routes (user + owned project). |
| `lib/supabase/client.ts` | Browser Supabase client (anon). |
| `lib/supabase/server.ts` | Cookie-based server client + auth/profile helpers. |
| `lib/supabase/middleware.ts` | Session refresh + auth redirects for the edge middleware. |
| `lib/editor/fs.ts` | Virtual FS: path utilities, page↔file mapping, folder tree building. |
| `lib/editor/build.ts` | Publish build: multi-page static HTML, SEO meta, inlined CSS/JS, link rewriting, sitemap/robots. |
| `lib/editor/styling.ts` | Visual style rules → `.wp-el-uid` CSS with breakpoint media queries. |
| `lib/editor/components.ts` | Reusable-component helpers (wrap, clean, find/replace instances). |
| `lib/editor/diff.ts` | Line-level LCS diff used by the AI panel. |
| `lib/editor/cm-setup.ts` | CodeMirror 6 extension bundle. |
| `lib/editor/canvas-agent.ts` | The injected visual-editing agent (selection, editing, RPC) + srcdoc builder. |
| `lib/ai/agent.ts` | Main agent: tool loop, sub-agent orchestration, draft edits. |
| `lib/ai/context.ts` | Structured project context for the agent (files, pages, design tokens). |
| `lib/ai/providers.ts` | Provider abstraction (OpenAI-compatible + Anthropic). |
| `lib/qa/static.ts` | Deterministic quality checks (SEO/a11y/links/perf/security) with auto-fixes. |
| `lib/qa/runner.ts` | Runs checks and syncs results into `test_runs` + `suggestions`. |
| `lib/qa/playwright.ts` | Browser QA: renders pages, collects console/page errors, viewport checks. |
| `lib/qa/snapshot.ts` | Loads a project snapshot — playwright-free so deploy can import it. |
| `lib/templates/index.ts` | Template registry. |
| `lib/templates/*.ts` | Template definitions by category. |

## `components/` — UI

| File | What it does |
| --- | --- |
| `components/ui.tsx` | Primitive kit (Button, Input, Spinner…). |
| `components/dialog.tsx` | Dialog + ConfirmDialog. |
| `components/menu.tsx` | Dropdown menu. |
| `components/toast.tsx` | Toasts + provider. |
| `components/theme-provider.tsx` | Light/dark/system theming. |
| `components/auth-form.tsx` | Sign in / sign up form. |
| `components/new-project.tsx` | Wizard: name + template picker. |
| `components/projects-page.tsx` | Projects list UI. |
| `components/editor/store.ts` | Zustand editor store. |
| `components/editor/EditorWorkspace.tsx` | Editor shell: hydration, autosave, undo, shortcuts, layout. |
| `components/editor/VisualCanvas.tsx` | Sandboxed iframe canvas + agent bridge. |
| `components/editor/CodeEditor.tsx` | CodeMirror editor with tabs + autosave. |
| `components/editor/PreviewPane.tsx` | Clean preview iframe. |
| `components/editor/PropsPanel.tsx` | Contextual properties for the selection. |
| `components/editor/AIPanel.tsx` | AI chat: streaming runs, drafts, apply/discard. |
| `components/editor/CommandPalette.tsx` | ⌘K palette. |
| `components/editor/SidebarNav.tsx` | Left rail + panel host. |
| `components/editor/workspace-context.ts` | Context that hands editor actions to panels. |
| `components/editor/panels/*.tsx` | Pages, Components, Assets, Files, History, Tests, Deploy (incl. PublishDialog), Settings, Analytics. |

## `db/`, `tests/`, `docs/`

| Path | What it is |
| --- | --- |
| `db/migrations/0001_init.sql` | Complete Supabase schema (tables, RLS, storage). |
| `tests/unit/` | Vitest: build, components, diff, fs, qa-static, security, styling, templates. |
| `tests/e2e/journey.spec.ts` | Playwright full-journey test (signup → create → publish). |
| `docs/` | This documentation set. |
