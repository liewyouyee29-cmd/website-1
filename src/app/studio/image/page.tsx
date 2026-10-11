"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ImageIcon,
  Upload,
  X,
  Copy,
  Check,
  RotateCcw,
  Download,
  History,
  Wand2,
  Sparkles,
  Loader2,
  Maximize,
  Eraser,
  Repeat,
  Palette,
  Smile,
  Cat,
  Grid3X3,
} from "lucide-react";
import { StudioShell, SettingsCard, SettingsSection } from "@/components/studio/studio-shell";
import { PromptBox } from "@/components/studio/prompt-box";
import { Button } from "@/components/ui/button";
import { Chip, SegmentedControl, ProgressBar, Select } from "@/components/ui/fields";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { useStudioGeneration } from "@/hooks/use-studio-generation";
import { fileToDataUrl, cn } from "@/lib/utils";
import { generateArtworkRatio, seedFrom } from "@/lib/demo-media";
import { Artwork, DemoBadge } from "@/components/ui/media";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/providers/auth-provider";

const TOOL_MODES = [
  { id: "text-to-image", label: "Text to Image", icon: Wand2 },
  { id: "image-to-image", label: "Image to Image", icon: Repeat },
  { id: "upscale", label: "Upscaler", icon: Maximize },
  { id: "remove-bg", label: "Background", icon: Eraser },
  { id: "remove-object", label: "Object Remover", icon: Eraser },
  { id: "anime", label: "Anime Art", icon: Cat },
  { id: "sticker", label: "Sticker", icon: Smile },
  { id: "pixel", label: "Pixel Art", icon: Grid3X3 },
] as const;

type ToolMode = (typeof TOOL_MODES)[number]["id"];

const MODELS = [
  { id: "weaver-photo", name: "Weaver Photo", desc: "Photoreal stills", cost: 4 },
  { id: "aurora-xl", name: "Aurora XL", desc: "4K creative imagery", cost: 6 },
  { id: "weaver-anime", name: "Weaver Anime", desc: "Anime & manga", cost: 3 },
];

const RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"] as const;
const STYLES = ["photorealistic", "cinematic", "3d render", "watercolor", "clay", "line art", "synthwave"] as const;

export default function ImageStudioPage() {
  return (
    <Suspense>
      <ImageStudio />
    </Suspense>
  );
}

function ImageStudio() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") ?? "";
  const [mode, setMode] = useState<ToolMode>("text-to-image");
  const [prompt, setPrompt] = useState(initialPrompt);
  const [negative, setNegative] = useState("");
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [ratio, setRatio] = useState<(typeof RATIOS)[number]>("1:1");
  const [dimension, setDimension] = useState(1024);
  const [numOutputs, setNumOutputs] = useState(1);
  const [style, setStyle] = useState<string>("");
  const [references, setReferences] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { stage, progress, error, isBusy, results, generate, cancel, canGenerate } = useStudioGeneration("image");

  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const cost = useMemo(
    () => model.cost * numOutputs + (dimension >= 1536 ? 8 : 0) + (mode === "upscale" ? 12 : 0),
    [model.cost, numOutputs, dimension, mode],
  );

  const needsReference = ["image-to-image", "remove-bg", "remove-object"].includes(mode);
  const isEditTool = mode !== "text-to-image";

  const submit = async () => {
    if (!canGenerate) {
      toast("You're out of credits. Add credits to keep creating.", "error");
      return;
    }
    if (!isEditTool && !prompt.trim()) {
      toast("Describe the image you want to create.", "error");
      return;
    }
    if (needsReference && references.length === 0) {
      toast("Add a reference image first.", "error");
      return;
    }
    await generate({
      prompt: prompt || defaultEditPrompt(mode),
      negativePrompt: negative,
      modelId,
      aspectRatio: ratio,
      numOutputs,
      style: style || undefined,
      dim: dimension,
      tool: mode,
      reference: references[0],
    });
  };

  const onFiles = async (files: FileList | undefined | null) => {
    if (!files) return;
    const list = Array.from(files).slice(0, 4 - references.length);
    if (list.length === 0) return;
    const converted = await Promise.all(list.map((f) => fileToDataUrl(f)));
    setReferences((prev) => [...prev, ...converted].slice(0, 4));
  };

  return (
    <StudioShell
      icon={<ImageIcon className="h-7 w-7" />}
      eyebrow="AI Image"
      title="AI Image Generator"
      description="Generate, edit, upscale and restyle images — with reference control and style presets."
    >
      {/* Mode rail */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {TOOL_MODES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMode(t.id)}
            aria-pressed={mode === t.id}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
              mode === t.id
                ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                : "border-zinc-300 text-zinc-600 hover:border-indigo-400 dark:border-white/15 dark:text-zinc-300",
            )}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {isEditTool && !needsReference && (
            <div className="card flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 text-white">
                  <Wand2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">{titledMode(mode)}</p>
                  <p className="text-xs text-zinc-400">{toolDescription(mode)}</p>
                </div>
              </div>
              <Badge tone="indigo">{cost} credits</Badge>
            </div>
          )}

          <PromptBox
            value={prompt}
            onChange={setPrompt}
            onSubmit={submit}
            busy={isBusy}
            placeholder={isEditTool ? "Describe the edit — e.g. 'make it moody, golden hour'…" : "Describe the image you'd like to create…"}
          />

          {/* Reference images */}
          {(isEditTool) && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {needsReference ? "Reference image" : "Reference images (optional, max 4)"}
              </p>
              {references.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-3">
                  {references.map((ref, i) => (
                    <div key={i} className="relative h-24 w-24 overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10">
                      <img src={ref} alt={`Reference ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        aria-label="Remove reference"
                        onClick={() => setReferences((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {references.length < 4 && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 py-6 text-sm font-medium text-zinc-500 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-white/15"
                >
                  <Upload className="h-5 w-5" /> {references.length === 0 ? "Upload" : "Add more"} images
                </button>
              )}
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
            </div>
          )}

          <SettingsCard>
            {mode === "text-to-image" && (
              <SettingsSection title="Negative prompt (optional)">
                <input
                  value={negative}
                  onChange={(e) => setNegative(e.target.value)}
                  placeholder="low-res, watermark, extra fingers…"
                  className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-white/15 dark:bg-zinc-900/60"
                />
              </SettingsSection>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <SettingsSection title="Aspect ratio">
                <div className="flex flex-wrap gap-2">
                  {RATIOS.map((r) => (
                    <Chip key={r} active={ratio === r} onClick={() => setRatio(r)}>{r}</Chip>
                  ))}
                </div>
              </SettingsSection>
              <SettingsSection title="Dimensions">
                <div className="space-y-2">
                  <input type="range" min={512} max={2048} step={256} value={dimension} onChange={(e) => setDimension(Number(e.target.value))} />
                  <div className="flex justify-between text-[11px] text-zinc-400"><span>512</span><span className="font-bold text-indigo-500">{dimension}px</span><span>2048</span></div>
                </div>
              </SettingsSection>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <SettingsSection title="Outputs">
                <div className="flex gap-2">
                  {[1, 2, 4].map((n) => (
                    <Chip key={n} active={numOutputs === n} onClick={() => setNumOutputs(n)}>{n}</Chip>
                  ))}
                </div>
              </SettingsSection>
              <SettingsSection title="AI model">
                <Select value={modelId} onChange={(e) => setModelId(e.target.value)}>
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} — {m.desc}</option>
                  ))}
                </Select>
              </SettingsSection>
            </div>
            <SettingsSection title="Style preset">
              <div className="flex flex-wrap gap-1.5">
                {STYLES.map((s) => (
                  <Chip key={s} active={style === s} onClick={() => setStyle(style === s ? "" : s)}>{s}</Chip>
                ))}
              </div>
            </SettingsSection>
            <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm dark:bg-white/5">
              <span className="font-semibold">Estimated cost:</span>{" "}
              <span className="font-bold text-amber-600 dark:text-amber-400">{cost} credits</span>
              <span className="ml-2 text-xs text-zinc-400">{user ? `${user.credits} available` : "sign in for a credit balance"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {isBusy ? (
                <Button variant="danger" onClick={cancel}><X className="h-4 w-4" /> Cancel</Button>
              ) : (
                <>
                  <Button variant="gradient" onClick={submit} loading={isBusy} disabled={isBusy || !canGenerate}>
                    <Sparkles className="h-4 w-4" /> {isEditTool ? "Apply edit" : "Generate image"}
                  </Button>
                  {stage === "done" && <Button variant="outline" onClick={submit}><RotateCcw className="h-4 w-4" /> Regenerate</Button>}
                </>
              )}
            </div>
          </SettingsCard>

          {isBusy && (
            <div className="card space-y-2 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Painting with the demo engine…
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

          <h2 className="mt-2 flex items-center gap-2 font-display text-lg font-bold">
            <History className="h-4 w-4" /> Recent results
          </h2>
          {results.length === 0 && !isBusy ? (
            <EmptyState
              icon={<ImageIcon className="h-6 w-6" />}
              title="No images yet"
              description="Your generations and edits will appear here. Download, copy, or reuse them."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((r) => {
                const images = r.result.images?.[0]?.urls ?? [];
                return images.map((img, i) => (
                  <ImageResultCard key={`${r.id}-${i}`} url={img.url} seed={seedFrom(r.id + i)} cost={r.result.creditCost} demo={r.result.demo} />
                ));
              })}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Editing tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {TOOL_MODES.filter((t) => t.id !== "text-to-image").map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setMode(t.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-2xl border px-3 py-2.5 text-xs font-medium transition-colors",
                    mode === t.id
                      ? "border-indigo-400 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                      : "border-zinc-200 text-zinc-600 hover:border-indigo-300 dark:border-white/10 dark:text-zinc-300",
                  )}
                >
                  <t.icon className="h-3.5 w-3.5 text-indigo-400" /> {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Prompt formula</h3>
            <p className="rounded-2xl bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed text-zinc-600 dark:bg-white/5 dark:text-zinc-300">
              [subject] + [setting] + [lighting] + [style] + [quality tags]
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              e.g. “A glass fox in a midnight garden, soft neon glow, <em>macro photography, cinematic, 8k</em>”
            </p>
          </div>
        </aside>
      </div>
    </StudioShell>
  );
}

function ImageResultCard({ url, seed, cost, demo }: { url: string; seed: number; cost: number; demo: boolean }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  return (
    <div className="card overflow-hidden">
      <Artwork src={url} alt="Generated image" aspect="1/1" />
      {demo && <div className="px-3 pt-2"><DemoBadge className="bg-transparent" /></div>}
      <div className="flex items-center justify-between gap-2 p-3.5">
        <p className="text-[11px] text-zinc-400">{cost} credits · seed {seed % 100000}</p>
        <div className="flex gap-1.5">
          <Button variant="outline" size="icon" aria-label="Copy prompt" onClick={() => { setCopied(true); toast("Prompt copied.", "info"); window.setTimeout(() => setCopied(false), 1500); }}>
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" aria-label="Download" onClick={() => toast("Downloads are disabled in demo mode.", "info")}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function titledMode(mode: ToolMode): string {
  return TOOL_MODES.find((t) => t.id === mode)?.label ?? "Edit";
}

function toolDescription(mode: ToolMode): string {
  switch (mode) {
    case "upscale": return "Increase resolution while keeping detail crisp.";
    case "remove-bg": return "Separate the subject from its background.";
    case "remove-object": return "Erase unwanted objects from a photo.";
    case "anime": return "Restyle into polished anime artwork.";
    case "sticker": return "Bold sticker-style casual illustrations.";
    case "pixel": return "Retro pixel-art conversion.";
    default: return "Guided image-to-image editing.";
  }
}

function defaultEditPrompt(mode: ToolMode): string {
  switch (mode) {
    case "upscale": return "Upscale this image, keep all details";
    case "remove-bg": return "Remove background, keep subject";
    case "remove-object": return "Remove the unwanted object";
    case "anime": return "Convert to high-quality anime art";
    case "sticker": return "Convert to a sticker-friendly illustration";
    case "pixel": return "Convert to crisp pixel art";
    default: return "Edit this image as described";
  }
}