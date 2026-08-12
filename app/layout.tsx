import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: { default: "Webpress — the modern WordPress alternative", template: "%s · Webpress" },
  description:
    "Create, edit, and publish websites with a visual editor, real code, AI agents, and one-click publishing. No lock-in: export your files and take them anywhere.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}