"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  ImageIcon,
  History,
  Bookmark,
  Heart,
  Settings,
  Shield,
  CreditCard,
  Sparkles,
  Star,
  Trash2,
  Pencil,
  Copy,
  Check,
  Download,
  Coins,
  FolderOpen,
  Upload,
  Music,
  Film,
  Wand2,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Field, Input } from "@/components/ui/fields";
import { useToast } from "@/components/ui/toaster";
import { getDemoContent } from "@/lib/content";
import { generateArtworkRatio, seedFrom } from "@/lib/demo-media";
import { cn } from "@/lib/utils";

type Tab = "creations" | "history" | "prompts" | "favorites" | "files" | "billing" | "settings" | "security";

const TABS: { id: Tab; label: string; icon: typeof ImageIcon }[] = [
  { id: "creations", label: "My Creations", icon: FolderOpen },
  { id: "history", label: "Generation History", icon: History },
  { id: "prompts", label: "Saved Prompts", icon: Bookmark },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "files", label: "Uploaded Files", icon: Upload },
  { id: "billing", label: "Credits & Billing", icon: CreditCard },
  { id: "settings", label: "Account Settings", icon: Settings },
  { id: "security", label: "Privacy & Security", icon: Shield },
];

interface Asset {
  id: string;
  kind: "image" | "video" | "music";
  title: string;
  seed: number;
  prompt: string;
  favorite: boolean;
  createdAt: string;
}

const seedAssets = (): Asset[] => {
  const content = getDemoContent();
  return content.community
    .filter((c) => c.kind !== "prompt")
    .slice(0, 9)
    .map((c, i) => ({
      id: `a${i}`,
      kind: c.kind as "image" | "video" | "music",
      title: c.title,
      seed: seedFrom(`${c.prompt}${i}`),
      prompt: c.prompt,
      favorite: i % 3 === 0,
      createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    }));
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-zinc-400">Loading your studio…</div>}>
      <DashboardInner />
    </Suspense>
  );
}

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = (searchParams.get("tab") as Tab | null) ?? "creations";
  const { user, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>(initial);
  const [assets, setAssets] = useState<Asset[]>(seedAssets);
  const [renameTarget, setRenameTarget] = useState<Asset | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();

  const prompts = useMemo(
    () => [
      { id: "p1", title: "Fox spirit in neon forest", content: "A fox spirit walking through a glowing neon forest at dusk, cinematic" },
      { id: "p2", title: "Lo-fi study beats", content: "Lo-fi hip-hop for late-night study, warm vinyl crackle, 78 bpm" },
      { id: "p3", title: "Product launch script", content: "A 30-second product launch voiceover script, energetic but trustworthy tone" },
    ],
    [],
  );
  const [savedPrompts, setSavedPrompts] = useState(prompts);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading your studio…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-indigo-500/10 text-indigo-500">
          <Sparkles className="h-8 w-8" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold">Sign in to open your studio</h1>
        <p className="mt-2 text-sm text-zinc-500">Your creations, prompts and credits live here.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => router.push("/signin")}>Sign in</Button>
          <Button variant="outline" onClick={() => router.push("/signup")}>Create account</Button>
        </div>
      </div>
    );
  }

  const toggleFavorite = (id: string) =>
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, favorite: !a.favorite } : a)));

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    toast("Creation deleted.", "info");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-lg font-extrabold text-white">
            {user.name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">Hi, {user.name.split(" ")[0]} 👋</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Here&apos;s what&apos;s happening in your studio.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl border border-amber-300/40 bg-amber-400/10 px-4 py-2.5">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-300">
              <Coins className="h-4 w-4" /> {user.credits} credits
            </p>
          </div>
          <Button variant="gradient" onClick={() => router.push("/pricing")}>Buy more</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto border-b border-zinc-200 pb-px dark:border-white/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-sm font-semibold transition-colors",
              tab === t.id
                ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-300"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200",
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "creations" && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-zinc-500">View, rename, organize and delete your creations. Private to you.</p>
            <Button variant="outline" size="sm" onClick={() => router.push("/studio/image")}>+ New creation</Button>
          </div>
          {assets.length === 0 ? (
            <EmptyState icon={<FolderOpen className="h-6 w-6" />} title="Nothing here yet" description="Generate your first creation and it will show up in this library." action={<Button onClick={() => router.push("/studio/image")}>Start creating</Button>} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((a) => (
                <div key={a.id} className="card group overflow-hidden">
                  <div className="relative">
                    {a.kind === "music" ? (
                      <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-500/10">
                        <Music className="h-10 w-10 text-amber-500" />
                      </div>
                    ) : (
                      <img src={generateArtworkRatio({ seed: a.seed }).url} alt={a.title} className={cn("w-full object-cover transition-transform group-hover:scale-105", a.kind === "video" ? "aspect-video" : "aspect-square")} loading="lazy" />
                    )}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(a.id)}
                      aria-label={a.favorite ? "Unfavorite" : "Favorite"}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                    >
                      <Star className={cn("h-4 w-4", a.favorite && "fill-amber-400 text-amber-400")} />
                    </button>
                    {a.kind !== "music" && <Badge tone="zinc" className="absolute left-2 top-2 bg-black/50 backdrop-blur">{a.kind}</Badge>}
                  </div>
                  <div className="space-y-3 p-4">
                    <p className="truncate text-sm font-bold">{a.title}</p>
                    <p className="line-clamp-2 text-xs text-zinc-400 italic">“{a.prompt}”</p>
                    <div className="flex gap-1.5">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => { setRenameTarget(a); setRenameValue(a.title); }}>
                        <Pencil className="h-3.5 w-3.5" /> Rename
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toast("Copied to clipboard.", "info")}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toast("Downloads are disabled in demo mode.", "info")}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteAsset(a.id)} aria-label="Delete">
                        <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "history" && (
        <HistoryTab assets={assets} />
      )}
      {tab === "prompts" && (
        <section>
          {savedPrompts.length === 0 ? (
            <EmptyState icon={<Bookmark className="h-6 w-6" />} title="No saved prompts" description="Save prompts from the Prompt Studio to reuse them here." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {savedPrompts.map((p) => (
                <div key={p.id} className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.title}</p>
                    <p className="line-clamp-2 text-xs text-zinc-400">{p.content}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard?.writeText(p.content).catch(() => undefined); toast("Prompt copied.", "info"); }}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setSavedPrompts((prev) => prev.filter((x) => x.id !== p.id)); toast("Prompt deleted.", "info"); }}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      {tab === "favorites" && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.filter((a) => a.favorite).map((a) => (
            <div key={a.id} className="card flex items-center gap-3 p-4">
              <img src={generateArtworkRatio({ seed: a.seed, size: 160 }).url} alt="" className="h-16 w-16 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-zinc-400">{a.kind}</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Remove from favorites" onClick={() => toggleFavorite(a.id)}>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </Button>
            </div>
          ))}
          {assets.filter((a) => a.favorite).length === 0 && (
            <div className="col-span-full">
              <EmptyState icon={<Heart className="h-6 w-6" />} title="No favorites yet" description="Tap the star on any creation to pin it here." />
            </div>
          )}
        </section>
      )}
      {tab === "files" && <FilesTab />}
      {tab === "billing" && <BillingTab user={user} />}
      {tab === "settings" && <SettingsTab />}
      {tab === "security" && <SecurityTab />}

      {/* Rename modal */}
      <Modal open={!!renameTarget} onClose={() => setRenameTarget(null)} title="Rename creation" footer={<>
        <Button variant="outline" onClick={() => setRenameTarget(null)}>Cancel</Button>
        <Button onClick={() => {
          if (renameTarget) {
            setAssets((prev) => prev.map((a) => (a.id === renameTarget.id ? { ...a, title: renameValue || a.title } : a)));
            toast("Renamed.", "success");
          }
          setRenameTarget(null);
        }}>Save</Button>
      </>}>
        <Field label="New title">
          <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus />
        </Field>
      </Modal>
    </div>
  );
}

function HistoryTab({ assets }: { assets: Asset[] }) {
  return (
    <section className="card divide-y divide-zinc-100 dark:divide-white/10">
      {assets.map((a, i) => (
        <div key={a.id} className="flex items-center gap-4 p-4">
          <span className={cn("grid h-9 w-9 place-items-center rounded-2xl", a.kind === "image" ? "bg-indigo-500/10 text-indigo-500" : a.kind === "video" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500")}>
            {a.kind === "image" ? <ImageIcon className="h-4 w-4" /> : a.kind === "video" ? <Film className="h-4 w-4" /> : <Music className="h-4 w-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{a.title}</p>
            <p className="text-xs text-zinc-400">
              {a.kind} · {2 + ((a.seed % 40))} credits · {new Date(a.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge tone={i % 3 === 0 ? "emerald" : "zinc"}>{i % 3 === 0 ? "Succeeded" : "Completed"}</Badge>
        </div>
      ))}
    </section>
  );
}

function FilesTab() {
  const files = [
    { name: "portrait-ref.png", size: "2.1 MB", date: "2 days ago" },
    { name: "product-shot.jpg", size: "4.3 MB", date: "5 days ago" },
    { name: "style-guide.png", size: "1.8 MB", date: "1 week ago" },
  ];
  return (
    <section className="card divide-y divide-zinc-100 dark:divide-white/10">
      {files.map((f) => (
        <div key={f.name} className="flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-white/5">
            <ImageIcon className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">{f.name}</p>
            <p className="text-xs text-zinc-400">{f.size} · {f.date}</p>
          </div>
          <Button variant="outline" size="sm">Manage</Button>
        </div>
      ))}
    </section>
  );
}

function BillingTab({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card p-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Current plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold capitalize">{user.plan} plan</p>
            <p className="text-xs text-zinc-400">{user.plan === "free" ? "25 credits / month" : user.plan === "creator" ? "1,000 credits / month" : "4,000 credits / month"}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { window.location.href = "/pricing"; }}>Change plan</Button>
        </div>
      </div>
      <div className="card p-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Recent transactions</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Welcome grant</span><span className="font-semibold text-emerald-500">+25</span></div>
          <div className="flex justify-between"><span>Image generation</span><span className="font-semibold text-rose-500">−4</span></div>
          <div className="flex justify-between"><span>Video sneeze-peek</span><span className="font-semibold text-rose-500">−24</span></div>
        </div>
        <p className="mt-3 text-xs text-zinc-400">No payment method stored. Sample history — real billing requires Stripe keys.</p>
      </div>
    </div>
  );
}

function SettingsTab() {
  const { toast } = useToast();
  const [name, setName] = useState("Your Name");
  return (
    <section className="max-w-xl space-y-5">
      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-bold">Profile</h3>
        <Field label="Display name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Email"><Input type="email" defaultValue="you@example.com" /></Field>
        <Button onClick={() => toast("Profile saved.", "success")}>Save changes</Button>
      </div>
      <div className="card space-y-3 p-5">
        <h3 className="text-sm font-bold">Danger zone</h3>
        <p className="text-xs text-zinc-400">Deleting your account removes all creations, prompts and credits. This is irreversible.</p>
        <Button variant="danger" onClick={() => toast("Demo: account deletion is disabled without a database.", "error")}>Delete account</Button>
      </div>
    </section>
  );
}

function SecurityTab() {
  const { toast } = useToast();
  return (
    <section className="max-w-xl space-y-5">
      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-bold">Password</h3>
        <Field label="Current password"><Input type="password" placeholder="••••••••" /></Field>
        <Field label="New password"><Input type="password" placeholder="Min 8 characters" /></Field>
        <Button onClick={() => toast("Demo: password change requires the connected database.", "error")}>Update password</Button>
      </div>
      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-bold">Privacy</h3>
        <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-white/5">
          <div>
            <p className="text-sm font-semibold">Public profile</p>
            <p className="text-xs text-zinc-400">Show your name on community creations</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-white/5">
          <div>
            <p className="text-sm font-semibold">AI training opt-out</p>
            <p className="text-xs text-zinc-400">Never use my content to improve models</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
        </div>
        <Button variant="outline" onClick={() => toast("Your data preferences were saved.", "success")}>Save preferences</Button>
      </div>
    </section>
  );
}