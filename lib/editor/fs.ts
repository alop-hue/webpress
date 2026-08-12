export interface FileEntry {
  path: string; // normalized, no leading slash: "index.html", "css/style.css", "assets/"
  content: string;
  kind: "file" | "folder";
  mime?: string;
}

export function normalizePath(p: string): string {
  return p
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "");
}

export function dirname(p: string): string {
  const n = normalizePath(p);
  const i = n.lastIndexOf("/");
  return i === -1 ? "" : n.slice(0, i);
}

export function basename(p: string): string {
  const n = normalizePath(p);
  const i = n.lastIndexOf("/");
  return i === -1 ? n : n.slice(i + 1);
}

export function extname(p: string): string {
  const b = basename(p);
  const i = b.lastIndexOf(".");
  return i === -1 ? "" : b.slice(i + 1).toLowerCase();
}

export function joinPath(...parts: string[]): string {
  return normalizePath(parts.filter(Boolean).join("/"));
}

export function pathToPage(path: string): string {
  // index.html -> /   about.html -> /about
  const n = normalizePath(path);
  if (!n.endsWith(".html")) return "";
  const base = n.slice(0, -5);
  if (base === "index") return "/";
  if (base.endsWith("/index")) return "/" + base.slice(0, -6);
  return "/" + base;
}

export function pageToPath(page: string): string {
  const p = page === "/" ? "index.html" : normalizePath(page).replace(/\.html$/, "") + ".html";
  return p;
}

export function createFolderEntries(files: FileEntry[]): FileEntry[] {
  const dirs = new Map<string, FileEntry>();
  for (const f of files) {
    let d = dirname(f.path);
    while (d) {
      if (!dirs.has(d)) dirs.set(d, { path: d, content: "", kind: "folder" });
      d = dirname(d);
    }
  }
  return [...dirs.values()];
}

export interface TreeNode {
  path: string;
  name: string;
  kind: "file" | "folder";
  children: TreeNode[];
}

export function buildTree(files: FileEntry[]): TreeNode[] {
  const root: TreeNode[] = [];
  const map = new Map<string, TreeNode>();
  const all = [
    ...createFolderEntries(files),
    ...files.filter((f) => f.kind === "file"),
  ].sort((a, b) => {
    const da = a.kind === "folder" ? 0 : 1;
    const db = b.kind === "folder" ? 0 : 1;
    if (da !== db) return da - db;
    return a.path.localeCompare(b.path);
  });

  for (const f of all) {
    const node: TreeNode = {
      path: f.path,
      name: basename(f.path) || f.path,
      kind: f.kind,
      children: [],
    };
    map.set(f.path, node);
    const parent = dirname(f.path);
    if (!parent) root.push(node);
    else {
      const p = map.get(parent);
      if (p && p.kind === "folder") p.children.push(node);
      else root.push(node);
    }
  }
  return root;
}

export function isPageFile(path: string): boolean {
  const e = extname(path);
  return e === "html" && !path.startsWith("components/");
}

export function isInside(path: string, folder: string): boolean {
  const n = normalizePath(folder);
  if (!n) return true;
  return normalizePath(path) === n || normalizePath(path).startsWith(n + "/");
}

export function validatePath(p: string): string | null {
  if (!p || p.length > 200) return "Invalid path";
  if (p.includes("..") || p.includes("//") || p.startsWith("/"))
    return "Invalid path";
  if (/[<>:"|?*\u0000-\u001f]/.test(p)) return "Invalid characters in path";
  return null;
}