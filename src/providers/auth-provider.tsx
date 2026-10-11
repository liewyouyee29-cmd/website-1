"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { PublicUser } from "@/lib/auth/auth-server";
import { apiLogin, apiLogout, apiMe, apiRegister } from "@/lib/auth/client-auth";

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  /** Optimistically update credits after generation. */
  applyCreditChange: (delta: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { user } = await apiMe();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { user } = await apiLogin({ email, password });
    setUser(user);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const { user } = await apiRegister({ name, email, password });
    setUser(user);
  }, []);

  const signOut = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const applyCreditChange = useCallback((delta: number) => {
    setUser((prev) => (prev ? { ...prev, credits: Math.max(0, prev.credits + delta) } : prev));
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, refresh, applyCreditChange }),
    [user, loading, signIn, signUp, signOut, refresh, applyCreditChange],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}