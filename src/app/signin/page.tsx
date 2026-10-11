"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, KeyRound, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/fields";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter both your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your creative studio."
      footer={
        <>
          New to Weaver?{" "}
          <Link href="/signup" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
            Create a free account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div role="alert" className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}
        <Field label="Email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input type="email" autoComplete="email" className="pl-11" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
        </Field>
        <Field label="Password">
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input type={show ? "text" : "password"} autoComplete="current-password" className="pl-11 pr-11" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 hover:text-zinc-600">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-zinc-500">
            <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" /> Remember me
          </label>
          <Link href="/forgot-password" className="font-medium text-indigo-600 hover:underline dark:text-indigo-300">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="gradient" loading={loading} className="w-full" size="lg">
          <Sparkles className="h-4 w-4" /> Sign in
        </Button>
        <p className="rounded-2xl bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          Demo account: <strong>demo@weaver.local</strong> / <strong>demo1234</strong>
        </p>
      </form>
    </AuthShell>
  );
}