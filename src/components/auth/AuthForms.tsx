"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth/AuthProvider";
import { siteUrl } from "@/lib/asset-url";
import { getSupabase } from "@/lib/supabase/client";

const emailSchema = z.string().email("Érvényes e-mail címet adj meg.");
const passwordSchema = z.string().min(8, "Legalább 8 karakter.");

const inputClass = "mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm";
const btnClass = "mt-5 w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground disabled:opacity-50";

function NotConfigured() {
  return <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">A bejelentkezés Supabase konfigurációt igényel (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).</p>;
}

function useNext() {
  const params = useSearchParams();
  const next = params.get("next");
  return next && next.startsWith("/") ? next : "/profile/";
}

export function LoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const next = useNext();
  const [error, setError] = useState<string | null>(null);
  const schema = z.object({ email: emailSchema, password: z.string().min(1, "Add meg a jelszót.") });
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (auth.user) router.replace(next);
  }, [auth.user, next, router]);

  if (!auth.configured) return <NotConfigured />;
  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        setError(null);
        const { error: err } = await getSupabase().auth.signInWithPassword(values);
        if (err) setError(err.message === "Invalid login credentials" ? "Hibás e-mail vagy jelszó." : err.message === "Email not confirmed" ? "Előbb erősítsd meg az e-mail címed (nézd meg a postaládád)." : err.message);
        else router.replace(next);
      })}
      className="space-y-3"
    >
      <label className="block text-sm">
        E-mail
        <input type="email" autoComplete="email" {...form.register("email")} className={inputClass} />
        {form.formState.errors.email ? <span className="text-xs text-red-700">{form.formState.errors.email.message}</span> : null}
      </label>
      <label className="block text-sm">
        Jelszó
        <input type="password" autoComplete="current-password" {...form.register("password")} className={inputClass} />
        {form.formState.errors.password ? <span className="text-xs text-red-700">{form.formState.errors.password.message}</span> : null}
      </label>
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={form.formState.isSubmitting} className={btnClass}>
        {form.formState.isSubmitting ? "Belépés…" : "Belépés"}
      </button>
      <p className="text-center text-xs text-muted">
        <Link href="/auth/forgot-password/" className="underline">
          Elfelejtett jelszó
        </Link>{" "}
        ·{" "}
        <Link href={`/auth/register/?next=${encodeURIComponent(next)}`} className="underline">
          Regisztráció
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const auth = useAuth();
  const next = useNext();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const schema = z
    .object({ displayName: z.string().min(2, "Add meg a neved."), email: emailSchema, password: passwordSchema, confirm: z.string(), terms: z.literal(true, { message: "Az ÁSZF elfogadása szükséges." }) })
    .refine((v) => v.password === v.confirm, { message: "A két jelszó nem egyezik.", path: ["confirm"] });
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  if (!auth.configured) return <NotConfigured />;
  if (done)
    return (
      <div className="rounded-xl border border-green-300 bg-green-50 px-4 py-4 text-sm text-green-900">
        <p className="font-semibold">Már csak egy lépés.</p>
        <p className="mt-1">Küldtünk egy megerősítő e-mailt. Kattints a linkre, utána be tudsz lépni.</p>
      </div>
    );
  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        setError(null);
        const { error: err } = await getSupabase().auth.signUp({
          email: values.email,
          password: values.password,
          options: { data: { display_name: values.displayName }, emailRedirectTo: `${siteUrl()}/auth/callback/?next=${encodeURIComponent(next)}` },
        });
        if (err) setError(err.message);
        else setDone(true);
      })}
      className="space-y-3"
    >
      <label className="block text-sm">
        Név
        <input autoComplete="name" {...form.register("displayName")} className={inputClass} />
        {form.formState.errors.displayName ? <span className="text-xs text-red-700">{form.formState.errors.displayName.message}</span> : null}
      </label>
      <label className="block text-sm">
        E-mail
        <input type="email" autoComplete="email" {...form.register("email")} className={inputClass} />
        {form.formState.errors.email ? <span className="text-xs text-red-700">{form.formState.errors.email.message}</span> : null}
      </label>
      <label className="block text-sm">
        Jelszó
        <input type="password" autoComplete="new-password" {...form.register("password")} className={inputClass} />
        {form.formState.errors.password ? <span className="text-xs text-red-700">{form.formState.errors.password.message}</span> : null}
      </label>
      <label className="block text-sm">
        Jelszó újra
        <input type="password" autoComplete="new-password" {...form.register("confirm")} className={inputClass} />
        {form.formState.errors.confirm ? <span className="text-xs text-red-700">{form.formState.errors.confirm.message}</span> : null}
      </label>
      <label className="flex items-start gap-2 text-xs text-muted">
        <input type="checkbox" {...form.register("terms")} className="mt-0.5" />
        <span>
          Elfogadom az{" "}
          <Link href="/legal/aszf/" className="underline">
            ÁSZF
          </Link>
          -et és az{" "}
          <Link href="/legal/adatkezeles/" className="underline">
            adatkezelési tájékoztatót
          </Link>
          .
        </span>
      </label>
      {form.formState.errors.terms ? <p className="text-xs text-red-700">{form.formState.errors.terms.message}</p> : null}
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={form.formState.isSubmitting} className={btnClass}>
        {form.formState.isSubmitting ? "Regisztráció…" : "Regisztráció"}
      </button>
      <p className="text-center text-xs text-muted">
        Van már fiókod?{" "}
        <Link href={`/auth/login/?next=${encodeURIComponent(next)}`} className="underline">
          Belépés
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const auth = useAuth();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const schema = z.object({ email: emailSchema });
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  if (!auth.configured) return <NotConfigured />;
  if (done) return <p className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900">Ha létezik fiók ezzel a címmel, küldtünk egy jelszó-visszaállító linket.</p>;
  return (
    <form
      onSubmit={form.handleSubmit(async ({ email }) => {
        setError(null);
        const { error: err } = await getSupabase().auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl()}/auth/reset-password/` });
        if (err) setError(err.message);
        else setDone(true);
      })}
      className="space-y-3"
    >
      <label className="block text-sm">
        E-mail
        <input type="email" autoComplete="email" {...form.register("email")} className={inputClass} />
        {form.formState.errors.email ? <span className="text-xs text-red-700">{form.formState.errors.email.message}</span> : null}
      </label>
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={form.formState.isSubmitting} className={btnClass}>
        Link küldése
      </button>
    </form>
  );
}

export function ResetPasswordForm() {
  const auth = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const schema = z.object({ password: passwordSchema, confirm: z.string() }).refine((v) => v.password === v.confirm, { message: "A két jelszó nem egyezik.", path: ["confirm"] });
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!auth.configured) return;
    const { data } = getSupabase().auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    const t = window.setTimeout(() => {
      if (window.location.hash.includes("error")) setError("A link lejárt vagy érvénytelen. Kérj újat.");
    }, 0);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(t);
    };
  }, [auth.configured]);

  if (!auth.configured) return <NotConfigured />;
  return (
    <form
      onSubmit={form.handleSubmit(async ({ password }) => {
        setError(null);
        const { error: err } = await getSupabase().auth.updateUser({ password });
        if (err) setError(err.message);
        else router.replace("/profile/");
      })}
      className="space-y-3"
    >
      {!ready && !auth.user ? <p className="text-xs text-muted">A visszaállító link feldolgozása… Ha nem az e-mailből érkeztél, kérj új linket.</p> : null}
      <label className="block text-sm">
        Új jelszó
        <input type="password" autoComplete="new-password" {...form.register("password")} className={inputClass} />
        {form.formState.errors.password ? <span className="text-xs text-red-700">{form.formState.errors.password.message}</span> : null}
      </label>
      <label className="block text-sm">
        Új jelszó újra
        <input type="password" autoComplete="new-password" {...form.register("confirm")} className={inputClass} />
        {form.formState.errors.confirm ? <span className="text-xs text-red-700">{form.formState.errors.confirm.message}</span> : null}
      </label>
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={form.formState.isSubmitting || (!ready && !auth.user)} className={btnClass}>
        Jelszó mentése
      </button>
    </form>
  );
}

export function AuthCallback() {
  const auth = useAuth();
  const router = useRouter();
  const next = useNext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const hash = window.location.hash;
      if (hash.includes("error_code=otp_expired")) setError("A megerősítő link lejárt. Jelentkezz be, és kérj újat.");
      else if (hash.includes("error")) setError("A link érvénytelen.");
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (auth.user) router.replace(next);
  }, [auth.user, next, router]);

  useEffect(() => {
    if (!auth.configured || auth.user) return;
    const { data } = getSupabase().auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") router.replace(next);
    });
    return () => data.subscription.unsubscribe();
  }, [auth.configured, auth.user, next, router]);

  if (error)
    return (
      <div className="text-sm">
        <p className="text-red-700">{error}</p>
        <Link href="/auth/login/" className="mt-3 inline-block underline">
          Belépés
        </Link>
      </div>
    );
  return <p className="text-sm text-muted">Bejelentkezés…</p>;
}
