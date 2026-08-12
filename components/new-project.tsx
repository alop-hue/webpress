"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/http";
import { Button, Input, Textarea, Spinner, Badge } from "@/components/ui";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  pages: number;
}

export default function NewProjectPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[] | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState<string>(params.get("blank") ? "blank" : "");
  const [busy, setBusy] = useState(false);

  const templateRef = useRef(template);
  templateRef.current = template;

  useEffect(() => {
    api<{ templates: Template[] }>("/api/templates")
      .then((r) => {
        setTemplates(r.templates);
        // only auto-select when the user hasn't already picked one (a slow fetch
        // must not clobber a deliberate selection)
        if (!params.get("blank") && r.templates.length && !templateRef.current) {
          setTemplate(r.templates[0].id);
        }
      })
      .catch(() => setTemplates([]));
  }, []);

  const create = async () => {
    if (!name.trim()) {
      toast("Give your site a name", "bad");
      return;
    }
    setBusy(true);
    try {
      const res = await api<{ project: { id: string } }>("/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), template, description }),
      });
      toast("Site created", "ok");
      router.push(`/editor/${res.project.id}`);
    } catch (e: any) {
      toast(e?.message ?? "Could not create site", "bad");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <button onClick={() => router.push("/projects")} className="mb-6 cursor-pointer text-[12.5px] font-medium text-ink-muted hover:text-ink">
        ← All sites
      </button>
      <h1 className="text-2xl font-semibold tracking-tight">Create a new site</h1>
      <p className="mt-1 text-[13.5px] text-ink-muted">Start from a template or a blank canvas — everything stays editable.</p>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-muted">Name</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. My Studio" autoFocus />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-muted">Description (optional)</span>
          <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this site about?" />
        </label>

        <div>
          <span className="mb-2 block text-[12.5px] font-semibold text-ink-muted">Template</span>
          {!templates ? (
            <div className="flex items-center gap-2 text-ink-muted"><Spinner className="size-4" /> Loading templates…</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <TemplateCard
                selected={template === "blank"}
                onSelect={() => setTemplate("blank")}
                name="Blank"
                category="Start fresh"
                description="An empty page and your own imagination. Best for full control."
                icon="📄"
              />
              {templates.map((t) => (
                <TemplateCard
                  key={t.id}
                  selected={template === t.id}
                  onSelect={() => setTemplate(t.id)}
                  name={t.name}
                  category={t.category}
                  description={t.description}
                  tags={t.tags}
                  icon={templateIcon(t.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="primary" size="lg" onClick={create} loading={busy}>
            Create site
          </Button>
        </div>
        <p className="text-[12px] text-ink-muted">
          Tip: you can ask the AI to build your pages right after creating the site.
        </p>
      </div>
    </div>
  );
}

function templateIcon(id: string): string {
  const map: Record<string, string> = {
    saas: "🚀",
    portfolio: "🎨",
    linktree: "🔗",
    personal: "👤",
    chatbot: "🤖",
    restaurant: "🍽️",
    agency: "🏢",
    store: "🛍️",
    blog: "📝",
    docs: "📚",
    startup: "⚡",
  };
  return map[id] ?? "🌐";
}

function TemplateCard({
  selected,
  onSelect,
  name,
  category,
  description,
  tags,
  icon,
}: {
  selected: boolean;
  onSelect: () => void;
  name: string;
  category: string;
  description: string;
  tags?: string[];
  icon: string;
}) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group cursor-pointer rounded-2xl border bg-surface p-4 text-left transition-all",
        selected ? "border-accent ring-2 ring-accent/25" : "border-line hover:border-accent/40"
      )}
    >
      <div className="mb-3 flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-accent-soft to-black/[.03] text-3xl dark:to-white/[.06]">
        {icon}
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold">{name}</h3>
        {selected && <span className="text-accent">✓</span>}
      </div>
      <p className="mt-0.5 text-[11.5px] font-medium uppercase tracking-wide text-ink-muted">{category}</p>
      <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-muted">{description}</p>
      {tags && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((t) => (
            <Badge key={t} tone="neutral">{t}</Badge>
          ))}
        </div>
      )}
    </button>
  );
}