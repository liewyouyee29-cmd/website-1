"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/fields";
import { AuthShell } from "@/components/auth/auth-shell";
import { apiApplyReset, apiRequestReset } from "@/lib/auth/client-auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiRequestReset(email);
      if (res.token) {
        setToken(res.token);
        setStep(2);
      } else {
        // Account doesn't exist — answer uniformly to avoid leaking emails.
        setError("If that account exists, a reset link was dispatched. (This demo shows the code only for existing accounts.)");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const apply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await apiApplyReset(token, email, password);
      setDone(true);
      window.setTimeout(() => router.push("/signin"), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell title="Password updated" subtitle="You can now sign in with your new password.">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <p className="text-sm text-zinc-500">Redirecting you to sign in…</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle={step === 1 ? "We'll email you a one-time reset link." : "Enter the code you received and choose a new password."}
      footer={
        <Link href="/signin" className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:underline dark:text-indigo-300">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      }
    >
      {step === 1 ? (
        <form onSubmit={requestReset} className="space-y-4">
          {error && <div role="alert" className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
          <Field label="Account email">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input type="email" className="pl-11" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
          </Field>
          <Button type="submit" variant="gradient" loading={loading} className="w-full" size="lg">
            Send reset instructions
          </Button>
          <p className="rounded-2xl bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            Demo build: the code is shown in the API response instead of an email.
          </p>
        </form>
      ) : (
        <form onSubmit={apply} className="space-y-4">
          {error && <div role="alert" className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
          <Field label="Reset code">
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input className="pl-11 font-mono" value={token} onChange={(e) => setToken(e.target.value)} placeholder="paste the code…" required />
            </div>
          </Field>
          <Field label="New password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8} />
          </Field>
          <Field label="Confirm password">
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat it" required minLength={8} />
          </Field>
          <Button type="submit" variant="gradient" loading={loading} className="w-full" size="lg">
            Reset password
          </Button>
        </form>
      )}
    </AuthShell>
  );
}