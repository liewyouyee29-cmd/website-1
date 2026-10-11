import Link from "next/link";
import { ChevronRight, LifeBuoy, ArrowLeft } from "lucide-react";

export default function HelpArticle() {
  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-zinc-400" aria-label="Breadcrumb">
          <Link href="/help" className="hover:text-indigo-500">Help Center</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-zinc-600 dark:text-zinc-300">How to write prompts that work</span>
        </nav>
        <article className="card p-8 sm:p-10">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-500">
            <LifeBuoy className="h-3.5 w-3.5" /> Help article
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">How to write prompts that work</h1>
<p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
  A great prompt is a small creative brief. Use this anatomy for reliable results:
</p>
<ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
  <li><strong>Subject</strong> — what is it? A fox spirit? A floating cabin?</li>
  <li><strong>Setting</strong> — where and when? Neon forest at dusk?</li>
  <li><strong>Lighting &amp; mood</strong> — golden hour, harsh flash, soft glow?</li>
  <li><strong>Style</strong> — photorealistic, anime, clay render, watercolor?</li>
  <li><strong>Quality tags</strong> — cinematic, 8k, macro, detailed.</li>
</ol>
<p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
  Example: <em>“A fox spirit in a neon-lit forest at dusk, cinematic lighting, anime style, highly detailed”</em>.
  Use the Prompt Studio&apos;s <strong>Enhance</strong> button to expand your draft automatically.
</p>
          <div className="mt-10 border-t border-zinc-100 pt-6 dark:border-white/10">
            <Link href="/help" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
              <ArrowLeft className="h-4 w-4" /> Back to Help Center
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
