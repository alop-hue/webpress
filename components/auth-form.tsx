"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/toast";

function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || email.split("@")[0] } },
        });
        if (error) throw error;
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
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-white">W</div>
          <h1 className="text-xl font-semibold tracking-tight">Webpress</h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            {mode === "login" ? "Welcome back. Continue building." : "Create websites. Own the code. Publish in one click."}
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          )}
          <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <Input type="password" required minLength={8} placeholder="Password (min 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} />
          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-[12.5px] text-ink-muted">
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