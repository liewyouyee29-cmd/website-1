import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/legal/terms", title: "Terms of Service" },
  { href: "/legal/privacy", title: "Privacy Policy" },
  { href: "/legal/cookies", title: "Cookie Preferences" },
  { href: "/legal/refunds", title: "Refund Policy" },
  { href: "/legal/billing", title: "Billing & Cancellation" },
  { href: "/legal/safety", title: "Content & Safety Policy" },
  { href: "/legal/reporting", title: "Content Reporting" },
  { href: "/legal/ai-transparency", title: "AI Transparency" },
];

export function LegalLayout({
  title,
  updated,
  children,
  activePath,
}: {
  title: string;
  updated: string;
  children: ReactNode;
  activePath: string;
}) {
  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
          <div>
            <Badge tone="indigo" className="mb-3"><ShieldCheck className="h-3 w-3" /> Legal & Trust</Badge>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          </div>
          <p className="text-xs text-zinc-400">Last updated: {updated}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <nav aria-label="Legal pages" className="no-scrollbar flex gap-2 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:overflow-visible">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  l.href === activePath
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5",
                )}
              >
                {l.title}
              </Link>
            ))}
          </nav>
          <div className="prose-policy space-y-6">
            <div className="card p-8 sm:p-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-8 mb-3 font-display text-xl font-bold">{children}</h2>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{children}</p>;
}