"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Newspaper, ClockArrowUp, TrendingUp, Sparkles } from "lucide-react";
import { EducationHeader, CategoryPills } from "@/components/education/page-header";
import { generateArtworkRatio } from "@/lib/demo-media";

const CATS = [
  { id: "all", label: "All" },
  { id: "guides", label: "Guides" },
  { id: "updates", label: "Updates" },
  { id: "community", label: "Community" },
  { id: "engineering", label: "Engineering" },
];

const POSTS = [
  { id: "p1", title: "Weaver Motion now renders 12-second clips", cat: "updates", date: "Oct 2, 2026", read: "3 min", seed: 11, category: "News" },
  { id: "p2", title: "The anatomy of a world-class image prompt", cat: "guides", date: "Sep 27, 2026", read: "8 min", seed: 22, category: "Guides" },
  { id: "p3", title: "Community spotlight: pixel artists of Weaver", cat: "community", date: "Sep 18, 2026", read: "5 min", seed: 33, category: "Community" },
  { id: "p4", title: "How we built the demo engine with zero GPUs", cat: "engineering", date: "Sep 9, 2026", read: "12 min", seed: 44, category: "Engineering" },
  { id: "p5", title: "Syncing vocals to avatar video: under the hood", cat: "engineering", date: "Aug 30, 2026", read: "10 min", seed: 55, category: "Engineering" },
  { id: "p6", title: "Lo-fi for beginners: chord progressions that live", cat: "guides", date: "Aug 21, 2026", read: "7 min", seed: 66, category: "Guides" },
];

export default function BlogPage() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = POSTS;
    if (cat !== "all") list = list.filter((p) => p.cat === cat);
    if (q.trim()) list = list.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [cat, q]);

  const [featured, ...rest] = filtered;

  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <EducationHeader
          badge="Blog"
          icon={<Newspaper className="h-3.5 w-3.5" />}
          title="Stories from the studio"
          subtitle="Product updates, deep dives and creator stories."
          searchPlaceholder="Search articles…"
          searchValue={q}
          onSearch={setQ}
        />
        <CategoryPills categories={CATS} active={cat} onChange={setCat} />

        {featured && (
          <Link href="/blog" className="card group mb-6 grid overflow-hidden md:grid-cols-2">
            <img src={generateArtworkRatio({ seed: featured.seed, ratio: "16:9", size: 720 }).url} alt="" className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full" />
            <div className="flex flex-col justify-center gap-3 p-7">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-500"><Sparkles className="h-3.5 w-3.5" /> Featured</p>
              <h2 className="font-display text-2xl font-extrabold leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300">{featured.title}</h2>
              <p className="text-xs text-zinc-400"><ClockArrowUp className="mr-1 inline h-3.5 w-3.5" /> {featured.date} · {featured.read} read</p>
            </div>
          </Link>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.id} href="/blog" className="card group overflow-hidden">
              <img src={generateArtworkRatio({ seed: p.seed, size: 480 }).url} alt="" className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="space-y-2 p-5">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">{p.category}</span>
                <h3 className="font-semibold leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-300">{p.title}</h3>
                <p className="text-xs text-zinc-400"><TrendingUp className="mr-1 inline h-3.5 w-3.5" /> {p.date} · {p.read} read</p>
              </div>
            </Link>
          ))}
        </div>

        {rest.length === 0 && <p className="py-10 text-center text-sm text-zinc-400">No articles match that search.</p>}
      </div>
    </div>
  );
}
