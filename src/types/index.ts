/** Shared domain types for Weaver AI Studio. */

export type ModelKind = "image" | "video" | "music" | "text";

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3" | "3:4" | "21:9";

export type GenerationStatus =
  | "idle"
  | "queued"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled";

export type GenerationType =
  | "image"
  | "video"
  | "music"
  | "text"
  | "avatar"
  | "dance"
  | "upscale"
  | "remove-object"
  | "singing"
  | "ad"
  | "song"
  | "verify";

export interface AiModel {
  id: string;
  name: string;
  provider: string;
  kind: ModelKind;
  description: string;
  /** credits per base generation */
  cost: number;
  strengths?: string[];
  badge?: string;
}

export interface GenerationSettings {
  modelId: string;
  prompt?: string;
  negativePrompt?: string;
  aspectRatio?: AspectRatio;
  duration?: number;
  resolution?: string;
  numOutputs?: number;
  style?: string;
  seed?: number;
  [key: string]: unknown;
}

export interface AIGeneration {
  id: string;
  type: GenerationType;
  status: GenerationStatus;
  prompt?: string;
  settings: GenerationSettings;
  creditCost: number;
  createdAt: string;
  completedAt?: string;
  /**
   * Preview URLs. In demo mode these point to locally computed
   * placeholder media (seed-derived). With real providers they contain
   * signed/remote object URLs.
   */
  previewUrl?: string;
  thumbUrl?: string;
  audioUrl?: string;
  error?: string;
  sample?: string;
}

export interface CommunityCreation {
  id: string;
  kind: "image" | "video" | "music" | "prompt";
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  prompt: string;
  negativePrompt?: string;
  thumbUrl?: string;
  previewUrl?: string;
  stats: { likes: number; downloads: number; remixes: number };
  tags: string[];
  model?: string;
  createdAt: string;
  isPublic: boolean;
}

export interface UserCreation {
  id: string;
  kind: GenerationType;
  title: string;
  prompt?: string;
  status: GenerationStatus;
  previewUrl?: string;
  thumbUrl?: string;
  audioUrl?: string;
  creditCost: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  kind: "grant" | "purchase" | "spend" | "refund";
  amount: number;
  description: string;
  createdAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice?: number;
  credits: number;
  description: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

export interface CreditPack {
  id: string;
  credits: number;
  price: number;
  bonusLabel?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  quote: string;
  rating: number;
  creationUrl?: string;
}

export interface FeaturedArt {
  id: string;
  kind: "image" | "video" | "music";
  title: string;
  prompt: string;
  seed: number;
  author: string;
  model: string;
  tags: string[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  kind: ModelKind;
  category: string;
  prompt: string;
  icon?: string;
}