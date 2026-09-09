"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { tryGetSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";
import { formatSizeCm } from "@/lib/utils/format";

type SavedDesign = Database["public"]["Tables"]["saved_designs"]["Row"];
type Item = Database["public"]["Tables"]["saved_design_items"]["Row"];

/** Megosztható design nézet: /design/?code=DES-XXXXXX (publikus vagy saját). */
export function SharedDesignView() {
  const params = useSearchParams();
  const code = (params.get("code") ?? "").toUpperCase();
  const [design, setDesign] = useState<SavedDesign | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fetchState, setState] = useState<"loading" | "ok" | "missing">("loading");
  const configured = isSupabaseConfigured();
  const state = !configured ? "noconfig" : !code ? "missing" : fetchState;

  useEffect(() => {
    const supabase = tryGetSupabase();
    if (!supabase || !code) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("saved_designs").select("*").eq("public_code", code).maybeSingle();
      if (cancelled) return;
      if (!data) {
        setState("missing");
        return;
      }
      const { data: its } = await supabase.from("saved_design_items").select("*").eq("saved_design_id", data.id).order("sort_order");
      let url: string | null = null;
      if (data.preview_path) {
        const { data: signed } = await supabase.storage.from("user-designs").createSignedUrl(data.preview_path, 3600);
        url = signed?.signedUrl ?? null;
      }
      if (cancelled) return;
      setDesign(data);
      setItems(its ?? []);
      setPreviewUrl(url);
      setState("ok");
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (state === "loading") return <p className="text-sm text-muted">Design betöltése…</p>;
  if (state === "noconfig") return <p className="text-sm text-muted">A megosztott designok megtekintése Supabase konfigurációt igényel.</p>;
  if (state === "missing" || !design)
    return (
      <div className="text-sm">
        <p>Nincs ilyen design ({code || "hiányzó kód"}), vagy nem nyilvános.</p>
        <Link href="/studio/" className="mt-3 inline-block underline">
          Tervezz sajátot
        </Link>
      </div>
    );

  const config = (design.config ?? {}) as { productSlug?: string; colorSlug?: string; sizeCode?: string; fitSlug?: string };
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
      <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={design.name} className="h-full w-full object-contain" />
        ) : (
          <span className="text-sm text-muted">Nincs előnézeti kép</span>
        )}
      </div>
      <div className="text-sm">
        <p className="font-mono text-xs text-muted">{design.public_code}</p>
        <h2 className="mt-1 text-2xl font-semibold">{design.name}</h2>
        <dl className="mt-4 space-y-1">
          <div className="flex justify-between">
            <dt className="text-muted">Ruha</dt>
            <dd>{config.productSlug ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Fazon / szín / méret</dt>
            <dd>
              {config.fitSlug ?? "—"} / {config.colorSlug ?? "—"} / {config.sizeCode ?? "—"}
            </dd>
          </div>
          {items.map((it) => (
            <div key={it.id} className="flex justify-between">
              <dt className="text-muted">{it.zone_key.replace(/_/g, " ")}</dt>
              <dd>
                {formatSizeCm(Number(it.width_cm), Number(it.height_cm))} · {Number(it.rotation_deg)}°
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-muted">Létrehozva: {new Date(design.created_at).toLocaleDateString("hu-HU")} · {design.is_public ? "nyilvános" : "privát"}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {config.productSlug ? (
            <Link href={`/studio/?product=${config.productSlug}`} className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground">
              Hasonlót tervezek
            </Link>
          ) : null}
          <button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="rounded-full border border-line px-5 py-2.5 text-sm hover:border-foreground">
            Link másolása
          </button>
        </div>
        <p className="mt-4 text-xs text-muted">Későbbi funkciók: duplikálás a Studióba, újrarendelés, like, designer profil.</p>
      </div>
    </div>
  );
}
