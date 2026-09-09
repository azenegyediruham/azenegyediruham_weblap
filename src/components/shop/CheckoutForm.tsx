"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useCatalog } from "@/lib/catalog/useCatalog";
import { getSupabase } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";
import { useCart } from "@/lib/store/cart";
import { formatHuf } from "@/lib/utils/format";

/** Szállítási módok – szolgáltatófüggetlen lista (FOXPOST integráció később). */
const SHIPPING = [
  { id: "home_delivery", label: "Házhozszállítás futárral", feeHuf: 1990, eta: "1–2 munkanap" },
  { id: "foxpost", label: "FOXPOST csomagautomata (bevezetés alatt)", feeHuf: 1290, eta: "1–3 munkanap" },
  { id: "pickup", label: "Személyes átvétel, Budapest", feeHuf: 0, eta: "egyeztetés szerint" },
];
const PAYMENT = [
  { id: "mock", label: "Teszt fizetés (prototípus)", note: "Nem történik valódi terhelés." },
  { id: "transfer", label: "Banki átutalás", note: "A visszaigazoló e-mailben küldjük az adatokat." },
  { id: "card", label: "Bankkártya (Stripe – hamarosan)", note: "Aktiválás után érhető el.", disabled: true },
];

const schema = z.object({
  customer_name: z.string().min(2, "Add meg a neved."),
  email: z.string().email("Érvényes e-mail címet adj meg."),
  phone: z.string().min(6, "Add meg a telefonszámod."),
  zip: z.string().min(4, "Irányítószám."),
  city: z.string().min(2, "Város."),
  street: z.string().min(3, "Utca, házszám."),
  shipping_method: z.string(),
  payment_method: z.string(),
  notes: z.string().max(2000).optional(),
  terms: z.literal(true, { message: "Az ÁSZF elfogadása szükséges." }),
});
type Values = z.infer<typeof schema>;
const inputClass = "mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm";

export function CheckoutForm() {
  const auth = useAuth();
  const cart = useCart();
  const { catalog } = useCatalog();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { shipping_method: "home_delivery", payment_method: "mock" } });

  useEffect(() => {
    if (auth.user?.email) form.setValue("email", auth.user.email);
    if (auth.profile?.display_name) form.setValue("customer_name", auth.profile.display_name);
  }, [auth.user?.email, auth.profile?.display_name, form]);

  const shippingId = form.watch("shipping_method");
  const shipping = SHIPPING.find((s) => s.id === shippingId) ?? SHIPPING[0];
  const shippingFee = cart.subtotalHuf >= 25000 ? 0 : shipping.feeHuf;
  const total = cart.subtotalHuf + shippingFee;

  if (auth.loading) return <p className="text-sm text-muted">Betöltés…</p>;
  if (!auth.user)
    return (
      <p className="text-sm">
        A rendeléshez{" "}
        <Link href="/auth/login/?next=/checkout/" className="underline">
          jelentkezz be
        </Link>
        .
      </p>
    );
  if (orderNumber)
    return (
      <div className="rounded-2xl border border-green-300 bg-green-50 p-6 text-sm text-green-900">
        <p className="text-lg font-semibold">Köszönjük a rendelést!</p>
        <p className="mt-2">
          Rendelésszám: <strong>{orderNumber}</strong>. Státusz: <strong>pending</strong>. A visszaigazoló e-mail küldése a Resend integráció bevezetése után lesz automatikus – addig manuálisan jelentkezünk.
        </p>
        <Link href="/profile/" className="mt-4 inline-block underline">
          Rendeléseim
        </Link>
      </div>
    );
  if (cart.hydrated && cart.items.length === 0)
    return (
      <p className="text-sm">
        A kosarad üres.{" "}
        <Link href="/studio/" className="underline">
          Tervezz valamit
        </Link>
        .
      </p>
    );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <form
        onSubmit={form.handleSubmit(async (values) => {
          setError(null);
          const supabase = getSupabase();
          const userId = auth.user!.id;
          const { data: order, error: oErr } = await supabase
            .from("orders")
            .insert({
              user_id: userId,
              customer_name: values.customer_name,
              email: values.email,
              phone: values.phone,
              shipping_address: { zip: values.zip, city: values.city, street: values.street, country: "HU" },
              shipping_method: values.shipping_method,
              payment_method: values.payment_method,
              payment_status: values.payment_method === "mock" ? "paid" : "unpaid",
              subtotal_huf: cart.subtotalHuf,
              shipping_fee_huf: shippingFee,
              total_huf: total,
              notes: values.notes || null,
            })
            .select("id, order_number")
            .single();
          if (oErr || !order) {
            setError(`A rendelés mentése nem sikerült: ${oErr?.message ?? "ismeretlen hiba"}`);
            return;
          }
          const items = cart.items.map((i) => {
            const product = catalog.products.find((p) => p.slug === i.productSlug);
            const variant = product?.variants.find((v) => v.fitSlug === i.fitSlug && v.colorSlug === i.colorSlug && v.sizeCode === i.sizeCode);
            return {
              order_id: order.id,
              product_id: product && !product.id.startsWith("prod-") ? product.id : null,
              variant_id: variant && !variant.id.includes("-v") ? variant.id : null,
              product_name: i.productName,
              variant_snapshot: { fit: i.fitSlug, color: i.colorSlug, size: i.sizeCode, sku: variant?.sku ?? null, productSlug: i.productSlug },
              design_snapshot: (i.design ? { placements: i.design.placements, sourceMeta: i.design.sourceMeta, savedDesignCode: i.design.savedDesignCode, embroideryTotalHuf: i.design.embroideryTotalHuf } : null) as unknown as Json,
              quantity: i.quantity,
              unit_price_huf: i.unitPriceHuf,
              line_total_huf: i.unitPriceHuf * i.quantity,
            };
          });
          const { error: iErr } = await supabase.from("order_items").insert(items);
          if (iErr) {
            setError(`A tételek mentése nem sikerült: ${iErr.message}`);
            return;
          }
          cart.clear();
          setOrderNumber(order.order_number);
        })}
        className="space-y-5"
      >
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-semibold">Kapcsolat és szállítási cím</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <F label="Név" err={form.formState.errors.customer_name?.message}>
              <input {...form.register("customer_name")} className={inputClass} autoComplete="name" />
            </F>
            <F label="E-mail" err={form.formState.errors.email?.message}>
              <input type="email" {...form.register("email")} className={inputClass} autoComplete="email" />
            </F>
            <F label="Telefon" err={form.formState.errors.phone?.message}>
              <input {...form.register("phone")} className={inputClass} autoComplete="tel" />
            </F>
            <F label="Irányítószám" err={form.formState.errors.zip?.message}>
              <input {...form.register("zip")} className={inputClass} autoComplete="postal-code" />
            </F>
            <F label="Város" err={form.formState.errors.city?.message}>
              <input {...form.register("city")} className={inputClass} autoComplete="address-level2" />
            </F>
            <F label="Utca, házszám" err={form.formState.errors.street?.message}>
              <input {...form.register("street")} className={inputClass} autoComplete="street-address" />
            </F>
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-semibold">Szállítás</h2>
          <div className="mt-3 space-y-2">
            {SHIPPING.map((s) => (
              <label key={s.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm has-[:checked]:border-foreground">
                <span className="flex items-center gap-3">
                  <input type="radio" value={s.id} {...form.register("shipping_method")} />
                  <span>
                    {s.label}
                    <span className="block text-xs text-muted">{s.eta}</span>
                  </span>
                </span>
                <span>{s.feeHuf === 0 ? "0 Ft" : formatHuf(s.feeHuf)}</span>
              </label>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-semibold">Fizetés</h2>
          <div className="mt-3 space-y-2">
            {PAYMENT.map((p) => (
              <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm has-[:checked]:border-foreground ${p.disabled ? "opacity-50" : ""}`}>
                <input type="radio" value={p.id} disabled={p.disabled} {...form.register("payment_method")} />
                <span>
                  {p.label}
                  <span className="block text-xs text-muted">{p.note}</span>
                </span>
              </label>
            ))}
          </div>
          <F label="Megjegyzés a rendeléshez">
            <textarea rows={2} {...form.register("notes")} className={inputClass} />
          </F>
          <label className="mt-3 flex items-start gap-2 text-xs text-muted">
            <input type="checkbox" {...form.register("terms")} className="mt-0.5" />
            <span>
              Elfogadom az{" "}
              <Link href="/legal/aszf/" className="underline">
                ÁSZF
              </Link>
              -et; tudomásul veszem, hogy az egyedi (hímzett) termékekre az elállási jog nem vonatkozik.
            </span>
          </label>
          {form.formState.errors.terms ? <p className="text-xs text-red-700">{form.formState.errors.terms.message}</p> : null}
        </section>
        {error ? (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={form.formState.isSubmitting} className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground disabled:opacity-50">
          {form.formState.isSubmitting ? "Rendelés leadása…" : `Rendelés leadása – ${formatHuf(total)}`}
        </button>
      </form>
      <aside className="h-fit rounded-2xl border border-line bg-surface p-5 text-sm">
        <h2 className="font-semibold">Tételek</h2>
        <ul className="mt-3 space-y-2">
          {cart.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span>
                {i.quantity} × {i.productName}
                <span className="block text-xs text-muted">
                  {i.fitSlug} · {i.colorSlug} · {i.sizeCode}
                  {i.design ? ` · ${i.design.placements.length} hímzés` : ""}
                </span>
              </span>
              <span>{formatHuf(i.unitPriceHuf * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-line pt-3">
          <div className="flex justify-between">
            <dt className="text-muted">Részösszeg</dt>
            <dd>{formatHuf(cart.subtotalHuf)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Szállítás</dt>
            <dd>{shippingFee === 0 ? "Ingyenes" : formatHuf(shippingFee)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Összesen</dt>
            <dd>{formatHuf(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function F({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      {label}
      {children}
      {err ? <span className="block text-xs text-red-700">{err}</span> : null}
    </label>
  );
}
