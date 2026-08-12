# AGENTS.md

Guidelines for AI agents (and humans) working in this repository.

## Project

Next.js 16 App Router + TypeScript + Tailwind CSS website builder ("Webpress"). Backend is Supabase (Postgres, Auth, Storage). See `README.md` for product overview.

## Commands

```bash
pnpm typecheck   # MUST pass before finishing any change
pnpm test        # unit tests (Vitest) — run before finishing
pnpm test:e2e    # full journey E2E (needs dev server on :3000)
pnpm dev         # dev server
```

## Structure

- `app/` — Next.js routes. `app/api/` are route handlers; `app/p/[code]/` are public published sites.
- `components/editor/` — the editor UI (workspace shell, visual canvas, CodeMirror, sidebar panels, AI panel).
- `lib/editor/` — pure logic: file system helpers (`fs.ts`), HTML build (`build.ts`), styling rules (`styling.ts`), components (`components.ts`), canvas agent source (`canvas-agent.ts`), diffing (`diff.ts`).
- `lib/qa/` — static checks (`static.ts`), browser QA (`playwright.ts`), snapshot loader (`runner.ts`).
- `lib/ai/` — AI providers and the agent loop.
- `tests/unit/` — Vitest unit tests; `tests/e2e/` — Playwright journey.

## Conventions

- **Type safety:** all API payloads and editor state are typed. Run `pnpm typecheck` after every change.
- **Server vs client:** route handlers use `import "server-only"` and `createClient()` from `@/lib/supabase/server` (await it — Next 15+ async cookies). Browser code uses `@/lib/supabase/client`.
- **Errors:** throw `AppError(message, code, status?, details?)` in handlers; respond via `errorResponse(e)`. Client panels surface `e.message`.
- **Editor state:** Zustand store at `components/editor/store.ts`. `setFileContent` marks files dirty; autosave flushes dirty paths to `/api/projects/[id]/files`.
- **Visual canvas:** built from the project's real HTML via `buildSrcdoc` (inlines project CSS/JS so relative assets resolve inside the iframe). Mutations post back as `wp.*` messages and are serialized into the file. Never leave the canvas out of sync with the code.
- **Hydration (`refresh` in `EditorWorkspace`):** uses `Promise.allSettled` so one failing endpoint doesn't blank the editor; locally-dirty files are never overwritten by server state.
- **Deploys:** quality gate in `lib/qa/static.ts` blocks on `error`-severity checks unless overridden. Keep checks honest — no fake passes.
- **Security:** never execute user HTML/JS server-side; browser QA runs in isolated Playwright instances. Keep published pages free of editor chrome.
- **Tests:** unit tests cover `fs`, `build`, `styling`, `components`, `diff`, `security`, `templates`, `qa-static`. The E2E journey covers signup → create → edit → publish → public URL → export.
- **Minimalism:** make the smallest change that solves the problem. Reuse `lib/editor/*` helpers instead of duplicating logic.

## Do not

- Add mock/fake implementations of real features (deploys, tests, AI).
- Store whole project state in one giant blob — use the normalized tables.
- Overwrite user files silently. Preserve custom code; show diffs before AI applies changes.
