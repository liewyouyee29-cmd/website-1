/**
 * Provider layer contracts.
 *
 * Providers are modular: a new model integration (image, video, music,
 * text, avatar…) only needs to implement one interface below and register
 * itself in providers/index.ts. Credentials stay server-side and are never
 * referenced from client components.
 */

export interface ImageGenerateInput {
  prompt: string;
  negativePrompt?: string;
  modelId: string;
  aspectRatio?: string;
  numOutputs?: number;
  style?: string;
  seed?: number;
}

export interface ImageGenerateOutput {
  urls: { url: string; width: number; height: number }[];
  provider: string;
  modelId: string;
}

export interface VideoGenerateInput {
  prompt: string;
  negativePrompt?: string;
  modelId: string;
  aspectRatio?: string;
  durationSec?: number;
  resolution?: string;
  /** data URL or object key of the guide image for image-to-video */
  imageInput?: string | null;
  seed?: number;
}

export interface VideoGenerateOutput {
  videoUrl: string;
  thumbUrl: string;
  provider: string;
  modelId: string;
}

export interface MusicGenerateInput {
  prompt: string;
  modelId: string;
  durationSec?: number;
  instrumental?: boolean;
  mood?: string;
  genre?: string;
}

export interface MusicGenerateOutput {
  audioUrl: string;
  title: string;
  provider: string;
  modelId: string;
  durationSec: number;
}

export interface TextGenerateInput {
  kind: "enhance" | "script" | "ideas" | "storyboard" | "lyrics" | "generic";
  prompt: string;
  modelId?: string;
}

export interface TextGenerateOutput {
  text: string;
  provider: string;
  modelId: string;
}

export interface GenerationResult {
  images?: ImageGenerateOutput[];
  video?: VideoGenerateOutput;
  music?: MusicGenerateOutput;
  text?: TextGenerateOutput;
  /** Estimated credit cost actually charged for this request. */
  creditCost: number;
  provider: string;
  demo: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  kind: "image" | "video" | "music" | "text";
  /** true when no real credentials are configured and output is procedurally generated */
  demo: boolean;
  available: boolean;
  generateImage?(input: ImageGenerateInput): Promise<ImageGenerateOutput>;
  generateVideo?(input: VideoGenerateInput): Promise<VideoGenerateOutput>;
  generateMusic?(input: MusicGenerateInput): Promise<MusicGenerateOutput>;
  generateText?(input: TextGenerateInput): Promise<TextGenerateOutput>;
}

/** Thrown by provider layer when a capability is not configured. */
export class ProviderUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderUnavailableError";
  }
}