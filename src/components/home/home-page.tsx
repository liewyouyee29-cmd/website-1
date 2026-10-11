"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clapperboard,
  ImageIcon,
  Music,
  Sparkles,
  Wand2,
  ArrowRight,
  Star,
  ShieldCheck,
  Zap,
  Layers,
  BadgeCheck,
  PlayCircle,
  Palette,
  Film,
  Music2,
  BrainCircuit,
  Quote,
  Check,
  ChevronDown,
  Upload,
  Coins,
} from "lucide-react";
import { getDemoContent } from "@/lib/content";
import { generateDemoClip, generateArtworkRatio, seedFrom } from "@/lib/demo-media";
import { PROMPT_TEMPLATES } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { Artwork, AudioPlayer, ClipPlayer, DemoBadge } from "@/components/ui/media";

const heroExamples = [
  "A fox spirit walking through a glowing neon forest at dusk, cinematic",
  "Cosmic whale swimming through a nebula of blooming flowers, surreal",
  "A cozy isometric cabin in a snowstorm, warm lights, 3D clay render",
];

const features = [
  {
    icon: Clapperboard,
    title: "AI Video Studio",
    desc: "Text-to-video, image-to-video, upscaling and object removal with full preview controls.",
    href: "/studio/video",
    accent: "from-fuchsia-500 to-rose-500",
  },
  {
    icon: ImageIcon,
    title: "AI Image Studio",
    desc: "Generate, edit, upscale and restyle images with one intuitive workspace.",
    href: "/studio/image",
    accent: "from-indigo-500 to-violet-500",
  },
  {
    icon: Music,
    title: "AI Music Studio",
    desc: "Original tracks, birthday songs, talking avatars and a personal library.",
    href: "/studio/music",
    accent: "from-amber-500 to-orange-500",
  },
  {
    icon: Wand2,
    title: "Prompt & Text Studio",
    desc: "Enhance prompts, draft scripts, storyboard videos and remix lyrics.",
    href: "/studio/text",
    accent: "from-emerald-500 to-teal-500",
  },
];

export function HomePage() {
  const router = useRouter();
  return (
    <div>
      <AnnouncementBar />
      <Hero router={router} />
      <CreationPath />
      <Showcase />
      <PixelGallery />
      <CommunityShowcase />
      <ModelsTools />
      <Testimonials />
      <Faq />
      <FinalCta />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function AnnouncementBar() {
  return (
    <div className="relative z-10 mx-auto -mt-1 flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 pb-4 pt-5 text-center lg:px-8">
      <Badge tone="gradient" className="animate-pulse-ring">
        <Sparkles className="h-3 w-3" /> New
      </Badge>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        <span className="font-semibold text-zinc-900 dark:text-white">Image-to-video is live</span> — turn a single photo into motion.{" "}
        <Link href="/studio/video" className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300">
          Try it now
        </Link>
      </p>
    </div>
  );
}

function Hero({ router }: { router: ReturnType<typeof useRouter> }) {
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState("video");
  const { toast } = useToast();

  const submit = () => {
    const p = prompt.trim();
    if (!p) {
      toast("Describe something you'd like to create first.", "error");
      return;
    }
    const target =
      selected === "video" ? "/studio/video" : selected === "image" ? "/studio/image" : "/studio/music";
    router.push(`${target}?prompt=${encodeURIComponent(p)}`);
  };

  const cnvHero = useHeroArt();

  const options = [
    { id: "video", label: "Video", icon: Clapperboard },
    { id: "image", label: "Image", icon: ImageIcon },
    { id: "music", label: "Music", icon: Music },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-mesh">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-16">
        <div className="flex flex-col justify-center">
          <Badge tone="indigo" className="mb-5 w-fit">
            <Sparkles className="h-3 w-3" /> The all-in-one AI creative studio
          </Badge>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl xl:text-6xl">
            Your Ideas, Brought to <span className="text-gradient">Life with AI.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg">
            Generate cinematic videos, stunning images and original music from a single prompt — then
            edit, organize and remix everything you make in one polished, private workspace.
          </p>

          <div className="mt-8">
            <div className="mb-3 flex gap-2" role="tablist" aria-label="Choose what to create">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  role="tab"
                  aria-selected={selected === opt.id}
                  onClick={() => setSelected(opt.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    selected === opt.id
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                      : "border-zinc-300 text-zinc-600 hover:border-indigo-400 dark:border-white/15 dark:text-zinc-300",
                  )}
                >
                  <opt.icon className="h-4 w-4" /> {opt.label}
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/90 p-2 shadow-card backdrop-blur dark:border-white/10 dark:bg-zinc-900/80">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Describe your idea… e.g. a bioluminescent whale drifting through a nebula"
                  aria-label="Prompt"
                  className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-zinc-400"
                />
                <Button variant="gradient" size="lg" onClick={submit} className="sm:shrink-0">
                  Create <Sparkles className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 px-2 pb-1.5 pt-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Try:</span>
                {heroExamples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => { setPrompt(ex); setSelected(ex.includes("fox") ? "video" : ex.includes("whale") ? "image" : "image"); }}
                    className="truncate rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-500 hover:bg-indigo-100 hover:text-indigo-600 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-indigo-300"
                  >
                    {ex.length > 42 ? `${ex.slice(0, 42)}…` : ex}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5"><Coins className="h-3.5 w-3.5 text-amber-500" /> Transparent credit costs</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Private by default</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-indigo-500" /> No watermark on paid plans</span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-4xl border border-white/20 shadow-2xl dark:border-white/10">
            <img src={cnvHero.url} alt="AI-generated showcase artwork" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Aurora XL · 4K</p>
                <p className="text-xs text-white/70">Showcase render</p>
              </div>
              <DemoBadge />
            </div>
            <div className="absolute right-4 top-4 flex gap-1.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur"><PlayCircle className="h-4.5 w-4.5 h-5 w-5" /></span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur"><Palette className="h-4 w-4" /></span>
            </div>
          </div>
          <div className="absolute -left-2 top-8 hidden animate-float rounded-2xl border border-zinc-200 bg-white p-3 shadow-card dark:border-white/10 dark:bg-zinc-900 lg:block">
            <div className="flex items-center gap-2 text-xs font-semibold"><Layers className="h-4 w-4 text-indigo-500" /> 2,300+ creations today</div>
          </div>
          <div className="absolute -bottom-4 -right-2 hidden animate-float rounded-2xl border border-zinc-200 bg-white p-3 shadow-card dark:border-white/10 dark:bg-zinc-900 lg:block" style={{ animationDelay: "1.2s" }}>
            <div className="flex items-center gap-2 text-xs font-semibold"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9 · 12k reviews</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function useHeroArt() {
  // Deterministic seeded render — safe to compute on both server and client
  // so the src is never empty during hydration.
  const url = generateArtworkRatio({
    seed: 424242,
    shapes: "orb",
    size: 1100,
    ratio: "4:3",
  }).url;
  return { url };
}

/* ------------------------------------------------------------------ */

function CreationPath() {
  const cards = [
    { href: "/studio/video", icon: Clapperboard, title: "Video", desc: "Motion, story and style", color: "from-fuchsia-500/25 to-rose-500/10 text-fuchsia-500", ring: "hover:border-fuchsia-400/60" },
    { href: "/studio/image", icon: ImageIcon, title: "Image", desc: "Stills that sell the idea", color: "from-indigo-500/25 to-violet-500/10 text-indigo-500", ring: "hover:border-indigo-400/60" },
    { href: "/studio/music", icon: Music, title: "Music", desc: "Soundscapes and songs", color: "from-amber-500/25 to-orange-500/10 text-amber-500", ring: "hover:border-amber-400/60" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className={cn(
              "group flex items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-card transition-all hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-900/60",
              c.ring,
            )}
          >
            <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br", c.color)}>
              <c.icon className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-bold">{c.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{c.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Showcase() {
  const [active, setActive] = useState(0);
  const content = getDemoContent();
  const featured = content.featured.slice(0, 6);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => {
        const next = prev + 1;
        if (next >= featured.length) {
          // return to first after brief pause at end
          return 0;
        }
        return next;
      });
    }, 4000);
    return () => window.clearInterval(id);
  }, [featured.length]);

  const current = featured[active];

  const renderPreview = (item: (typeof featured)[number]) => {
    if (item.kind === "video") {
      const clip = generateDemoClip({ seed: item.seed, ratio: "16:9", duration: 6 });
      return <ClipPlayer src={clip.url} alt={item.title} />;
    }
    const art = generateArtworkRatio({ seed: item.seed, size: 900, ratio: "1:1" });
    return <Artwork src={art.url} alt={item.title} aspect="1/1" />;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge tone="sky" className="mb-3"><Film className="h-3 w-3" /> Live showcase</Badge>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Fresh from the studio</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Animated, rotating gallery of what people are making with Weaver.</p>
        </div>
        <Link href="/explore" className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
          Explore all →
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <div className="relative aspect-video w-full">{current && renderPreview(current)}</div>
            <div className="flex items-center justify-between gap-3 border-t border-zinc-100 p-4 dark:border-white/10">
              <div className="min-w-0">
                <p className="truncate font-semibold">{current?.title}</p>
                <p className="truncate text-xs text-zinc-400">by {current?.author} · {current?.model}</p>
              </div>
              <div className="flex gap-2">
                <PromptsActions prompt={current?.prompt ?? ""} reason="Try This Prompt" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
          {featured.slice(1, 4).map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i + 1)}
              className={cn(
                "group relative flex w-full items-center gap-3 overflow-hidden rounded-3xl border p-2 text-left transition-all",
                active === i + 1
                  ? "border-indigo-400 bg-indigo-50/60 dark:border-indigo-500/50 dark:bg-indigo-500/10"
                  : "border-zinc-200 hover:border-indigo-300 dark:border-white/10",
              )}
              aria-pressed={active === i + 1}
            >
              <div className={cn("h-full w-28 shrink-0 overflow-hidden rounded-2xl", item.kind === "video" ? "aspect-video" : "aspect-square")}>
                {item.kind === "video"
                  ? <img src={generateDemoClip({ seed: item.seed, ratio: "16:9" }).url} className={cn("h-full w-full object-cover", "w-full")} alt="" />
                  : <img src={generateArtworkRatio({ seed: item.seed, size: 240 }).url} className="h-full w-full object-cover" alt="" />}
              </div>
              <div className="min-w-0 flex-1 pr-1">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-zinc-500 dark:text-zinc-400">{item.prompt}</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-indigo-500">{item.kind}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Shared action row: Try This Prompt / View Details / Create Similar. */
export function PromptsActions({
  prompt,
  reason = "Try This Prompt",
  onAction,
}: {
  prompt: string;
  reason?: string;
  onAction?: () => void;
}) {
  const { toast } = useToast();
  const copied = () => toast("Prompt copied — paste it into any studio.", "info");

  return (
    <div className="flex flex-wrap items-center gap-2" onClick={onAction}>
      <Link
        href={`/studio/text?prompt=${encodeURIComponent(prompt)}&action=${encodeURIComponent(reason)}`}
        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
      >
        <Sparkles className="h-3.5 w-3.5" /> {reason}
      </Link>
      <Link
        href={`/studio/video?prompt=${encodeURIComponent(prompt)}`}
        aria-label="Create similar"
        title="Create similar"
        className="grid h-8 w-8 place-items-center rounded-full border border-zinc-200 text-zinc-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/15"
      >
        <BadgeCheck className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={() => { navigator.clipboard?.writeText(prompt).catch(() => undefined); copied(); }}
        aria-label="Copy prompt"
        className="grid h-8 w-8 place-items-center rounded-full border border-zinc-200 text-zinc-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/15"
        title="Copy prompt"
      >
        <Wand2 className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PixelGallery() {
  const content = getDemoContent();
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Fantasy", "City", "Nature", "Sci-fi"];
  const items = useMemo(
    () => (filter === "All" ? content.pixelArt : content.pixelArt.filter((p) => p.category === filter)),
    [content.pixelArt, filter],
  );

  return (
    <section className="bg-zinc-50 py-20 dark:bg-[#0b0b16]">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge tone="emerald" className="mb-3"><Palette className="h-3 w-3" /> Pixel Art Studio</Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">The pixel-art gallery</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Retro charm, modern pipeline — generate your own in seconds.</p>
          </div>
          <Link href="/tools/pixel-art" className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300">Open Pixel Art Studio →</Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                filter === c
                  ? "border-indigo-500 bg-indigo-500 text-white"
                  : "border-zinc-300 text-zinc-600 hover:border-indigo-400 dark:border-white/15 dark:text-zinc-300",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <div key={item.title} className="group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/10">
              <img src={item.url} alt={item.title} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-xs font-bold text-white">{item.title}</p>
                <PromptsActions prompt={item.prompt} reason="Try This Prompt" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function CommunityShowcase() {
  const content = getDemoContent();
  const items = content.community.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Badge tone="indigo" className="mb-3"><Music2 className="h-3 w-3" /> Community</Badge>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Made by the community</h2>
        </div>
        <Link href="/explore" className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300">Browse gallery →</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          if (item.kind === "music") {
            return (
              <div key={item.id} className="card flex flex-col gap-3 p-4">
                <div className="flex items-center gap-2 text-xs text-zinc-500"><Music2 className="h-4 w-4 text-amber-500" /> Music · {item.model}</div>
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-[10px] font-bold text-white">
                    {item.author.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.title}</p>
                    <p className="truncate text-[11px] text-zinc-400">by {item.author.name}</p>
                  </div>
                </div>
                <p className="line-clamp-2 text-xs text-zinc-500 italic dark:text-zinc-400">“{item.prompt}”</p>
                <CommunityStats item={item} />
                <PromptsActions prompt={item.prompt} reason="Try This Prompt" />
              </div>
            );
          }
          const isVideo = item.kind === "video";
          const art = isVideo
            ? generateArtworkRatio({ seed: seedFrom(`${item.prompt}::vid`), ratio: "16:9", size: 640 })
            : generateArtworkRatio({ seed: seedFrom(`${item.prompt}::img`), size: 640 });
          return (
            <div key={item.id} className="card overflow-hidden">
              <div className={cn("relative w-full overflow-hidden", isVideo ? "aspect-video" : "aspect-square")}>
                <img src={art.url} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                {isVideo && (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur">
                      <PlayCircle className="h-5 w-5" />
                    </span>
                  </span>
                )}
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                  <Badge tone={isVideo ? "rose" : "sky"}>{item.kind}</Badge>
                </div>
                <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">{item.prompt}</p>
                <CommunityStats item={item} />
                <PromptsActions prompt={item.prompt} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CommunityStats({ item }: { item: NonNullable<ReturnType<typeof getDemoContent>["community"]>[number] }) {
  return (
    <div className="flex items-center gap-4 text-[11px] text-zinc-400">
      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {item.stats.likes}</span>
      <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> {item.stats.remixes} remixes</span>
      <span className="ml-auto">{item.kind === "music" ? "Listen" : "View"}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ModelsTools() {
  const featuredModels = [
    { name: "Weaver Motion", kind: "Video", desc: "5–12s clips with camera control and six motion styles.", cost: "24 credits", color: "from-fuchsia-500 to-rose-500" },
    { name: "Weaver Photo", kind: "Image", desc: "Photoreal stills with natural light and true faces.", cost: "4 credits", color: "from-indigo-500 to-violet-500" },
    { name: "Aurora XL", kind: "Image", desc: "High-detail creative imagery up to 4K concept art.", cost: "6 credits", color: "from-sky-500 to-cyan-400" },
    { name: "Weaver Verse", kind: "Music", desc: "Original tracks across genres with optional vocals.", cost: "18 credits", color: "from-amber-500 to-orange-500" },
  ];
  const tools = [
    { name: "Video Upscaler", href: "/tools/video-upscaler" },
    { name: "Image Upscaler", href: "/tools/image-upscaler" },
    { name: "Object Remover", href: "/tools/object-remover" },
    { name: "Talking Avatar", href: "/tools/avatar" },
    { name: "Singing Video", href: "/tools/singing-video" },
    { name: "AI Dance", href: "/tools/dance" },
    { name: "Pixel Art Studio", href: "/tools/pixel-art" },
    { name: "Anime Art", href: "/tools/anime-art" },
  ];

  return (
    <section className="bg-zinc-50 py-20 dark:bg-[#0b0b16]">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10">
          <Badge tone="indigo" className="mb-3"><BrainCircuit className="h-3 w-3" /> Featured models & tools</Badge>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">One studio, every medium</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredModels.map((m) => (
              <div key={m.name} className="card p-5">
                <div className={cn("mb-3 inline-grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br text-white", m.color)}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{m.name}</h3>
                  <Badge tone="zinc">{m.kind}</Badge>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{m.desc}</p>
                <p className="mt-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400">{m.cost} / generation</p>
              </div>
            ))}
          </div>
          <div className="card flex flex-col p-6">
            <h3 className="mb-4 font-display text-lg font-bold">Editing & creation tools</h3>
            <div className="grid flex-1 grid-cols-2 gap-2">
              {tools.map((t) => (
                <Link
                  key={t.name}
                  href={t.href}
                  className="flex items-center gap-2 rounded-2xl border border-zinc-200 px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:text-zinc-200 dark:hover:text-indigo-300"
                >
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-400" /> {t.name}
                </Link>
              ))}
            </div>
            <Link href="/tools" className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
              <Zap className="h-4 w-4" /> See all 14 tools
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Testimonials() {
  const content = getDemoContent();
  const quotes = [
    { who: "Maya Reyes", role: "Indie filmmaker", text: "I storyboarded an entire short film with Weaver before touching a camera. The prompt studio alone is worth it.", star: 5 },
    { who: "David Okafor", role: "Motion designer", text: "The image-to-video pipeline changed how I pitch clients. Thirty-second concepts in the time it used to take to set up a meeting.", star: 5 },
    { who: "Lena Fischer", role: "Music producer", text: "Real stems, real ownership. I use the music studio for roughs before flying to the studio — it's part of my writing process now.", star: 5 },
    { who: "Arjun Patel", role: "Social media lead", text: "We ship a week of content in two hours. The ad maker and avatar generator are absurdly good for deadline-driven teams.", star: 4 },
    { who: "Sofia Bianchi", role: "Art director", text: "The pixel-art studio and object remover are in my permanent toolkit. Gorgeous results without touching a graphics program.", star: 5 },
    { who: "Noah Kim", role: "Piano teacher", text: "My students compose their own demo loops now. The lo-fi presets are brilliant for beginners.", star: 5 },
  ];
  void content;
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-10 text-center">
        <Badge tone="amber" className="mb-3"><Quote className="h-3 w-3" /> Loved by creators</Badge>
        <h2 className="font-display text-3xl font-extrabold tracking-tight">Don&apos;t just take our word</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((q, i) => (
          <figure key={i} className="card flex flex-col p-6">
            <div className="mb-3 flex gap-0.5 text-amber-400">
              {Array.from({ length: q.star }).map((_, s) => <Star key={s} className="h-4 w-4 fill-current" />)}
            </div>
            <blockquote className="flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">“{q.text}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xs font-bold text-white">
                {q.who.split(" ").map((w) => w[0]).join("")}
              </span>
              <div>
                <p className="text-sm font-semibold">{q.who}</p>
                <p className="text-xs text-zinc-400">{q.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Faq() {
  const items = [
    { q: "How does the credit system work?", a: "Every generation costs a small number of credits depending on the model, resolution, duration and output count. Monthly plans include an allowance; single packs never expire. You always see the estimated cost before you hit Generate." },
    { q: "Can I use creations commercially?", a: "Yes — paid plans include full ownership and a commercial license for everything you generate. Starter accounts are for personal use with a watermark." },
    { q: "Is demo mode real AI?", a: "No. When no AI provider is connected, Weaver runs in demo mode: every 'generation' is a clearly-labelled local preview so you can explore the full workflow for free." },
    { q: "What models are used?", a: "Weaver is model-agnostic. Depending on the environment it routes image, video, music and text tasks to different providers — the UI and your creations stay the same." },
    { q: "How do I cancel my subscription?", a: "From Dashboard → Billing at any time. Access continues until the end of the billing period." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">Frequently asked questions</h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Everything creators usually ask before starting.</p>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.q} className="card overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-semibold"
            >
              {item.q}
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-zinc-400 transition-transform", open === i && "rotate-180")} />
            </button>
            {open === i && (
              <p className="animate-fade-in-up px-5 pb-5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-500 px-6 py-16 text-center text-white shadow-glow">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Start creating before your next coffee break</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
          25 free credits on sign-up. No credit card required. Generate, edit and organize everything in one studio.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className="rounded-full bg-white px-7 py-3 text-sm font-bold text-zinc-900 shadow-card transition hover:bg-zinc-100">
            Start Creating — it&apos;s free
            <span className="ml-1">→</span>
          </Link>
          <Link href="/studio/image" className="rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Explore the studio
          </Link>
        </div>
      </div>
    </section>
  );
}