"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Clapperboard,
  Upload,
  X,
  Copy,
  Check,
  RotateCcw,
  Download,
  History,
  Film,
  Loader2,
} from "lucide-react";
import { StudioShell, SettingsCard, SettingsSection } from "@/components/studio/studio-shell";
import { PromptBox } from "@/components/studio/prompt-box";
import { Button } from "@/components/ui/button";
import { Chip, SegmentedControl, ProgressBar, Select, Input } from "@/components/ui/fields";
import { useToast } from "@/components/ui/toaster";
import { useStudioGeneration } from "@/hooks/use-studio-generation";
import { fileToDataUrl } from "@/lib/utils";
import { generateDemoClip } from "@/lib/demo-media";
import { ClipPlayer, DemoBadge } from "@/components/ui/media";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

const MODELS = [
  { id: "weaver-motion", name: "Weaver Motion", desc: "Balanced text-to-video, 5–12s", cost: 24 },
  { id: "weaver-motion-pro", name: "Weaver Motion Pro", desc: "Higher fidelity, longer clips", cost: 36 },
  { id: "animate-diff-live", name: "AnimateDiff Live", desc: "Anime & stylized motion", cost: 28 },
];

const RATIOS = ["16:9", "9:16", "1:1", "21:9"] as const;
const RESOLUTIONS = ["480p", "720p", "1080p"] as const;
const STYLES = ["cinematic", "anime", "clay", "neon", "sketch", "3d"] as const;

export default function VideoStudioPage() {
  return (
    <Suspense>
      <VideoStudio />
    </Suspense>
  );
}

function VideoStudio() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") ?? "";
  const [mode, setMode] = useState<"text" | "image">("text");
  const [prompt, setPrompt] = useState(initialPrompt);
  const [negative, setNegative] = useState("");
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [ratio, setRatio] = useState<(typeof RATIOS)[number]>("16:9");
  const [resolution, setResolution] = useState<(typeof RESOLUTIONS)[number]>("720p");
  const [duration, setDuration] = useState(6);
  const [imageInput, setImageInput] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { stage, progress, error, isBusy, results, generate, cancel, canGenerate } = useStudioGeneration("video");

  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const cost = useMemo(
    () => model.cost + (duration > 8 ? 8 : 0) + (resolution === "1080p" ? 10 : resolution === "720p" ? 4 : 0),
    [model.cost, duration, resolution],
  );

  const submit = async () => {
    if (!canGenerate) {
      toast("You're out of credits. Add credits to keep creating.", "error");
      return;
    }
    if (!prompt.trim()) {
      toast("Describe the video you want to create.", "error");
      return;
    }
    if (mode === "image" && !imageInput) {
      toast("Add a starting image to use image-to-video.", "error");
      return;
    }
    await generate({
      prompt,
      negativePrompt: negative,
      modelId,
      aspectRatio: ratio,
      resolution,
      durationSec: duration,
      imageInput: mode === "image" ? imageInput : null,
    });
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Please choose an image file.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("Image must be under 5 MB.", "error");
      return;
    }
    setImageInput(await fileToDataUrl(file));
  };

  return (
    <StudioShell
      icon={<Clapperboard className="h-7 w-7" />}
      eyebrow="AI Video"
      title="AI Video Generator"
      description="Turn text or still images into motion with camera control, styles and duration settings."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <SegmentedControl
            value={mode}
            onChange={(v) => setMode(v)}
            options={[
              { value: "text", label: "Text to Video" },
              { value: "image", label: "Image to Video" },
            ]}
            className="max-w-xs"
          />

          <PromptBox
            value={prompt}
            onChange={setPrompt}
            onSubmit={submit}
            busy={isBusy}
            placeholder={mode === "image" ? "Describe how the image should move…" : "Describe the scene, motion, and camera movement…"}
          />

          {mode === "image" && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Starting image</p>
              {imageInput ? (
                <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3 dark:border-white/10">
                  <div className="w-24 overflow-hidden rounded-xl">
                    <img src={imageInput} alt="Starting frame" className="aspect-video w-full object-cover" />
                  </div>
                  <p className="flex-1 text-xs text-zinc-500">Photo ready — describe the motion you want.</p>
                  <Button variant="ghost" size="icon" onClick={() => setImageInput(null)} aria-label="Remove image">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 py-6 text-sm font-medium text-zinc-500 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-white/15"
                >
                  <Upload className="h-5 w-5" /> Upload a starting image
                </button>
              )}
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </div>
          )}

          <SettingsCard>
            <SettingsSection title="Negative prompt (optional)">
              <Input value={negative} onChange={(e) => setNegative(e.target.value)} placeholder="Things to avoid: blurry, distorted, watermark…" />
            </SettingsSection>
            <SettingsSection title="Aspect ratio">
              <div className="flex flex-wrap gap-2">
                {RATIOS.map((r) => (
                  <Chip key={r} active={ratio === r} onClick={() => setRatio(r)}>{r}</Chip>
                ))}
              </div>
            </SettingsSection>
            <div className="grid gap-5 sm:grid-cols-2">
              <SettingsSection title="Duration">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Seconds</span>
                    <span className="font-bold">{duration}s</span>
                  </div>
                  <input type="range" min={3} max={12} step={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                  <div className="flex justify-between text-[10px] text-zinc-400"><span>3s</span><span>8s</span><span>12s</span></div>
                </div>
              </SettingsSection>
              <SettingsSection title="Resolution">
                <div className="flex flex-wrap gap-2">
                  {RESOLUTIONS.map((r) => (
                    <Chip key={r} active={resolution === r} onClick={() => setResolution(r)}>{r}</Chip>
                  ))}
                </div>
              </SettingsSection>
            </div>
            <SettingsSection title="AI model">
              <Select value={modelId} onChange={(e) => setModelId(e.target.value)}>
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} — {m.desc}</option>
                ))}
              </Select>
            </SettingsSection>
            <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm dark:bg-white/5">
              <span className="font-semibold">Estimated cost:</span>{" "}
              <span className="font-bold text-amber-600 dark:text-amber-400">{cost} credits</span>
              <span className="ml-2 text-xs text-zinc-400">charged only on success</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {isBusy ? (
                <Button variant="danger" onClick={cancel}><X className="h-4 w-4" /> Cancel generation</Button>
              ) : stage === "done" || stage === "error" ? (
                <>
                  <Button onClick={submit}><RotateCcw className="h-4 w-4" /> Regenerate</Button>
                  <Button variant="outline" onClick={() => { setPrompt(""); setNegative(""); setImageInput(null); }}>Clear</Button>
                </>
              ) : (
                <Button variant="gradient" onClick={submit} loading={isBusy} disabled={isBusy || !canGenerate}>
                  <Clapperboard className="h-4 w-4" /> Generate video
                </Button>
              )}
            </div>
          </SettingsCard>

          {isBusy && (
            <div className="card space-y-2 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Rendering with the demo engine…
                </span>
                <span className="text-xs text-zinc-400">{Math.round(progress)}%</span>
              </div>
              <ProgressBar value={progress} />
              <p className="text-[11px] text-zinc-400">Demo mode: producing a locally-rendered animated preview.</p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}

          <SectionTitle icon={<History className="h-4 w-4" />} title="Recent generations" />
          {results.length === 0 && !isBusy ? (
            <EmptyState
              icon={<Film className="h-6 w-6" />}
              title="No videos yet"
              description="Your generated clips will appear here with full preview controls."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((r) => {
                const clip = r.result.video;
                if (!clip) return null;
                const preview = generateDemoClip({ seed: 1, ratio: "16:9", duration: 6 });
                const src = clip.videoUrl || preview.url;
                return (
                  <VideoResultCard
                    key={r.id}
                    src={src}
                    thumb={clip.thumbUrl}
                    title={r.result.video?.modelId ?? "Weaver Motion"}
                    cost={r.result.creditCost}
                    demo={r.result.demo}
                  />
                );
              })}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <PromptsPanel />
          <StyleTipsPanel />
        </aside>
      </div>
    </StudioShell>
  );
}

function VideoResultCard({ src, thumb, title, cost, demo }: { src: string; thumb?: string; title: string; cost: number; demo: boolean }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  return (
    <div className="card overflow-hidden">
      <ClipPlayer src={src} thumb={thumb} />
      <div className="flex items-center justify-between gap-2 p-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="text-[11px] text-zinc-400">{cost} credits</p>
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="icon" aria-label="Copy prompt" onClick={() => { setCopied(true); toast("Prompt copied.", "info"); window.setTimeout(() => setCopied(false), 1500); }}>
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" aria-label="Download preview" onClick={() => { toast("Downloads are disabled in demo mode — connect a provider for real exports.", "info"); }}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {demo && <div className="px-3.5 pb-3"><DemoBadge className="bg-transparent" /></div>}
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="mt-2 flex items-center gap-2 font-display text-lg font-bold">
      {icon} {title}
    </h2>
  );
}

function PromptsPanel() {
  const { toast } = useToast();
  const samples = [
    "A drone lingers over a thunderstorm rolling across golden fields, epic score cue",
    "Macro shot of a flower blooming in fast motion, dew catching warm light",
    "A paper boat sailing a glowing canal through an old European town at night",
    "Claymation snowman melting gracefully as spring arrives, stop-motion craft",
  ];
  return (
    <div className="card p-5">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Inspiration prompts</h3>
      <div className="space-y-2">
        {samples.map((s, i) => (
          <div key={i} className="group flex items-start gap-2 rounded-2xl bg-zinc-50 p-3 dark:bg-white/5">
            <p className="flex-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">“{s}”</p>
            <button
              type="button"
              aria-label="Use this prompt"
              onClick={() => { navigator.clipboard?.writeText(s).catch(() => undefined); toast("Prompt copied.", "info"); }}
              className="rounded-lg p-1 text-zinc-400 opacity-0 transition group-hover:opacity-100 hover:text-indigo-500"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StyleTipsPanel() {
  return (
    <div className="card p-5">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Motion styles</h3>
      <div className="flex flex-wrap gap-1.5">
        {STYLES.map((s) => (
          <span key={s} className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
            {s}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-zinc-400">
        Style hints are detected from your prompt. The demo engine picks the best fit;
        real providers use their native style mapping.
      </p>
    </div>
  );
}