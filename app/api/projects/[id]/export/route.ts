/**
 * Downloads the whole project as a zip of its real files.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthedProject } from "@/lib/api/guard";
import { AppError, errorResponse } from "@/lib/errors";
import { zipSync, strToU8, type Zippable } from "fflate";
import { basename } from "@/lib/editor/fs";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const { project } = await getAuthedProject(id);
    const supabase = await createClient();
    const { data: files } = await supabase
      .from("project_files")
      .select("path,content,kind")
      .eq("project_id", id)
      .eq("kind", "file");
    const { data: assets } = await supabase.from("assets").select("path,name").eq("project_id", id);

    const entries: Zippable = {};
    const push = (p: string, content: Uint8Array) => {
      entries[p] = content;
    };
    for (const f of files ?? []) {
      push(f.path, strToU8(f.content));
    }
    // pull binary assets from storage into the zip
    for (const a of assets ?? []) {
      const { data: blob, error } = await supabase.storage
        .from("assets")
        .download(`${id}/${a.path}`);
      if (blob) push(`assets/${a.path}`, new Uint8Array(await blob.arrayBuffer()));
    }

    const slug = (project.slug || "my-website").replace(/[^a-z0-9_-]/gi, "-");
    push(
      "package.json",
      strToU8(
        JSON.stringify(
          {
            name: slug,
            version: "1.0.0",
            private: true,
            description: `Static site exported from Webpress (${project.name})`,
            scripts: { start: "npx serve ." },
          },
          null,
          2
        )
      )
    );
    push(
      "README.md",
      strToU8(
        `# ${project.name}\n\nExported from Webpress — a fully static site. No build step needed.\n\n- \`index.html\` — home page\n- \`css/\`, \`js/\` — shared styles & scripts\n- \`assets/\` — images and media\n\nServe locally: \`npm start\` or any static server (e.g. \`python3 -m http.server\`).\nDeploy anywhere static hosting is supported (Vercel, Netlify, GitHub Pages, S3).\n`
      )
    );

    const zip = zipSync(entries, { level: 6 });
    const name = encodeURIComponent(slug);
    return new Response(zip, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${name}-export.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}