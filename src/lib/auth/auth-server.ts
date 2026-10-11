/**
 * Server-side auth helpers.
 *
 * Uses HMAC-signed session cookies (httpOnly, secure in production).
 * Passwords are hashed with bcrypt. The user store is a small JSON-backed
 * datastore usable anywhere (no database required). When Supabase
 * credentials are configured, swap this module for a Supabase-backed store
 * with the same interface — the rest of the app does not change.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  credits: number;
  plan: "free" | "creator" | "pro" | "studio";
  passwordResetToken?: string;
  passwordResetExp?: number;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  credits: number;
  plan: AuthUser["plan"];
}

interface UserStore {
  users: AuthUser[];
}

const SESSION_COOKIE = "weaver_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function sessionSecret(): string {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    // Local-dev fallback — never rely on this in production.
    return "weaver-dev-insecure-secret";
  }
  return secret;
}

let dataDir = process.env.WEAVER_DATA_DIR ?? "";

export function setDataDir(dir: string) {
  dataDir = dir;
}

function storeFile(): string {
  return path.join(dataDir, "users.json");
}

let memoryUsers: UserStore | null = null;

async function loadStore(): Promise<UserStore> {
  if (memoryUsers) return memoryUsers;
  if (!dataDir) {
    memoryUsers = { users: [] };
    return memoryUsers;
  }
  const file = storeFile();
  try {
    const raw = await readFile(file, "utf8");
    memoryUsers = JSON.parse(raw) as UserStore;
  } catch {
    memoryUsers = { users: [] };
    await persistStore();
  }
  return memoryUsers;
}

async function persistStore(): Promise<void> {
  if (!dataDir || !memoryUsers) return;
  await mkdir(dataDir, { recursive: true });
  await writeFile(storeFile(), JSON.stringify(memoryUsers, null, 2), "utf8");
}

/** Local demo seeding — creates a sample account so the dashboard is explorable. */
export async function ensureSeedUser(): Promise<PublicUser | null> {
  if (process.env.ALLOW_DEMO_ACCOUNT === "false") return null;
  const store = await loadStore();
  if (!store.users.some((u) => u.email === "demo@weaver.local")) {
    const hash = await bcrypt.hash("demo1234", 10);
    store.users.push({
      id: crypto.randomUUID(),
      email: "demo@weaver.local",
      name: "Demo Artist",
      passwordHash: hash,
      createdAt: new Date().toISOString(),
      credits: 640,
      plan: "pro",
    });
    await persistStore();
  }
  return null;
}

export function toPublicUser(u: AuthUser): PublicUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    createdAt: u.createdAt,
    credits: u.credits,
    plan: u.plan,
  };
}

// ------------------- Signing / cookies --------------------------------

export function signSession(payload: { uid: string; exp: number }): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string): { uid: string } | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { uid: string; exp: number };
    if (payload.exp < Date.now()) return null;
    return { uid: payload.uid };
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<string> {
  return signSession({ uid: userId, exp: Date.now() + SESSION_TTL_MS });
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

/** Read the current user from a cookie string. */
export async function getUserFromCookie(cookieHeader: string | null | undefined): Promise<AuthUser | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  const token = match.slice(SESSION_COOKIE.length + 1);
  const payload = verifySessionToken(token);
  if (!payload) return null;
  const store = await loadStore();
  return store.users.find((u) => u.id === payload.uid) ?? null;
}

export function sessionCookieHeader(token: string, secure: boolean): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Max-Age=${SESSION_TTL_MS / 1000}; ${secure ? "Secure; " : ""}SameSite=Lax`;
}

export function clearSessionCookieHeader(secure: boolean): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0; ${secure ? "Secure; " : ""}SameSite=Lax`;
}

// ------------------- Account operations --------------------------------

export async function registerUser(input: { email: string; password: string; name: string }): Promise<{ user: PublicUser; error?: never } | { error: string }> {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (input.password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  const store = await loadStore();
  if (store.users.some((u) => u.email === email)) {
    return { error: "An account with this email already exists." };
  }
  const hash = await bcrypt.hash(input.password, 10);
  const user: AuthUser = {
    id: crypto.randomUUID(),
    email,
    name: input.name.trim() || email.split("@")[0],
    passwordHash: hash,
    createdAt: new Date().toISOString(),
    credits: 25,
    plan: "free",
  };
  store.users.push(user);
  await persistStore();
  return { user: toPublicUser(user) };
}

export async function loginWithPassword(emailRaw: string, password: string): Promise<{ user: PublicUser; error?: never } | { error: string }> {
  const email = emailRaw.trim().toLowerCase();
  const store = await loadStore();
  const user = store.users.find((u) => u.email === email);
  if (!user) {
    // Timing-safe-ish: still run a hash comparison.
    await bcrypt.hash(password, 10);
    return { error: "Invalid email or password." };
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password." };
  return { user: toPublicUser(user) };
}

export async function findUserById(id: string): Promise<AuthUser | null> {
  const store = await loadStore();
  return store.users.find((u) => u.id === id) ?? null;
}

export async function updateUser(id: string, patch: Partial<Pick<AuthUser, "name" | "email" | "credits" | "plan">>): Promise<PublicUser | null> {
  const store = await loadStore();
  const user = store.users.find((u) => u.id === id);
  if (!user) return null;
  if (typeof patch.name === "string") user.name = patch.name;
  if (typeof patch.email === "string") user.email = patch.email.trim().toLowerCase();
  if (typeof patch.credits === "number") user.credits = Math.max(0, patch.credits);
  if (typeof patch.plan === "string") user.plan = patch.plan;
  await persistStore();
  return toPublicUser(user);
}

export async function resetPassword(emailRaw: string): Promise<{ ok: boolean; token?: string }> {
  const email = emailRaw.trim().toLowerCase();
  const store = await loadStore();
  const user = store.users.find((u) => u.email === email);
  if (!user) return { ok: false };
  // Demo implementation: return a one-time reset token in the response.
  // In production this is emailed with an expiring link instead.
  const token = crypto.randomBytes(18).toString("base64url");
  user.passwordResetToken = crypto
    .createHmac("sha256", sessionSecret())
    .update(`${user.id}:${token}`)
    .digest("hex")
    .slice(0, 32);
  user.passwordResetExp = Date.now() + 1000 * 60 * 30; // 30 minutes
  await persistStore();
  return { ok: true, token };
}

export async function applyPasswordReset(token: string, emailRaw: string, newPassword: string): Promise<{ ok: boolean }> {
  const email = emailRaw.trim().toLowerCase();
  const store = await loadStore();
  const user = store.users.find((u) => u.email === email);
  if (!user || newPassword.length < 8) return { ok: false };
  if (!user.passwordResetToken || !user.passwordResetExp) return { ok: false };
  if (user.passwordResetExp < Date.now()) return { ok: false };
  const expected = crypto
    .createHmac("sha256", sessionSecret())
    .update(`${user.id}:${token}`)
    .digest("hex")
    .slice(0, 32);
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(user.passwordResetToken))) return { ok: false };
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExp = undefined;
  await persistStore();
  return { ok: true };
}