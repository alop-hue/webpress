/**
 * Project settings: name, description, analytics toggle, danger zone.
 */
"use client";

import { useEffect, useState } from "react";
import { useEditor } from "../store";
import { useWorkspace } from "../workspace-context";
import { api } from "@/lib/http";
import { useToast } from "@/components/toast";
import { Button, Input, Select, Switch } from "@/components/ui";
import { ConfirmDialog } from "@/components/dialog";
import { useRouter } from "next/navigation";

interface AiSettings {
  settings: {
    provider: string;
    model: string;
    permissions: Record<string, unknown>;
  };
  providers: Array<{ id: string; label: string; defaultModel: string; configured: boolean }>;
}

export function SettingsPanel() {
  const project = useEditor((s) => s.project);
  const projectId = useEditor((s) => s.projectId);
  const ctx = useWorkspace();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState(project?.name ?? "");
  const [desc, setDesc] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [ai, setAi] = useState<AiSettings | null>(null);
  const [provider, setProvider] = useState("openrouter");
  const [model, setModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [perms, setPerms] = useState<Record<string, any>>({ read: true, edit: true, runTests: true, deleteFiles: "ask" });

  useEffect(() => {
    setName(project?.name ?? "");
    setDesc((project as any)?.description ?? "");
  }, [project]);

  useEffect(() => {
    api<AiSettings>("/api/ai-settings")
      .then((r) => {
        setAi(r);
        setProvider(r.settings.provider);
        setModel(r.settings.model);
        setPerms(r.settings.permissions ?? {});
      })
      .catch(() => {});
  }, []);

  const saveProject = async () => {
    try {
      await api(`/api/projects/${projectId}`, { method: "PATCH", body: JSON.stringify({ name: name.trim() || project?.name, description: desc }) });
      toast("Project saved", "ok");
      await ctx.refresh();
    } catch (e: any) {
      toast(e?.message ?? "Could not save", "bad");
    }
  };

  const saveAi = async () => {
    try {
      await api("/api/ai-settings", { method: "PUT", body: JSON.stringify({ provider, model, permissions: perms }) });
      toast("AI settings saved", "ok");
      setAi((a) => (a ? { ...a, settings: { ...a.settings, provider, model, permissions: perms } } : a));
    } catch (e: any) {
      toast(e?.message ?? "Could not save settings", "bad");
    }
  };

  const saveKey = async () => {
    if (!apiKey.trim()) {
      toast("Paste an API key first", "bad");
      return;
    }
    try {
      await api("/api/ai-settings", { method: "POST", body: JSON.stringify({ provider, key: apiKey.trim() }) });
      toast(`Key saved for ${provider} (encrypted)`, "ok");
      setApiKey("");
      const fresh = await api<AiSettings>("/api/ai-settings");
      setAi(fresh);
    } catch (e: any) {
      toast(e?.message ?? "Could not save key", "bad");
    }
  };

  const removeProject = async () => {
    try {
      await api(`/api/projects/${projectId}`, { method: "DELETE" });
      router.push("/projects");
    } catch (e: any) {
      toast(e?.message ?? "Could not delete", "bad");
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-line px-3 py-3.5">
      <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-3 py-2.5">
        <h2 className="text-[12px] font-semibold">Settings</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Section title="Site">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-ink-muted">Name</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={saveProject} />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-ink-muted">Description</span>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} onBlur={saveProject} rows={2}
              className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 text-[12px] text-ink outline-none focus:border-accent" />
          </label>
          <Button size="sm" onClick={ctx.exportProject}>⭳ Export project files</Button>
        </Section>

        <Section title="AI Agent">
          <p className="text-[11px] leading-relaxed text-ink-muted">
            The agent drafts changes to your files; you approve them before anything is applied. Keys are encrypted (AES-256-GCM) and never stored in your site files.
          </p>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-ink-muted">Provider</span>
            <Select value={provider} onChange={(e) => setProvider(e.target.value)}>
              {(ai?.providers ?? []).map((p) => (
                <option key={p.id} value={p.id}>{p.label}{p.configured ? " ✓" : ""}</option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-ink-muted">Model</span>
            <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder={(ai?.providers.find((p) => p.id === provider)?.defaultModel) ?? "default"} />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-ink-muted">API key ({provider})</span>
            <div className="flex gap-1.5">
              <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={ai?.providers.find((p) => p.id === provider)?.configured ? "Configured — paste to replace" : "sk-…"} />
              <Button size="sm" onClick={saveKey}>Save</Button>
            </div>
          </label>
          <div className="flex gap-1.5 pt-1">
            <Button size="sm" variant="primary" onClick={saveAi}>Save settings</Button>
          </div>
          <div className="space-y-2 rounded-lg border border-line p-2.5">
            <PermRow label="Read project files" checked={!!perms.read} onChange={(v) => setPerms((p) => ({ ...p, read: v }))} />
            <PermRow label="Edit files (drafted)" checked={!!perms.edit} onChange={(v) => setPerms((p) => ({ ...p, edit: v }))} />
            <PermRow label="Run tests" checked={!!perms.runTests} onChange={(v) => setPerms((p) => ({ ...p, runTests: v }))} />
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-ink-muted">Delete files</span>
              <Select
                className="h-7 w-24 text-[11px]"
                value={perms.deleteFiles === "allow" ? "allow" : "ask"}
                onChange={(e) => setPerms((p) => ({ ...p, deleteFiles: e.target.value }))}
              >
                <option value="ask">Ask</option>
                <option value="allow">Allow</option>
              </Select>
            </div>
          </div>
        </Section>

        <Section title="Danger zone">
          <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>Delete project</Button>
        </Section>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={removeProject}
        title="Delete project"
        body="This permanently deletes the project, its files, deployments and published site. This cannot be undone."
        confirmLabel="Delete forever"
        danger
      />
    </div>
  );
}

function PermRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11.5px] text-ink-muted">{label}</span>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
