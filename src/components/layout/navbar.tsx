"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  Clapperboard,
  ImageIcon,
  Music,
  PenLine,
  Sparkles,
  User,
  LayoutDashboard,
  LogOut,
  Coins,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";

const toolMenu = [
  {
    label: "AI Video",
    icon: Clapperboard,
    items: [
      { href: "/studio/video", label: "Video Generator" },
      { href: "/tools/video-upscaler", label: "Video Upscaler" },
      { href: "/tools/singing-video", label: "Singing Video" },
      { href: "/tools/avatar", label: "Talking Avatar" },
      { href: "/tools/dance", label: "AI Dance Generator" },
      { href: "/tools/video-ad", label: "Video Ad Maker" },
    ],
  },
  {
    label: "AI Image",
    icon: ImageIcon,
    items: [
      { href: "/studio/image", label: "Image Generator" },
      { href: "/tools/image-upscaler", label: "Image Upscaler" },
      { href: "/tools/object-remover", label: "Object Remover" },
      { href: "/tools/anime-art", label: "Anime Art Generator" },
      { href: "/tools/pixel-art", label: "Pixel Art Studio" },
    ],
  },
  {
    label: "AI Music",
    icon: Music,
    items: [
      { href: "/studio/music", label: "Music Generator" },
      { href: "/tools/birthday-song", label: "Birthday Song" },
      { href: "/studio/music-library", label: "My Music Library" },
    ],
  },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Weaver AI Studio home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-500 text-white shadow-glow">
        <Sparkles className="h-5 w-5" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        Weaver<span className="text-gradient"> AI</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileTools, setMobileTools] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, loading } = useAuth();
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileTools(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
        setCreditsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const navLink =
    "text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all",
        scrolled
          ? "border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#090911]/80"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8" aria-label="Main">
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop dropdown navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {toolMenu.map((group) => (
              <Dropdown key={group.label} label={group.label} icon={<group.icon className="h-4 w-4" />}>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-indigo-400" />
                    {item.label}
                  </Link>
                ))}
              </Dropdown>
            ))}
            <Link href="/studio/text" className={cn(navLink, "ml-1 flex items-center gap-1")}>
              <PenLine className="h-4 w-4" /> AI Text
            </Link>
            <Dropdown label="Explore" icon={<ChevronDown className="h-3.5 w-3.5" />}>
              <Link href="/explore" className="dropdown-link">Explore & Community</Link>
              <Link href="/pricing" className="dropdown-link">Pricing & Credits</Link>
            </Dropdown>
            <Dropdown label="Learn" icon={<ChevronDown className="h-3.5 w-3.5" />}>
              <Link href="/academy" className="dropdown-link">Academy</Link>
              <Link href="/blog" className="dropdown-link">Blog</Link>
              <Link href="/help" className="dropdown-link">Help Center</Link>
            </Dropdown>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full p-2.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5 h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {loading ? null : user ? (
              <div className="flex items-center gap-2" ref={accountRef}>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCreditsOpen((v) => !v)}
                    className="flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-300"
                    aria-label="Credits"
                  >
                    <Coins className="h-4 w-4" />
                    {user.credits}
                  </button>
                  {creditsOpen && (
                    <div className="absolute right-0 top-11 w-56 rounded-2xl border border-zinc-200 bg-white p-3 shadow-card dark:border-white/10 dark:bg-zinc-900">
                      <p className="mb-1 text-xs text-zinc-500">Credit balance</p>
                      <p className="mb-3 text-2xl font-bold">{user.credits} <span className="text-sm font-medium text-zinc-400">credits</span></p>
                      <Link
                        href="/pricing"
                        onClick={() => setCreditsOpen(false)}
                        className="flex items-center justify-center gap-1 rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" /> Buy credits
                      </Link>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full border border-zinc-200 p-1 pr-3 hover:border-indigo-400 dark:border-white/10"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xs font-bold text-white">
                      {user.name.slice(0, 2).toUpperCase()}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-12 w-60 rounded-2xl border border-zinc-200 bg-white py-2 shadow-card dark:border-white/10 dark:bg-zinc-900">
                      <div className="border-b border-zinc-100 px-4 pb-2 pt-1 dark:border-white/10">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <p className="truncate text-xs text-zinc-400">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link href="/dashboard" className="dropdown-link"><LayoutDashboard className="h-4 w-4 text-zinc-400" /> Dashboard</Link>
                        <Link href="/dashboard?tab=creations" className="dropdown-link"><User className="h-4 w-4 text-zinc-400" /> My Creations</Link>
                        <button
                          type="button"
                          onClick={() => { void signOut(); }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <LogOut className="h-4 w-4" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link href="/signin" className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10">
                  Sign in
                </Link>
              </>
            )}
          </div>

          <Link
            href="/signup"
            className="hidden rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 md:inline-flex"
          >
            Start Creating
          </Link>

          <button
            type="button"
            className="rounded-full p-2.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-zinc-200 bg-white/95 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#090911]/95 lg:hidden">
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setMobileTools((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-white/5"
              aria-expanded={mobileTools}
            >
              <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-indigo-500" /> Create</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", mobileTools && "rotate-180")} />
            </button>
            {mobileTools && (
              <div className="ml-3 space-y-1 border-l border-zinc-200 pl-3 dark:border-white/10">
                {toolMenu.flatMap((g) => g.items).map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5">
                    {item.label}
                  </Link>
                ))}
                <Link href="/studio/text" className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5">
                  AI Prompt Studio
                </Link>
              </div>
            )}
          </div>
          {[
            { href: "/pricing", label: "Pricing" },
            { href: "/explore", label: "Explore" },
            { href: "/academy", label: "Academy" },
            { href: "/blog", label: "Blog" },
            { href: "/help", label: "Help Center" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5">
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center gap-2 border-t border-zinc-200 pt-3 dark:border-white/10">
            {user ? (
              <>
                <Link href="/dashboard" className="flex-1 rounded-full bg-zinc-900 px-4 py-2.5 text-center text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => { void signOut(); }}
                  className="rounded-full border border-zinc-300 px-4 py-2.5 text-sm font-semibold dark:border-white/15"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="flex-1 rounded-full border border-zinc-300 px-4 py-2.5 text-center text-sm font-semibold dark:border-white/15">
                  Sign in
                </Link>
                <Link href="/signup" className="flex-1 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2.5 text-center text-sm font-semibold text-white">
                  Start Creating
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Dropdown({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
          isOpen
            ? "bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white",
        )}
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        {icon}
        {label}
      </button>
      {isOpen && (
        <div
          className="absolute left-1/2 top-full z-50 mt-2 w-60 -translate-x-1/2 animate-fade-in-up rounded-2xl border border-zinc-200 bg-white p-2 shadow-card dark:border-white/10 dark:bg-zinc-900"
        >
          {children}
        </div>
      )}
    </div>
  );
}