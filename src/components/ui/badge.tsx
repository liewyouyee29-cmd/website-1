import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  indigo: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/20",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  rose: "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/20",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/20",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/20",
  zinc: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 border-zinc-500/20",
  gradient: "bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-rose-400/20 text-indigo-600 dark:text-indigo-200 border-transparent",
};

export function Badge({
  children,
  tone = "zinc",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}