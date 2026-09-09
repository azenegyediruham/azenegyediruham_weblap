import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProductView } from "@/components/shop/ProductView";

export const metadata: Metadata = {
  title: "Termék",
};

export default function ProductPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-16 text-sm text-muted">Termék betöltése…</div>}>
          <ProductView />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
