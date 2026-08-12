# Editor

The editor lives at `/editor/[id]` and is assembled by
`components/editor/EditorWorkspace.tsx`. It has three modes — **Visual**,
**Code**, and **Preview** — plus a left sidebar (pages/components/assets/files/
history/tests/deploy/settings/analytics) and a right panel (properties or AI).

## State

`components/editor/store.ts` is a Zustand store (`useEditor`) holding the whole
workspace: `files`, `pages`, `components`, `assets`, `deployments`, `versions`,
`suggestions`, current `mode`, `breakpoint`, open code tabs, `dirty` map,
selection, and style rules. The store is the single source of truth for the UI;
the canvas agent and panels read/write it.

## Visual mode

`VisualCanvas.tsx` renders the current HTML file into a sandboxed
`<iframe srcdoc>` (no `allow-same-origin`, so project scripts cannot touch the
editor UI). Before rendering, `lib/editor/canvas-agent.ts`'s
`buildSrcdoc`/`inlineProjectAssets` inline relative CSS/JS from the project and
inject the **canvas agent** script.

The canvas agent (embedded in `canvas-agent.ts`) makes the document editable:

- **Selection** — click to select (`data-wp-el` uids, hover/selection outlines).
- **Inline text editing** — double-click (or two quick clicks) text elements;
  Enter/Escape commit and the new text is posted back to the host.
- **Structural ops** — delete, duplicate, move up/down (arrow keys or RPC),
  insert HTML, replace HTML — executed directly in the DOM, then the host
  serializes the document and autosaves.
- **Styling bridge** — the host sends style rules; the agent writes them into
  `<style id="wp-el-styles">` in the document head.
- **RPC** — the host calls methods (`select`, `set-style`, `get-tree`, …) over
  `postMessage` (`wp.rpc` / `wp.rpc-res`), with a `wp.ready` handshake.

The host watches `wp.*` events, applies them to `useEditor`, and on any DOM
mutation calls `onNeedsSave(doc)` which updates the file and marks it dirty —
autosave flushes to `/api/projects/[id]/files` after a short debounce.

### Styling system (`lib/editor/styling.ts`)

Visual style edits are **class-based**: each styled element is tagged
`data-wp-el="<uid>"` and the host stores style rules
`{ uid, bp: base|tablet|mobile, prop, value }`. `cssForRules` compiles them to
`.wp-el-<uid> { … }` selectors with `@media` wrappers for the tablet/mobile
breakpoints. Because the CSS lives in the document head, it survives code-mode
edits and stays cascade-friendly. `PropsPanel.tsx` offers contextual controls
(text, link, style, spacing, typography, layout, responsive, actions) that
target the current selection.

### Breakpoints

Desktop / Tablet / Mobile switch the iframe width and the active breakpoint.
Style rules recorded under a breakpoint only apply within its media range, so
per-device overrides are generated automatically without media queries in the
user's CSS.

## Code mode

`CodeEditor.tsx` wraps CodeMirror 6 with the extension bundle in
`lib/editor/cm-setup.ts` (line numbers, folding, autocompletion, bracket
matching, search/highlight, rectangular selection). Files open in tabs; a dirty
dot marks unsaved files; Ctrl/Cmd+S and autosave flush to the files API. The
`dirty` map in the store is what keeps the visual canvas and code editor
mutually consistent: whichever mode edited last wins until the file is saved.

## Preview mode

`PreviewPane.tsx` renders the current page in an iframe with no canvas agent —
a clean look at the real site.

## Undo / history

- **Visual undo** (Ctrl/Cmd+Z in visual mode): `EditorWorkspace` keeps a stack
  of `{path, doc}` snapshots (coalesced within 500 ms) and restores the
  previous document into the store.
- **Version history**: the `HistoryPanel` lists `versions` snapshots; a restore
  writes the snapshot's files back (see `/versions/restore`). Agent operations
  create labeled versions (`kind: agent`) so they can be rolled back as a unit.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘/Ctrl K` | Command palette |
| `⌘/Ctrl S` | Save now |
| `⌘/Ctrl Z` | Undo (visual mode) |
| `⌘/Ctrl 1/2/3` | Visual / Code / Preview |
| `Delete` / arrows | Remove / move selection (visual) |
