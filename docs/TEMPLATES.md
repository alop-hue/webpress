# Templates

The template library powers the "New site" wizard (`components/new-project.tsx`
→ `POST /api/projects`). Each template is a **complete, editable project**: a
set of real files plus page metadata.

## Registry

- `lib/templates/index.ts` — imports all template modules and exports the
  unified `TEMPLATES` array (id, name, category, description, files, pages).
- `lib/templates/personal-templates.ts` — Link-in-Bio, Personal Resume, AI Chatbot
- `lib/templates/business-templates.ts` — Restaurant, Agency, Store
- `lib/templates/content-templates.ts` — Blog, Documentation, Startup

`GET /api/templates` serves the public catalog (used by the wizard and by AI
generation hints).

## Template shape

```ts
interface TemplateDef {
  id: string;            // url-safe unique id, e.g. "restaurant"
  name: string;          // display name
  category: string;      // personal | business | landing | content | portfolio | …
  description: string;
  files: FileEntry[];    // real files: index.html, css/style.css, js/app.js, …
  pages: PageMeta[];     // path, title, description, og_image
}
```

## Adding a template

1. Create a new module (or extend an existing one) in `lib/templates/` with a
   `TemplateDef`.
2. Export it from `lib/templates/index.ts` and add it to `TEMPLATES`.
3. Optionally register a thumbnail/icon in `components/new-project.tsx`.
4. Run `pnpm test` — `tests/unit/templates.test.ts` asserts **every declared
   page of every template actually builds** (this catches malformed HTML that
   would silently drop pages at publish time).

## Authoring rules (important)

- Every page must be a **complete standalone document**: `<!DOCTYPE html>`,
  `<html lang>`, `<head>` (charset + viewport + title), `<body>`.
- Deriving sub-pages by string surgery on another page is fragile — prefer
  writing each page fully (see the restaurant `menu.html`).
- Internal links should use bare file names (`menu.html`, `about.html`,
  `index.html` = home). The build rewrites them to absolute public paths.
- Keep CSS in a real `css/` file and JS in `js/` — they are inlined at build
  and shipped in the export.
