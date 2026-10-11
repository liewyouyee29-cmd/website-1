/**
 * Demo-mode media generation.
 *
 * When real AI providers are not configured the platform does NOT pretend
 * to call them. Instead every request is routed through these procedural
 * generators that produce deterministic, seed-derived placeholder artwork,
 * animated clips and synthesized audio. Every result is labelled
 * "Demo preview" in the UI.
 */

/** Deterministic PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashCode(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seedFrom(input: string): number {
  return hashCode(input) % 2147483647;
}

/** Deterministic int in [min, max] from a PRNG. */
function rint(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

/** Pick one from array. */
function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

const PALETTES: [string, string, string, string][] = [
  ["#6d28d9", "#a21caf", "#ec4899", "#fbbf24"], // violet dream
  ["#db2777", "#f97316", "#facc15", "#2dd4bf"], // sunset flame
  ["#0ea5e9", "#6366f1", "#a78bfa", "#67e8f9"], // ocean neon
  ["#16a34a", "#84cc16", "#eab308", "#a3e635"], // acid garden
  ["#1e1b4b", "#7c3aed", "#f0abfc", "#c4b5fd"], // midnight lavender
  ["#e11d48", "#fda4af", "#64748b", "#0f172a"], // noir rose
  ["#059669", "#10b981", "#f59e0b", "#fef3c7"], // ember mint
  ["#4338ca", "#06b6d4", "#22d3ee", "#f472b6"], // cyber tide
  ["#f43f5e", "#fbbf24", "#3b82f6", "#0d9488"], // primary splash
  ["#5b21b6", "#3730a3", "#1d4ed8", "#818cf8"], // deep cosmos
];

function pickPalette(rand: () => number): [string, string, string, string] {
  return pick(rand, PALETTES);
}

const SVG_ESCAPE_RE = /[&<>"']/g;
function esc(s: string): string {
  return s.replace(SVG_ESCAPE_RE, (c) =>
    c === "&"
      ? "&amp;"
      : c === "<"
        ? "&lt;"
        : c === ">"
          ? "&gt;"
          : c === '"'
            ? "&quot;"
            : "&#39;",
  );
}

function svgDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

interface ArtworkOptions {
  seed?: number;
  palette?: "auto" | number;
  shapes?: "auto" | "waves" | "orb" | "grid" | "blob" | "rings" | "prism" | "particles" | "rain" | "city";
  size?: number;
}

const SHAPE_NAMES = ["waves", "orb", "grid", "blob", "rings", "prism", "particles", "rain", "city"] as const;

/**
 * Generate deterministic generative-art SVG as a data URL.
 * This is the "real" artwork our demo pipeline creates, derived from
 * prompt + style + seed.
 */
export function generateArtwork({
  seed = 1,
  palette = "auto",
  shapes = "auto",
  size = 1024,
}: ArtworkOptions = {}): string {
  const rand = mulberry32(seed);
  const [c0, c1, c2, c3] = palette === "auto" ? pickPalette(rand) : PALETTES[palette % PALETTES.length];
  const shape = shapes === "auto" ? pick(rand, SHAPE_NAMES) : shapes;
  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
  );
  // background
  parts.push(`<defs>`);
  parts.push(
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient>`,
  );
  parts.push(`<radialGradient id="glow" cx="0.5" cy="0.4" r="0.8">` + `<stop offset="0" stop-color="${c2}" stop-opacity="0.65"/>` + `<stop offset="1" stop-color="${c0}" stop-opacity="0"/></radialGradient>`);
  parts.push(`</defs>`);
  parts.push(`<rect width="${size}" height="${size}" fill="url(#bg)"/>`);
  parts.push(`<rect width="${size}" height="${size}" fill="url(#glow)"/>`);

  const n = rint(rand, 8, 22);

  switch (shape) {
    case "waves": {
      for (let i = 0; i < n; i++) {
        const amp = rint(rand, 20, 160);
        const y = rint(rand, 0, size);
        const stroke = pick(rand, [c1, c2, c3]);
        const w = rint(rand, 2, 14);
        parts.push(
          `<path d="M0 ${y} Q ${size / 4} ${y - amp} ${size / 2} ${y} T ${size} ${y}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" opacity="${(0.3 + rand() * 0.55).toFixed(2)}"/>`,
        );
      }
      break;
    }
    case "orb": {
      const r = rint(rand, 120, size / 2);
      const cx = rint(rand, r, size - r);
      const cy = rint(rand, r, size - r);
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow)"/>`);
      for (let i = 0; i < 14; i++) {
        const rr = r * (0.4 + rand() * 0.6);
        const a = rand() * Math.PI * 2;
        const px = cx + Math.cos(a) * r * 0.8;
        const py = cy + Math.sin(a) * r * 0.8;
        parts.push(
          `<circle cx="${px}" cy="${py}" r="${rr}" fill="none" stroke="${pick(rand, [c2, c3])}" stroke-width="${(1 + rand() * 3).toFixed(1)}" opacity="${(0.15 + rand() * 0.5).toFixed(2)}"/>`,
        );
      }
      break;
    }
    case "grid": {
      const step = size / Math.max(4, Math.sqrt(n) * 2);
      for (let x = step / 2 + step * rand() * 0.3; x < size; x += step) {
        for (let y = step / 2 + step * rand() * 0.3; y < size; y += step) {
          const rr = rint(rand, 6, step * 0.6);
          const color = pick(rand, [c1, c2, c3]);
          if (rand() > 0.5) {
            parts.push(`<circle cx="${x}" cy="${y}" r="${rr}" fill="${color}" opacity="${(0.3 + rand() * 0.5).toFixed(2)}"/>`);
          } else {
            parts.push(
              `<rect x="${x - rr / 2}" y="${y - rr / 2}" width="${rr}" height="${rr}" rx="${rr * 0.2}" fill="none" stroke="${color}" stroke-width="2" opacity="${(0.4 + rand() * 0.5).toFixed(2)}"/>`,
            );
          }
        }
      }
      break;
    }
    case "blob": {
      for (let i = 0; i < n; i++) {
        const r = rint(rand, 40, 260);
        const cx = rint(rand, 0, size);
        const cy = rint(rand, 0, size);
        let d = `M ${cx} ${cy - r}`;
        for (let k = 0; k < 8; k++) {
          const ang = ((k + 1) * Math.PI) / 4;
          const px = cx + Math.cos(ang) * r;
          const py = cy + Math.sin(ang) * r;
          const cp1x = cx + Math.cos((ang + Math.PI / 8) * 0.4) * r * 1.2;
          const cp1y = cy + Math.sin((ang + Math.PI / 8) * 0.4) * r * 1.2;
          d += ` Q ${cp1x.toFixed(0)} ${cp1y.toFixed(0)} ${px.toFixed(0)} ${py.toFixed(0)}`;
        }
        parts.push(
          `<path d="${d} Z" fill="${pick(rand, [c1, c2, c3])}" opacity="${(0.25 + rand() * 0.5).toFixed(2)}"/>`,
        );
      }
      break;
    }
    case "rings": {
      const cx = rint(rand, size * 0.2, size * 0.8);
      const cy = rint(rand, size * 0.2, size * 0.8);
      for (let i = 0; i < n; i++) {
        const r = rint(rand, 20, size * 0.7);
        parts.push(
          `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${pick(rand, [c1, c2, c3])}" stroke-width="${(1.5 + rand() * 6).toFixed(1)}" opacity="${(0.3 + rand() * 0.6).toFixed(2)}"/>`,
        );
      }
      break;
    }
    case "prism": {
      for (let i = 0; i < n; i++) {
        const x = rint(rand, 0, size);
        const y = rint(rand, 0, size);
        const w = rint(rand, 20, 200);
        const rot = rint(rand, 0, 180);
        parts.push(
          `<rect x="${x}" y="${y}" width="${w}" height="${w}" rx="${w * 0.25}" transform="rotate(${rot} ${x + w / 2} ${y + w / 2})" fill="none" stroke="${pick(rand, [c1, c2, c3])}" stroke-width="${(2 + rand() * 10).toFixed(1)}" opacity="${(0.25 + rand() * 0.5).toFixed(2)}"/>`,
        );
      }
      break;
    }
    case "particles": {
      for (let i = 0; i < n * 6; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const r = rint(rand, 1, 6);
        parts.push(
          `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="${pick(rand, [c2, c3, c1])}" opacity="${(0.4 + rand() * 0.6).toFixed(2)}"/>`,
        );
      }
      for (let i = 0; i < n; i++) {
        const x1 = rand() * size;
        const y1 = rand() * size;
        const x2 = x1 + (rand() - 0.5) * size * 0.4;
        const y2 = y1 + (rand() - 0.5) * size * 0.4;
        parts.push(
          `<line x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="${c2}" stroke-width="1" opacity="${(0.1 + rand() * 0.3).toFixed(2)}"/>`,
        );
      }
      break;
    }
    case "rain": {
      for (let i = 0; i < n * 5; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const len = rint(rand, 20, 90);
        const tilt = 0.15 + rand() * 0.2;
        parts.push(
          `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x + len * tilt).toFixed(0)}" y2="${(y + len).toFixed(0)}" stroke="${pick(rand, [c2, c3])}" stroke-width="${(1 + rand() * 3).toFixed(1)}" stroke-linecap="round" opacity="${(0.35 + rand() * 0.4).toFixed(2)}"/>`,
        );
      }
      break;
    }
    case "city": {
      const horizon = rint(rand, size * 0.55, size * 0.75);
      parts.push(`<rect width="${size}" height="${size - horizon}" y="${horizon}" fill="${c0}" opacity="0.55"/>`);
      const buildings = rint(rand, 6, 14);
      const bwidth = size / buildings;
      for (let x = 0; x < buildings; x++) {
        const bh = rint(rand, size * 0.15, size * 0.6);
        parts.push(
          `<rect x="${x * bwidth + 4}" y="${horizon - bh}" width="${bwidth - 8}" height="${bh}" fill="${pick(rand, [c1, c2])}" opacity="0.8"/>`,
        );
        for (let wy = 0; wy < Math.floor(bh / 22); wy++) {
          for (let wx = 0; wx < 3; wx++) {
            if (rand() > 0.55) {
              parts.push(
                `<rect x="${x * bwidth + 12 + wx * 16}" y="${horizon - bh + 10 + wy * 22}" width="8" height="10" fill="${c3}" opacity="${(0.3 + rand() * 0.6).toFixed(2)}"/>`,
              );
            }
          }
        }
      }
      break;
    }
  }

  const starCount = rint(rand, 6, 16);
  for (let i = 0; i < starCount; i++) {
    const x = rand() * size * 0.9 + size * 0.05;
    const y = rand() * size * 0.9 + size * 0.05;
    parts.push(
      `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1 + rand() * 3).toFixed(1)}" fill="#fff" opacity="${(0.25 + rand() * 0.5).toFixed(2)}"/>`,
    );
  }

  parts.push(`</svg>`);
  return svgDataUrl(parts.join(""));
}

/** Generate a non-square artwork cropped to an aspect ratio. */
export function generateArtworkRatio(opts: ArtworkOptions & { ratio?: string }): { url: string; width: number; height: number } {
  const [w, h] = (opts.ratio ?? "1:1").split(":").map(Number);
  const base = opts.size ?? 1024;
  let width = base;
  let height = base;
  if (w > h) width = Math.round(base * (w / h));
  else height = Math.round(base * (h / w));
  return { url: generateArtwork({ ...opts, size: Math.max(width, height) }), width, height };
}

export type VideoStyle = "cinematic" | "anime" | "clay" | "neon" | "sketch" | "3d";

function styleWord(style: VideoStyle): string {
  switch (style) {
    case "cinematic": return "Movie camera flyby";
    case "anime": return "Sakura petals drifting";
    case "clay": return "Bouncy claymation squash";
    case "neon": return "Neon grid pulsing";
    case "sketch": return "Ink strokes drawing";
    case "3d": return "Glossy shapes spinning";
  }
}

const VIDEO_STYLES: VideoStyle[] = ["cinematic", "anime", "clay", "neon", "sketch", "3d"];

/**
 * Generate an animated clip as a data-URL SVG using SMIL animations so it
 * actually moves when played. This is the demo-mode video pipeline —
 * clearly labelled in the UI.
 */
export function generateDemoClip(opts: { seed?: number; style?: VideoStyle; ratio?: string; duration?: number }): { url: string; width: number; height: number } {
  const seed = opts.seed ?? 1;
  const rand = mulberry32(seed);
  const style = opts.style ?? pick(rand, VIDEO_STYLES);
  const ratio = opts.ratio ?? "16:9";
  const [rw, rh] = ratio.split(":").map(Number);
  const base = 1280;
  let W = base;
  let H = base;
  if (rw > rh) H = Math.round(base * (rh / rw));
  else W = Math.round(base * (rw / rh));
  const [c0, c1, c2, c3] = pickPalette(rand);
  const durNum = opts.duration ?? 6;
  const dur = durNum.toFixed(1);
  const label = styleWord(style);
  const parts: string[] = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
  parts.push(`<defs>`);
  parts.push(
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient>`,
  );
  parts.push(`</defs>`);
  parts.push(`<rect width="${W}" height="${H}" fill="url(#bg)"/>`);

  const midX = W / 2;
  const midY = H / 2;

  switch (style) {
    case "cinematic": {
      for (let i = 0; i < 5; i++) {
        const y0 = (H / 5) * i;
        const cy = y0;
        parts.push(`<ellipse cx="${midX}" cy="${cy}" rx="${W * 0.8}" ry="${W * 0.28}">`);
        parts.push(
          `<animate attributeName="cx" values="${-W * 0.2};${W * 0.2};${-W * 0.2}" dur="${dur}s" repeatCount="indefinite" begin="${(i * 0.3).toFixed(1)}s"/>`,
        );
        parts.push(
          `<animate attributeName="ry" values="${W * 0.28};${W * 0.3};${W * 0.28}" dur="${(durNum * 0.6).toFixed(1)}s" repeatCount="indefinite"/>`,
        );
        parts.push(
          `<animate attributeName="opacity" values="0.12;0.3;0.12" dur="${(durNum * 0.5).toFixed(1)}s" repeatCount="indefinite"/>`,
        );
        parts.push(`</ellipse>`);
      }
      break;
    }
    case "anime": {
      for (let i = 0; i < 22; i++) {
        const x = rand() * W;
        const y = rand() * H;
        const r = 3 + rand() * 7;
        const color = pick(rand, ["#f9a8d4", "#f472b6", "#fbcfe8", "#fda4af"]);
        parts.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0.8">`);
        parts.push(
          `<animate attributeName="cy" values="${-20};${H + 20}" dur="${(2 + rand() * 5).toFixed(1)}s" repeatCount="indefinite" begin="${(rand() * durNum).toFixed(1)}s"/>`,
        );
        parts.push(
          `<animate attributeName="cx" values="${x};${x + (rand() - 0.5) * 120}" dur="${(3 + rand() * 3).toFixed(1)}s" repeatCount="indefinite" begin="${(rand() * durNum).toFixed(1)}s"/>`,
        );
        parts.push(`</circle>`);
      }
      break;
    }
    case "clay": {
      const colors = [c1, c2, c3];
      for (let i = 0; i < 6; i++) {
        const x = (W / 6) * i + W / 12;
        const r = H * 0.18;
        parts.push(`<circle cx="${x}" cy="${midY}" r="${r}" fill="${colors[i % 3]}" opacity="0.85">`);
        parts.push(
          `<animate attributeName="r" values="${(r * 0.8).toFixed(0)};${r.toFixed(0)};${(r * 0.8).toFixed(0)}" dur="${(1.2 + (i % 3) * 0.3).toFixed(2)}s" repeatCount="indefinite" calcMode="spline" keySplines="0.2 0 0.8 1;0.2 0 0.8 1"/>`,
        );
        parts.push(`</circle>`);
      }
      break;
    }
    case "neon": {
      for (let i = 0; i < 8; i++) {
        const h = H / 8;
        const y = h * i;
        parts.push(
          `<line x1="0" y1="${y}" x2="${W}" y2="${y}"><animate attributeName="opacity" values="0.2;0.9;0.2" dur="${(durNum / 3).toFixed(2)}s" repeatCount="indefinite" begin="${(i * 0.2).toFixed(1)}s"/></line>`,
        );
        parts.push(
          `<line x1="${(W / 8) * i}" y1="0" x2="${(W / 8) * i}" y2="${H}"><animate attributeName="opacity" values="0.9;0.2;0.9" dur="${(durNum / 3).toFixed(2)}s" repeatCount="indefinite" begin="${(i * 0.15).toFixed(1)}s"/></line>`,
        );
      }
      parts.push(`<circle cx="${midX}" cy="${midY}" r="10" fill="${c3}">`);
      parts.push(
        `<animate attributeName="r" values="8;${Math.max(W, H) * 0.5};8" dur="${(durNum / 2).toFixed(1)}s" repeatCount="indefinite"/>`,
      );
      parts.push(`<animate attributeName="opacity" values="0.7;0.15;0.7" dur="${(durNum / 2).toFixed(1)}s" repeatCount="indefinite"/>`);
      parts.push(`</circle>`);
      break;
    }
    case "sketch": {
      for (let i = 0; i < 10; i++) {
        const cx = rand() * W;
        const cy = rand() * H;
        const r = 20 + rand() * 120;
        const len = r * 6.28;
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-width="2" opacity="0.5" stroke-dasharray="${len.toFixed(0)}" stroke-dashoffset="${len.toFixed(0)}">`);
        parts.push(
          `<animate attributeName="stroke-dashoffset" values="${len.toFixed(0)};0" dur="${dur}s" repeatCount="indefinite"/>`,
        );
        parts.push(`</circle>`);
      }
      break;
    }
    case "3d": {
      for (let i = 0; i < 5; i++) {
        const x = (W / 6) * (i + 0.5);
        const s = H * 0.22;
        const rotated = i % 2 === 0;
        parts.push(`<g style="transform-origin:${x}px ${midY}px">`);
        const durv = (4 + (i % 3) * 1.5).toFixed(1);
        if (rotated) {
          parts.push(`<rect x="${x - s / 2}" y="${midY - s / 2}" width="${s}" height="${s}" rx="${s * 0.15}" fill="${[c1, c2, c3][i % 3]}" opacity="0.85">`);
          parts.push(`<animateTransform attributeName="transform" type="rotate" values="0 ${x} ${midY};360 ${x} ${midY}" dur="${durv}s" repeatCount="indefinite"/>`);
          parts.push(`</rect>`);
        } else {
          parts.push(`<circle cx="${x}" cy="${midY}" r="${s / 2}" fill="${[c1, c2, c3][i % 3]}" opacity="0.85">`);
          parts.push(`<animateTransform attributeName="transform" type="rotate" values="0 ${x} ${midY};360 ${x} ${midY}" dur="${durv}s" repeatCount="indefinite"/>`);
          parts.push(`</circle>`);
        }
        parts.push(`</g>`);
      }
      break;
    }
  }

  parts.push(
    `<text x="20" y="${H - 24}" font-family="system-ui,sans-serif" font-size="24" fill="rgba(255,255,255,0.85)">${esc(label)} — demo preview</text>`,
  );
  parts.push(`</svg>`);
  return { url: svgDataUrl(parts.join("")), width: W, height: H };
}

/* ------------------------------------------------------------------ */
/* Music synthesis (Web Audio → WAV in the browser)                    */
/* ------------------------------------------------------------------ */

export interface DemoTrackOptions {
  genre?: string;
  mood?: string;
  duration?: number;
  seed?: number;
}

const SCALES: Record<string, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  minor: [0, 2, 3, 5, 7, 8, 10, 12],
  pentatonic: [0, 2, 4, 7, 9, 12],
};

const GENRE_TEMPO: Record<string, { tempo: number; scale: string; root: number }> = {
  ambient: { tempo: 60, scale: "minor", root: 57 },
  lofi: { tempo: 76, scale: "major", root: 57 },
  electronic: { tempo: 120, scale: "minor", root: 48 },
  hiphop: { tempo: 88, scale: "pentatonic", root: 45 },
  pop: { tempo: 110, scale: "major", root: 55 },
  cinematic: { tempo: 72, scale: "minor", root: 45 },
  rock: { tempo: 128, scale: "minor", root: 45 },
  classical: { tempo: 90, scale: "major", root: 48 },
};

const DEFAULT_GENRE = "ambient";

/** Note frequency in Hz from MIDI note number. */
function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Synthesize a complete demo music track as a WAV data URL using the
 * Web Audio API. Generates a chord pad + melody lead + kick/hat rhythm
 * loop seeded from the prompt. Runs entirely client-side and is labelled
 * a demo track in the UI.
 */
export async function synthesizeDemoTrack(opts: DemoTrackOptions): Promise<{ url: string; durationSec: number }> {
  const genre = opts.genre?.toLowerCase() ?? DEFAULT_GENRE;
  const mood = opts.mood?.toLowerCase() ?? "";
  const tempo = (GENRE_TEMPO[genre] ?? GENRE_TEMPO[DEFAULT_GENRE]).tempo * (mood.includes("slow") ? 0.8 : 1);
  const scaleName = (GENRE_TEMPO[genre] ?? GENRE_TEMPO[DEFAULT_GENRE]).scale;
  const root = (GENRE_TEMPO[genre] ?? GENRE_TEMPO[DEFAULT_GENRE]).root + (mood.includes("dark") ? -3 : 0);
  const scale = SCALES[scaleName] ?? SCALES.minor;
  const duration = Math.min(Math.max(opts.duration ?? 15, 5), 120);
  const seed = opts.seed ?? 42;
  const rand = mulberry32(seed);

  const sr = 22050;
  const totalSamples = Math.floor(duration * sr);
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);
  const beatLen = Math.floor((60 / tempo) * sr);

  const chordProg: number[][] = [
    [0, 2, 4],
    [3, 0, 2],
    [4, 1, 3],
    [2, 4, 0],
  ];

  const addSine = (data: Float32Array, start: number, freq: number, dur: number, gain: number, pan: number) => {
    const n = Math.floor(dur * sr);
    for (let i = 0; i < n; i++) {
      const idx = start + i;
      if (idx >= data.length) break;
      const t = i / sr;
      const env = Math.min(1, t * 20) * Math.exp(-t * 2.6);
      const s = Math.sin(2 * Math.PI * freq * t);
      data[idx] += s * env * gain * 0.55;
    }
  };

  const addPluck = (data: Float32Array, start: number, freq: number, gain: number) => {
    const n = Math.min(Math.floor(sr * 0.6), data.length - start);
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      const env = Math.exp(-t * 7);
      const s =
        0.6 * Math.sin(2 * Math.PI * freq * t) +
        0.25 * Math.sin(2 * Math.PI * freq * 2 * t) +
        0.15 * Math.sin(2 * Math.PI * freq * 3 * t);
      data[start + i] += s * env * gain;
    }
  };

  const addDrum = (data: Float32Array, start: number, type: "kick" | "hat", gain: number) => {
    const n = Math.min(Math.floor(sr * 0.25), data.length - start);
    const freqStart = type === "kick" ? 140 : 6000;
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      const env = Math.exp(-t * (type === "kick" ? 25 : 40));
      const freq = freqStart * Math.exp(-t * (type === "kick" ? 12 : 20));
      const s = Math.sin(2 * Math.PI * freq * t);
      data[start + i] += s * env * gain;
    }
  };

  const barLen = beatLen * 4;
  for (let bar = 0; bar * barLen < totalSamples; bar++) {
    const chord = chordProg[bar % chordProg.length];
    const barStart = bar * barLen;
    for (const c of chord) {
      const freq = midiToFreq(root + scale[c] - 12);
      addSine(left, barStart, freq, barLen / sr, 0.5, 0);
      addSine(right, barStart, freq, barLen / sr, 0.5, 0.25);
    }
    for (let step = 0; step < 8; step++) {
      const chance = genre === "ambient" ? 0.65 : 0.85;
      if (rand() < chance) {
        const chordIdx = chord[step % chord.length];
        const octave = step % 2 === 0 ? 12 : 24;
        const freq = midiToFreq(root + scale[chordIdx] + octave + step);
        addPluck(left, barStart + Math.floor((step * barLen) / 8), freq, 0.55);
        addPluck(right, barStart + Math.floor((step * barLen) / 8), freq, 0.45);
      }
    }
    addPluck(left, barStart, midiToFreq(root + scale[chord[0]] - 24), 0.6);
    addPluck(left, barStart + barLen / 2, midiToFreq(root + scale[chord[1]] - 24), 0.45);
    const hasDrums = !["ambient", "classical"].includes(genre);
    if (hasDrums) {
      for (let b = 0; b < 4; b++) {
        const at = barStart + b * beatLen;
        addDrum(left, at, "kick", 0.8);
        addDrum(right, at, "kick", 0.72);
        if (b % 2 === 1) addDrum(left, at, "hat", 0.35);
      }
    }
  }

  const normalizer = (data: Float32Array) => {
    let max = 0.001;
    for (let i = 0; i < data.length; i++) max = Math.max(max, Math.abs(data[i]));
    const g = 0.85 / max;
    for (let i = 0; i < data.length; i++) data[i] *= g;
  };
  normalizer(left);
  normalizer(right);

  const wav = encodeWav(left, right, sr);
  const blob = new Blob([wav], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  return { url, durationSec: duration };
}

/** Encode interleaved stereo Float32 samples to a 16-bit PCM WAV. */
function encodeWav(left: Float32Array, right: Float32Array, sampleRate: number): ArrayBuffer {
  const numFrames = left.length;
  const buffer = new ArrayBuffer(44 + numFrames * 4);
  const view = new DataView(buffer);
  const writeString = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + numFrames * 4, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numFrames * 4, true);
  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    view.setInt16(offset, Math.max(-1, Math.min(1, left[i])) * 0x7fff, true);
    view.setInt16(offset + 2, Math.max(-1, Math.min(1, right[i])) * 0x7fff, true);
    offset += 4;
  }
  return buffer;
}

/** Does the current runtime (browser) support WebAudio synthesis? */
export function canSynthesizeAudio(): boolean {
  return typeof window !== "undefined" && typeof window.AudioContext !== "undefined";
}