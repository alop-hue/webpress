# Setup

## Prerequisites

- Node.js 20+, `pnpm`
- A Supabase project (database + auth + storage)

## Install & run

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase values
pnpm dev                     # http://localhost:3000
```

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (e.g. `https://<ref>.supabase.co`) | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable (anon) key | ✅ |
| `NEXT_PUBLIC_APP_URL` | Public base URL used in published links (defaults to request host) | optional |
| `WEBPRESS_MASTER_KEY` | AES key that encrypts saved AI API keys (`ai_credentials`). Keep stable across deploys | optional* |
| `OPENROUTER_API_KEY` / `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / etc. | AI provider keys — can be set here **or** per-user in the app's AI Settings (stored encrypted) | optional |

\* If unset it falls back to `webpress-dev-master-key` — fine for development,
but set a real value in production **before** users store keys.

## Database setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `db/migrations/0001_init.sql` (tables, row-level
   security, storage buckets, and the `profiles` trigger).
3. (Recommended) Turn **off** "Confirm email" under
   **Authentication → Sign In / Providers → Email** so signup activates
   instantly. The app also ships a full callback route
   (`app/auth/callback/route.ts`), so keeping confirmation on works too.

### Optional: manage via the Supabase CLI

```bash
pnpm db:migrate   # placeholder — apply SQL via `supabase db push` (migrations live in db/migrations/)
```

## Scripts

```bash
pnpm dev          # dev server on :3000
pnpm build        # production build
pnpm typecheck    # tsc --noEmit
pnpm test         # unit tests (Vitest)
pnpm test:e2e     # full-journey E2E (Playwright; needs dev server on :3000)
```

## Deployment (Vercel)

1. Push the repo to GitHub and import it into Vercel.
2. Add the two `NEXT_PUBLIC_SUPABASE_*` variables (and `WEBPRESS_MASTER_KEY`,
   plus any provider keys) to the project's environment.
3. Deploy. The `app/api/projects/[id]/deploy` route needs Node.js runtime and
   is already annotated with `runtime = "nodejs"` and `maxDuration = 300`.
