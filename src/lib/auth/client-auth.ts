/** Client-side auth helpers — never expose secrets here. */
import type { PublicUser } from "./auth-server";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "same-origin",
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Request failed");
  }
  return data;
}

export async function apiRegister(input: { email: string; password: string; name: string }): Promise<{ user: PublicUser }> {
  return request("/api/auth/register", { method: "POST", body: JSON.stringify(input) });
}

export async function apiLogin(input: { email: string; password: string }): Promise<{ user: PublicUser }> {
  return request("/api/auth/login", { method: "POST", body: JSON.stringify(input) });
}

export async function apiLogout(): Promise<void> {
  await request("/api/auth/logout", { method: "POST", body: "{}" });
}

export async function apiMe(): Promise<{ user: PublicUser | null }> {
  return request("/api/auth/me", { method: "GET" });
}

export async function apiRequestReset(email: string): Promise<{ ok: boolean; token?: string }> {
  return request("/api/auth/reset", { method: "POST", body: JSON.stringify({ email }) });
}

export async function apiApplyReset(token: string, email: string, password: string): Promise<{ ok: boolean }> {
  return request("/api/auth/reset", { method: "POST", body: JSON.stringify({ token, email, password }) });
}

export async function apiMode(): Promise<{ demoMode: boolean; providers: { id: string; name: string; demo: boolean }[] }> {
  return request("/api/mode", { method: "GET" });
}

export interface GeneratePayload {
  kind: "image" | "video" | "music" | "text";
  input: Record<string, unknown>;
}

export async function apiGenerate(payload: GeneratePayload): Promise<{
  creditCost: number;
  provider: string;
  demo: boolean;
  newCredits?: number;
  images?: { urls: { url: string; width: number; height: number }[]; provider: string; modelId: string }[];
  video?: { videoUrl: string; thumbUrl: string; provider: string; modelId: string };
  music?: { audioUrl: string; title: string; provider: string; modelId: string; durationSec: number };
  text?: { text: string; provider: string; modelId: string };
}> {
  return request("/api/generate", { method: "POST", body: JSON.stringify(payload) });
}