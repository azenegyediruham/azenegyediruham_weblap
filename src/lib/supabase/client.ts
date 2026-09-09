import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

export type AppSupabaseClient = SupabaseClient<Database>;

let client: AppSupabaseClient | null = null;

/**
 * Böngészőoldali Supabase kliens (singleton). Static exporton nincs szerver,
 * ezért csak a publishable kulcsot használjuk; minden jogosultság RLS-ből jön.
 * Implicit auth flow: az email-linkek más eszközön/böngészőben megnyitva is működnek.
 */
export function getSupabase(): AppSupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase nincs konfigurálva: NEXT_PUBLIC_SUPABASE_URL és NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY szükséges.",
    );
  }
  if (!client) {
    client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        flowType: "implicit",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

/** Null-safe változat: ha nincs konfiguráció, null-t ad (mock fallbackhez). */
export function tryGetSupabase(): AppSupabaseClient | null {
  return isSupabaseConfigured() ? getSupabase() : null;
}
