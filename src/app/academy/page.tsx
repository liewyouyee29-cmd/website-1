"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GraduationCap, Clock, BarChart3, PlayCircle, BookOpen } from "lucide-react";
import { EducationHeader, CategoryPills } from "@/components/education/page-header";

const CATS = [
  { id: "all", label: "All" },
  { id: "basics", label: "Basics" },
  { id: "video", label: "Video" },
  { id: "image", label: "Image" },
  { id: "music", label: "Music" },
  { id: "prompting", label: "Prompting" },
  { id: "workflow", label: "Workflow" },
];

const COURSES = [
  { id: "c1", title: "First video in 10 minutes", cat: "basics", level: "Beginner", time: "10 min", icon: PlayCircle },
  { id: "c2", title: "Camera motion styles explained", cat: "video", level: "Beginner", time: "14 min", icon: PlayCircle },
  { id: "c3", title: "Image-to-video: the complete guide", cat: "video", level: "Intermediate", time: "22 min", icon: PlayCircle },
  { id: "c4", title: "Prompt anatomy for photorealistic images", cat: "prompting", level: "Intermediate", time: "18 min", icon: BookOpen },
  { id: "c5", title: "Styling anime & pixel art", cat: "image", level: "Beginner", time: "12 min", icon: BookOpen },
  { id: "c6", title: "Composing a track from a mood", cat: "music", level: "Intermediate", time: "20 min", icon: PlayCircle },
  { id: "c7", title: "Lo-fi beats workflow (0 to full song)", cat: "music", level: "Advanced", time: "35 min", icon: PlayCircle },
  { id: "c8", title: "Credit budgets: spend less, ship more", cat: "workflow", level: "Beginner", time: "8 min", icon: BarChart3 },
];

const GUIDES = [
  { href: "/help/how-to", title: "How to write prompts that work", time: "6 min read" },
  { href: "/academy/video-motion", title: "Motion styles: cinematic vs anime vs clay", time: "9 min read" },
  { href: "/academy/credit-budget", title: "Understanding credit costs", time: "5 min read" },
];

export default function AcademyPage() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = COURSES;
    if (cat !== "all") list = list.filter((c) => c.cat === cat);
    if (q.trim()) list = list.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [cat, q]);

  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <EducationHeader
          badge="Academy"
          icon={<GraduationCap className="h-3.5 w-3.5" />}
          title="Learn to create with AI"
          subtitle="Structured courses and short guides for every skill level."
          searchPlaceholder="Search courses…"
          searchValue={q}
          onSearch={setQ}
        />

        <CategoryPills categories={CATS} active={cat} onChange={setCat} />

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((c) => (
            <Link key={c.id} href="/academy" className="card group p-5 transition-all hover:-translate-y-1">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
                <c.icon className="h-5 w-5" />
              </span>
              <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-500">{c.level}</p>
              <h2 className="mt-1 font-semibold leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-300">{c.title}</h2>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                <Clock className="h-3.5 w-3.5" /> {c.time}
              </p>
            </Link>
          ))}
        </div>

        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-display text-2xl font-extrabold">Quick guides</h2>
          <div className="space-y-3">
            {GUIDES.map((g) => (
              <Link key={g.title} href={g.href} className="card flex items-center justify-between gap-3 p-4 hover:border-indigo-300 dark:hover:border-indigo-500/50">
                <div>
                  <p className="font-semibold">{g.title}</p>
                  <p className="text-xs text-zinc-400">{g.time}</p>
                </div>
                <span className="text-indigo-500">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
