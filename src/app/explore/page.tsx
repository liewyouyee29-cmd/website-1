"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ImageIcon,
  Film,
  Music2,
  SlidersHorizontal,
  Heart,
  Share2,
  Star,
  Layers,
  PlayCircle,
  Sparkles,
  Lock,
} from "lucide-react";
import { getDemoContent } from "@/lib/content";
import { generateArtworkRatio, generateDemoClip, seedFrom } from "@/lib/demo-media";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { PromptsActions } from "@/components/home/home-page";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";

type Filter = "all" | "image" | "video" | "music" | "prompt";
type Sort = "popular" | "new" | "remixes";

export default function ExplorePage() {
  const content = getDemoContent();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("popular");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<(typeof content.community)[number] | null>(null);
  const { toast } = useToast();

  const items = useMemo(() => {
    let list = content.community;
    if (filter !== "all") list = list.filter((c) => c.kind === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.prompt.toLowerCase().includes(q) || c.author.name.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sort === "new") sorted.sort((a, b) => b.createdAt?.localeCompare(a.createdAt ?? "") ?? 0);
    if (sort === "remixes") sorted.sort((a, b) => b.stats.remixes - a.stats.remixes);
    // popular (default) is by likes desc
    sorted.sort((a, b) => b.stats.likes - a.stats.likes);
    return sorted;
  }, [content.community, filter, sort, query]);

  const renderCard = (item: (typeof content.community)[number]) => {
    if (item.kind === "music") {
      return (
        <div className="card flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <Music2 className="h-4 w-4" />
            </span>
            <Badge tone="zinc">Music</Badge>
          </div>
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-xs text-zinc-400">by {item.author.name}</p>
          </div>
          <p className="line-clamp-2 text-xs italic text-zinc-500 dark:text-zinc-400">“{item.prompt}”</p>
          <Stats item={item} />
          <PromptsActions prompt={item.prompt} reason="Try This Prompt" onAction={() => setDetail(item)} />
        </div>
      );
    }
    const art = generateArtworkRatio({
      seed: seedFrom(`${item.prompt}::${item.kind}`),
      ratio: item.kind === "video" ? "16:9" : "1:1",
      size: 520,
    });
    return (
      <div className="card overflow-hidden">
        <button type="button" className="group relative block w-full" onClick={() => setDetail(item)} aria-label={`View ${item.title}`}>
          <img src={art.url} alt={item.title} className={cn("w-full object-cover transition-transform duration-500 group-hover:scale-105", item.kind === "video" ? "aspect-video" : "aspect-square")} loading="lazy" />
          {item.kind === "video" && (
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition group-hover:bg-black/70">
                <PlayCircle className="h-5 w-5" />
              </span>
            </span>
          )}
          <Badge tone="zinc" className="absolute left-3 top-3 bg-black/50 backdrop-blur">
            {item.kind === "video" ? <><Film className="h-3 w-3" /> Video</> : <><ImageIcon className="h-3 w-3" /> Image</>}
          </Badge>
        </button>
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-[9px] font-bold text-white">
                {item.author.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                <p className="truncate text-[11px] text-zinc-400">{item.model}</p>
              </div>
            </div>
          </div>
          <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">{item.prompt}</p>
          <Stats item={item} />
          <PromptsActions prompt={item.prompt} onAction={() => setDetail(item)} />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge tone="indigo" className="mb-3"><Layers className="h-3 w-3" /> Explore & Community</Badge>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Discover what others are making</h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Public community gallery — remix any creation into your own studio with one click.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Lock className="h-3.5 w-3.5" /> Private creations stay in your dashboard
          </div>
        </div>

        {/* Search + filters */}
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search creations, prompts, creators…"
              className="w-full rounded-full border border-zinc-300 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-white/15 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "image", "video", "music", "prompt"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-colors",
                  filter === f
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-zinc-300 text-zinc-600 hover:border-indigo-400 dark:border-white/15 dark:text-zinc-300",
                )}
              >
                {f}
              </button>
            ))}
            <div className="ml-1 flex items-center gap-1.5 text-xs text-zinc-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent font-semibold text-zinc-600 outline-none dark:text-zinc-300">
                <option value="popular">Most liked</option>
                <option value="new">Newest</option>
                <option value="remixes">Most remixed</option>
              </select>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 p-14 text-center dark:border-white/15">
            <p className="font-semibold">No results for “{query}”</p>
            <p className="mt-1 text-sm text-zinc-400">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div key={item.id}>{renderCard(item)}</div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.title ?? ""}>
        {detail && <DetailView item={detail} />}
      </Modal>
    </div>
  );
}

function Stats({ item }: { item: { stats: { likes: number; remixes: number }; kind: string } }) {
  return (
    <div className="flex items-center gap-4 text-[11px] text-zinc-400">
      <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" /> {item.stats.likes}</span>
      <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {item.stats.remixes} remixes</span>
      <span className="ml-auto flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {item.kind}</span>
    </div>
  );
}

function DetailView({ item }: { item: { title: string; prompt: string; model?: string; kind: string; author: { name: string }; stats: { likes: number; remixes: number } } }) {
  const { toast } = useToast();
  const art = item.kind === "music"
    ? null
    : generateArtworkRatio({
        seed: seedFrom(`${item.prompt}::detail`),
        ratio: item.kind === "video" ? "16:9" : "1:1",
        size: 720,
      });
  return (
    <div className="space-y-4">
      {art && <img src={art.url} alt={item.title} className={cn("w-full rounded-2xl border border-zinc-200 dark:border-white/10", item.kind === "video" ? "aspect-video" : "aspect-square object-cover")} />}
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Badge tone={item.kind === "video" ? "rose" : item.kind === "music" ? "amber" : "sky"}>{item.kind}</Badge>
        {item.model && <span>{item.model}</span>}
        <span className="ml-auto">by {item.author.name}</span>
      </div>
      <p className="rounded-2xl bg-zinc-50 p-4 text-sm italic leading-relaxed dark:bg-white/5">“{item.prompt}”</p>
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/studio/video?prompt=${encodeURIComponent(item.prompt)}`} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500">
          <Sparkles className="h-3.5 w-3.5" /> Create Similar
        </Link>
        <button
          type="button"
          onClick={() => { navigator.clipboard?.writeText(item.prompt).catch(() => undefined); toast("Prompt copied.", "info"); }}
          className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold hover:border-indigo-400 dark:border-white/15"
        >
          Copy prompt
        </button>
        <button
          type="button"
          onClick={() => toast("Community sharing is a demo — connect a database to save remixes.", "info")}
          className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold hover:border-indigo-400 dark:border-white/15"
        >
          <Share2 className="mr-1 inline h-3.5 w-3.5" /> Remix
        </button>
      </div>
    </div>
  );
}