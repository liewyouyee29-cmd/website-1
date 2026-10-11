import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  registerUser,
  sessionCookieHeader,
  setDataDir,
} from "@/lib/auth/auth-server";

export async function POST(req: NextRequest) {
  setDataDir(process.env.WEAVER_DATA_DIR ?? "data");
  try {
    const body = (await req.json().catch(() => null)) as {
      email?: string;
      password?: string;
      name?: string;
    } | null;
    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    const result = await registerUser({
      email: body.email ?? "",
      password: body.password ?? "",
      name: body.name ?? "",
    });
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const token = await createSession(result.user.id);
    const res = NextResponse.json({ user: result.user });
    res.headers.set(
      "Set-Cookie",
      sessionCookieHeader(token, process.env.NODE_ENV === "production"),
    );
    return res;
  } catch (err) {
    console.error("register error", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}