import Link from "next/link";
import { ConceptFrame } from "@/components/concepts/ConceptFrame";
import { Reveal } from "@/components/concepts/Reveal";
import { DesignOnGarment } from "@/components/garments/DesignOnGarment";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { ImmersiveScene } from "@/concepts/03-immersive-3d/ImmersiveScene";
import { siteConfig } from "@/config/site";
import { STEPS, assetUrl, colorHex, featuredProducts, gallery, productBySlug } from "@/concepts/shared/data";
import { formatHuf } from "@/lib/utils/format";

export default function Immersive3DPage() {
  return (
    <div className="min-h-screen">
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 text-[var(--c03-fg)] mix-blend-difference">
          <Link href="/" className="c03-display text-[15px] tracking-[0.2em] uppercase">
            {siteConfig.shortName}
          </Link>
          <nav className="hidden gap-8 text-[12px] uppercase tracking-[0.25em] md:flex" aria-label="Fő navigáció">
            {["Ruhák", "Studio", "Galéria", "Rólunk"].map((n) => (
              <a key={n} href="#" className="opacity-70 hover:opacity-100">
                {n}
              </a>
            ))}
          </nav>
          <a href="#" className="text-[12px] uppercase tracking-[0.25em]">
            Kosár 0
          </a>
        </div>
      </header>

      <main>
        <ImmersiveScene />

        {/* STEPS – világos zárás után sötét folytatás */}
        <section className="bg-[var(--c03-fg)] text-[var(--c03-bg)]">
          <div className="mx-auto max-w-[1440px] px-6 py-24">
            <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
              <Reveal>
                <p className="text-[11px] uppercase tracking-[0.4em] opacity-60">Hogyan működik</p>
                <h2 className="c03-display mt-4 text-[clamp(32px,4.5vw,64px)] leading-[1]">Hét lépés a saját ruhádig.</h2>
              </Reveal>
              <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                {STEPS.map((s, i) => (
                  <Reveal key={s.n} as="li" delay={i * 0.05} className="border-t border-[var(--c03-bg)]/15 pt-4">
                    <p className="c03-display text-[13px] text-[var(--c03-gold)]">0{s.n}</p>
                    <h3 className="mt-2 text-[16px] font-medium">{s.title}</h3>
                    <p className="mt-1 text-[13px] opacity-60">{s.text}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* PRODUCTS – sötét, spotlight kártyák */}
        <section className="bg-[var(--c03-bg)]">
          <div className="mx-auto max-w-[1440px] px-6 py-24">
            <div className="flex items-end justify-between">
              <Reveal>
                <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--c03-gold)]">Kollekció</p>
                <h2 className="c03-display mt-4 text-[clamp(32px,4.5vw,64px)] leading-[1]">Alapdarabok, amikre tervezhetsz.</h2>
              </Reveal>
              <Link href="/shop/" className="hidden text-[12px] uppercase tracking-[0.25em] opacity-70 hover:opacity-100 md:block">
                Összes →
              </Link>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.slice(0, 6).map((p, i) => (
                <Reveal key={p.slug} as="li" delay={(i % 3) * 0.08} className="c03-glow group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[var(--c03-bg2)] to-[var(--c03-bg)] p-6">
                  <Link href={`/shop/product/?slug=${p.slug}`} className="block">
                    <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(201,166,107,0.18),transparent_70%)]" aria-hidden />
                    <GarmentSilhouette kind={p.silhouette} color={colorHex(p.colorSlugs[Math.min(2, p.colorSlugs.length - 1)])} lineColor="rgba(255,255,255,0.12)" className="relative mx-auto h-64 w-auto transition-transform duration-700 group-hover:scale-[1.04]" title={p.name} />
                    <div className="mt-6 flex items-baseline justify-between">
                      <h3 className="c03-display text-[17px]">{p.name}</h3>
                      <p className="text-[13px] text-[var(--c03-gold)]">{formatHuf(p.basePriceHuf)}</p>
                    </div>
                    <p className="mt-1 text-[12px] opacity-50">{p.description.slice(0, 70)}…</p>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* GALLERY – filmstrip */}
        <section className="border-t border-white/10 bg-[var(--c03-bg2)]">
          <div className="mx-auto max-w-[1440px] px-6 py-24">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--c03-gold)]">Elkészült</p>
              <h2 className="c03-display mt-4 text-[clamp(32px,4.5vw,64px)] leading-[1]">Jelenetek a műhelyből.</h2>
            </Reveal>
            <div className="c03-gold-line mt-10" aria-hidden />
            <ul className="mt-10 flex snap-x gap-4 overflow-x-auto pb-4">
              {gallery.map((g) => {
                const p = productBySlug(g.productSlug);
                if (!p) return null;
                return (
                  <li key={g.id} className="w-[260px] shrink-0 snap-start rounded-xl bg-[var(--c03-bg)] p-5">
                    <DesignOnGarment kind={p.silhouette} color={colorHex(g.colorSlug)} designUrl={assetUrl(g.designAssetSlug)} position={g.zoneKey as "front_center"} widthCm={g.widthCm} heightCm={g.heightCm} lineColor="rgba(255,255,255,0.15)" className="h-56 w-auto" title={g.title} />
                    <p className="c03-display mt-4 text-[14px]">{g.title}</p>
                    <p className="text-[12px] opacity-50">
                      {g.widthCm} × {g.heightCm} cm
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* CREATOR */}
        <section className="bg-[var(--c03-bg)]">
          <div className="mx-auto max-w-[1440px] px-6 py-28 text-center">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--c03-gold)]">{siteConfig.creatorProgram.programName}</p>
              <h2 className="c03-display mx-auto mt-5 max-w-3xl text-[clamp(32px,5vw,72px)] leading-[1]">Alkotóknak: hímzés cserébe a történetért.</h2>
              <p className="mx-auto mt-6 max-w-lg text-[15px] opacity-60">{siteConfig.creatorProgram.benefit}</p>
              <Link href="/creator/" className="mt-10 inline-block rounded-full border border-[var(--c03-gold)] px-7 py-3.5 text-[13px] uppercase tracking-[0.2em] text-[var(--c03-gold)] hover:bg-[var(--c03-gold)] hover:text-[var(--c03-bg)]">
                Jelentkezés
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[var(--c03-bg)]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-10 text-[12px] opacity-60 md:flex-row md:items-center md:justify-between">
          <p>
            {siteConfig.name} · {siteConfig.contact.email} · {siteConfig.contact.address}
          </p>
          <p>ÁSZF · Adatkezelés · Cookie · Szállítás · Elállás</p>
        </div>
      </footer>
      <ConceptFrame slug="03-immersive-3d" />
    </div>
  );
}
