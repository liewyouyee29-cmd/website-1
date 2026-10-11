import type { AiModel, CreditPack, FaqItem, PricingPlan, PromptTemplate, Testimonial } from "@/types";

/** Original brand — "Weaver AI" is an original concept, not derived from WowMade. */
export const SITE = {
  name: "Weaver AI",
  tagline: "Your ideas, brought to life with AI.",
  description:
    "Weaver is an AI creative studio for video, image, music and text. Turn a single prompt into polished, reusable creative media — then edit, organize and remix everything in one place.",
  email: "hello@weaver-studio.example",
  supportEmail: "support@weaver-studio.example",
  legalEmail: "legal@weaver-studio.example",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  socials: {
    twitter: "#",
    instagram: "#",
    youtube: "#",
    discord: "#",
    github: "#",
  },
};

/** Sample pricing — configurable until real business pricing is provided. */
export const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Starter",
    monthlyPrice: 0,
    credits: 25,
    description: "Explore the studio with a free monthly grant.",
    features: [
      "25 credits every month",
      "Image generation (up to 480p)",
      "30-second video previews",
      "Community uploads",
      "Standard generation queue",
    ],
    cta: "Start for free",
  },
  {
    id: "creator",
    name: "Creator",
    monthlyPrice: 12,
    annualPrice: 120,
    credits: 1000,
    description: "For hobbyists making regular content.",
    features: [
      "1,000 credits every month",
      "Up to 4K image generation",
      "Up to 12-second AI videos",
      "Music tracks · full ownership",
      "Prompt studio & presets",
      "Priority queue",
    ],
    highlight: true,
    cta: "Start with Creator",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 39,
    annualPrice: 390,
    credits: 4000,
    description: "Serious creators and small teams.",
    features: [
      "4,000 credits every month",
      "All models incl. video & avatar",
      "Background removal & upscaling",
      "Batch generation & API access",
      "Commercial license",
      "Priority render servers",
    ],
    cta: "Start with Pro",
  },
  {
    id: "studio",
    name: "Studio",
    monthlyPrice: 99,
    annualPrice: 990,
    credits: 12000,
    description: "Agencies and studios with volume.",
    features: [
      "12,000 credits every month",
      "Everything in Pro",
      "5 team seats",
      "Dedicated render capacity",
      "SSO & audit logs",
      "Onboarding support",
    ],
    cta: "Contact sales",
  },
];

export const CREDIT_PACKS: CreditPack[] = [
  { id: "cp-small", credits: 100, price: 1.99 },
  { id: "cp-med", credits: 500, price: 8.99, bonusLabel: "10% bonus" },
  { id: "cp-large", credits: 1200, price: 19.99, bonusLabel: "15% bonus" },
  { id: "cp-xl", credits: 3000, price: 44.99, bonusLabel: "20% bonus" },
];

export const FAQS: FaqItem[] = [
  {
    question: "How does the credit system work?",
    answer:
      "Every generation costs a small number of credits depending on the model, resolution, duration and number of outputs. Monthly plans include an allowance; you can also buy single packs that never expire. You can always see the estimated cost before you hit Generate.",
  },
  {
    question: "Can I use the creations commercially?",
    answer:
      "Yes. Paid plans include full ownership and a commercial license for everything you generate. Starter-account generations are for personal use with a watermark. See the Terms of Service for details.",
  },
  {
    question: "Is the demo mode real AI?",
    answer:
      "No. When no AI provider is connected, Weaver runs in demo mode: every 'generation' is a clearly-labelled local preview so you can explore the full workflow without spending credits. Connect a provider in server settings to enable real generation.",
  },
  {
    question: "What models are used?",
    answer:
      "Weaver is designed as a model-agnostic studio. Depending on the environment it can route image, video, music and text tasks to different providers — the UI and your creations stay the same, and providers can be swapped without rebuilding the app.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel from Dashboard → Billing at any time. Access continues until the end of the billing period and unused credits remain available until then.",
  },
  {
    question: "How is my data protected?",
    answer:
      "Prompts and outputs are encrypted in transit, stored in a private cloud, and never used to train our models by default. See Privacy Policy for controls including export and deletion.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Maya Reyes",
    role: "Indie filmmaker",
    avatarColor: "bg-fuchsia-500",
    quote:
      "I storyboarded an entire short film with Weaver before touching a camera. The prompt studio alone is worth the subscription.",
    rating: 5,
  },
  {
    id: "t2",
    name: "David Okafor",
    role: "Motion designer",
    avatarColor: "bg-indigo-500",
    quote:
      "The image-to-video pipeline changed how I pitch clients. thirty-second concepts in the time it used to take to set up a meeting.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Lena Fischer",
    role: "Music producer",
    avatarColor: "bg-teal-500",
    quote:
      "Real stems, real ownership. I use the music studio for roughs before flying to the studio — it's become part of my writing process.",
    rating: 5,
  },
  {
    id: "t4",
    name: "Arjun Patel",
    role: "Social media lead",
    avatarColor: "bg-amber-500",
    quote:
      "We ship a week of content in two hours. The ad maker and avatar generator are absurdly good for creators on a deadline.",
    rating: 4,
  },
  {
    id: "t5",
    name: "Sofia Bianchi",
    role: "Art director",
    avatarColor: "bg-rose-500",
    quote:
      "The pixel-art studio and object remover are in my permanent toolkit now. Gorgeous results without touching a graphics program.",
    rating: 5,
  },
];

export const AI_MODELS: AiModel[] = [
  { id: "weaver-photo", name: "Weaver Photo", provider: "stable-diffusion-esque", kind: "image", description: "Photorealistic stills with natural light.", cost: 4, strengths: ["portraits", "landscapes", "product shots"], badge: "Popular" },
  { id: "weaver-anime", name: "Weaver Anime", provider: "anime-diffusion", kind: "image", description: "Clean anime / manga art, characters and scenes.", cost: 3, strengths: ["characters", "scenes", "style transfer"] },
  { id: "aurora-xl", name: "Aurora XL", provider: "image-xl", kind: "image", description: "High-detail creative imagery up to 4K.", cost: 6, strengths: ["illustration", "concept art"] },
  { id: "weaver-motion", name: "Weaver Motion", provider: "video-live", kind: "video", description: "5–12s text-to-video in multiple motion styles.", cost: 24, strengths: ["cinematic", "styles", "camera control"] },
  { id: "weaver-verse", name: "Weaver Verse", provider: "music-gen", kind: "music", description: "Original tracks with optional vocals.", cost: 18, strengths: ["genres", "lyrics", "stems"] },
  { id: "weaver-voice", name: "Weaver Voice", provider: "voice-engine", kind: "music", description: "Talking avatars and synchronized singing.", cost: 20, strengths: ["avatars", "lip-sync", "singing"] },
];

/** Small sample of models used by selector chips across generator pages. */
export const TOOL_GROUPS: Record<string, { name: string; description: string; href: string; icon: string; category: string; models?: string[] }> = {
  video: {
    name: "AI Video",
    description: "Text-to-video, image-to-video, upscaling and object removal.",
    href: "/studio/video",
    icon: "clapperboard",
    category: "video",
  },
  image: {
    name: "AI Image",
    description: "Generate and edit images with style presets and outpainting.",
    href: "/studio/image",
    icon: "image",
    category: "image",
  },
  music: {
    name: "AI Music",
    description: "Original tracks, birthday songs and talking avatars.",
    href: "/studio/music",
    icon: "music",
    category: "music",
  },
  text: {
    name: "AI Text",
    description: "Prompt and script studio for every creative medium.",
    href: "/studio/text",
    icon: "pen-line",
    category: "text",
  },
};

export const NAV_LINKS = {
  tools: [
    { href: "/studio/video", label: "AI Video Generator", group: "video" },
    { href: "/studio/image", label: "AI Image Generator", group: "image" },
    { href: "/studio/music", label: "AI Music Generator", group: "music" },
    { href: "/studio/text", label: "AI Prompt Studio", group: "text" },
  ],
};

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  { id: "pt1", title: "Cinematic forest intro", kind: "video", category: "Cinematic", prompt: "A golden-hour walk through a misty pine forest, dolly-in camera move, volumetric god rays, filmic grade, 35mm, 4k" },
  { id: "pt2", title: "Cyberpunk alley", kind: "video", category: "Sci-fi", prompt: "A neon-drenched cyberpunk alley at night, rain-slicked pavement, holographic signs, cinematic anamorphic lens, motion blur" },
  { id: "pt3", title: "Dreamy portrait", kind: "image", category: "Portrait", prompt: "Ethereal portrait of a woman with glowing freckles, soft rim light, floating petals, shallow depth of field, pastel palette" },
  { id: "pt4", title: "Isometric game room", kind: "image", category: "3D", prompt: "Isometric cozy gaming room, low-poly 3D render, warm lamp light, cable management chaos, cute details, pastel colors" },
  { id: "pt5", title: "Lo-fi study beats", kind: "music", category: "Lo-fi", prompt: "Lo-fi hip-hop for late-night study, warm vinyl crackle, soft electric piano, mellow boom-bap drums, 78 bpm" },
  { id: "pt6", title: "Epic trailer strings", kind: "music", category: "Cinematic", prompt: "Rising cinematic trailer music, epic string section, slow to soaring brass, tense percussion, 110 bpm" },
  { id: "pt7", title: "Product launch script", kind: "text", category: "Script", prompt: "A 30-second product launch voiceover script, energetic but trustworthy tone, three-act structure with a clear call to action" },
  { id: "pt8", title: "Abstract ink explosion", kind: "image", category: "Abstract", prompt: "Abstract ink explosion on black canvas, vibrant magenta and electric blue ink clouds, high-speed photography look, dramatic lighting" },
];