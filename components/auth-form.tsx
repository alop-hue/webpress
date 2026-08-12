/**
 * Sign in / sign up form wired to Supabase auth with actionable error messages.
 */
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/toast";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();

  const callbackError = params.get("error") === "invalid_token";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name || email.split("@")[0] },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        // If email confirmation is required, no session is returned yet.
        if (!data.session) {
          toast("Check your inbox — click the confirmation link to activate your account.", "ok");
          return;
        }
        toast("Account created — welcome to Webpress", "ok");
        router.push("/projects");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const next = params.get("next") || "/projects";
        router.push(next);
      }
      router.refresh();
    } catch (err: any) {
      // Surface a clear, actionable message instead of the raw Supabase error
      const code: string = err?.code ?? "";
      const msg =
        code === "invalid_credentials"
          ? mode === "signup"
            ? "An account with this email already exists — try signing in instead."
            : "Incorrect email or password — double-check both and try again."
          : code === "email_not_confirmed"
          ? "Please confirm your email first — check your inbox for the confirmation link."
          : code === "over_request_rate_limit"
          ? "Too many attempts — wait a minute and try again."
          : err?.message ?? "unknown error";
      toast(msg, "bad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-dvh items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(1100px 500px at 50% -10%, color-mix(in srgb, var(--accent) 9%, transparent), transparent), radial-gradient(700px 400px at 90% 110%, color-mix(in srgb, var(--accent) 5%, transparent), transparent)",
      }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-strong text-lg font-bold text-white shadow-lg shadow-accent/25">
            W
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Webpress</h1>
          <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-muted">
            {mode === "login" ? "Welcome back. Continue building." : "Create websites. Own the code."}
          </p>
        </div>

        {callbackError && mode === "login" && (
          <div className="mb-5 rounded-xl border border-bad/30 bg-bad/10 px-3 py-2.5 text-center text-[12.5px] text-bad">
            That confirmation link is invalid or has expired — try signing in, or create a new account.
          </div>
        )}

        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-line bg-surface/80 p-6 shadow-xl shadow-black/[.04] backdrop-blur">
          {mode === "signup" && (
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-medium text-ink-muted">Name</span>
              <input
                className="inp h-10"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-ink-muted">Email</span>
            <input
              className="inp h-10"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-ink-muted">Password</span>
            <div className="relative">
              <input
                className="inp h-10 pr-10"
                type={showPw ? "text" : "password"}
                required
                minLength={8}
                placeholder={mode === "login" ? "Your password" : "Min 8 characters"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                title={showPw ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-ink-muted/70 transition-colors hover:text-ink"
              >
                {showPw ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
              </button>
            </div>
          </label>
          <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-1 w-full">
            {mode === "login" ? "Sign in" : "Create account"}
            {!loading && <ArrowRight size={15} strokeWidth={2} />}
          </Button>
        </form>

        <p className="mt-5 text-center text-[12.5px] text-ink-muted">
          {mode === "login" ? (
            <>
              New to Webpress?{" "}
              <a href="/signup" className="font-semibold text-accent hover:underline">
                Create an account
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-accent hover:underline">
                Sign in
              </a>
            </>
          )}
        </p>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-muted/70">
          <Sparkles size={11} strokeWidth={2} />
          Visual editor · real code · AI agents · one-click publishing
        </p>
      </div>
    </div>
  );
}

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  return (
    <Suspense>
      <AuthForm mode={mode} />
    </Suspense>
  );
}
