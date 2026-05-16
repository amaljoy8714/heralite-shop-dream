import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/login")({
  validateSearch: (s) => ({ redirect: (s.redirect as string) || "/" }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: search.redirect });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") {
      const parsed = z.object({ email: z.string().email() }).safeParse({ email });
      if (!parsed.success) { toast.error("Enter a valid email"); return; }
      setBusy(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent! Check your email.");
        setMode("signin");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to send reset link");
      } finally { setBusy(false); }
      return;
    }
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6, "Min 6 chars"),
      name: mode === "signup" ? z.string().min(2).max(60) : z.string().optional(),
    });
    const parsed = schema.safeParse({ email, password, name });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name },
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: search.redirect });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + search.redirect,
    });
    if (result.error) {
      toast.error(result.error.message);
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: search.redirect });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary/40 via-background to-accent/30 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <BrandLogo className="h-10 w-10" />
          <span className="font-display text-2xl font-bold"><span className="text-[var(--primary-deep)]">Hera</span><span className="text-primary">Lite</span></span>
        </Link>
        <h1 className="text-center font-display text-2xl font-bold">
          {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to track orders & shop faster"
            : mode === "signup"
              ? "Join HeraLite for a personalized shopping experience"
              : "Enter your email and we'll send you a reset link"}
        </p>

        {mode !== "forgot" && (
          <>
            <button
              onClick={google}
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white py-2.5 text-sm font-semibold transition hover:bg-secondary disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={submit} className={`space-y-3 ${mode === "forgot" ? "mt-6" : ""}`}>
          {mode === "signup" && (
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          )}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          {mode !== "forgot" && (
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 chars)"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          )}
          {mode === "signin" && (
            <div className="text-right">
              <button type="button" onClick={() => setMode("forgot")} className="text-xs font-semibold text-primary hover:underline">
                Forgot password?
              </button>
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-[var(--primary-deep)] py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "signin" && (
            <>New here? <button onClick={() => setMode("signup")} className="font-semibold text-primary hover:underline">Create an account</button></>
          )}
          {mode === "signup" && (
            <>Already have an account? <button onClick={() => setMode("signin")} className="font-semibold text-primary hover:underline">Sign in</button></>
          )}
          {mode === "forgot" && (
            <>Remembered it? <button onClick={() => setMode("signin")} className="font-semibold text-primary hover:underline">Back to sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
