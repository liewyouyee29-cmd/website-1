"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LifeBuoy, MessageCircleQuestion, PlayCircle, FileText, Mail, ChevronRight } from "lucide-react";
import { EducationHeader, CategoryPills } from "@/components/education/page-header";

const CATS = [
  { id: "all", label: "All" },
  { id: "getting-started", label: "Getting Started" },
  { id: "billing", label: "Billing & Credits" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "safety", label: "Safety & Policy" },
];

const ARTICLES = [
  { title: "How much does a generation cost?", cat: "billing", href: "/help/costs" },
  { title: "What happens when I run out of credits?", cat: "billing", href: "/help/no-credits" },
  { title: "Why is my preview labelled Demo?", cat: "getting-started", href: "/help/demo-mode" },
  { title: "Do I own the content I create?", cat: "getting-started", href: "/help/ownership" },
  { title: "How do I cancel my subscription?", cat: "billing", href: "/help/cancel" },
  { title: "Generations keep failing", cat: "troubleshooting", href: "/help/failing" },
  { title: "Uploads are being rejected", cat: "troubleshooting", href: "/help/uploads" },
  { title: "Reporting policy violations", cat: "safety", href: "/legal/reporting" },
  { title: "AI content transparency", cat: "safety", href: "/legal/ai-transparency" },
];

export default function HelpPage() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = ARTICLES;
    if (cat !== "all") list = list.filter((a) => a.cat === cat);
    if (q.trim()) list = list.filter((a) => a.title.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [cat, q]);

  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <EducationHeader
          badge="Help Center"
          icon={<LifeBuoy className="h-3.5 w-3.5" />}
          title="How can we help?"
          subtitle="Answers, walkthroughs and friendly support."
          searchPlaceholder="Search help articles…"
          searchValue={q}
          onSearch={setQ}
        />
        <CategoryPills categories={CATS} active={cat} onChange={setCat} />

        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { icon: MessageCircleQuestion, title: "Quick start", desc: "Create your first image in 60 seconds.", href: "/help/how-to" },
            { icon: PlayCircle, title: "Watch a tutorial", desc: "Short videos for every tool.", href: "/academy" },
            { icon: Mail, title: "Contact support", desc: "We reply within one business day.", href: "mailto:support@weaver.example" },
          ].map((c) => (
            <Link key={c.title} href={c.href} className="card p-5 text-center transition-all hover:-translate-y-1">
              <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                <c.icon className="h-5 w-5" />
              </span>
              <p className="font-bold">{c.title}</p>
              <p className="mt-1 text-xs text-zinc-400">{c.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <h2 className="mb-4 font-display text-2xl font-extrabold">Popular articles</h2>
          <div className="card divide-y divide-zinc-100 dark:divide-white/10">
            {filtered.map((a) => (
              <Link key={a.title} href={a.href} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-white/5">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-4 w-4 shrink-0 text-zinc-400" />
                  <span className="truncate text-sm font-medium">{a.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-zinc-300" />
              </Link>
            ))}
          </div>
          {filtered.length === 0 && <p className="py-8 text-center text-sm text-zinc-400">No articles found — try another search.</p>}
        </div>
      </div>
    </div>
  );
}
