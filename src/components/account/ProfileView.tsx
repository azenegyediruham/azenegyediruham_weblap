"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import { formatHuf } from "@/lib/utils/format";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type SavedDesign = Database["public"]["Tables"]["saved_designs"]["Row"];
type Application = Database["public"]["Tables"]["creator_applications"]["Row"];

const STATUS_LABEL: Record<string, string> = {
  pending: "Leadva",
  confirmed: "Visszaigazolva",
  in_production: "Gyártás alatt",
  ready: "Elkészült",
  shipped: "Feladva",
  delivered: "Kézbesítve",
  cancelled: "Törölve",
  refunded: "Visszatérítve",
  submitted: "Beküldve",
  reviewing: "Elbírálás alatt",
  approved: "Elfogadva",
  rejected: "Elutasítva",
  fulfilled: "Teljesítve",
};

export function ProfileView() {
  const auth = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [designs, setDesigns] = useState<(SavedDesign & { previewUrl?: string | null })[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user) return;
    let cancelled = false;
    const supabase = getSupabase();
    (async () => {
      const [o, d, a] = await Promise.all([
        supabase.from("orders").select("*").order("placed_at", { ascending: false }),
        supabase.from("saved_designs").select("*").order("created_at", { ascending: false }),
        supabase.from("creator_applications").select("*").order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;
      const withPreviews = await Promise.all(
        (d.data ?? []).map(async (design) => {
          if (!design.preview_path) return { ...design, previewUrl: null };
          const { data } = await supabase.storage.from("user-designs").createSignedUrl(design.preview_path, 3600);
          return { ...design, previewUrl: data?.signedUrl ?? null };
        }),
      );
      if (cancelled) return;
      setOrders(o.data ?? []);
      setDesigns(withPreviews);
      setApplications(a.data ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [auth.user]);

  if (!auth.configured) return <p className="text-sm text-muted">A profil Supabase konfigurációt igényel.</p>;
  if (auth.loading) return <p className="text-sm text-muted">Betöltés…</p>;
  if (!auth.user)
    return (
      <p className="text-sm">
        <Link href="/auth/login/?next=/profile/" className="underline">
          Jelentkezz be
        </Link>{" "}
        a profilod megtekintéséhez.
      </p>
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
        <div>
          <p className="text-lg font-semibold">{auth.profile?.display_name ?? auth.user.email}</p>
          <p className="text-sm text-muted">{auth.user.email}</p>
          {auth.isAdmin ? (
            <Link href="/admin/" className="mt-1 inline-block text-xs font-semibold text-accent underline-offset-4 hover:underline">
              Admin felület →
            </Link>
          ) : null}
        </div>
        <button type="button" onClick={() => void auth.signOut()} className="rounded-full border border-line px-4 py-2 text-sm hover:border-foreground">
          Kijelentkezés
        </button>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Rendeléseim</h2>
        {loading ? <p className="mt-2 text-sm text-muted">Betöltés…</p> : orders.length === 0 ? <p className="mt-2 text-sm text-muted">Még nincs rendelésed.</p> : null}
        <ul className="mt-3 space-y-2">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm">
              <div>
                <p className="font-semibold">{o.order_number}</p>
                <p className="text-xs text-muted">{new Date(o.placed_at).toLocaleDateString("hu-HU")}</p>
              </div>
              <span className="rounded-full bg-background px-3 py-1 text-xs">{STATUS_LABEL[o.status] ?? o.status}</span>
              <span className="text-xs text-muted">Fizetés: {o.payment_status}</span>
              <span className="font-semibold">{formatHuf(o.total_huf)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Mentett designjaim</h2>
        {!loading && designs.length === 0 ? <p className="mt-2 text-sm text-muted">Még nincs mentett designod – a Studióban a Mentés gombbal tudsz menteni.</p> : null}
        <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {designs.map((d) => (
            <li key={d.id} className="rounded-xl border border-line bg-surface p-3 text-sm">
              <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg bg-background">
                {d.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.previewUrl} alt={d.name} className="h-full w-full object-contain" />
                ) : (
                  <span className="text-xs text-muted">nincs előnézet</span>
                )}
              </div>
              <p className="mt-2 font-semibold">{d.name}</p>
              <p className="text-xs text-muted">{d.public_code}</p>
              <div className="mt-2 flex gap-3 text-xs">
                <Link href={`/design/?code=${d.public_code}`} className="underline">
                  Megnyitás
                </Link>
                <Link href={`/studio/?product=${(d.config as { productSlug?: string })?.productSlug ?? ""}`} className="underline">
                  Újra a Studióban
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Creator Program jelentkezéseim</h2>
        {!loading && applications.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Nincs jelentkezésed.{" "}
            <Link href="/creator/" className="underline">
              Jelentkezem
            </Link>
          </p>
        ) : null}
        <ul className="mt-3 space-y-2">
          {applications.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm">
              <span>
                {a.platform} · {a.social_username} · {a.follower_count.toLocaleString("hu-HU")} követő
              </span>
              <span className="rounded-full bg-background px-3 py-1 text-xs">{STATUS_LABEL[a.status] ?? a.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
