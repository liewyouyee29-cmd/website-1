import { NextResponse } from "next/server";
import { CREDIT_PACKS, PLANS } from "@/config/site";

/**
 * Pricing endpoint. Prices are divisible sample values until real
 * business pricing is configured via environment variables:
 *   WEAVER_PLAN_PRICES_JSON and WEAVER_CREDIT_PACKS_JSON
 */
export async function GET() {
  let plans = PLANS;
  let packs = CREDIT_PACKS;

  const plansRaw = process.env.WEAVER_PLAN_PRICES_JSON;
  const packsRaw = process.env.WEAVER_CREDIT_PACKS_JSON;
  try {
    if (plansRaw) plans = JSON.parse(plansRaw);
    if (packsRaw) packs = JSON.parse(packsRaw);
  } catch {
    // keep sample pricing on malformed env values
  }

  return NextResponse.json({
    sample: !process.env.WEAVER_PLAN_PRICES_JSON,
    plans,
    packs,
    note: "Sample pricing until business pricing is configured. No charges without explicit confirmation.",
  });
}