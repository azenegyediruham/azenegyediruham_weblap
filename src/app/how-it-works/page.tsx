import type { Metadata } from "next";
import Link from "next/link";
import { DesignOnGarment } from "@/components/garments/DesignOnGarment";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { PageShell } from "@/components/layout/PageShell";
import { ShirtViewerLazy } from "@/components/three/ShirtViewerLazy";
import { STEPS } from "@/concepts/shared/data";

export const metadata: Metadata = {
  title: "Hogyan működik?",
  description: "Válassz ruhát, tölts fel egy mintát, helyezd el, nézd meg 3D-ben, rendeld meg – mi elkészítjük.",
};

const VISUALS = [
  <div key="1" className="flex gap-2">
    {(["tshirt", "hoodie", "dress"] as const).map((k) => (
      <GarmentSilhouette key={k} kind={k} color="#F4F2EC" className="h-28 w-auto" />
    ))}
  </div>,
  <div key="2" className="flex items-center gap-3">
    {["#F4F2EC", "#161616", "#1F2B47", "#D8C6A5", "#5A6B3F"].map((h) => (
      <span key={h} className="h-8 w-8 rounded-full border border-black/10" style={{ backgroundColor: h }} />
    ))}
    <span className="rounded-full border border-line px-3 py-1 text-xs">XS – XXL</span>
  </div>,
  <div key="3" className="rounded-xl border-2 border-dashed border-line px-6 py-6 text-center text-xs text-muted">
    PNG · JPG · WebP · SVG
    <br />
    max 10 MB
  </div>,
  <DesignOnGarment key="4" kind="tshirt" color="#F4F2EC" designUrl="/design-assets/sun-wave.svg" position="front_center" widthCm={18} heightCm={14.4} className="h-32 w-auto" />,
  <div key="5" className="h-36 w-40">
    <ShirtViewerLazy color="#1F2B47" className="h-full w-full" hint={false} zoom={false} contactShadow={false} />
  </div>,
  <div key="6" className="rounded-xl bg-surface px-5 py-4 text-sm">
    <p className="font-semibold">Összesen: 11 279 Ft</p>
    <p className="text-xs text-muted">Classic póló + 12 × 8 cm hímzés</p>
  </div>,
  <div key="7" className="text-sm">
    <p className="font-semibold">5–10 munkanap</p>
    <p className="text-xs text-muted">digitizálás · hímzés · ellenőrzés · csomagolás</p>
  </div>,
];

export default function HowItWorksPage() {
  return (
    <PageShell eyebrow="Hogyan működik?" title="Hét lépés a saját ruhádig" lead="Nem kell tervezői tudás. A rendszer valós centiméterben mutatja, mekkora lesz a minta, és a 3D nézetben körbe is forgathatod, mielőtt rendelsz.">
      <ol className="space-y-6">
        {STEPS.map((s, i) => (
          <li key={s.n} className="grid gap-4 rounded-2xl border border-line bg-surface p-6 md:grid-cols-[64px_1fr_auto] md:items-center">
            <span className="font-mono text-2xl text-muted">0{s.n}</span>
            <div>
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </div>
            <div className="flex items-center justify-center md:w-56">{VISUALS[i]}</div>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/studio/" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground">
          Kezdd el a tervezést
        </Link>
        <Link href="/faq/" className="rounded-full border border-line px-6 py-3 text-sm font-medium hover:border-foreground">
          Gyakori kérdések
        </Link>
      </div>
    </PageShell>
  );
}
