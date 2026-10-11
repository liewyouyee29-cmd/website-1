"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Coins,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Info,
  Zap,
} from "lucide-react";
import { PLANS, CREDIT_PACKS } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <Suspense>
      <Pricing />
    </Suspense>
  );
}

function Pricing() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as "credits" | null) ?? "plans";
  const [annual, setAnnual] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [buying, setBuying] = useState<string | null>(null);

  const buy = (label: string, price: number) => {
    setBuying(label);
    window.setTimeout(() => {
      setBuying(null);
      toast(
        user
          ? "Demo checkout: no payment is processed. Connect Stripe keys to enable purchases."
          : "Sign in to complete checkout. Demo mode never charges.",
        "info",
      );
    }, 900);
  };

  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="mb-10 text-center">
          <Badge tone="gradient" className="mb-4"><Sparkles className="h-3 w-3" /> Sample pricing</Badge>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simple credits for serious <span className="text-gradient">creators</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
            Pick a monthly plan with an included allowance — or grab a pack that never expires.
            Every generation shows its exact cost before you run it.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-600 dark:text-amber-300">
            <Info className="h-3.5 w-3.5" />
            No charges without explicit confirmation — even in the demo.
          </div>
        </div>

        <div className="mb-10 flex justify-center gap-2">
          {[
            { id: "plans" as const, label: "Monthly plans" },
            { id: "credits" as const, label: "Credit packs" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { const url = new URL(window.location.href); url.searchParams.set("mode", t.id); window.history.replaceState(null, "", url.toString()); window.location.reload(); }}
              aria-pressed={mode === t.id}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-semibold transition-colors",
                mode === t.id
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                  : "border-zinc-300 text-zinc-600 hover:border-indigo-300 dark:border-white/15 dark:text-zinc-300",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {mode === "plans" ? <PlansView annual={annual} setAnnual={setAnnual} buy={buy} buying={buying} /> : <PacksView buy={buy} buying={buying} />}

        {/* Cost estimator */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-4 text-center font-display text-2xl font-extrabold">Estimated generation costs</h2>
          <div className="card divide-y divide-zinc-100 dark:divide-white/10">
            {[
              { tool: "AI Image — Weaver Photo (1:1, 1024px)", cost: "4 credits" },
              { tool: "AI Image — Aurora XL 4K", cost: "6 credits" },
              { tool: "AI Video — Weaver Motion 5s, 720p", cost: "24 credits" },
              { tool: "AI Video — 12s 1080p", cost: "42 credits" },
              { tool: "AI Music — full track (30s)", cost: "18 credits" },
              { tool: "Image Upscaler", cost: "12 credits" },
              { tool: "Prompt enhance (text)", cost: "1 credit" },
            ].map((row) => (
              <div key={row.tool} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-zinc-600 dark:text-zinc-300">{row.tool}</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{row.cost}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { icon: CreditCard, title: "Flexible billing", desc: "Monthly plans or one-time packs. Cancel anytime." },
            { icon: RefreshCw, title: "Failed generations free", desc: "If a job errors, credits are never deducted." },
            { icon: ShieldCheck, title: "Private by default", desc: "Your prompts and outputs stay yours." },
          ].map((f) => (
            <div key={f.title} className="card p-5 text-center">
              <span className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                <f.icon className="h-5 w-5" />
              </span>
              <p className="text-sm font-bold">{f.title}</p>
              <p className="mt-1 text-xs text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlansView({
  annual,
  setAnnual,
  buy,
  buying,
}: {
  annual: boolean;
  setAnnual: (v: boolean) => void;
  buy: (label: string, price: number) => void;
  buying: string | null;
}) {
  return (
    <>
      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white p-1.5 dark:border-white/10 dark:bg-zinc-900">
          <button type="button" onClick={() => setAnnual(false)} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold", !annual ? "bg-indigo-600 text-white" : "text-zinc-500")}>
            Monthly
          </button>
          <button type="button" onClick={() => setAnnual(true)} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold", annual ? "bg-indigo-600 text-white" : "text-zinc-500")}>
            Annual <span className="text-emerald-400">save 20%</span>
          </button>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const price = annual && plan.annualPrice ? plan.annualPrice / 12 : plan.monthlyPrice;
          const perCredit = plan.credits > 0 ? plan.monthlyPrice / plan.credits : 0;
          return (
            <div
              key={plan.id}
              className={cn(
                "card flex flex-col p-6",
                plan.highlight && "relative border-indigo-400 ring-2 ring-indigo-500/40",
              )}
            >
              {plan.highlight && (
                <Badge tone="gradient" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most popular
                </Badge>
              )}
              <h3 className="font-display text-lg font-bold">{plan.name}</h3>
              <p className="mt-1 min-h-[40px] text-xs text-zinc-400">{plan.description}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="font-display text-4xl font-extrabold">${Math.round(price)}</span>
                <span className="mb-1 text-sm text-zinc-400">/mo</span>
              </div>
              {annual && plan.annualPrice && (
                <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">Billed ${plan.annualPrice}/year</p>
              )}
              <div className="mt-4 rounded-2xl bg-indigo-50 px-4 py-2.5 text-sm dark:bg-indigo-500/10">
                <span className="font-bold text-indigo-600 dark:text-indigo-300">{plan.credits.toLocaleString()} credits</span>
                <span className="ml-1 text-xs text-zinc-400">/month</span>
                {perCredit > 0 && (
                  <p className="text-[11px] text-zinc-400">≈ ${perCredit.toFixed(2)}/credit</p>
                )}
              </div>
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlight ? "gradient" : "outline"}
                className="mt-6 w-full"
                loading={buying === plan.id}
                onClick={() => buy(plan.name, plan.monthlyPrice)}
              >
                {plan.cta}
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}

function PacksView({ buy, buying }: { buy: (label: string, price: number) => void; buying: string | null }) {
  const { user } = useAuth();
  return (
    <>
      <div className="mx-auto max-w-xs text-center">
        <div className="card mb-6 flex items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-xs text-zinc-400">Your balance</p>
              <p className="text-lg font-extrabold">{user?.credits ?? 0} credits</p>
            </div>
          </div>
          <Link href="/dashboard?tab=billing" className="text-xs font-semibold text-indigo-500 hover:underline">History</Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CREDIT_PACKS.map((pack) => {
          const perCredit = pack.price / pack.credits;
          return (
            <div key={pack.id} className="card flex flex-col p-6 text-center">
              {pack.bonusLabel && <Badge tone="emerald" className="mx-auto mb-2">{pack.bonusLabel}</Badge>}
              <p className="font-display text-3xl font-extrabold">{pack.credits.toLocaleString()}</p>
              <p className="text-xs text-zinc-400">credits · never expire</p>
              <p className="mt-4 font-display text-2xl font-extrabold">${pack.price}</p>
              <p className="mb-5 text-[11px] text-zinc-400">≈ ${perCredit.toFixed(2)}/credit</p>
              <Button variant={pack.id === "cp-large" ? "gradient" : "outline"} className="mt-auto w-full" size="sm" loading={buying === pack.id} onClick={() => buy(pack.id, pack.price)}>
                <Zap className="h-3.5 w-3.5" /> Buy now
              </Button>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center text-xs text-zinc-400">
        Pack credits never expire. Packs don&apos;t auto-renew. Payment is only ever processed after explicit confirmation on a secure checkout page.
      </p>
    </>
  );
}