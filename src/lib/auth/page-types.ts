"use client";

export type AuthError = string | null;

export function fieldError(form: FormData, field: string): string {
  const val = (form.get(field) ?? "") as string;
  return val.trim();
}