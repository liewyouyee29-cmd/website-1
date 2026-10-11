"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Sparkles, Mail, User as UserIcon, KeyRound, Check, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/fields";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const strength = password.length >= 8 ? password.length >= 12 ? 3 : 2 : password.length >= 4 ? 1 : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity();
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (!agree) {
      setError("You need to accept the Terms and Privacy Policy to create an account.");
      return;
    }
    setLoading(true);
    try {
      await signUp(name, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="25 free credits are waiting. No credit card required."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
            Sign in
          </Link>
        </>
      }
    >
      <form ref={formRef} onSubmit={submit} className="space-y-4">
        {error && (
          <div role="alert" className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}
        <Field label="Display name">
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input className="pl-11" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Weaver" autoComplete="name" required minLength={2} />
          </div>
        </Field>
        <Field label="Email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input type="email" className="pl-11" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
          </div>
        </Field>
        <Field label="Password" hint="Min 8 characters">
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input type={show ? "text" : "password"} className="pl-11 pr-11" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" autoComplete="new-password" required minLength={8} />
            <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 hover:text-zinc-600">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i < strength ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"}`} />
            ))}
          </div>
        </Field>
        <Field label="Confirm password">
          <Input type={show ? "text" : "password"} className={confirm && confirm !== password ? "border-rose-400" : ""} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" autoComplete="new-password" required minLength={8} />
        </Field>
        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-zinc-300" required />
          <span>
            I agree to the{" "}
            <Link href="/legal/terms" className="font-medium text-indigo-600 hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="font-medium text-indigo-600 hover:underline">Privacy Policy</Link>, and confirm I am 13 or older.
          </span>
        </label>
        <Button type="submit" variant="gradient" loading={loading} className="w-full" size="lg">
          <Sparkles className="h-4 w-4" /> Create free account
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
          <Check className="h-3.5 w-3.5" /> You&apos;ll never be charged without explicit confirmation
        </p>
      </form>
    </AuthShell>
  );
}