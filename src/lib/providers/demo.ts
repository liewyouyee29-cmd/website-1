/**
 * Demo provider — the default when no real AI credentials are configured.
 * Produces deterministic, clearly-labelled local previews.
 */
import {
  generateArtworkRatio,
  generateDemoClip,
  seedFrom,
} from "@/lib/demo-media";
import type {
  AIProvider,
  ImageGenerateInput,
  ImageGenerateOutput,
  MusicGenerateInput,
  MusicGenerateOutput,
  TextGenerateInput,
  TextGenerateOutput,
  VideoGenerateInput,
  VideoGenerateOutput,
} from "./types";

const VARIANTS = ["waves", "orb", "grid", "blob", "rings", "prism", "particles", "rain", "city"] as const;

function inferStyle(prompt: string): "waves" | "orb" | "grid" | "blob" | "rings" | "prism" | "particles" | "rain" | "city" {
  const p = prompt.toLowerCase();
  if (/(pixel|retro|8bit|16bit)/.test(p)) return "grid";
  if (/(city|cyber|neon|street|urban)/.test(p)) return "city";
  if (/(underwater|ocean|sea|drop|rain|water)/.test(p)) return "rain";
  if (/(galaxy|space|nebula|cosmic|star|night)/.test(p)) return "particles";
  if (/(abstract|ink|splash|flow)/.test(p)) return "blob";
  if (/(sunset|synthwave|retro|80s)/.test(p)) return "rings";
  return VARIANTS[seedFrom(prompt) % VARIANTS.length];
}

const DEMO_VIDEO_STYLES = ["cinematic", "anime", "clay", "neon", "sketch", "3d"] as const;

function inferVideoStyle(prompt: string): (typeof DEMO_VIDEO_STYLES)[number] {
  const p = prompt.toLowerCase();
  if (/(anime|manga|sakura|waifu|2d)/.test(p)) return "anime";
  if (/(clay|stop.?motion|puppet|cute)/.test(p)) return "clay";
  if (/(neon|cyber|synthwave|grid|glow)/.test(p)) return "neon";
  if (/(sketch|ink|draw|line.?art)/.test(p)) return "sketch";
  if (/(3d|render|glossy|low.?poly)/.test(p)) return "3d";
  return "cinematic";
}

export const demoProvider: AIProvider = {
  id: "demo",
  name: "Local Demo Engine",
  kind: "image",
  demo: true,
  available: true,

  async generateImage(input: ImageGenerateInput): Promise<ImageGenerateOutput> {
    const seed = input.seed ?? seedFrom(`${input.prompt}:${input.style ?? ""}:${input.modelId}`);
    const shape = inferStyle(input.style ?? input.prompt);
    const numOutputs = Math.max(1, Math.min(input.numOutputs ?? 1, 4));
    const urls = Array.from({ length: numOutputs }).map((_, i) => {
      // derive slightly different seeds per output index for variety
      const s = (seed + i * 7919) % 2147483647;
      return {
        ...generateArtworkRatio({ seed: s, shapes: shape, ratio: input.aspectRatio ?? "1:1", size: 1024 }),
        // In demo mode we bake in a subtle "demo" marker label.
        // The returned URL points at SVG data; UI also shows a DEMO badge.
      } as ImageGenerateOutput["urls"][number];
    });
    return { urls, provider: demoProvider.name, modelId: input.modelId };
  },

  async generateVideo(input: VideoGenerateInput): Promise<VideoGenerateOutput> {
    const seed = input.seed ?? seedFrom(`${input.prompt}:${input.modelId}`);
    const style = inferVideoStyle(input.prompt);
    const clip = generateDemoClip({
      seed,
      style,
      ratio: input.aspectRatio ?? "16:9",
      duration: input.durationSec ?? 6,
    });
    // For image-to-video, bias the palette on the source image hash.
    const thumb = input.imageInput
      ? generateArtworkRatio({ seed: seedFrom(input.imageInput), ratio: input.aspectRatio ?? "16:9", size: 640 }).url
      : generateArtworkRatio({ seed, ratio: input.aspectRatio ?? "16:9", size: 640 }).url;
    return { videoUrl: clip.url, thumbUrl: thumb, provider: demoProvider.name, modelId: input.modelId };
  },

  async generateMusic(input: MusicGenerateInput): Promise<MusicGenerateOutput> {
    // Synthesis happens client-side for audio; this server path returns a
    // marker so the client can synthesize locally. When a real music
    // provider is configured this branch is never used.
    const title = input.prompt.split(/[,.\n]/)[0].trim().slice(0, 60) || "Untitled demo track";
    const durationSec = input.durationSec ?? 15;
    return {
      audioUrl: "",
      title,
      provider: demoProvider.name,
      modelId: input.modelId,
      durationSec,
    };
  },

  async generateText(input: TextGenerateInput): Promise<TextGenerateOutput> {
    const base = { provider: demoProvider.name, modelId: input.modelId ?? "weaver-text" };
    switch (input.kind) {
      case "enhance":
        return { ...base, text: enhance(input.prompt) };
      case "script":
        return { ...base, text: script(input.prompt) };
      case "storyboard":
        return { ...base, text: storyboard(input.prompt) };
      case "ideas":
        return { ...base, text: ideas(input.prompt) };
      case "lyrics":
        return { ...base, text: lyrics(input.prompt) };
      default:
        return { ...base, text: `Paraphrased output:\n\n${input.prompt}\n\n(Expanded by the Weaver demo text engine — connect an LLM provider to get true AI writing.)` };
    }
  },
};

function enhance(prompt: string): string {
  return [
    "Enhanced prompt (demo engine):",
    "",
    prompt.trim(),
    "",
    `Add: ultra-detailed, masterful composition, dramatic lighting, high dynamic range, soft rim light, subtle film grain, ultra sharp focus, elegant color grading, 8K cinematic quality`,
    `Avoid: low-res, blurry, distorted anatomy, excess noise, watermark`,
  ].join("\n");
}

function script(prompt: string): string {
  return [
    `Script concept — "${prompt.slice(0, 60)}"`,
    "",
    "[SCENE 1 — OPENING]",
    "Hook: a single unexpected image that frames the core idea.",
    "",
    "[SCENE 2 — BUILD]",
    "Introduce the problem the story clearly states, one beat at a time.",
    "",
    "[SCENE 3 — TURN]",
    "The moment of change; show, don't tell, with action and emotion.",
    "",
    "[SCENE 4 — RESOLUTION]",
    "Land the idea and end on the call to action.",
    "",
    "(Demo script — connect an LLM provider for a bespoke draft.)",
  ].join("\n");
}

function storyboard(prompt: string): string {
  return [
    "Storyboard — 6 beats",
    "",
    "1. Establishing wide with clear geography",
    "2. Detail close-up that sets mood",
    "3. Character / object enters frame",
    "4. Conflict or pivot moment",
    "5. Emotional peak (extreme close-up or slow motion)",
    "6. Final wide, resolved, matched to shot 1",
    "",
    "Suggested ratio: 16:9 · style: cinematic · camera: dolly",
  ].join("\n");
}

function ideas(prompt: string): string {
  return [
    `Ideas inspired by "${prompt.slice(0, 60)}"`,
    "",
    "• A 1-line premise, inverted for contrast",
    "• Same idea told from an unexpected point of view",
    "• Two ideas merged into one surprising hybrid",
    "• A micro-version: just five words, maximum punch",
    "• The franchise version: your idea × a familiar world",
    "",
    "(Deterministic demo output — add an LLM key for real creative ideation.)",
  ].join("\n");
}

function lyrics(prompt: string): string {
  return [
    `"${prompt.slice(0, 50)}" — demo verse`,
    "",
    "Verse:",
    "The signal in the static hums a name,",
    "a slow piano rolling in the rain.",
    "We built this from the sparks we didn't spend,",
    "now every frame begins and never ends.",
    "",
    "Chorus:",
    "Hold the light, we're weaving it together,",
    "wires and words and weather.",
    "Hold the night, we're turning up the sound,",
    "creation's all around.",
    "",
    "(Structural demo lyrics — extend with a lyrics model when configured.)",
  ].join("\n");
}