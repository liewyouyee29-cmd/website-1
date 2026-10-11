/**
 * Provider registry.
 *
 * Each provider module is wired by environment variables. Everything else
 * falls back to the demo provider so the whole platform remains explorable
 * without credentials. Credentials are read server-side only and are never
 * exposed to the client.
 */
import type { AIProvider, GenerationResult } from "./types";
import { demoProvider } from "./demo";

export { ProviderUnavailableError } from "./types";
export type * from "./types";

let registryCache: { providers: AIProvider[]; demoMode: boolean } | null = null;

function defineRealProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  if (process.env.OPENAI_API_KEY) {
    providers.push({
      id: "openai",
      name: "OpenAI",
      kind: "image",
      demo: false,
      available: true,
      generateImage() {
        throw new Error("OpenAI adapter not wired in this build — add src/lib/providers/openai.ts.");
      },
    });
  }
  // Extend here: Replicate, Stability, Runway, ElevenLabs, etc.
  // if (process.env.REPLICATE_API_TOKEN) providers.push(createReplicateProvider());

  return providers;
}

/**
 * Returns all available providers given the current environment.
 * Never includes credentials in the returned metadata.
 */
export function listProviders(): { providers: AIProvider[]; demoMode: boolean } {
  if (registryCache) return registryCache;
  const real = defineRealProviders();
  const providers = real.length > 0 ? real : [demoProvider];
  const demoMode = providers.every((p) => p.demo);
  registryCache = { providers, demoMode };
  return registryCache;
}

/** True when the platform currently runs in demo mode (no real AI). */
export function isDemoMode(): boolean {
  const explicit = process.env.NEXT_PUBLIC_DEMO_MODE;
  if (explicit === "forced") return true;
  if (explicit === "off") return false;
  return listProviders().demoMode;
}

const DEMO_CREDITS: Record<"image" | "video" | "music" | "text", number> = {
  image: 4,
  video: 24,
  music: 18,
  text: 1,
};

async function getProvider(kind: "image" | "video" | "music" | "text"): Promise<AIProvider> {
  const { providers } = listProviders();
  for (const p of providers) {
    if (p.demo) continue;
    if (p.kind === kind) return p;
  }
  const imageish = providers.find((p) => !p.demo);
  if (imageish) return imageish;
  return demoProvider;
}

/** Server-side generation entry point. */
export async function runGeneration(
  kind: "image" | "video" | "music" | "text",
  input: Record<string, unknown>,
): Promise<GenerationResult> {
  const provider = await getProvider(kind);
  const { providers } = listProviders();
  const demoMode = providers.every((p) => p.demo);
  const modelId = typeof input.modelId === "string" ? input.modelId : "";

  switch (kind) {
    case "image": {
      if (!provider.generateImage) {
        throw new Error(`Provider "${provider.id}" cannot generate images.`);
      }
      const out = await provider.generateImage({
        prompt: String(input.prompt ?? ""),
        negativePrompt: input.negativePrompt ? String(input.negativePrompt) : undefined,
        modelId: modelId || "weaver-photo",
        style: input.style ? String(input.style) : undefined,
        aspectRatio: input.aspectRatio ? String(input.aspectRatio) : "1:1",
        seed: typeof input.seed === "number" ? input.seed : undefined,
      });
      return {
        images: [out],
        creditCost: DEMO_CREDITS.image * out.urls.length,
        provider: provider.id,
        demo: demoMode,
      };
    }
    case "video": {
      if (!provider.generateVideo) {
        throw new Error(`Provider "${provider.id}" cannot generate videos.`);
      }
      const out = await provider.generateVideo({
        prompt: String(input.prompt ?? ""),
        negativePrompt: input.negativePrompt ? String(input.negativePrompt) : undefined,
        modelId: modelId || "weaver-motion",
        aspectRatio: input.aspectRatio ? String(input.aspectRatio) : "16:9",
        durationSec: typeof input.durationSec === "number" ? input.durationSec : 6,
        resolution: input.resolution ? String(input.resolution) : undefined,
        imageInput: input.imageInput ? String(input.imageInput) : null,
        seed: typeof input.seed === "number" ? input.seed : undefined,
      });
      return {
        video: out,
        creditCost: DEMO_CREDITS.video,
        provider: provider.id,
        demo: demoMode,
      };
    }
    case "music": {
      if (!provider.generateMusic) {
        throw new Error(`Provider "${provider.id}" cannot generate music.`);
      }
      const out = await provider.generateMusic({
        prompt: String(input.prompt ?? ""),
        modelId: modelId || "weaver-verse",
        durationSec: typeof input.durationSec === "number" ? input.durationSec : 15,
        instrumental: input.instrumental ? true : undefined,
        genre: input.genre ? String(input.genre) : undefined,
        mood: input.mood ? String(input.mood) : undefined,
      });
      return {
        music: out,
        creditCost: DEMO_CREDITS.music,
        provider: provider.id,
        demo: demoMode,
      };
    }
    case "text": {
      if (!provider.generateText) {
        throw new Error(`Provider "${provider.id}" cannot generate text.`);
      }
      const out = await provider.generateText({
        kind:
          (input.kind as "enhance" | "script" | "ideas" | "storyboard" | "lyrics" | "generic") ?? "generic",
        prompt: String(input.prompt ?? ""),
        modelId: modelId || "weaver-text",
      });
      return {
        text: out,
        creditCost: DEMO_CREDITS.text,
        provider: provider.id,
        demo: demoMode,
      };
    }
    default: {
      throw new Error(`Unknown generation kind: ${kind}`);
    }
  }
}