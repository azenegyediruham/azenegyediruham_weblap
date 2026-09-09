#!/usr/bin/env node
/**
 * Felhasználó létrehozása / szerep beállítása a Supabase Admin API-val (service role kulcs a .env.local-ból).
 * Csak fejlesztői gépről; a kulcs nem kerül kiírásra.
 *
 *   node scripts/create-user.mjs <email> <jelszó> [customer|admin]
 *   node scripts/create-user.mjs valaki@example.com 'Eros-Jelszo-123' admin
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envFile = resolve(root, ".env.local");
if (!existsSync(envFile)) {
  console.error("Hiányzik a .env.local");
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(envFile, "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z0-9_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
const [email, password, role = "customer"] = process.argv.slice(2);
if (!email || !password) {
  console.error("Használat: node scripts/create-user.mjs <email> <jelszó> [customer|admin]");
  process.exit(1);
}
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL és SUPABASE_SERVICE_ROLE_KEY szükséges a .env.local-ban.");
  process.exit(1);
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 200 });
if (listErr) throw listErr;
let user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
if (!user) {
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: email.split("@")[0] } });
  if (error) throw error;
  user = data.user;
  console.log("Létrehozva:", user.id);
} else {
  console.log("Már létezik:", user.id);
}
const { error: pErr } = await admin.from("profiles").update({ role }).eq("id", user.id);
if (pErr) throw pErr;
const { data: profile } = await admin.from("profiles").select("email, role").eq("id", user.id).single();
console.log("Profil:", profile);
