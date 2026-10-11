import { NextRequest, NextResponse } from "next/server";
import {
  applyPasswordReset,
  resetPassword,
  setDataDir,
} from "@/lib/auth/auth-server";

export async function POST(req: NextRequest) {
  setDataDir(process.env.WEAVER_DATA_DIR ?? "data");
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    token?: string;
    password?: string;
  } | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Phase 1: request a reset token.
  if (!body.token) {
    if (!body.email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    // Never reveal whether an account exists.
    const { ok, token } = await resetPassword(body.email);
    return NextResponse.json({ ok: true, token: ok ? token : undefined });
  }

  // Phase 2: apply the reset.
  const { ok } = await applyPasswordReset(body.token, body.email ?? "", body.password ?? "");
  if (!ok) {
    return NextResponse.json(
      { error: "Reset failed. The link may have expired. Request a new one." },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true });
}