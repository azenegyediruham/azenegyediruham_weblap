"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSupabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthApi {
  configured: boolean;
  loading: boolean;
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [loading, setLoading] = useState(configured);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await getSupabase().from("profiles").select("*").eq("id", userId).maybeSingle();
    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    if (!configured) return;
    const supabase = getSupabase();
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      loadProfile(data.session?.user.id).finally(() => {
        if (active) setLoading(false);
      });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      void loadProfile(next?.user.id);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [configured, loadProfile]);

  const signOut = useCallback(async () => {
    if (!configured) return;
    await getSupabase().auth.signOut();
    setSession(null);
    setProfile(null);
  }, [configured]);

  const refreshProfile = useCallback(() => loadProfile(session?.user.id), [loadProfile, session?.user.id]);

  const api = useMemo<AuthApi>(
    () => ({ configured, loading, user: session?.user ?? null, session, profile, isAdmin: profile?.role === "admin", refreshProfile, signOut }),
    [configured, loading, session, profile, refreshProfile, signOut],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth csak AuthProvider alatt használható");
  return ctx;
}
