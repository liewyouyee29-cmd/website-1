import Link from "next/link";
import { Twitter, Instagram, Youtube, MessageCircle, Github, Sparkles } from "lucide-react";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Create",
    links: [
      { href: "/studio/video", label: "AI Video Generator" },
      { href: "/studio/image", label: "AI Image Generator" },
      { href: "/studio/music", label: "AI Music Generator" },
      { href: "/studio/text", label: "AI Prompt Studio" },
      { href: "/tools/video-upscaler", label: "Video Upscaler" },
      { href: "/tools/image-upscaler", label: "Image Upscaler" },
      { href: "/tools/avatar", label: "Talking Avatar" },
      { href: "/tools/pixel-art", label: "Pixel Art Studio" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/explore", label: "Explore & Community" },
      { href: "/pricing", label: "Pricing & Credits" },
      { href: "/academy", label: "Academy" },
      { href: "/blog", label: "Blog" },
      { href: "/help", label: "Help Center" },
      { href: "/dashboard", label: "My Creations" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/cookies", label: "Cookie Preferences" },
      { href: "/legal/refunds", label: "Refund Policy" },
      { href: "/legal/billing", label: "Billing & Cancellation" },
      { href: "/legal/safety", label: "Content & Safety Policy" },
      { href: "/legal/reporting", label: "Content Reporting" },
      { href: "/legal/ai-transparency", label: "AI Transparency" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-[#0a0a14]">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-500 text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold">
                Weaver<span className="text-gradient"> AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Your ideas, brought to life with AI. A creative studio for video, image, music and text —
              generate, edit, organize and explore in one place.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
                { icon: MessageCircle, label: "Discord" },
                { icon: Github, label: "GitHub" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="rounded-full border border-zinc-200 p-2.5 text-zinc-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:text-zinc-400 dark:hover:text-indigo-300"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col, i) => (
            <div key={col.title} className={i === 0 ? "lg:col-span-1" : "lg:col-span-1"}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-400 dark:border-white/10 sm:flex-row">
          <p>© {new Date().getFullYear()} Weaver AI Studio. Crafted with curiosity.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}