# API

All routes are Next.js App Router route handlers under `app/api/`. Responses
are JSON (except the agent run, which streams Server-Sent Events). Errors use
the shape `{ code, message, details? }` (see `lib/errors.ts`).

Authentication is enforced per-route via `lib/api/guard.ts`, which reads the
Supabase session from cookies. All `/projects/...` routes return **404** for
projects that don't belong to the signed-in user (RLS backs this up).

## Projects

| Method | Route | Description |
| --- | --- | --- |
| GET/POST | `/api/projects` | List own projects / create one (optionally seeding template files + pages + a v1 snapshot) |
| GET/PATCH/DELETE | `/api/projects/[id]` | Read / update (name, description, settings, status) / delete a project |
| GET/POST | `/api/projects/[id]/files` | List all files / bulk-save (upsert + delete marked files) |
| PUT | `/api/projects/[id]/files` | Single-file autosave (code editor) |
| GET/POST/PATCH/DELETE | `/api/projects/[id]/pages` | Page metadata CRUD; creating a page also creates its backing `*.html` file |
| GET/POST/PATCH/DELETE | `/api/projects/[id]/components` | Reusable component CRUD |
| GET/POST/DELETE | `/api/projects/[id]/assets` | Asset metadata + storage upload/delete |
| GET/POST | `/api/projects/[id]/versions` | Version history list / create a manual snapshot |
| POST | `/api/projects/[id]/versions/restore` | Restore all files from a previous version snapshot |
| GET/POST | `/api/projects/[id]/deployments` | Deployment history / (deploy happens in `/deploy`) |
| POST | `/api/projects/[id]/deployments/rollback` | Promote a previous live deployment back to live |
| POST | `/api/projects/[id]/deploy` | **Publish**: quality gate → build → zip → live snapshot (see [PUBLISHING.md](./PUBLISHING.md)) |
| GET | `/api/projects/[id]/export` | Download the whole project as a `.zip` of real files |
| POST | `/api/projects/[id]/tests` | Run static QA checks, store results + sync suggestions |
| POST | `/api/projects/[id]/tests/browser` | Run browser QA via Playwright (console errors, layout) |
| GET/PATCH | `/api/projects/[id]/suggestions` | List improvement suggestions / update status (open→fixed/ignored) |
| POST | `/api/projects/[id]/agents` | **SSE**: run the AI agent (streams logs, sub-agent status, drafts) |
| POST | `/api/projects/[id]/agents/apply` | Apply an approved run's draft edits + create a version |
| GET | `/api/projects/[id]/analytics` | Analytics dashboard data (owner only) |

## Misc

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/templates` | Public template library (id, name, category, description, thumbnail) |
| GET/PATCH | `/api/ai-settings` | Per-user AI provider/model/permissions + encrypted credential save |
| POST | `/api/analytics/[code]` | **Public beacon**: anonymous, rate-limited visit event for a published site |

## Public site routes (no API shape)

- `GET /p/[code]` — published homepage (full HTML document)
- `GET /p/[code]/[slug]` — published sub-page
- `GET /p/[code]/sitemap.xml`, `GET /p/[code]/robots.txt` — SEO files

## Conventions

- Route handlers are `export async function GET/POST/…`.
- Use `json(data, status)` for success and `errorResponse(e)` in `catch` —
  this guarantees a consistent error contract.
- Long-running handlers (deploy, tests, agents) set `runtime = "nodejs"` and
  `maxDuration`.
