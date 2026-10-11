import type { CommunityCreation, FeaturedArt } from "@/types";
import { generateArtworkRatio, seedFrom } from "@/lib/demo-media";

const AUTHORS = [
  { name: "Maya Reyes", color: "bg-fuchsia-500" },
  { name: "David Okafor", color: "bg-indigo-500" },
  { name: "Lena Fischer", color: "bg-teal-500" },
  { name: "Arjun Patel", color: "bg-amber-500" },
  { name: "Sofia Bianchi", color: "bg-rose-500" },
  { name: "Noah Kim", color: "bg-sky-500" },
  { name: "Amara Diallo", color: "bg-emerald-500" },
  { name: "Tomas Rivera", color: "bg-orange-500" },
];

const ARTWORK_PROMPTS: { prompt: string; title: string; tags: string[] }[] = [
  { prompt: "A cyberpunk city reflected in rain puddles at midnight, anime style", title: "Midnight Shibuya", tags: ["anime", "city", "cyberpunk"] },
  { prompt: "Cosmic whale swimming through a nebula made of flowers", title: "Bloom Nebula", tags: ["space", "surreal", "colorful"] },
  { prompt: "An isometric cabin in the woods at golden hour, clay render", title: "Cabin Study", tags: ["3d", "isometric", "cozy"] },
  { prompt: "Portrait of a fox spirit wearing a glowing kimono", title: "Fox Spirit", tags: ["character", "fantasy", "portrait"] },
  { prompt: "A single retro car driving through a synthwave sunset grid", title: "Retro Drive", tags: ["retro", "synthwave", "80s"] },
  { prompt: "Underwater library with floating books and glowing coral", title: "Submerged Archive", tags: ["interior", "surreal", "ocean"] },
  { prompt: "Luminous jellyfish drifting in a bioluminescent deep sea trench", title: "Deep Glow", tags: ["ocean", "bioluminescent", "dark"] },
  { prompt: "A paper-mache dragon resting on an artist's studio desk", title: "Desk Dragon", tags: ["miniature", "craft", "cute"] },
];

const VIDEO_PROMPTS: { prompt: string; title: string; tags: string[] }[] = [
  { prompt: "Slow dolly shot through a lavender field at sunrise, mist rolling", title: "Lavender Bloom", tags: ["cinematic", "nature"] },
  { prompt: "Neon signs flickering over a rainy Tokyo street, anime style", title: "Rainy Akihabara", tags: ["anime", "city"] },
  { prompt: "A claymation robot making a cup of coffee, stop-motion feel", title: "Robot Barista", tags: ["clay", "cute"] },
  { prompt: "Abstract chalk particles swarming to form a human silhouette", title: "Ink Human", tags: ["abstract", "particles"] },
];

const MUSIC_PROMPTS: { prompt: string; title: string; tags: string[]; genre: string }[] = [
  { prompt: "Ambient drones with soft piano and distant water, meditative", title: "River Meditation", tags: ["ambient", "meditative"], genre: "ambient" },
  { prompt: "Upbeat electronic house with shimmering arpeggios and big drop", title: "Solar Flare", tags: ["electronic", "upbeat"], genre: "electronic" },
  { prompt: "Late-night lo-fi with dusty drums and mellow Rhodes chords", title: "Study Buddy", tags: ["lofi", "chill"], genre: "lofi" },
  { prompt: "Epic orchestral swell with choir, tension and release", title: "Ascension", tags: ["orchestral", "epic"], genre: "cinematic" },
];

export interface DemoContent {
  featured: FeaturedArt[];
  pixelArt: { url: string; title: string; category: string; seed: number; prompt: string }[];
  community: CommunityCreation[];
}

let cache: DemoContent | null = null;

function makeSeed(prompt: string, salt: string): number {
  return seedFrom(`${prompt}::${salt}`);
}

/** Deterministic demo content, generated once and cached. */
export function getDemoContent(): DemoContent {
  if (cache) return cache;

  const featured: FeaturedArt[] = [
    ...ARTWORK_PROMPTS.slice(0, 4).map((a, i) => ({
      id: `fa-${i}`,
      kind: "image" as const,
      title: a.title,
      prompt: a.prompt,
      seed: makeSeed(a.prompt, "img"),
      author: AUTHORS[i % AUTHORS.length].name,
      model: i % 2 === 0 ? "weaver-photo" : "aurora-xl",
      tags: a.tags,
    })),
    ...VIDEO_PROMPTS.slice(0, 2).map((v, i) => ({
      id: `fv-${i}`,
      kind: "video" as const,
      title: v.title,
      prompt: v.prompt,
      seed: makeSeed(v.prompt, "vid"),
      author: AUTHORS[(i + 2) % AUTHORS.length].name,
      model: "weaver-motion",
      tags: v.tags,
    })),
    ...MUSIC_PROMPTS.slice(0, 2).map((m, i) => ({
      id: `fm-${i}`,
      kind: "music" as const,
      title: m.title,
      prompt: m.prompt,
      seed: makeSeed(m.prompt, "music"),
      author: AUTHORS[(i + 4) % AUTHORS.length].name,
      model: "weaver-verse",
      tags: m.tags,
    })),
  ];

  const pixelCategories = ["Fantasy", "City", "Nature", "Sci-fi"];
  const pixelArt = Array.from({ length: 12 }).map((_, i) => {
    const cat = pixelCategories[i % pixelCategories.length];
    const prompt = TRAIT[pixelTitles(pixelCategories)[i]];
    return {
      url: generateArtworkRatio({ seed: makeSeed(prompt, "px"), shapes: "grid", size: 288 }).url,
      title: pixelTitles(pixelCategories)[i],
      category: cat,
      seed: makeSeed(prompt, "px"),
      prompt,
    };
  });

  const community: CommunityCreation[] = [
    ...ARTWORK_PROMPTS.slice(0, 8).map((a, i) => ({
      id: `c-img-${i}`,
      kind: "image" as const,
      title: a.title,
      author: { name: AUTHORS[i % AUTHORS.length].name },
      prompt: a.prompt,
      thumbUrl: generateArtworkRatio({ seed: makeSeed(a.prompt, "img"), size: 640 }).url,
      previewUrl: generateArtworkRatio({ seed: makeSeed(a.prompt, "img"), size: 1024 }).url,
      stats: { likes: seededInt(a.prompt, "likes", 12, 400), downloads: seededInt(a.prompt, "dl", 3, 90), remixes: seededInt(a.prompt, "rm", 1, 40) },
      tags: a.tags,
      model: i % 2 === 0 ? "weaver-photo" : "aurora-xl",
      createdAt: isoAgo(i * 13),
      isPublic: true,
    })),
    ...VIDEO_PROMPTS.map((v, i) => ({
      id: `c-vid-${i}`,
      kind: "video" as const,
      title: v.title,
      author: { name: AUTHORS[(i + 1) % AUTHORS.length].name },
      prompt: v.prompt,
      thumbUrl: generateArtworkRatio({ seed: makeSeed(v.prompt, "vid"), size: 640, ratio: "16:9" }).url,
      previewUrl: generateArtworkRatio({ seed: makeSeed(v.prompt, "vid"), size: 1280, ratio: "16:9" }).url,
      stats: { likes: seededInt(v.prompt, "likes", 20, 900), downloads: seededInt(v.prompt, "dl", 5, 200), remixes: seededInt(v.prompt, "rm", 1, 60) },
      tags: v.tags,
      model: "weaver-motion",
      createdAt: isoAgo(i * 7 + 3),
      isPublic: true,
    })),
    ...MUSIC_PROMPTS.map((m, i) => ({
      id: `c-mus-${i}`,
      kind: "music" as const,
      title: m.title,
      author: { name: AUTHORS[(i + 3) % AUTHORS.length].name },
      prompt: m.prompt,
      thumbUrl: undefined,
      previewUrl: undefined,
      stats: { likes: seededInt(m.prompt, "likes", 5, 300), downloads: seededInt(m.prompt, "dl", 2, 120), remixes: seededInt(m.prompt, "rm", 0, 30) },
      tags: m.tags,
      model: "weaver-verse",
      createdAt: isoAgo(i * 5 + 8),
      isPublic: true,
    })),
  ];

  cache = { featured, pixelArt, community };
  return cache;
}

function pixelTitles(cats: string[]): string[] {
  return [
    `Pixel ${cats[0]} Castle`,
    `Neon ${cats[1]} Street`,
    `${cats[2]} Island Co-op`,
    `${cats[3]} Outpost`,
    `Old ${cats[0]} Temple`,
    `${cats[1]} Rooftops`,
    `Hidden ${cats[2]} Cove`,
    `${cats[3]} Space Station`,
    `${cats[0]} Market`,
    `${cats[1]} Alley Cat`,
    `${cats[2]} Waterfall`,
    `${cats[3]} Mech Bay`,
  ];
}

const TRAIT: Record<string, string> = {
  "Pixel Fantasy Castle": "Retro pixel-art fantasy castle with flag towers and big moon",
  "Neon City Street": "Synthwave pixel city street with glowing signs and umbrellas",
  "Nature Island Co-op": "Pixel co-op farm built on a tiny island, boats and crops",
  "Sci-fi Outpost": "Pixel sci-fi outpost on a red planet with landing pads",
  "Old Fantasy Temple": "Ancient pixel temple ruins reclaimed by vines at dusk",
  "City Rooftops": "Overhead pixel rooftops with laundry, antennas and pigeons",
  "Hidden Nature Cove": "Cozy pixel cove with a lighthouse and fishing hut",
  "Sci-fi Space Station": "Pixel space station orbiting a ringed planet with tiny shuttles",
  "Fantasy Market": "Busy pixel fantasy market stalls with lanterns and a bard",
  "City Alley Cat": "Moody pixel alley with a small cat watching rain",
  "Nature Waterfall": "Pixel waterfall canyon with moss, koi and stepping stones",
  "Sci-fi Mech Bay": "Giant pixel mech silhouetted in a repair bay",
};

function seededInt(prompt: string, salt: string, min: number, max: number): number {
  const s = seedFrom(`${prompt}${salt}`);
  return min + (s % (max - min + 1));
}

function isoAgo(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString();
}

/** Category definitions for the homepage pixel-art gallery filters. */
export const PIXEL_CATEGORIES = ["All", "Fantasy", "City", "Nature", "Sci-fi"] as const;

export const COMMUNITY_CATEGORIES = ["All", "Images", "Videos", "Music", "Prompts"] as const;