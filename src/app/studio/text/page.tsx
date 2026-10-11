"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  PenLine,
  Sparkles,
  Wand2,
  Copy,
  Check,
  Save,
  Trash2,
  BookOpen,
  Film,
  Music2,
  ImageIcon,
  Lightbulb,
  History,
  Loader2,
} from "lucide-react";
import { StudioShell } from "@/components/studio/studio-shell";
import { Button } from "@/components/ui/button";
import { Field, Textarea, Input, SegmentedControl, Chip } from "@/components/ui/fields";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { useStudioGeneration } from "@/hooks/use-studio-generation";
import { PROMPT_TEMPLATES } from "@/config/site";
import { cn, truncate } from "@/lib/utils";

type AssistantKind = "enhance" | "script" | "storyboard" | "ideas" | "lyrics" | "generic";

const KINDS: { id: AssistantKind; label: string; icon: typeof Wand2; desc: string; placeholder: string }[] = [
  { id: "enhance", label: "Enhance Prompt", icon: Wand2, desc: "Make any creative prompt richer and more describable.", placeholder: "Paste the rough prompt you want to level up…" },
  { id: "script", label: "Script Writing", icon: Film, desc: "Draft short video scripts with a clear three-act structure.", placeholder: "What is the video about? Who is it for?" },
  { id: "storyboard", label: "Storyboard", icon: BookOpen, desc: "Break a concept into camera-ready beats.", placeholder: "Describe the video concept…" },
  { id: "ideas", label: "Idea Sparker", icon: Lightbulb, desc: "Brainstorm hooks, titles and creative directions.", placeholder: "What do you want ideas about?" },
  { id: "lyrics", label: "Lyrics", icon: Music2, desc: "Start song lyrics from a theme or line.", placeholder: "A theme, mood and title hint for the song…" },
  { id: "generic", label: "Creative Desk", icon: PenLine, desc: "General writing help for descriptions or copy.", placeholder: "What should the AI write for you?" },
];

interface SavedPrompt {
  id: string;
  kind: AssistantKind;
  title: string;
  content: string;
  savedAt: string;
}

export default function TextStudioPage() {
  return (
    <Suspense>
      <TextStudio />
    </Suspense>
  );
}

function TextStudio() {
  const searchParams = useSearchParams();
  const initialPrompt = useMemo(() => searchParams.get("prompt") ?? "", [searchParams]);

  const [kind, setKind] = useState<AssistantKind>("enhance");
  const [prompt, setPrompt] = useState(initialPrompt);
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState<SavedPrompt[]>([]);
  const [title, setTitle] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { stage, progress, error, isBusy, generate, canGenerate } = useStudioGeneration("text");

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const run = async () => {
    if (!canGenerate) {
      toast("You're out of credits. Add credits to keep creating.", "error");
      return;
    }
    if (!prompt.trim()) {
      toast("Type something for the studio to work with.", "error");
      return;
    }
    const entry = await generate({ kind, prompt: prompt.trim(), modelId: "weaver-text" });
    if (!entry) return;
    const text = entry.result.text?.text ?? "";
    setOutput(text);
    setTitle(prompt.trim().split(/\n/)[0].slice(0, 60));
    window.setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  };

  const copyOutput = () => {
    navigator.clipboard?.writeText(output).catch(() => undefined);
    setCopied(true);
    toast("Copied to clipboard.", "info");
    window.setTimeout(() => setCopied(false), 1400);
  };

  const savePrompt = () => {
    if (!output || !title) return;
    const entry: SavedPrompt = { id: `sp${Date.now()}`, kind, title, content: output, savedAt: new Date().toISOString() };
    setSaved((prev) => [entry, ...prev].slice(0, 30));
    toast("Saved to your prompts library.", "success");
  };

  const k = KINDS.find((k) => k.id === kind)!;

  return (
    <StudioShell
      icon={<PenLine className="h-7 w-7" />}
      eyebrow="AI Text"
      title="AI Prompt & Creative Studio"
      description="Write better prompts, scripts, storyboards and lyrics — then copy them straight into any generator."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {/* Kind rail */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {KINDS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => { setKind(item.id); setOutput(""); }}
                aria-pressed={kind === item.id}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
                  kind === item.id
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                    : "border-zinc-300 text-zinc-600 hover:border-indigo-400 dark:border-white/15 dark:text-zinc-300",
                )}
              >
                <item.icon className="h-3.5 w-3.5" /> {item.label}
              </button>
            ))}
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-indigo-50 px-4 py-3 dark:bg-indigo-500/10">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
                <k.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold">{k.desc}</p>
              </div>
            </div>
            <Field label="Your input" hint={`${prompt.length}/2000`}>
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={k.placeholder} rows={5} />
            </Field>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] text-zinc-400">Tip: reference a saved prompt below to reuse it.</p>
              <Button variant="gradient" onClick={run} loading={isBusy} disabled={isBusy || !canGenerate}>
                <Sparkles className="h-4 w-4" /> Generate
              </Button>
            </div>
          </div>

          {isBusy && (
            <div className="card flex items-center gap-3 p-4 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              <span className="flex-1 font-medium">Working on it — demo text engine at {Math.round(progress)}%</span>
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}

          {output && (
            <div className="card overflow-hidden" ref={outputRef}>
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Badge tone="indigo">Output</Badge>
                  <span className="text-sm font-semibold">{title}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyOutput}>
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />} Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={savePrompt}>
                    <Save className="h-3.5 w-3.5" /> Save
                  </Button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap px-5 py-4 font-sans text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                {output}
              </pre>
            </div>
          )}

          {/* Saved prompts */}
          <div className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
              <History className="h-4 w-4" /> Saved prompts ({saved.length})
            </h2>
            {saved.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-400 dark:border-white/15">
                Nothing saved yet — hit <strong>Save</strong> on an output to keep it for reuse.
              </p>
            ) : (
              <div className="space-y-2">
                {saved.map((p) => (
                  <div key={p.id} className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.title}</p>
                      <p className="truncate text-xs text-zinc-400">{truncate(p.content, 120)}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setPrompt(p.content); setKind(p.kind); toast("Loaded into the composer.", "info"); }}>
                        <Wand2 className="h-3.5 w-3.5" /> Reuse
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => { setSaved((prev) => prev.filter((x) => x.id !== p.id)); toast("Deleted.", "info"); }}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <Wand2 className="h-3.5 w-3.5" /> Template prompts
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {PROMPT_TEMPLATES.slice(0, 8).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setPrompt(t.prompt); setKind(t.kind === "image" ? "enhance" : t.kind === "video" ? "storyboard" : t.kind === "music" ? "lyrics" : "generic"); toast("Template loaded.", "info"); }}
                  className="rounded-2xl border border-zinc-200 p-3 text-left transition hover:border-indigo-400 dark:border-white/10"
                >
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-indigo-500">{t.category}</span>
                  <span className="line-clamp-2 text-xs font-medium text-zinc-700 dark:text-zinc-200">{t.title}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <ImageIcon className="h-3.5 w-3.5" /> Prompt anatomy
            </h3>
            <p className="rounded-2xl bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed text-zinc-600 dark:bg-white/5 dark:text-zinc-300">
              subject + setting + lighting + motion + style + camera + quality
            </p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              The enhance mode turns fragments into full sentences with strong visual cues your
              generator can act on.
            </p>
          </div>
        </aside>
      </div>
    </StudioShell>
  );
}