import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ShopBrowser } from "@/components/shop/ShopBrowser";

export const metadata: Metadata = {
  title: "Ruhák",
  description: "Pólók, pulóverek, trikók, nadrágok, ruhák és szoknyák – mind testreszabható saját mintával.",
};

export default function ShopPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-16 text-sm text-muted">Katalógus betöltése…</div>}>
          <ShopBrowser />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
