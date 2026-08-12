/**
 * Projects dashboard UI: create, open, delete.
 */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { api } from "@/lib/http";
import { EmptyState, Button, Spinner } from "@/components/ui";
import { useToast } from "@/components/toast";
import { timeAgo } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  template: string;
  status: string;
  updated_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const load = async () => {
    try {
      setError("");
      const res = await api<{ projects: Project[] }>("/api/projects");
      setProjects(res.projects);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load projects");
      setProjects([]);
      toast(e?.message ?? "Failed to load projects", "bad");
    }
  };
  useEffect(() => {
    load();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-accent text-[13px] font-bold text-white">W</div>
            <span className="text-[14px] font-semibold tracking-tight">Webpress</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={signOut}
              className="cursor-pointer text-[12.5px] font-medium text-ink-muted hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your sites</h1>
            <p className="mt-1 text-[13.5px] text-ink-muted">Create, edit, publish. Your files, your code, forever.</p>
          </div>
          <Button variant="primary" onClick={() => router.push("/projects/new")}>New site</Button>
        </div>

        {error && projects === null && (
          <div className="rounded-xl border border-bad/30 bg-bad/10 px-4 py-3 text-[13px] text-bad">{error}</div>
        )}

        {projects?.length === 0 && (
          <EmptyState
            icon="🌱"
            title="Your website starts here"
            body="Start from a template, a blank canvas, or let the AI build the first version for you."
            actions={
              <>
                <Button variant="primary" onClick={() => router.push("/projects/new")}>Create from template</Button>
                <Button onClick={() => router.push("/projects/new?blank=1")}>Blank project</Button>
              </>
            }
          />
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((p) => (
            <button
              key={p.id}
              onClick={() => router.push(`/editor/${p.id}`)}
              className="group cursor-pointer rounded-2xl border border-line bg-surface p-4 text-left transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-black/5"
            >
              <div className="mb-3 flex aspect-[16/9] items-center justify-center rounded-xl bg-gradient-to-br from-accent-soft to-black/[.03] dark:to-white/[.06] text-[28px]">
                {p.template === "saas" ? "🚀" : p.template === "portfolio" ? "🎨" : "📄"}
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-[14px] font-semibold">{p.name}</h3>
                {p.status === "published" && <span className="size-1.5 shrink-0 rounded-full bg-ok" title="Published" />}
              </div>
              <p className="mt-0.5 text-[12px] text-ink-muted">Edited {timeAgo(p.updated_at)}</p>
            </button>
          ))}
          {projects === null && (
            <div className="col-span-full flex items-center justify-center gap-2 py-20 text-ink-muted">
              <Spinner /> Loading your sites…
            </div>
          )}
        </div>
      </main>
    </div>
  );
}