import { NextRequest, NextResponse } from "next/server";
import { runGeneration } from "@/lib/providers";
import { getUserFromCookie, setDataDir, updateUser } from "@/lib/auth/auth-server";

const KIND_VALIDATOR: Record<string, { promptRequired?: boolean; maxPrompt: number }> = {
  image: { promptRequired: true, maxPrompt: 2000 },
  video: { promptRequired: true, maxPrompt: 2000 },
  music: { promptRequired: true, maxPrompt: 1000 },
  text: { promptRequired: true, maxPrompt: 4000 },
};

/**
 * Authoritative credit cost for a generation request. Mirrors the formulas
 * shown in the studio UIs so the client estimate always matches the charge.
 */
function estimateCost(kind: string, input: Record<string, unknown>): number {
  const num = (v: unknown, fallback: number) =>
    typeof v === "number" && Number.isFinite(v) ? v : fallback;
  const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);

  switch (kind) {
    case "image": {
      const MODEL_BASE: Record<string, number> = {
        "weaver-photo": 4,
        "aurora-xl": 6,
        "weaver-anime": 3,
      };
      const modelId = str(input.modelId, "weaver-photo");
      const base = MODEL_BASE[modelId] ?? 4;
      const n = Math.max(1, Math.min(4, num(input.numOutputs, 1)));
      const dim = num(input.dim, 1024);
      const upscale = input.tool === "upscale" ? 12 : 0;
      return base * n + (dim >= 1536 ? 8 : 0) + upscale;
    }
    case "video": {
      const MODEL_BASE: Record<string, number> = {
        "weaver-motion": 24,
        "weaver-motion-pro": 36,
        "animate-diff-live": 28,
      };
      const modelId = str(input.modelId, "weaver-motion");
      const base = MODEL_BASE[modelId] ?? 24;
      const dur = num(input.durationSec, 6);
      const res = str(input.resolution, "480p");
      const resBonus = res === "1080p" ? 10 : res === "720p" ? 4 : 0;
      return base + (dur > 8 ? 8 : 0) + resBonus;
    }
    case "music":
      return 18;
    case "text":
      return 1;
    default:
      return 0;
  }
}

export async function POST(req: NextRequest) {
  setDataDir(process.env.WEAVER_DATA_DIR ?? "data");
  const body = (await req.json().catch(() => null)) as {
    kind?: string;
    input?: Record<string, unknown>;
  } | null;
  if (!body?.kind || !body.input) {
    return NextResponse.json({ error: "Invalid request. Missing kind or input." }, { status: 400 });
  }
  const rule = KIND_VALIDATOR[body.kind];
  if (!rule) {
    return NextResponse.json({ error: `Unsupported generation kind: ${body.kind}` }, { status: 400 });
  }

  const prompt = typeof body.input.prompt === "string" ? body.input.prompt.trim() : "";
  if (rule.promptRequired && !prompt) {
    return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
  }
  if (prompt.length > rule.maxPrompt) {
    return NextResponse.json(
      { error: `Prompt is too long (max ${rule.maxPrompt} characters).` },
      { status: 400 },
    );
  }

  // Auth: generation consumes credits for signed-in users. Guests in
  // demo mode may generate a limited number of previews without an account.
  const user = await getUserFromCookie(req.headers.get("cookie"));

  // Estimate cost up-front so we can reject without running generation
  // when the user cannot afford it. The authoritative deduction still only
  // happens after a successful generation.
  const preflight = estimateCost(body.kind, body.input);

  if (user && user.credits < preflight) {
    return NextResponse.json(
      {
        error: `Not enough credits. This costs ${preflight} credits and you have ${user.credits}. Add credits on the pricing page.`,
        creditCost: preflight,
      },
      { status: 402 },
    );
  }

  try {
    const result = await runGeneration(body.kind as "image" | "video" | "music" | "text", body.input);

    // Spend credits server-side so the client cannot forge balances.
    let newCredits: number | undefined;
    if (user) {
      const updated = await updateUser(user.id, { credits: user.credits - preflight });
      newCredits = updated?.credits;
    }

    return NextResponse.json({ ...result, creditCost: preflight, newCredits });
  } catch (err) {
    console.error("generation error", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message, demo: false }, { status: 502 });
  }
}