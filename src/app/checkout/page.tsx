import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const metadata: Metadata = { title: "Pénztár" };

export default function CheckoutPage() {
  return (
    <PageShell eyebrow="Pénztár" title="Rendelés leadása" lead="Prototípus: a fizetés szimulált, a rendelés az adatbázisba kerül és a profilodban követhető. Stripe és FOXPOST integráció később." wide>
      <CheckoutForm />
    </PageShell>
  );
}
