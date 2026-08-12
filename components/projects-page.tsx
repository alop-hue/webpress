/**
 * Projects dashboard UI: create, open, delete.
 */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { api } from "@/lib/http";
import { EmptyState, Button, Skeleton } from "@/components/ui";
import {
  Rocket,
  Palette,
  FileText,
  Sprout,
  Plus,
  LogOut,
  Link as LinkIcon,
  User,
  Bot,
  UtensilsCrossed,
  Building2,
  ShoppingBag,
  PenLine,
  BookOpen,
  Zap,
  Globe,
} from "lucide-react";
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
              className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
            >
              <LogOut size={14} strokeWidth={1.8} /> Sign out
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
          <Button variant="primary" onClick={() => router.push("/projects/new")}>
            <Plus size={15} strokeWidth={2} /> New site
          </Button>
        </div>

        {error && projects === null && (
          <div className="rounded-xl border border-bad/30 bg-bad/10 px-4 py-3 text-[13px] text-bad">{error}</div>
        )}

        {projects?.length === 0 && (
          <EmptyState
            icon={<Sprout size={22} strokeWidth={1.7} />}
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
              <div className="mb-3 flex aspect-[16/9] items-center justify-center rounded-xl bg-gradient-to-br from-accent-soft to-black/[.03] text-accent dark:to-white/[.06]">
                {projectIcon(p.template)}
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-[14px] font-semibold">{p.name}</h3>
                {p.status === "published" && <span className="size-1.5 shrink-0 rounded-full bg-ok" title="Published" />}
              </div>
              <p className="mt-0.5 text-[12px] text-ink-muted">Edited {timeAgo(p.updated_at)}</p>
            </button>
          ))}
          {projects === null &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-line bg-surface p-4">
                <Skeleton className="mb-3 aspect-[16/9] w-full rounded-xl" />
                <Skeleton className="mb-2 h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}

function projectIcon(template: string): React.ReactNode {
  const map: Record<string, React.ReactNode> = {
    saas: <Rocket size={26} strokeWidth={1.6} />,
    portfolio: <Palette size={26} strokeWidth={1.6} />,
    linktree: <LinkIcon size={26} strokeWidth={1.6} />,
    personal: <User size={26} strokeWidth={1.6} />,
    chatbot: <Bot size={26} strokeWidth={1.6} />,
    restaurant: <UtensilsCrossed size={26} strokeWidth={1.6} />,
    agency: <Building2 size={26} strokeWidth={1.6} />,
    store: <ShoppingBag size={26} strokeWidth={1.6} />,
    blog: <PenLine size={26} strokeWidth={1.6} />,
    docs: <BookOpen size={26} strokeWidth={1.6} />,
    startup: <Zap size={26} strokeWidth={1.6} />,
  };
  return map[template] ?? <Globe size={26} strokeWidth={1.6} />;
}