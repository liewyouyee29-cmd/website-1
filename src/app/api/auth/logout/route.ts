import { NextResponse } from "next/server";
import { clearSessionCookieHeader } from "@/lib/auth/auth-server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set(
    "Set-Cookie",
    clearSessionCookieHeader(process.env.NODE_ENV === "production"),
  );
  return res;
}