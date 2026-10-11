import Link from "next/link";
import { ChevronRight, LifeBuoy, ArrowLeft } from "lucide-react";

export default function HelpArticle() {
  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-zinc-400" aria-label="Breadcrumb">
          <Link href="/help" className="hover:text-indigo-500">Help Center</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-zinc-600 dark:text-zinc-300">Do I own the content I create?</span>
        </nav>
        <article className="card p-8 sm:p-10">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-500">
            <LifeBuoy className="h-3.5 w-3.5" /> Help article
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Do I own the content I create?</h1>
<p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
  On paid plans you own your outputs and may use them commercially, including
  product shots, social content and within client work. Free accounts are for
  personal use and outputs carry a Weaver watermark.
</p>
<p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
  You remain responsible for inputs: don&apos;t create works that closely mimic a living
  artist or use someone&apos;s likeness without consent. See Terms of Service sections 5–6.
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
