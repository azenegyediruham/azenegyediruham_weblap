"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth/AuthProvider";
import { tryGetSupabase } from "@/lib/supabase/client";

const schema = z.object({
  name: z.string().min(2, "Add meg a neved."),
  email: z.string().email("Érvényes e-mail címet adj meg."),
  subject: z.string().min(2, "Add meg a tárgyat."),
  message: z.string().min(10, "Írj legalább 10 karaktert.").max(5000),
});
type Values = z.infer<typeof schema>;

const inputClass = "mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm";

export function ContactForm() {
  const auth = useAuth();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { subject: "Kérdés" } });

  if (done) return <p className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900">Köszönjük! Megkaptuk az üzeneted, hamarosan válaszolunk.</p>;

  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        setError(null);
        const supabase = tryGetSupabase();
        if (!supabase) {
          setDone(true); // mock: nincs backend
          return;
        }
        const { error: err } = await supabase.from("contact_messages").insert({ ...values, user_id: auth.user?.id ?? null });
        if (err) setError("Az üzenet küldése nem sikerült. Írj közvetlenül e-mailben.");
        else setDone(true);
      })}
      className="space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Név
          <input {...form.register("name")} className={inputClass} />
          {form.formState.errors.name ? <span className="text-xs text-red-700">{form.formState.errors.name.message}</span> : null}
        </label>
        <label className="block text-sm">
          E-mail
          <input type="email" {...form.register("email")} className={inputClass} />
          {form.formState.errors.email ? <span className="text-xs text-red-700">{form.formState.errors.email.message}</span> : null}
        </label>
      </div>
      <label className="block text-sm">
        Tárgy
        <select {...form.register("subject")} className={inputClass}>
          {["Kérdés", "Céges rendelés", "Saját ruha hímzése", "Rendelésem", "Creator Program", "Egyéb"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Üzenet
        <textarea rows={6} {...form.register("message")} className={inputClass} />
        {form.formState.errors.message ? <span className="text-xs text-red-700">{form.formState.errors.message.message}</span> : null}
      </label>
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground disabled:opacity-50">
        {form.formState.isSubmitting ? "Küldés…" : "Üzenet küldése"}
      </button>
    </form>
  );
}
