# Database

Supabase (Postgres). The full DDL lives in
[`db/migrations/0001_init.sql`](../db/migrations/0001_init.sql) — tables,
row-level security (RLS) policies, storage buckets and policies, and a trigger
that creates a `profiles` row for every new auth user.

## Tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| `profiles` | One row per auth user (auto-created by trigger) | `id` → `auth.users.id`, `name`, `email` |
| `projects` | Project header | `owner_id`, `name`, `slug`, `template`, `status`, `settings` (jsonb) |
| `project_files` | **The source of truth**: every file in a project | `project_id`, `path`, `content`, `kind` (`file`/`folder`), `mime`, `size` — unique `(project_id, path)` |
| `pages` | Page metadata (routes, titles, SEO) | `project_id`, `path` (`/`, `/about`…), `title`, `description`, `og_image`, `is_home` — unique `(project_id, path)` |
| `components` | Reusable components | `project_id`, `name`, `html`, `css`, `js` — unique `(project_id, name)` |
| `assets` | Asset metadata (blobs live in storage) | `project_id`, `name`, `path`, `size`, `mime`, `width`, `height` |
| `deployments` | Deploy history | `project_id`, `code`, `version`, `status`, `stage`, `url`, `error` (jsonb), `meta` (jsonb) |
| `published_sites` | **Atomic public snapshot** keyed by short code | `code` (pk), `project_id`, `deployment_id`, `version`, `pages` (jsonb), `assets` (jsonb), `settings`, `checks` |
| `versions` | Version history snapshots | `project_id`, `number`, `kind` (`user`/`agent`/`auto`), `label`, `summary`, `files` (jsonb), `created_by` — unique `(project_id, number)` |
| `test_runs` | QA results | `project_id`, `kind` (`static`/`browser`), `status`, `results` (jsonb), `summary` (jsonb) |
| `suggestions` | Improvement center items | `project_id`, `category`, `severity`, `title`, `detail`, `fix` (jsonb), `source`, `status` (`open`/`fixed`/`ignored`) |
| `agent_runs` | AI agent run records | `project_id`, `kind`, `prompt`, `status`, `messages` (jsonb), `files_changed` (jsonb), `result` (jsonb) |
| `agent_settings` | Per-user AI preferences | `user_id` (pk), `provider`, `model`, `permissions` (jsonb) |
| `ai_credentials` | Encrypted AI API keys | `user_id`, `provider`, `label`, `encrypted_key` — unique `(user_id, provider)` |
| `analytics_events` | Anonymous visit beacon rows | `site_code`, `path`, `device`, `referrer`, `ua` |

## Row-level security (summary)

- **Owner-only tables** (`projects`, `project_files`, `pages`, `components`,
  `assets`, `deployments`, `versions`, `test_runs`, `suggestions`,
  `agent_runs`): all operations require the row's project to belong to
  `auth.uid()`. Implemented with `exists(select 1 from projects p where
  p.id = project_id and p.owner_id = auth.uid())`.
- **`published_sites`**: public `select` (so `/p/[code]` renders for anonymous
  visitors), owner-only insert/update/delete.
- **`analytics_events`**: anonymous insert (the beacon route rate-limits and
  validates the site code first); owner read via their deployments.
- **`profiles` / `agent_settings` / `ai_credentials`**: `auth.uid()` = own row.

## Storage

| Bucket | Visibility | Objects | Policies |
| --- | --- | --- | --- |
| `assets` | private | `{projectId}/{path}` | owner-only (checks the folder prefix belongs to a project owned by `auth.uid()`) |
| `publish` | public | `sites/{code}/site.zip` (full export) | world read; any signed-in user may upload (the deploy route uploads with the user's session) |

## Migrations

Add new migrations as `db/migrations/NNNN_name.sql` and apply through the
Supabase dashboard SQL editor or `supabase db push` (after `supabase link`).
