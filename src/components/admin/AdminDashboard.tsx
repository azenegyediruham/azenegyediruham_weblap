"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";

const COUNTS: { table: string; label: string; href: string; filter?: [string, string] }[] = [
  { table: "products", label: "Termék", href: "/admin/products/" },
  { table: "product_variants", label: "Variáns", href: "/admin/product_variants/" },
  { table: "orders", label: "Rendelés", href: "/admin/orders/" },
  { table: "orders", label: "Új rendelés", href: "/admin/orders/", filter: ["status", "pending"] },
  { table: "creator_applications", label: "Creator jelentkezés", href: "/admin/creator_applications/" },
  { table: "creator_applications", label: "Elbírálásra vár", href: "/admin/creator_applications/", filter: ["status", "submitted"] },
  { table: "saved_designs", label: "Mentett design", href: "/admin/user_uploads/" },
  { table: "profiles", label: "Felhasználó", href: "/admin/profiles/" },
  { table: "contact_messages", label: "Üzenet", href: "/admin/contact_messages/" },
];

export function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  useEffect(() => {
    const db = getSupabase() as unknown as SupabaseClient;
    let cancelled = false;
    Promise.all(
      COUNTS.map(async (c, i) => {
        let q = db.from(c.table).select("*", { count: "exact", head: true });
        if (c.filter) q = q.eq(c.filter[0], c.filter[1]);
        const { count } = await q;
        return [String(i), count ?? null] as const;
      }),
    ).then((entries) => {
      if (!cancelled) setCounts(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {COUNTS.map((c, i) => (
          <li key={i}>
            <Link href={c.href} className="block rounded-2xl border border-line bg-surface p-4 hover:border-foreground">
              <p className="text-3xl font-semibold">{counts[String(i)] ?? "…"}</p>
              <p className="text-sm text-muted">{c.label}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 rounded-2xl border border-line bg-surface p-5 text-sm text-muted">
        <p className="font-semibold text-foreground">Gyors útmutató</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Új terméktípus: Kategóriák → Új; majd Termékek → Új (kategória, modell, mérettáblázat, ár); Variánsok → fazon × szín × méret.</li>
          <li>Új 3D modell: 3D ruhamodellek → GLB feltöltés + chartok/nézetek JSON; Hímzési zónák → cm bounding boxok.</li>
          <li>Kontakt, hero, creator szabályok, pricing: Oldalbeállítások (JSON kulcsonként).</li>
          <li>Creator jelentkezés státuszai: submitted → reviewing → approved / rejected → fulfilled.</li>
        </ul>
      </div>
    </div>
  );
}
