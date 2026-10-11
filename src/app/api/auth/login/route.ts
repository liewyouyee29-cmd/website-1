import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  loginWithPassword,
  sessionCookieHeader,
  setDataDir,
} from "@/lib/auth/auth-server";

export async function POST(req: NextRequest) {
  setDataDir(process.env.WEAVER_DATA_DIR ?? "data");
  try {
    const body = (await req.json().catch(() => null)) as {
      email?: string;
      password?: string;
    } | null;
    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    const result = await loginWithPassword(body.email ?? "", body.password ?? "");
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    const token = await createSession(result.user.id);
    const res = NextResponse.json({ user: result.user });
    res.headers.set(
      "Set-Cookie",
      sessionCookieHeader(token, process.env.NODE_ENV === "production"),
    );
    return res;
  } catch (err) {
    console.error("login error", err);
    return NextResponse.json({ error: "Sign in failed. Please try again." }, { status: 500 });
  }
}