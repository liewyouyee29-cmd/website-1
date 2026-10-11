"use client";

import { useEffect, useState } from "react";
import { FlaskConical, X } from "lucide-react";

export function DemoBanner() {
  const [mode, setMode] = useState<{ demoMode: boolean } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/mode", { credentials: "same-origin" })
      .then((r) => r.json().catch(() => null))
      .then((data) => setMode(data))
      .catch(() => setMode({ demoMode: true }));
  }, []);

  if (!mode?.demoMode || dismissed) return null;

  return (
    <div className="relative z-[60] flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 px-4 py-2 text-center text-xs font-semibold text-white">
      <FlaskConical className="h-3.5 w-3.5 shrink-0" />
      <span>
        <strong>Demo mode</strong> — no AI provider connected. All outputs are clearly-labelled previews.{" "}
        <a href="/help/demo-mode" className="underline underline-offset-2 hover:opacity-90">
          Learn more
        </a>
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss demo notice"
        className="absolute right-2 rounded-full p-1 hover:bg-white/20"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}