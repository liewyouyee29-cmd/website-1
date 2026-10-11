"use client";

import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Music,
  X,
  Loader2,
  History,
  Play,
  Pause,
  Mic,
  Sparkles,
  Download,
  ListMusic,
} from "lucide-react";
import { StudioShell, SettingsCard, SettingsSection } from "@/components/studio/studio-shell";
import { PromptBox } from "@/components/studio/prompt-box";
import { Button } from "@/components/ui/button";
import { Chip, Toggle, ProgressBar, Select } from "@/components/ui/fields";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { useStudioGeneration } from "@/hooks/use-studio-generation";
import { mulberry32, synthesizeDemoTrack } from "@/lib/demo-media";
import { AudioPlayer, DemoBadge } from "@/components/ui/media";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

const GENRES = ["ambient", "lofi", "electronic", "hiphop", "pop", "cinematic", "rock", "classical"] as const;
const MOODS = ["uplifting", "melancholic", "dreamy", "dark", "energetic", "slow"] as const;

export default function MusicStudioPage() {
  return (
    <Suspense>
      <MusicStudio />
    </Suspense>
  );
}

interface Track {
  url: string;
  title: string;
  durationSec: number;
  cost: number;
  genre: string;
  createdAt: string;
  id: string;
}

function MusicStudio() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") ?? "";
  const [prompt, setPrompt] = useState(initialPrompt);
  const [genre, setGenre] = useState<(typeof GENRES)[number]>("lofi");
  const [mood, setMood] = useState<string>("");
  const [instrumental, setInstrumental] = useState(true);
  const [duration, setDuration] = useState(15);
  const [modelId, setModelId] = useState("weaver-verse");
  const { toast } = useToast();

  const { stage, progress, error, isBusy, generate, cancel, canGenerate } = useStudioGeneration("music");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [synthesizing, setSynthesizing] = useState(false);
  const idRef = useRef(0);

  const cost = 18;

  const submit = async () => {
    if (!canGenerate) {
      toast("You're out of credits. Add credits to keep creating.", "error");
      return;
    }
    if (!prompt.trim()) {
      toast("Describe the track — genre, mood, instruments and atmosphere.", "error");
      return;
    }
    const entry = await generate({
      prompt,
      modelId,
      durationSec: duration,
      instrumental,
      genre,
      mood,
    });
    if (!entry) return;

    // In demo mode the server returns no audio; synthesize locally so the
    // player is genuinely functional. Real providers return an audio URL.
    setSynthesizing(true);
    try {
      const seed = idRef.current++;
      const synth = await synthesizeDemoTrack({
        genre,
        mood,
        duration,
        seed: 1000 + seed,
      });
      const title = entry.result.music?.title || prompt.split(/[,.\n]/)[0].trim().slice(0, 60) || "Untitled track";
      setTracks((prev) =>
        [
          { url: synth.url, title, durationSec: synth.durationSec, cost: entry.result.creditCost, genre, createdAt: new Date().toISOString(), id: `t${Date.now()}` },
          ...prev,
        ].slice(0, 20),
      );
    } catch {
      toast("Demo synthesis failed — connect a music provider for real audio.", "error");
    } finally {
      setSynthesizing(false);
    }
  };

  return (
    <StudioShell
      icon={<Music className="h-7 w-7" />}
      eyebrow="AI Music"
      title="AI Music Generator"
      description="Describe a track and get original music you can actually play — genre, mood, structure and optional vocals."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <PromptBox
            value={prompt}
            onChange={setPrompt}
            onSubmit={submit}
            busy={isBusy || synthesizing}
            placeholder="Describe your track… e.g. 'Lo-fi hip-hop for late-night study, warm vinyl crackle, soft electric piano, 78 bpm'"
          />

          <SettingsCard>
            <SettingsSection title="Genre">
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <Chip key={g} active={genre === g} onClick={() => setGenre(g)}>{g}</Chip>
                ))}
              </div>
            </SettingsSection>
            <SettingsSection title="Mood">
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <Chip key={m} active={mood === m} onClick={() => setMood(mood === m ? "" : m)}>{m}</Chip>
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
                  <input type="range" min={10} max={60} step={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                  <div className="flex justify-between text-[10px] text-zinc-400"><span>10s</span><span>35s</span><span>60s</span></div>
                </div>
              </SettingsSection>
              <SettingsSection title="Model">
                <Select value={modelId} onChange={(e) => setModelId(e.target.value)}>
                  <option value="weaver-verse">Weaver Verse — full songs</option>
                  <option value="weaver-voice">Weaver Voice — singing & vocals</option>
                  <option value="demo-synth">Demo Synth — instant local render</option>
                </Select>
              </SettingsSection>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-white/5">
              <div>
                <p className="text-sm font-semibold">Vocals</p>
                <p className="text-xs text-zinc-400">Add sung lyrics (demo renders instrumental only)</p>
              </div>
              <Toggle checked={!instrumental} onChange={(v) => setInstrumental(!v)} label="Vocals" />
            </div>
            <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm dark:bg-white/5">
              <span className="font-semibold">Estimated cost:</span>{" "}
              <span className="font-bold text-amber-600 dark:text-amber-400">{cost} credits</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {isBusy || synthesizing ? (
                <Button variant="danger" onClick={cancel}><X className="h-4 w-4" /> Cancel</Button>
              ) : (
                <Button variant="gradient" onClick={submit} loading={isBusy} disabled={isBusy || !canGenerate}>
                  <Sparkles className="h-4 w-4" /> Compose track
                </Button>
              )}
            </div>
          </SettingsCard>

          {(isBusy || synthesizing) && (
            <div className="card space-y-2 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                  {synthesizing ? "Synthesizing your demo track…" : "Composing with the demo engine…"}
                </span>
                <span className="text-xs text-zinc-400">{Math.round(progress + (synthesizing ? 80 : 0))}%</span>
              </div>
              <ProgressBar value={synthesizing ? 96 : progress} />
              {isBusy && <p className="text-[11px] text-zinc-400">Demo mode: the browser synthesizes a unique WAV based on your genre and mood.</p>}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}

          <h2 className="mt-2 flex items-center gap-2 font-display text-lg font-bold">
            <History className="h-4 w-4" /> Your music library
          </h2>
          {tracks.length === 0 && !isBusy ? (
            <EmptyState
              icon={<ListMusic className="h-6 w-6" />}
              title="Your library is empty"
              description="Every composed track gets a card here — play, download or regenerate it."
            />
          ) : (
            <div className="space-y-3">
              {tracks.map((t) => (
                <MusicResultCard key={t.id} track={t} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <Mic className="h-3.5 w-3.5" /> Write a better music prompt
            </h3>
            <ol className="list-decimal space-y-2 pl-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              <li>Start with the genre & tempo: “Chill lo-fi, 120 bpm”</li>
              <li>Name instruments: “warm Rhodes, vinyl crackle, soft drum machine”</li>
              <li>Describe structure: “verse to chorus, slow build”</li>
              <li>Set the vibe: “nostalgic, rainy Sunday, headphones”</li>
            </ol>
            <DemoBadge className="mt-3 bg-transparent" />
          </div>
          <div className="card p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">What is demo composition?</h3>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Without a music provider key, Weaver synthesizes a deterministic instrumental preview
              in your browser using a real Web Audio synth — proper temp, chords, lead and drums.
              Connect a provider to generate true song-quality exports.
            </p>
          </div>
        </aside>
      </div>
    </StudioShell>
  );
}

function MusicResultCard({ track }: { track: Track }) {
  const { toast } = useToast();
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <Music className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{track.title}</p>
            <p className="text-[11px] capitalize text-zinc-400">{track.genre} · {track.durationSec}s · {track.cost} credits</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast("Downloads are disabled in demo mode.", "info")}>
          <Download className="h-3.5 w-3.5" /> WAV
        </Button>
      </div>
      <AudioPlayer url={track.url} title={track.title} durationSec={track.durationSec} />
    </div>
  );
}