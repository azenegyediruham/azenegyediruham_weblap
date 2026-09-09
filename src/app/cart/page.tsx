import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { CartView } from "@/components/shop/CartView";

export const metadata: Metadata = { title: "Kosár" };

export default function CartPage() {
  return (
    <PageShell eyebrow="Kosár" title="Kosarad" wide>
      <CartView />
    </PageShell>
  );
}
