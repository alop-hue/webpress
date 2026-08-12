# Webpress

A production-ready WordPress alternative: visually build modern websites, drop into HTML/CSS/JS when you need to, let AI agents edit and test your project, and publish to a public URL in one click. Projects are real files — export them anytime, keep the same public URL across updates, and roll back deployments instantly.

## Highlights

- **Visual editor** — select, reorder, duplicate, delete and inline-edit elements on a live canvas (desktop / tablet / mobile breakpoints). Visual changes are serialized back into the actual HTML file.
- **Code editor** — full CodeMirror editor (HTML / CSS / JS / JSON) with tabs, autocomplete, search, formatting and per-file autosave. The visual canvas and the code stay in sync.
- **AI agent** — chat with an agent that inspects the real project, applies changes (with per-run diff review before applying), and explains what it did. Optional sub-agent QA: static checks, browser checks, SEO / a11y / security suggestions.
- **Publish** — one click runs a quality gate (broken links, missing metadata, a11y, secrets…), builds a full static export, uploads it, and returns a stable public URL at `/p/[code]`. No login needed to view.
- **Pages & components** — multi-page sites with per-page titles/descriptions/OG metadata, plus reusable components saved from any selection.
- **Assets** — upload images, SVGs and more via Supabase Storage; inserted into pages as real relative paths.
- **Version history** — every meaningful edit is snapshotted; preview, compare and restore.
- **Deploy dashboard** — live URL, deployment history, rollback, export (downloads a complete working static project zip), analytics (anonymous, rate-limited).
- **Templates** — SaaS and Portfolio starters; more can be added as plain file sets.

## Stack

- Next.js 16 (App Router, TypeScript), Tailwind CSS
- Supabase (Postgres + Auth + Storage)
- CodeMirror 6 (editor), node-html-parser (static analysis), fflate (zip export), Playwright (browser QA)

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase values (see below)
pnpm dev                     # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable (anon) key |
| `NEXT_PUBLIC_APP_URL` | Public base URL used in published links (optional; defaults to request host) |

### Database

Tables: `projects`, `project_files`, `pages`, `components`, `assets`, `deployments`, `published_sites`, `versions`, `test_runs`, `suggestions`, `analytics_events`, `users` (Supabase auth).

Apply the schema in `db/migrations/` through the Supabase dashboard or CLI, then run:

```bash
pnpm db:migrate
```

## Scripts

```bash
pnpm dev          # dev server on :3000
pnpm build        # production build
pnpm typecheck    # tsc --noEmit
pnpm test         # unit tests (Vitest)
pnpm test:e2e     # full journey E2E (Playwright; needs the dev server on :3000)
```

## The full journey

1. Sign up / sign in.
2. **New site** → pick a template (or blank).
3. Edit visually, or switch to **Code** and write real HTML/CSS/JS.
4. Ask the **AI agent** to improve things, then review and apply diffs.
5. **Publish** → quality gate → live public URL (`/p/[code]`).
6. Anyone with the link can view it. Update and republish — same URL. Roll back anytime.
7. **Export** downloads the complete static project as files.

## Architecture notes

- The visual canvas renders the project's real HTML in a sandboxed iframe; a small injected agent script handles selection/editing and posts mutations back to the host, which serializes the document into the file and autosaves.
- Deploys are real: quality gate → build multi-page static output + sitemap + robots → zip → upload to storage → atomic `published_sites` upsert keyed by the stable code.
- Public routes (`/p/[code]`, plus `/p/[code]/robots.txt`, `/p/[code]/sitemap.xml`) serve the published snapshot with full SEO metadata and no editor chrome.
- AI edits are transactional: each agent run produces a list of file diffs you approve per-run (or discard); dangerous operations require explicit confirmation.
