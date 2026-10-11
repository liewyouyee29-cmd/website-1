import Link from "next/link";
import { FlaskConical, ShieldCheck, Wand2, Plug } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DemoModePage() {
  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <Badge tone="amber" className="mb-4"><FlaskConical className="h-3 w-3" /> Why demo mode?</Badge>
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Everything works. The AI is a stand-in.</h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Weaver is built around a provider layer. When a real AI provider is connected (image, video,
          music or text keys in your environment), generation is handled by that provider. When no
          keys are present — like this preview build — Weaver switches to a <strong>deterministic demo
          engine</strong>, and every output is clearly labelled <strong>“Demo preview”</strong>.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-500"><Wand2 className="h-5 w-5" /></span>
            <h2 className="font-semibold">Real workflows</h2>
            <p className="mt-1 text-xs text-zinc-400">Prompts, settings, progress, history, credits and previews all behave like production.</p>
          </div>
          <div className="card p-5">
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500"><ShieldCheck className="h-5 w-5" /></span>
            <h2 className="font-semibold">Honest labels</h2>
            <p className="mt-1 text-xs text-zinc-400">Every demo output carries a Demo badge — we never pretend generated media is real.</p>
          </div>
          <div className="card p-5">
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-500"><Plug className="h-5 w-5" /></span>
            <h2 className="font-semibold">Provider-ready</h2>
            <p className="mt-1 text-xs text-zinc-400">Add API keys and the demo engine steps aside — no code changes needed.</p>
          </div>
        </div>

        <div className="card mt-10 p-6">
          <h2 className="mb-3 font-display text-lg font-bold">What&apos;s supported where</h2>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <li><strong>Images & video:</strong> deterministic SVG renderings from your prompt (style-aware).</li>
            <li><strong>Music:</strong> a real Web Audio synth in your browser plays a unique track per prompt.</li>
            <li><strong>Text:</strong> a local template engine writes prompts, scripts, storyboards and lyrics.</li>
            <li><strong>Downloads & payments:</strong> disabled in demo mode — connect providers to enable.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/studio/image" className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">Try the studio</Link>
          <Link href="/legal/ai-transparency" className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-semibold hover:border-indigo-400 dark:border-white/15">Read AI transparency →</Link>
        </div>
      </div>
    </div>
  );
}