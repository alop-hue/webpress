"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type BtnVariant = "primary" | "ghost" | "outline" | "danger" | "subtle";
type BtnSize = "sm" | "md" | "lg" | "icon";

const variants: Record<BtnVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-strong",
  ghost: "text-ink-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/10",
  outline: "border border-line bg-surface hover:bg-black/[.03] dark:hover:bg-white/5 text-ink",
  danger: "bg-bad/10 text-bad hover:bg-bad/20",
  subtle: "bg-black/[.04] dark:bg-white/[.07] text-ink hover:bg-black/[.08] dark:hover:bg-white/[.12]",
};
const sizes: Record<BtnSize, string> = {
  sm: "h-7 px-2.5 text-[12.5px] gap-1.5 rounded-md",
  md: "h-8.5 px-3.5 text-[13px] gap-2 rounded-lg",
  lg: "h-10 px-5 text-sm gap-2 rounded-lg",
  icon: "h-8 w-8 rounded-lg",
};

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize; loading?: boolean }
>(function Button({ className, variant = "outline", size = "md", loading, children, disabled, ...rest }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium whitespace-nowrap select-none transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {loading && <Spinner className="size-3.5" />}
      {children}
    </button>
  );
});

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("wp-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".2" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-8.5 w-full rounded-lg border border-line bg-surface px-3 text-[13px] text-ink placeholder:text-ink-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 transition-colors",
          className
        )}
        {...rest}
      />
    );
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-line bg-surface px-3 py-2 text-[13px] text-ink placeholder:text-ink-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 transition-colors resize-y",
          className
        )}
        {...rest}
      />
    );
  }
);

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "h-8.5 w-full rounded-lg border border-line bg-surface px-2.5 text-[13px] text-ink focus:border-accent focus:outline-none transition-colors cursor-pointer",
          className
        )}
        {...rest}
      >
        {children}
      </select>
    );
  }
);

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "accent" | "ok" | "warn" | "bad";
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: "bg-black/[.06] dark:bg-white/10 text-ink-muted",
    accent: "bg-accent-soft text-accent",
    ok: "bg-ok/15 text-[color:var(--success)]",
    warn: "bg-warn/15 text-[color:var(--warning)]",
    bad: "bg-bad/15 text-bad",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer",
        checked ? "bg-accent" : "bg-black/15 dark:bg-white/20"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-4 rounded-full bg-white shadow transition-all",
          checked ? "left-[18px]" : "left-0.5"
        )}
      />
    </button>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[10.5px] text-ink-muted shadow-[0_1px_0_var(--border)]">
      {children}
    </kbd>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  actions,
}: {
  icon?: string;
  title: string;
  body?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center wp-fade">
      {icon && <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-xl">{icon}</div>}
      <h3 className="text-[15px] font-semibold">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-ink-muted">{body}</p>}
      {actions && <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
    </div>
  );
}