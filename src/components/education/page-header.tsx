import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EducationHeader({
  badge,
  icon,
  title,
  subtitle,
  searchPlaceholder,
  searchValue,
  onSearch,
}: {
  badge: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (v: string) => void;
}) {
  return (
    <div className="mb-10 text-center">
      <Badge tone="gradient" className="mb-4">
        {icon} {badge}
      </Badge>
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      {searchPlaceholder && (
        <div className="relative mx-auto mt-6 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={searchValue ?? ""}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-full border border-zinc-300 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-white/15 dark:bg-zinc-900"
          />
        </div>
      )}
    </div>
  );
}

export function CategoryPills({
  categories,
  active,
  onChange,
}: {
  categories: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="no-scrollbar mb-8 flex justify-start gap-2 overflow-x-auto pb-1 lg:justify-center">
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          aria-pressed={active === c.id}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
            active === c.id
              ? "border-indigo-500 bg-indigo-500 text-white"
              : "border-zinc-300 text-zinc-600 hover:border-indigo-400 dark:border-white/15 dark:text-zinc-300"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}