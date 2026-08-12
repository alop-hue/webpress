/**
 * Toast notifications + ToastProvider (mounted in the root layout).
 */
"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Toast = { id: number; text: string; tone?: "ok" | "bad" | "accent" };

const ToastCtx = createContext<{ toast: (text: string, tone?: Toast["tone"]) => void }>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const toast = useCallback((text: string, tone: Toast["tone"] = "accent") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);
  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "wp-pop pointer-events-auto max-w-md rounded-xl border border-line bg-surface px-4 py-2.5 text-[13px] font-medium shadow-xl",
              t.tone === "ok" && "text-ok",
              t.tone === "bad" && "text-bad",
              t.tone === "accent" && "text-ink"
            )}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}