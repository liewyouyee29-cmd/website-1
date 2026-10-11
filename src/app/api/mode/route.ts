import { NextResponse } from "next/server";
import { isDemoMode, listProviders } from "@/lib/providers";

/** Publicly safe: exposes demo-mode state and provider names only. */
export async function GET() {
  const { providers } = listProviders();
  return NextResponse.json({
    demoMode: isDemoMode(),
    providers: providers.map((p) => ({ id: p.id, name: p.name, demo: p.demo })),
  });
}