import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { StudioApp } from "@/components/customizer/StudioApp";

export const metadata: Metadata = {
  title: "Design Studio – Saját ruhám",
  description: "Válassz ruhát, töltsd fel a mintád, helyezd el centiméter-pontosan, nézd meg 3D-ben.",
};

export default function StudioPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-16 text-sm text-muted">Studio betöltése…</div>}>
          <StudioApp />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
