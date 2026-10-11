"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden bg-mesh px-4 py-12">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center gap-2" aria-label="Weaver home">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-500 text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold">Weaver<span className="text-gradient"> AI</span></span>
          </Link>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white/90 p-7 shadow-card backdrop-blur dark:border-white/10 dark:bg-zinc-900/80">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        {footer && (
          <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">{footer}</p>
        )}
      </div>
    </div>
  );
}