"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DemoBadge({ className }: { className?: string }) {
  return <Badge tone="amber" className={className}><span aria-hidden="true">✦</span> Demo preview</Badge>;
}

/** Renders a decorative/animated SVG frame from a data URL. */
export function Artwork({
  src,
  alt = "",
  className,
  aspect,
  animated = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  aspect?: string;
  animated?: boolean;
}) {
  return (
    <div
      className={cn("relative w-full overflow-hidden", aspect && `aspect-[${aspect}]`, className)}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}

/**
 * Data-URL SVG "movie player". SMIL animations run inside the SVG, so the
 * file itself contains motion. We commute between a paused static frame and
 * the live image so "play/pause" works without real video decoding.
 */
export function ClipPlayer({
  src,
  thumb,
  alt,
  className,
}: {
  src: string;
  thumb?: string;
  alt?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [session, setSession] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Remount the SMIL <img> on every play so the animation restarts from
  // frame one. (Swapping src to "" restarts SMIL too, but an empty src can
  // make the browser treat it as a navigation and reload the page.)
  const togglePlay = () => {
    if (!playing) setSession((s) => s + 1);
    setPlaying((p) => !p);
  };

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <img
        ref={playing ? null : imgRef}
        src={thumb ?? src}
        alt={alt ?? "Generated clip"}
        className={cn("h-full w-full object-cover transition-opacity duration-200", playing && "opacity-0")}
      />
      {playing && (
        <img
          key={session}
          src={src}
          alt={alt ?? "Generated clip"}
          className={cn("absolute inset-0 h-full w-full object-cover", "opacity-0")}
        />
      )}
      <span className="pointer-events-none absolute left-2 top-2">
        <DemoBadge />
      </span>
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause preview" : "Play preview"}
        className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
      </button>
      {playing && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-white/90">LIVE PREVIEW</span>
          <VolumeX className="h-3 w-3 text-white/70" />
        </div>
      )}
    </div>
  );
}

/** Audio player with waveform-style bars and volume control. */
export function AudioPlayer({
  url,
  title,
  durationSec,
}: {
  url: string;
  title?: string;
  durationSec?: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrent(audio.currentTime);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const dur = durationSec && durationSec > 0 ? durationSec : 15;
  const frac = dur > 0 ? Math.min(1, current / dur) : 0;
  const bars = 36;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play();
      setPlaying(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900/60">
      <audio ref={audioRef} src={url} preload="metadata" />
      <div className="mb-3 flex items-center justify-between gap-2">
        {title && <p className="truncate text-sm font-semibold">{title}</p>}
        <DemoBadge />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-500"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
        </button>
        <div className="flex flex-1 items-center gap-[2px]" aria-hidden="true">
          {Array.from({ length: bars }).map((_, i) => {
            const height = 20 + Math.abs(Math.sin(i * 1.7)) * 80;
            const active = i / bars <= frac;
            return (
              <span
                key={i}
                className="flex-1 rounded-full"
                style={{
                  height: `${height}%`,
                  maxHeight: "100%",
                  minHeight: 4,
                  background: active ? "linear-gradient(to top, #6366f1, #d946ef)" : "rgb(161 161 170)",
                  opacity: active ? 1 : 0.35,
                }}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-zinc-200 text-zinc-500 hover:text-zinc-800 dark:border-white/10 dark:text-zinc-300 dark:hover:text-white"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
        <span>Demo audio · synthesized in your browser</span>
        <span>
          {frac * dur}s / {dur}s
        </span>
      </div>
    </div>
  );
}