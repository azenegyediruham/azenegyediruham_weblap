"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useSiteSettings } from "@/lib/settings/SiteSettingsProvider";
import { tryGetSupabase } from "@/lib/supabase/client";

const schema = z.object({
  name: z.string().min(2, "Add meg a neved."),
  email: z.string().email("Érvényes e-mail címet adj meg."),
  platform: z.enum(["instagram", "tiktok", "youtube", "facebook", "other"]),
  social_username: z.string().min(2, "Add meg a felhasználóneved."),
  profile_url: z.string().url("Érvényes URL-t adj meg.").or(z.literal("")),
  follower_count: z.number({ message: "Adj meg egy számot." }).int().min(0, "0 vagy több."),
  content_idea: z.string().min(10, "Írd le röviden az ötleted (min. 10 karakter)."),
  post_plan: z.string().min(5, "Milyen posztot készítenél?"),
  notes: z.string().max(2000).optional(),
});
type Values = z.infer<typeof schema>;

const inputClass = "mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm";

export function CreatorApplicationForm() {
  const auth = useAuth();
  const settings = useSiteSettings();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { platform: "instagram", profile_url: "", follower_count: 0 } });
  const platform = form.watch("platform");
  const followers = form.watch("follower_count");
  const minimum = settings.creatorProgram.minFollowers[platform] ?? 0;
  const belowMinimum = minimum > 0 && Number(followers) > 0 && Number(followers) < minimum;

  if (done)
    return (
      <div className="rounded-xl border border-green-300 bg-green-50 px-4 py-4 text-sm text-green-900">
        <p className="font-semibold">Köszönjük a jelentkezést!</p>
        <p className="mt-1">Státusz: <strong>submitted</strong>. Manuálisan ellenőrizzük, és e-mailben jelentkezünk. Bejelentkezve a profilodban is követheted.</p>
      </div>
    );

  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        setError(null);
        const supabase = tryGetSupabase();
        if (!supabase) {
          setDone(true);
          return;
        }
        let screenshot_path: string | null = null;
        if (screenshot) {
          if (screenshot.size > 10 * 1024 * 1024) {
            setError("A képernyőkép legfeljebb 10 MB lehet.");
            return;
          }
          const folder = auth.user?.id ?? "anonymous";
          const ext = screenshot.name.split(".").pop()?.toLowerCase() || "png";
          const path = `${folder}/${crypto.randomUUID()}.${ext}`;
          const { error: upErr } = await supabase.storage.from("creator-applications").upload(path, screenshot, { contentType: screenshot.type });
          if (upErr) {
            setError(`A képernyőkép feltöltése nem sikerült: ${upErr.message}`);
            return;
          }
          screenshot_path = path;
        }
        const { error: err } = await supabase.from("creator_applications").insert({
          user_id: auth.user?.id ?? null,
          name: values.name,
          email: values.email,
          platform: values.platform,
          social_username: values.social_username,
          profile_url: values.profile_url || null,
          follower_count: values.follower_count,
          content_idea: values.content_idea,
          post_plan: values.post_plan,
          notes: values.notes || null,
          screenshot_path,
        });
        if (err) setError("A jelentkezés mentése nem sikerült. Próbáld újra, vagy írj e-mailt.");
        else setDone(true);
      })}
      className="space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Név" error={form.formState.errors.name?.message}>
          <input {...form.register("name")} className={inputClass} />
        </Field>
        <Field label="E-mail" error={form.formState.errors.email?.message}>
          <input type="email" {...form.register("email")} className={inputClass} />
        </Field>
        <Field label="Platform">
          <select {...form.register("platform")} className={inputClass}>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
            <option value="other">Egyéb</option>
          </select>
        </Field>
        <Field label="Felhasználónév" error={form.formState.errors.social_username?.message}>
          <input placeholder="@nev" {...form.register("social_username")} className={inputClass} />
        </Field>
        <Field label="Profil URL" error={form.formState.errors.profile_url?.message}>
          <input placeholder="https://" {...form.register("profile_url")} className={inputClass} />
        </Field>
        <Field label="Követők száma" error={form.formState.errors.follower_count?.message}>
          <input type="number" min={0} {...form.register("follower_count", { valueAsNumber: true })} className={inputClass} />
          {belowMinimum ? <span className="text-xs text-amber-700">A minimum ezen a platformon {minimum.toLocaleString("hu-HU")}. Jelentkezhetsz, de az elbírálásnál számít.</span> : null}
        </Field>
      </div>
      <Field label="Tartalomötlet" error={form.formState.errors.content_idea?.message}>
        <textarea rows={3} placeholder="Mit mutatnál be? Milyen ruha, milyen minta?" {...form.register("content_idea")} className={inputClass} />
      </Field>
      <Field label="Milyen posztot készítenél?" error={form.formState.errors.post_plan?.message}>
        <textarea rows={2} placeholder="Pl. 1 reel + 2 story, kicsomagolás és viselés" {...form.register("post_plan")} className={inputClass} />
      </Field>
      <Field label="Képernyőkép a profilról (opcionális, PNG/JPG/WebP)">
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-xs" />
      </Field>
      <Field label="Megjegyzés">
        <textarea rows={2} {...form.register("notes")} className={inputClass} />
      </Field>
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground disabled:opacity-50">
        {form.formState.isSubmitting ? "Küldés…" : "Jelentkezés beküldése"}
      </button>
      <p className="text-xs text-muted">A jelentkezéssel hozzájárulsz az adatok kezeléséhez a program elbírálása céljából. Az elbírálás manuális.</p>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      {label}
      {children}
      {error ? <span className="block text-xs text-red-700">{error}</span> : null}
    </label>
  );
}
