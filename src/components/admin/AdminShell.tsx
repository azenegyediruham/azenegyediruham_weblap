"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ADMIN_RESOURCES } from "@/lib/admin/resources";

/** Admin keret: kliensoldali guard (a valódi kapu az RLS). */
export function AdminShell({ children, active }: { children: ReactNode; active?: string }) {
  const auth = useAuth();
  if (!auth.configured) return <p className="p-6 text-sm text-muted">Az admin felület Supabase konfigurációt igényel.</p>;
  if (auth.loading) return <p className="p-6 text-sm text-muted">Betöltés…</p>;
  if (!auth.user)
    return (
      <p className="p-6 text-sm">
        <Link href="/auth/login/?next=/admin/" className="underline">
          Jelentkezz be
        </Link>{" "}
        admin fiókkal.
      </p>
    );
  if (!auth.isAdmin) return <p className="p-6 text-sm text-red-700">Nincs admin jogosultságod. (A profiles.role = admin szükséges; a bootstrap e-mailek automatikusan adminok.)</p>;

  const groups = Array.from(new Set(ADMIN_RESOURCES.map((r) => r.group)));
  return (
    <div className="grid min-h-[70vh] gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="text-sm">
        <Link href="/admin/" className={`block rounded-lg px-3 py-1.5 font-semibold ${!active ? "bg-foreground text-background" : "hover:bg-surface"}`}>
          Áttekintés
        </Link>
        {groups.map((g) => (
          <div key={g} className="mt-4">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{g}</p>
            <ul className="mt-1">
              {ADMIN_RESOURCES.filter((r) => r.group === g).map((r) => (
                <li key={r.key}>
                  <Link href={`/admin/${r.key}/`} className={`block rounded-lg px-3 py-1.5 ${active === r.key ? "bg-foreground text-background" : "hover:bg-surface"}`}>
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
