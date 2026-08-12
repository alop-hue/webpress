-- Webpress initial schema
-- Run in the Supabase dashboard SQL Editor (or via CLI: supabase db push).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profiles (one row per auth user)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- keep a profile row in sync with auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null default '',
  template text not null default 'blank',
  status text not null default 'draft',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_owner_idx on public.projects (owner_id, updated_at desc);
create unique index if not exists projects_owner_slug_idx on public.projects (owner_id, slug);

alter table public.projects enable row level security;

drop policy if exists "projects owner select" on public.projects for select using (auth.uid() = owner_id);;
create policy "projects owner select" on public.projects for select using (auth.uid() = owner_id);
drop policy if exists "projects owner insert" on public.projects for insert with check (auth.uid() = owner_id);;
create policy "projects owner insert" on public.projects for insert with check (auth.uid() = owner_id);
drop policy if exists "projects owner update" on public.projects for update using (auth.uid() = owner_id);;
create policy "projects owner update" on public.projects for update using (auth.uid() = owner_id);
drop policy if exists "projects owner delete" on public.projects for delete using (auth.uid() = owner_id);;
create policy "projects owner delete" on public.projects for delete using (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- project_files (the real source of truth for every project)
-- ---------------------------------------------------------------------------
create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  path text not null,
  content text not null default '',
  kind text not null default 'file' check (kind in ('file', 'folder')),
  mime text not null default 'text/plain',
  size integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, path)
);

create index if not exists project_files_project_idx on public.project_files (project_id);

alter table public.project_files enable row level security;

drop policy if exists "files owner all" on public.project_files;
create policy "files owner all" on public.project_files
  for all using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- pages
-- ---------------------------------------------------------------------------
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  path text not null,
  title text not null default '',
  description text not null default '',
  og_image text not null default '',
  is_home boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, path)
);

create index if not exists pages_project_idx on public.pages (project_id);

alter table public.pages enable row level security;

drop policy if exists "pages owner all" on public.pages;
create policy "pages owner all" on public.pages
  for all using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- components (reusable)
-- ---------------------------------------------------------------------------
create table if not exists public.components (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  html text not null default '',
  css text not null default '',
  js text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, name)
);

alter table public.components enable row level security;

drop policy if exists "components owner all" on public.components;
create policy "components owner all" on public.components
  for all using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- assets (metadata; blobs live in the assets storage bucket)
-- ---------------------------------------------------------------------------
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  path text not null,
  size integer not null default 0,
  mime text not null default 'application/octet-stream',
  width integer,
  height integer,
  created_at timestamptz not null default now(),
  unique (project_id, path)
);

alter table public.assets enable row level security;

drop policy if exists "assets owner all" on public.assets;
create policy "assets owner all" on public.assets
  for all using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- deployments
-- ---------------------------------------------------------------------------
create table if not exists public.deployments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  code text not null,
  version integer not null default 1,
  status text not null default 'building',
  stage text not null default 'build',
  url text,
  error jsonb,
  meta jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists deployments_project_idx on public.deployments (project_id, created_at desc);
create index if not exists deployments_code_idx on public.deployments (code);

alter table public.deployments enable row level security;

drop policy if exists "deployments owner all" on public.deployments;
create policy "deployments owner all" on public.deployments
  for all using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- published_sites (atomic public snapshot keyed by short code)
-- ---------------------------------------------------------------------------
create table if not exists public.published_sites (
  code text primary key,
  project_id uuid not null references public.projects (id) on delete cascade,
  deployment_id uuid references public.deployments (id) on delete set null,
  version integer not null default 1,
  pages jsonb not null default '{}'::jsonb,
  assets jsonb not null default '[]'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  checks jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists published_sites_project_idx on public.published_sites (project_id);

alter table public.published_sites enable row level security;

-- public read by code so /p/[code] renders without login
drop policy if exists "published public select" on public.published_sites;
create policy "published public select" on public.published_sites
  for select using (true);
drop policy if exists "published owner insert" on public.published_sites;
create policy "published owner insert" on public.published_sites
  for insert with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );
drop policy if exists "published owner update" on public.published_sites;
create policy "published owner update" on public.published_sites
  for update using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );
drop policy if exists "published owner delete" on public.published_sites;
create policy "published owner delete" on public.published_sites
  for delete using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- versions (project history)
-- ---------------------------------------------------------------------------
create table if not exists public.versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  number integer not null,
  kind text not null default 'auto',
  label text not null default 'Snapshot',
  summary text,
  files jsonb not null default '[]'::jsonb,
  created_by text not null default 'user',
  created_at timestamptz not null default now(),
  unique (project_id, number)
);

alter table public.versions enable row level security;

drop policy if exists "versions owner all" on public.versions;
create policy "versions owner all" on public.versions
  for all using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- test_runs
-- ---------------------------------------------------------------------------
create table if not exists public.test_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  kind text not null default 'static',
  status text not null default 'running',
  results jsonb,
  summary jsonb,
  created_at timestamptz not null default now()
);

alter table public.test_runs enable row level security;

drop policy if exists "test_runs owner all" on public.test_runs;
create policy "test_runs owner all" on public.test_runs
  for all using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- suggestions (AI / QA improvement center)
-- ---------------------------------------------------------------------------
create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  category text not null default 'code',
  severity text not null default 'info',
  title text not null,
  detail text,
  fix jsonb,
  source text not null default 'check',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table public.suggestions enable row level security;

drop policy if exists "suggestions owner all" on public.suggestions;
create policy "suggestions owner all" on public.suggestions
  for all using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- agent_runs
-- ---------------------------------------------------------------------------
create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  kind text not null default 'chat',
  prompt text not null default '',
  status text not null default 'running',
  messages jsonb not null default '[]'::jsonb,
  files_changed jsonb,
  result jsonb,
  created_at timestamptz not null default now()
);

alter table public.agent_runs enable row level security;

drop policy if exists "agent_runs owner all" on public.agent_runs;
create policy "agent_runs owner all" on public.agent_runs
  for all using (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- agent_settings (per-user AI preferences + permissions)
-- ---------------------------------------------------------------------------
create table if not exists public.agent_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  provider text not null default 'openrouter',
  model text,
  permissions jsonb not null default '{"read":true,"edit":true,"runTests":true,"deleteFiles":"ask","deploy":"ask"}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.agent_settings enable row level security;

drop policy if exists "agent_settings owner all" on public.agent_settings;
create policy "agent_settings owner all" on public.agent_settings
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- ai_credentials (encrypted provider keys)
-- ---------------------------------------------------------------------------
create table if not exists public.ai_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null,
  label text,
  encrypted_key text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

alter table public.ai_credentials enable row level security;

drop policy if exists "ai_credentials owner all" on public.ai_credentials;
create policy "ai_credentials owner all" on public.ai_credentials
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- analytics_events (anonymous beacon)
-- ---------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  site_code text not null,
  path text not null default '/',
  device text not null default 'unknown',
  referrer text not null default '',
  ua text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists analytics_site_idx on public.analytics_events (site_code, created_at desc);

alter table public.analytics_events enable row level security;

-- anonymous insert (the beacon route rate-limits and validates the code first)
drop policy if exists "analytics anon insert" on public.analytics_events;
create policy "analytics anon insert" on public.analytics_events
  for insert with check (true);
-- owners can read their own site's events (via their deployments)
drop policy if exists "analytics owner select" on public.analytics_events;
create policy "analytics owner select" on public.analytics_events
  for select using (
    exists (
      select 1
      from public.projects p
      join public.deployments d on d.project_id = p.id
      where d.code = site_code and p.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Storage: assets (private, owner-only) and publish (public read)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('assets', 'assets', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('publish', 'publish', true)
on conflict (id) do nothing;

-- assets: object paths are {projectId}/{...} — owner is whoever owns that project
drop policy if exists "assets owner select" on storage.objects;
create policy "assets owner select" on storage.objects
  for select using (
    bucket_id = 'assets' and exists (
      select 1 from public.projects p
      where p.id::text = (storage.foldername(name))[1]
        and p.owner_id = auth.uid()
    )
  );

drop policy if exists "assets owner insert" on storage.objects;
create policy "assets owner insert" on storage.objects
  for insert with check (
    bucket_id = 'assets' and exists (
      select 1 from public.projects p
      where p.id::text = (storage.foldername(name))[1]
        and p.owner_id = auth.uid()
    )
  );

drop policy if exists "assets owner update" on storage.objects;
create policy "assets owner update" on storage.objects
  for update using (
    bucket_id = 'assets' and exists (
      select 1 from public.projects p
      where p.id::text = (storage.foldername(name))[1]
        and p.owner_id = auth.uid()
    )
  );

drop policy if exists "assets owner delete" on storage.objects;
create policy "assets owner delete" on storage.objects
  for delete using (
    bucket_id = 'assets' and exists (
      select 1 from public.projects p
      where p.id::text = (storage.foldername(name))[1]
        and p.owner_id = auth.uid()
    )
  );

-- publish: any signed-in user may upload (deploy route uploads with the user session); world can read
drop policy if exists "publish public read" on storage.objects;
create policy "publish public read" on storage.objects
  for select using (bucket_id = 'publish');

drop policy if exists "publish authed insert" on storage.objects;
create policy "publish authed insert" on storage.objects
  for insert with check (bucket_id = 'publish' and auth.role() = 'authenticated');

drop policy if exists "publish authed update" on storage.objects;
create policy "publish authed update" on storage.objects
  for update using (bucket_id = 'publish' and auth.role() = 'authenticated');

drop policy if exists "publish authed delete" on storage.objects;
create policy "publish authed delete" on storage.objects
  for delete using (bucket_id = 'publish' and auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Grants (least privilege; row-level security is the enforcement layer)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
-- anon: read published sites; insert anonymous analytics beacons
-- (RLS restricts these to the intended rows/tables)
grant select on public.published_sites to anon;
grant select, insert on public.analytics_events to anon;
-- authenticated: standard CRUD on all tables (RLS scopes to owned rows)
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
