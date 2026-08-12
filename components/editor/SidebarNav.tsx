"use client";

import { useEditor } from "./store";
import { cn } from "@/lib/utils";
import { PagesPanel } from "./panels/PagesPanel";
import { ComponentsPanel } from "./panels/ComponentsPanel";
import { AssetsPanel } from "./panels/AssetsPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { HistoryPanel } from "./panels/HistoryPanel";
import { TestsPanel } from "./panels/TestsPanel";
import { DeployPanel } from "./panels/DeployPanel";
import { SettingsPanel } from "./panels/SettingsPanel";
import { AnalyticsPanel } from "./panels/AnalyticsPanel";

const NAV = [
  { id: "pages", icon: "📄", label: "Pages" },
  { id: "components", icon: "🧩", label: "Components" },
  { id: "assets", icon: "🖼", label: "Assets" },
  { id: "files", icon: "📁", label: "Files" },
  { id: "history", icon: "🕘", label: "History" },
  { id: "tests", icon: "🧪", label: "Tests" },
  { id: "deploy", icon: "🚀", label: "Deploy" },
  { id: "analytics", icon: "📊", label: "Analytics" },
  { id: "settings", icon: "⚙️", label: "Settings" },
] as const;

const PANELS: Record<string, () => React.ReactElement> = {
  pages: () => <PagesPanel />,
  components: () => <ComponentsPanel />,
  assets: () => <AssetsPanel />,
  files: () => <FilesPanel />,
  history: () => <HistoryPanel />,
  tests: () => <TestsPanel />,
  deploy: () => <DeployPanel />,
  analytics: () => <AnalyticsPanel />,
  settings: () => <SettingsPanel />,
};

export function SidebarNav() {
  const leftNav = useEditor((s) => s.leftNav);
  const Active = PANELS[leftNav] ?? PANELS.pages;

  return (
    <aside className="hidden w-[252px] shrink-0 border-r border-line bg-surface lg:flex">
      <nav className="flex w-12 shrink-0 flex-col items-center border-r border-line py-2" aria-label="Editor sections">
        {NAV.map((n) => (
          <button
            key={n.id}
            title={n.label}
            aria-label={n.label}
            aria-current={leftNav === n.id}
            onClick={() => useEditor.setState({ leftNav: n.id })}
            className={cn(
              "relative my-0.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[15px] transition-all",
              leftNav === n.id
                ? "bg-accent-soft ring-1 ring-accent/30"
                : "opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
            )}
          >
            <span aria-hidden>{n.icon}</span>
            {leftNav === n.id && <span className="absolute -left-[7px] h-4 w-0.5 rounded-full bg-accent" />}
          </button>
        ))}
        <div className="mt-auto flex flex-col items-center gap-1 pb-1 text-[10px] text-ink-muted/50">
          <span title="Webpress">W</span>
        </div>
      </nav>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Active />
      </div>
    </aside>
  );
}
