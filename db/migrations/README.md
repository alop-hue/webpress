# Database

Webpress uses Supabase (Postgres). Apply these tables in the Supabase dashboard SQL editor, or via the CLI:

```bash
pnpm db:migrate
```

## Schema

Core tables (all rows scoped by `project_id` where noted):

| Table | Purpose |
| --- | --- |
| `projects` | Owner, name, slug, template, status, settings JSON |
| `project_files` | Path, content, kind (`file`/`folder`), mime — the real project source |
| `pages` | Route path, title, description, og_image, is_home |
| `components` | Reusable components: name, html, css, js |
| `assets` | Uploaded files: path, mime, size (stored in Supabase Storage) |
| `deployments` | Deploy history: code, version, status, stage, url, error, meta |
| `published_sites` | Atomic published snapshot keyed by `code` (pages, assets, settings, checks) |
| `versions` | Project history snapshots: number, kind, label, files JSON |
| `test_runs` | QA results: kind (static/browser), status, results, summary |
| `suggestions` | AI/QA improvement suggestions: category, severity, title, detail, fix JSON |
| `analytics_events` | Anonymous visit beacon rows (site_code, path, device, referrer, ua) |

## Recommended policies

- `projects` / `project_files` / `pages` / `components` / `assets` / `deployments` / `versions` / `test_runs` / `suggestions`: **owner-only access** via `auth.uid() = owner_id` (join through `projects`).
- `published_sites`: public read on the `code` column (so `/p/[code]` renders without login), owner-only write.
- `analytics_events`: anonymous insert (rate-limited by the beacon route); owner-only read.
- Storage buckets: `assets` (owner-only read/write), `publish` (public read, owner write).
