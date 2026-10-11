"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

export function StudioShell({
  icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-zinc-400">
          <Link href="/" className="hover:text-indigo-500">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-indigo-500">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-zinc-600 dark:text-zinc-300">{eyebrow}</span>
        </nav>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-500 text-white shadow-glow">
              {icon}
            </span>
            <div>
              <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                {title}
              </h1>
              {description && (
                <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
              )}
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-300"
          >
            <Sparkles className="h-3.5 w-3.5" /> Credits
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

export function SettingsSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</h3>
      {children}
    </div>
  );
}

export function SettingsCard({ children }: { children: ReactNode }) {
  return (
    <div className="card space-y-5 p-5">
      <div className="space-y-5">{children}</div>
    </div>
  );
}