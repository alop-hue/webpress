/**
 * Root layout: global fonts, theme provider, and the toast provider (mounted here so toasts work on every page).
 */
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  title: { default: "Webpress — the modern WordPress alternative", template: "%s · Webpress" },
  description:
    "Create, edit, and publish websites with a visual editor, real code, AI agents, and one-click publishing. No lock-in: export your files and take them anywhere.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}