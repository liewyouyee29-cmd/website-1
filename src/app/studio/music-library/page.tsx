"use client";

import { useState } from "react";
import Link from "next/link";
import { ListMusic, Download, Music, Plus, Trash2 } from "lucide-react";
import { StudioShell } from "@/components/studio/studio-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AudioPlayer } from "@/components/ui/media";
import { useToast } from "@/components/ui/toaster";
import { synthesizeDemoTrack } from "@/lib/demo-media";

interface LibraryTrack {
  id: string;
  title: string;
  genre: string;
  url: string;
  durationSec: number;
  createdAt: string;
}

const seedTracks: LibraryTrack[] = [
  { id: "t1", title: "Midnight Studio", genre: "lofi", url: "", durationSec: 15, createdAt: "2 days ago" },
  { id: "t2", title: "Neon Drive", genre: "synthwave", url: "", durationSec: 15, createdAt: "1 week ago" },
];

export default function MusicLibraryPage() {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<LibraryTrack[]>(seedTracks);
  const [playing, setPlaying] = useState<Record<string, string>>({});

  const materialize = async (track: LibraryTrack) => {
    if (playing[track.id]) return;
    try {
      const synth = await synthesizeDemoTrack({ genre: track.genre as never, duration: track.durationSec, seed: 42 + track.id.length });
      setPlaying((prev) => ({ ...prev, [track.id]: synth.url }));
    } catch {
      toast("Audio synthesis failed in this browser.", "error");
    }
  };

  return (
    <StudioShell
      icon={<ListMusic className="h-7 w-7" />}
      eyebrow="My Studio"
      title="My Music Library"
      description="Every track you compose lives here — play, download and organise."
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">{tracks.length} track{tracks.length === 1 ? "" : "s"} · demo library</p>
        <Link href="/studio/music">
          <Button variant="gradient"><Plus className="h-4 w-4" /> New track</Button>
        </Link>
      </div>

      {tracks.length === 0 ? (
        <EmptyState icon={<Music className="h-6 w-6" />} title="Your library is empty" description="Compose your first track in the Music Generator." action={<Link href="/studio/music"><Button>Compose a track</Button></Link>} />
      ) : (
        <div className="mt-5 space-y-3">
          {tracks.map((t) => {
            const url = playing[t.id];
            return (
              <div key={t.id} className="card p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
                      <Music className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">{t.title}</p>
                      <p className="text-xs capitalize text-zinc-400">{t.genre} · {t.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!url ? (
                      <Button variant="outline" size="sm" onClick={() => void materialize(t)}>
                        Load audio
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => toast("Downloads are disabled in demo mode.", "info")}>
                          <Download className="h-3.5 w-3.5" /> WAV
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setTracks((prev) => prev.filter((x) => x.id !== t.id))}>
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <AudioPlayer url={url} title={t.title} durationSec={t.durationSec} />
              </div>
            );
          })}
        </div>
      )}
    </StudioShell>
  );
}