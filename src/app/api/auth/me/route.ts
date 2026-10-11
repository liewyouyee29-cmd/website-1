import { NextRequest, NextResponse } from "next/server";
import {
  getUserFromCookie,
  setDataDir,
  toPublicUser,
} from "@/lib/auth/auth-server";

export async function GET(req: NextRequest) {
  setDataDir(process.env.WEAVER_DATA_DIR ?? "data");
  const user = await getUserFromCookie(req.headers.get("cookie"));
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user: toPublicUser(user) });
}