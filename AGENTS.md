# Weaver AI Studio — Repository Guide

## What this is

A Next.js (App Router) + TypeScript + Tailwind AI creative platform in demo mode.
Users generate procedural image/video/music/text previews without any external AI
credentials; real providers can be wired in through the provider factory.

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — full production build (all routes must compile)
- `npx tsc --noEmit -p tsconfig.json` — type check
- `npm run lint` (if configured) — lint

## Key architecture

- **Auth**: `src/lib/auth/auth-server.ts` — bcrypt password hashing, HMAC-signed
  session cookies, file-backed store at `data/users.json` (set `WEAVER_DATA_DIR`
  to relocate; Supabase drop-in is the intended swap). Sessions never store the
  user object (cookie can be swapped for a signed ID — do not trust client state).
- **AI providers**: `src/lib/providers/` — `index.ts` (factory + `demoMode` flag),
  `demo.ts` (procedural outputs), `types.ts`. `demoMode` is true until a provider
  env var is set. Add new providers by implementing the interface in the factory.
- **Generation API**: `src/app/api/generate/route.ts` — validates inputs
  (`KIND_VALIDATOR`), computes an **authoritative `estimateCost()`** matching the
  studio UI formulas, rejects with HTTP 402 when credits are insufficient, and
  only deducts credits after success. Keep the side UI cost formulas in sync with
  this function.
- **UI primitives**: `src/components/ui/` — Button, Card, Modal, Dropdown, badges,
  `ClipPlayer` (SMIL animated preview), `AudioPlayer`, `DemoBadge`, `Field`/`Input`
  form wrappers, `ToastProvider`. Dark/light theming via `ThemeProvider`.

## Important invariants / gotchas

- **Hydration**: `ClipPlayer` renders its SMIL `<img>` *only when playing* (never
  `src=""` at mount). If you reintroduce a placeholder swap at render time,
  `/signup` and other pages will throw hydration mismatches.
- **Credit gating must happen on the server.** The client `canGenerate` guard
  (`useStudioGeneration`) is UX only; the route's `estimateCost` preflight + 402
  is the source of truth. Never clamp a deduction with `Math.max(0, …)` in
  `updateUser` as a way to enforce limits — it silently lets users generate at
  negative balances (deduction was previously clamped this way).
- **Demo mode outputs are labelled previews** (`DemoBadge`). Do not claim real
  generation; every card and player carries a "Demo mode" marker.
- Data store is memory-cached per process (`memoryUsers` in auth-server). Editing
  `data/users.json` directly requires a server restart to take effect.
- Media uploads go to `public/uploads/` (gitignored, `.gitkeep` preserved).

## Conventions

- New pages go under `src/app/<segment>/page.tsx`; marketing pages are server
  components, studio/tool pages are `"use client"`.
- Metadata: root layout sets `title.template = "%s · Weaver AI Studio"`; client
  pages don't set metadata so their tab title falls back to the URL — set
  `document.title` in a `useEffect` if a specific title matters.
- Keep all provider credentials in server-only env vars — never in frontend code.