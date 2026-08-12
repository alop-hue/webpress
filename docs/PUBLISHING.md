# Publishing

## The publish pipeline (`POST /api/projects/[id]/deploy`)

1. **Quality gate** — `runStaticChecks` runs over the project. Errors block
   publish unless the user chooses "Publish anyway" (`overrideWarnings`).
2. **Build** — `lib/editor/build.ts`:
   - Parses every `*.html` page and injects `<title>`, meta description,
     Open Graph + Twitter tags, canonical URL, viewport, favicon, and any
     `customHead` settings.
   - **Inlines project CSS and JS** into the HTML (escaping `</script>` /
     `</style>` so user content can't break out). The export zip still ships
     the real files.
   - **Rewrites internal links** to absolute `/p/{code}/…` paths. The home page
     is served without a trailing slash, so bare `menu.html` would otherwise
     resolve against `/p/` and 404. `index.html` means the site root; `../`
     and nested routes resolve correctly.
   - Generates `sitemap.xml` and `robots.txt`.
3. **Archive** — the built pages + remaining files are zipped (fflate) and
   uploaded to the `publish` storage bucket at `sites/{code}/site.zip`.
4. **Atomic snapshot** — the built `pages`, asset URLs, settings and check
   summary are upserted into `published_sites` keyed by the stable short
   `code` (6 chars from a collision-resistant alphabet; reused across
   redeploys so the public URL never changes).
5. **Live** — the deployment row is marked `live` with its URL and the project
   status becomes `published`.

## Public sites (`/p/[code]`)

- `app/p/[code]/page.tsx` and `app/p/[code]/[...slug]/page.tsx` look up the
  published snapshot by code (public RLS select), pick the matching route, and
  render the stored HTML **as-is** — a normal static page with full SEO
  metadata, no login, no editor chrome.
- `generateMetadata` extracts the site's own `<title>`/description/OG/canonical
  from the HTML (`lib/published.ts`), so tabs and social cards match the site.
- `sitemap.xml` and `robots.txt` are served from the built artifacts.
- The optional analytics snippet (project setting) posts anonymous, rate-limited
  events to `/api/analytics/[code]`.

## Deploy dashboard

`DeployPanel.tsx` shows: live status, public URL (copy/open), last deployment
time, build/test summary, deployment history, **rollback** (promotes a previous
live snapshot back), **export** (downloads the full project zip from
`/api/projects/[id]/export`), and analytics (visits, devices, top paths).

## Export

`GET /api/projects/[id]/export` streams a zip of the project's real files
(`index.html`, `css/`, `js/`, assets…) — a complete, working static site the
user owns and can host anywhere.
