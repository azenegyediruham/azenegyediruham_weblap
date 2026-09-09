"use client";

import Link from "next/link";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useCart } from "@/lib/store/cart";
import { formatHuf, formatSizeCm } from "@/lib/utils/format";
import type { SilhouetteKey } from "@/lib/catalog/types";

export function CartView() {
  const cart = useCart();
  const auth = useAuth();

  if (!cart.hydrated) return <p className="text-sm text-muted">Kosár betöltése…</p>;
  if (cart.items.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-line p-10 text-center">
        <p className="text-lg font-semibold">A kosarad üres</p>
        <p className="mt-2 text-sm text-muted">Válassz egy ruhát, és tedd rá a saját mintád.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/studio/" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground">
            Design Studio
          </Link>
          <Link href="/shop/" className="rounded-full border border-line px-5 py-2.5 text-sm font-medium">
            Ruhák
          </Link>
        </div>
      </div>
    );

  const shipping = cart.subtotalHuf >= 25000 ? 0 : 1490;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <ul className="space-y-3">
        {cart.items.map((item) => (
          <li key={item.id} className="grid grid-cols-[80px_1fr_auto] gap-4 rounded-2xl border border-line bg-surface p-4">
            <div className="flex aspect-square items-center justify-center rounded-xl bg-background">
              <GarmentSilhouette kind={item.silhouette as SilhouetteKey} color={item.colorHex} className="h-[80%] w-auto" />
            </div>
            <div className="min-w-0 text-sm">
              <p className="font-semibold">{item.productName}</p>
              <p className="text-xs text-muted">
                {item.fitSlug} · {item.colorSlug} · {item.sizeCode}
              </p>
              {item.design ? (
                <ul className="mt-1 text-xs text-muted">
                  {item.design.placements.map((p) => (
                    <li key={p.id}>
                      Hímzés · {p.zoneKey.replace(/_/g, " ")} · {formatSizeCm(p.widthCm, p.heightCm)}
                    </li>
                  ))}
                  {item.design.savedDesignCode ? <li>Design kód: {item.design.savedDesignCode}</li> : null}
                </ul>
              ) : (
                <p className="mt-1 text-xs text-muted">Minta nélkül</p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs">
                  Db
                  <input type="number" min={1} max={500} value={item.quantity} onChange={(e) => cart.setQuantity(item.id, Number(e.target.value))} className="ml-2 w-16 rounded-lg border border-line px-2 py-1 text-sm" />
                </label>
                <button type="button" onClick={() => cart.remove(item.id)} className="text-xs text-red-700 underline-offset-4 hover:underline">
                  Eltávolítás
                </button>
              </div>
            </div>
            <p className="text-right text-sm font-semibold">{formatHuf(item.unitPriceHuf * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-2xl border border-line bg-surface p-5 text-sm">
        <h2 className="text-base font-semibold">Összegzés</h2>
        <dl className="mt-3 space-y-1">
          <div className="flex justify-between">
            <dt className="text-muted">Részösszeg</dt>
            <dd>{formatHuf(cart.subtotalHuf)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Szállítás (becsült)</dt>
            <dd>{shipping === 0 ? "Ingyenes" : formatHuf(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
            <dt>Összesen</dt>
            <dd>{formatHuf(cart.subtotalHuf + shipping)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-muted">25 000 Ft felett ingyenes szállítás. A végleges díj a pénztárban, a szállítási mód szerint.</p>
        {auth.user ? (
          <Link href="/checkout/" className="mt-5 block rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-accent-foreground">
            Tovább a pénztárhoz
          </Link>
        ) : (
          <Link href="/auth/login/?next=/checkout/" className="mt-5 block rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-accent-foreground">
            Belépés a pénztárhoz
          </Link>
        )}
        <button type="button" onClick={cart.clear} className="mt-3 w-full text-xs text-muted underline-offset-4 hover:underline">
          Kosár ürítése
        </button>
      </aside>
    </div>
  );
}
