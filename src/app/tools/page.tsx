import Link from "next/link";
import {
  Clapperboard,
  ImageIcon,
  Music,
  PenLine,
  Maximize2,
  Eraser,
  ScanEye,
  MicVocal,
  UserRound,
  PartyPopper,
  Megaphone,
  Cake,
  Cat,
  Grid3X3,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const tools = [
  { group: "Video", icon: Clapperboard, color: "from-fuchsia-500 to-rose-500" },
  { group: "Image", icon: ImageIcon, color: "from-indigo-500 to-violet-500" },
  { group: "Music", icon: Music, color: "from-amber-500 to-orange-500" },
  { group: "Text", icon: PenLine, color: "from-emerald-500 to-teal-500" },
];

const allTools = [
  { href: "/studio/video", icon: Clapperboard, title: "Video Generator", desc: "Text & image to video", cost: "from 24", color: "from-fuchsia-500 to-rose-500" },
  { href: "/studio/image", icon: ImageIcon, title: "Image Generator", desc: "Stills, edits & references", cost: "from 3", color: "from-indigo-500 to-violet-500" },
  { href: "/studio/music", icon: Music, title: "Music Generator", desc: "Original tracks with vocals", cost: "from 18", color: "from-amber-500 to-orange-500" },
  { href: "/studio/text", icon: PenLine, title: "Prompt Studio", desc: "Enhance, script, storyboard", cost: "1", color: "from-emerald-500 to-teal-500" },
  { href: "/tools/video-upscaler", icon: Maximize2, title: "Video Upscaler", desc: "4K upscaling of clips", cost: "30", color: "from-rose-500 to-red-500" },
  { href: "/tools/image-upscaler", icon: Maximize2, title: "Image Upscaler", desc: "Up to 4× resolution", cost: "12", color: "from-sky-500 to-blue-500" },
  { href: "/tools/object-remover", icon: Eraser, title: "Object Remover", desc: "Clean up unwanted items", cost: "8", color: "from-violet-500 to-purple-500" },
  { href: "/tools/video-object-remover", icon: ScanEye, title: "Video Object Remover", desc: "Erase objects in motion", cost: "34", color: "from-red-500 to-rose-400" },
  { href: "/tools/singing-video", icon: MicVocal, title: "Singing Video", desc: "Photos that lipsync", cost: "40", color: "from-pink-500 to-fuchsia-500" },
  { href: "/tools/avatar", icon: UserRound, title: "Talking Avatar", desc: "Scripted presenter avatars", cost: "36", color: "from-cyan-500 to-sky-500" },
  { href: "/tools/dance", icon: PartyPopper, title: "AI Dance Generator", desc: "Animated dance routines", cost: "32", color: "from-yellow-500 to-amber-500" },
  { href: "/tools/video-ad", icon: Megaphone, title: "Video Ad Maker", desc: "15s scroll-stoppers", cost: "45", color: "from-orange-500 to-red-400" },
  { href: "/tools/birthday-song", icon: Cake, title: "Birthday Song", desc: "Personalised song gifts", cost: "18", color: "from-amber-400 to-pink-400" },
  { href: "/studio/music-library", icon: Music, title: "Music Library", desc: "Play, download, organise", cost: "—", color: "from-teal-500 to-emerald-400" },
  { href: "/tools/anime-art", icon: Cat, title: "Anime Art", desc: "Photo-to-anime restyle", cost: "5", color: "from-fuchsia-400 to-pink-500" },
  { href: "/tools/pixel-art", icon: Grid3X3, title: "Pixel Art Studio", desc: "Retro pixel conversions", cost: "4", color: "from-emerald-400 to-lime-500" },
  { href: "/tools/verify", icon: ShieldAlert, title: "AI Content Verification", desc: "AI-generation signal check", cost: "1", color: "from-slate-500 to-zinc-500" },
];

export default function ToolsPage() {
  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="mb-10 text-center">
          <Badge tone="gradient" className="mb-4"><Sparkles className="h-3 w-3" /> The full toolkit</Badge>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Every creative tool in one <span className="text-gradient">studio</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
            Seventeen specialised tools that share your prompts, credits and workspace.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {tools.map((t) => (
            <span key={t.group} className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold dark:border-white/10 dark:bg-zinc-900">
              <t.icon className={`h-3.5 w-3.5 bg-gradient-to-br bg-clip-text ${t.color}`} />
              {t.group}
            </span>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allTools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="card group p-5 transition-all hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${t.color} text-white`}>
                  <t.icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-500 dark:bg-white/10 dark:text-zinc-300">
                  {t.cost} credits
                </span>
              </div>
              <h2 className="font-display text-base font-bold">{t.title}</h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{t.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                Open tool <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}