"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { apiGenerate } from "@/lib/auth/client-auth";
import type { GenerationResult } from "@/lib/providers";
import { useAuth } from "@/providers/auth-provider";
import { wait } from "@/lib/utils";

type Stage = "idle" | "queued" | "processing" | "done" | "error" | "cancelled";

export interface StudioResult {
  id: string;
  kind: string;
  result: GenerationResult;
  createdAt: string;
}

/**
 * Shared state machine for generator pages. Handles simulate-progress
 * locally (polling/webhooks will replace `wait` in production) — requests
 * actually hit the server, which spends real credits in the file store.
 */
export function useStudioGeneration(kind: "image" | "video" | "music" | "text") {
  const { user, applyCreditChange } = useAuth();
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<StudioResult[]>([]);
  const cancelRef = useRef(false);
  const idRef = useRef(0);

  const isBusy = stage === "queued" || stage === "processing";

  const cancel = useCallback(() => {
    cancelRef.current = true;
    setStage("cancelled");
  }, []);

  const reset = useCallback(() => {
    cancelRef.current = false;
    setStage("idle");
    setProgress(0);
    setError(null);
  }, []);

  const generate = useCallback(
    async (input: Record<string, unknown>) => {
      cancelRef.current = false;
      setError(null);
      setStage("queued");
      setProgress(5);

      // Simulate a progressive queue (2–8s). Swappable with real job polls.
      const done = await sleepWithCancel(cancelRef, [700, 1600, 1400, 1300], (p) => {
        setProgress(Math.min(p, 92));
        setStage("processing");
      });
      if (!done) return null;

      try {
        const res = await apiGenerate({ kind, input });
        applyCreditChange(-res.creditCost);
        const id = `${kind}-${++idRef.current}`;
        const entry: StudioResult = {
          id,
          kind,
          result: res as GenerationResult,
          createdAt: new Date().toISOString(),
        };
        setResults((prev) => [entry, ...prev].slice(0, 24));
        setProgress(100);
        setStage("done");
        return entry;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Generation failed";
        setError(message);
        setStage("error");
        return null;
      }
    },
    [applyCreditChange, kind],
  );

  const demo = useMemo(
    () => results.some((r) => r.result.demo),
    [results],
  );

  return { stage, progress, error, isBusy, results, generate, cancel, reset, demo, canGenerate: !user || user.credits > 0 };
}

async function sleepWithCancel(cancelRef: { current: boolean }, steps: number[], onStep: (p: number) => void): Promise<boolean> {
  let acc = 0;
  for (const step of steps) {
    if (cancelRef.current) return false;
    acc += step;
    await wait(step);
    if (cancelRef.current) return false;
    onStep(acc);
  }
  return !cancelRef.current;
}