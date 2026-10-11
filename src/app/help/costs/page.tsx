import Link from "next/link";
import { ChevronRight, LifeBuoy, ArrowLeft } from "lucide-react";

export default function HelpArticle() {
  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-zinc-400" aria-label="Breadcrumb">
          <Link href="/help" className="hover:text-indigo-500">Help Center</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-zinc-600 dark:text-zinc-300">How much does a generation cost?</span>
        </nav>
        <article className="card p-8 sm:p-10">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-500">
            <LifeBuoy className="h-3.5 w-3.5" /> Help article
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">How much does a generation cost?</h1>
<p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
  Every generation shows its estimated cost before you run it. As a rough guide:
  3–6 credits per image, 24+ per video, 18 per music track, 1 per text output.
  Resolution, duration, outputs and model choice change the price.
  Credits are only deducted when a generation succeeds.
</p>
<p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
  You can see your balance anytime in the top navigation and trace every spend in
  Dashboard → Credits &amp; Billing.
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
