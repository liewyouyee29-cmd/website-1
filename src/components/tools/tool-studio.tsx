"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import {
  Upload,
  X,
  Sparkles,
  Loader2,
  Check,
  Trash2,
  History,
  Wand2,
  RotateCcw,
  Download as DownloadIcon,
} from "lucide-react";
import { StudioShell } from "@/components/studio/studio-shell";
import { Button } from "@/components/ui/button";
import { Field, Textarea, ProgressBar } from "@/components/ui/fields";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { useStudioGeneration } from "@/hooks/use-studio-generation";
import { fileToDataUrl } from "@/lib/utils";
import type { GenerationResult } from "@/lib/providers";
import { Artwork, DemoBadge } from "@/components/ui/media";
import { EmptyState } from "@/components/ui/empty-state";

export type ToolConfig = {
  id: string;
  kind: "image" | "video" | "music" | "text";
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  cost: number;
  defaultPrompt: string;
  requiresReference?: boolean;
  referenceLabel?: string;
  placeholder?: string;
  settings?: ReactNode;
};

/** Reusable interface for the extra creative tools. */
export function ToolStudio({ config }: { config: ToolConfig }) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(config.defaultPrompt);
  const [reference, setReference] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<{ id: string; src: string; title: string }[]>([]);
  const { stage, progress, error, isBusy, results, generate, cancel } = useStudioGeneration(config.kind);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Please choose an image file.", "error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast("File must be under 8 MB.", "error");
      return;
    }
    setReference(await fileToDataUrl(file));
  };

  const submit = async () => {
    if (config.requiresReference && !reference) {
      toast(`Upload ${config.referenceLabel ?? "an image"} first.`, "error");
      return;
    }
    const p = prompt.trim();
    if (!p) {
      toast("Describe what you want.", "error");
      return;
    }
    const entry = await generate({
      prompt: p,
      modelId: config.id,
      tool: config.id,
      reference,
    });
    if (!entry) return;
    const src = pickPreviewUrl(entry.result, config.kind);
    if (src) {
      setHistory((prev) => [{ id: entry.id, src, title: p.slice(0, 60) }, ...prev].slice(0, 12));
    }
  };

  const doneResult = stage === "done" ? results[0]?.result : undefined;
  const preview = pickPreviewUrl(doneResult, config.kind);

  return (
    <StudioShell icon={config.icon} eyebrow={config.eyebrow} title={config.title} description={config.description}>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="card space-y-4 p-5">
            {config.requiresReference && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  {config.referenceLabel ?? "Input image"}
                </p>
                {reference ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3 dark:border-white/10">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <img src={reference} alt="Input" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">Ready to process</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => inputRef.current?.click()}>
                        Replace
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => setReference(null)}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 py-10 text-sm font-medium text-zinc-500 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-white/15"
                  >
                    <Upload className="h-5 w-5" /> Upload {config.referenceLabel ?? "an image"}
                  </button>
                )}
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </div>
            )}

            <Field label="Instructions">
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder={config.placeholder ?? "Describe what you want to do…"} />
            </Field>

            {config.settings}
          </div>

          <div className="card space-y-4 p-5">
            <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm dark:bg-white/5">
              <span className="font-semibold">Estimated cost</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{config.cost} credits</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {isBusy ? (
                <Button variant="danger" onClick={cancel}><X className="h-4 w-4" /> Cancel</Button>
              ) : (
                <>
                  <Button variant="gradient" onClick={submit} loading={isBusy}>
                    <Sparkles className="h-4 w-4" /> Run {config.title}
                  </Button>
                  {stage === "done" && (
                    <Button variant="outline" onClick={submit} title="Re-run with the same inputs">
                      <RotateCcw className="h-4 w-4" /> Again
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {isBusy && (
            <div className="card space-y-2 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Processing with the demo engine…
                </span>
                <span className="text-xs text-zinc-400">{Math.round(progress)}%</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}

          {doneResult && preview && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge tone="emerald"><Check className="h-3 w-3" /> Ready</Badge>
                  <p className="text-sm font-semibold">{config.title} output</p>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => { navigator.clipboard?.writeText(prompt).catch(() => undefined); toast("Prompt copied.", "info"); }}>
                    <Wand2 className="h-3.5 w-3.5" /> Copy prompt
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast("Downloads are disabled in demo mode.", "info")}>
                    <DownloadIcon className="h-3.5 w-3.5" /> Download
                  </Button>
                </div>
              </div>
              <div className="px-4 pb-4">
                <Artwork src={preview} alt="Result preview" aspect={config.kind === "video" ? "16/9" : "1/1"} className="rounded-2xl" />
              </div>
              {doneResult.demo && <div className="px-4 pb-3"><DemoBadge className="bg-transparent" /></div>}
            </div>
          )}

          <h2 className="mt-2 flex items-center gap-2 font-display text-lg font-bold">
            <History className="h-4 w-4" /> Recent runs
          </h2>
          {history.length === 0 && !isBusy ? (
            <EmptyState icon={<Wand2 className="h-6 w-6" />} title="Nothing yet" description="Your runs will show up here." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {history.map((h) => (
                <div key={h.id} className="card flex items-center gap-3 p-3">
                  <img src={h.src} alt="" className="h-14 w-14 rounded-xl object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{h.title}</p>
                  </div>
                  <Button variant="ghost" size="icon" aria-label="Delete run" onClick={() => setHistory((prev) => prev.filter((x) => x.id !== h.id))}>
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">How it works</h3>
            <ol className="list-decimal space-y-2 pl-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              <li>{config.requiresReference ? `Upload ${config.referenceLabel ?? "an image"}.` : "Describe your goal in a sentence."}</li>
              <li>Adjust the optional settings.</li>
              <li>Run once — tune and rerun if you want something different.</li>
              <li>Download when you love it. Demo outputs are clearly labelled.</li>
            </ol>
          </div>
          <div className="card p-5">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Credit cost</h3>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {config.cost} <span className="text-sm font-medium text-zinc-400">credits / run</span>
            </p>
            <p className="mt-2 text-xs text-zinc-400">Charged only on success. Failed runs are always free.</p>
          </div>
        </aside>
      </div>
    </StudioShell>
  );
}

function pickPreviewUrl(result: GenerationResult | undefined, kind: string): string | undefined {
  if (!result) return undefined;
  if (kind === "video" && result.video) return result.video.thumbUrl || result.video.videoUrl || undefined;
  if (result.images?.[0]?.urls?.[0]?.url) return result.images[0].urls[0].url;
  return undefined;
}