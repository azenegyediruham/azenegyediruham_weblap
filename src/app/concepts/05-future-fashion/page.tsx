import Link from "next/link";
import { ConceptFrame } from "@/components/concepts/ConceptFrame";
import { Reveal } from "@/components/concepts/Reveal";
import { DesignOnGarment } from "@/components/garments/DesignOnGarment";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { MaterialStage } from "@/concepts/05-future-fashion/MaterialStage";
import { siteConfig } from "@/config/site";
import { STEPS, assetUrl, colorHex, gallery, productBySlug, products } from "@/concepts/shared/data";
import { tshirtZones } from "@/data/mock-catalog";
import { formatHuf } from "@/lib/utils/format";

export default function FutureFashionPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[var(--c05-line)] bg-[var(--c05-bg)]/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
          <Link href="/" className="text-[14px] font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
          <nav className="c05-mono hidden gap-8 text-[11px] uppercase tracking-[0.25em] text-[var(--c05-fg)]/60 md:flex" aria-label="Fő navigáció">
            {["Ruhák", "Studio", "Precision", "Galéria"].map((n) => (
              <a key={n} href="#" className="hover:text-[var(--c05-fg)]">
                {n}
              </a>
            ))}
          </nav>
          <p className="c05-mono text-[11px] uppercase tracking-[0.25em] text-[var(--c05-fg)]/60">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--c05-accent)] align-middle" aria-hidden />
            Studio online
          </p>
        </div>
      </header>

      <main>
        {/* HERO – fényszínpad */}
        <section className="mx-auto max-w-[1400px] px-6 pb-20 pt-12 md:pt-16">
          <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] md:items-end">
            <Reveal>
              <p className="c05-mono text-[11px] uppercase tracking-[0.3em] text-[var(--c05-accent)]">Fashion · Technology · Embroidery</p>
              <h1 className="c05-glow-text mt-6 text-[clamp(44px,6.4vw,92px)] font-light leading-[1.02] tracking-[-0.03em]">
                Precíz hímzés,
                <br />
                <span className="font-semibold">valós időben tervezve.</span>
              </h1>
              <p className="mt-8 max-w-md text-[16px] leading-relaxed text-[var(--c05-fg)]/65">
                Válaszd ki az anyagot, töltsd fel a grafikát, helyezd el milliméter-pontosan. A 3D előnézet azt mutatja, amit a gép varrni fog.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/studio/" className="rounded-full bg-[var(--c05-fg)] px-7 py-3.5 text-[14px] font-semibold text-[var(--c05-bg)] hover:bg-[var(--c05-accent)] hover:text-white">
                  Belépés a Studióba
                </Link>
                <Link href="/shop/" className="rounded-full border border-[var(--c05-line)] px-7 py-3.5 text-[14px] font-medium hover:border-[var(--c05-fg)]">
                  Katalógus
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <MaterialStage />
            </Reveal>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="border-y border-[var(--c05-line)]">
          <div className="mx-auto max-w-[1400px] px-6 py-20">
            <Reveal>
              <p className="c05-mono text-[11px] uppercase tracking-[0.3em] text-[var(--c05-accent)]">Process</p>
              <h2 className="mt-4 text-[clamp(28px,3.6vw,48px)] font-light tracking-[-0.02em]">Hét lépés, nulla találgatás.</h2>
            </Reveal>
            <ol className="c05-timeline relative mt-12 grid gap-8 md:grid-cols-7">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} as="li" delay={i * 0.05} className="relative pt-8">
                  <span className="absolute left-0 top-[6px] h-3 w-3 rounded-full border border-[var(--c05-accent)] bg-[var(--c05-bg)]" aria-hidden />
                  <p className="c05-mono text-[11px] text-[var(--c05-accent)]">0{s.n}</p>
                  <h3 className="mt-2 text-[14px] font-semibold">{s.title}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--c05-fg)]/55">{s.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* PRECISION – zóna specifikáció valós adatokból */}
        <section className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <p className="c05-mono text-[11px] uppercase tracking-[0.3em] text-[var(--c05-accent)]">Precision</p>
              <h2 className="mt-4 text-[clamp(28px,3.6vw,48px)] font-light tracking-[-0.02em]">Hímzési zónák, cm-ben.</h2>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-[var(--c05-fg)]/65">
                Minden ruhamodellhez definiált zónák: hol, mekkora minta helyezhető el. A szerkesztő nem enged a zónán kívülre.
              </p>
              <div className="mt-8 rounded-2xl border border-[var(--c05-line)] p-5">
                <DesignOnGarment kind="tshirt" color="#1F2B47" lineColor="rgba(255,255,255,0.15)" designUrl={assetUrl("lightning-badge")} position="front_chest_left" widthCm={9} heightCm={9} className="mx-auto h-64 w-auto" title="Mellkasi embléma" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <table className="c05-mono w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-[var(--c05-line)] text-[10px] uppercase tracking-[0.25em] text-[var(--c05-fg)]/50">
                    <th className="py-3 pr-4 font-medium">Zóna</th>
                    <th className="py-3 pr-4 font-medium">Nézet</th>
                    <th className="py-3 pr-4 font-medium">Min. szélesség</th>
                    <th className="py-3 pr-4 font-medium">Max. szélesség</th>
                    <th className="py-3 font-medium">Max. magasság</th>
                  </tr>
                </thead>
                <tbody>
                  {tshirtZones.map((z) => (
                    <tr key={z.key} className="border-b border-[var(--c05-line)]/60 hover:bg-[var(--c05-panel)]">
                      <td className="py-3 pr-4">
                        <span className="text-[var(--c05-accent)]">{z.key}</span>
                        <br />
                        <span className="text-[var(--c05-fg)]/60">{z.displayName}</span>
                      </td>
                      <td className="py-3 pr-4 text-[var(--c05-fg)]/70">{z.viewKey}</td>
                      <td className="py-3 pr-4">{z.minWidthCm} cm</td>
                      <td className="py-3 pr-4">{z.maxWidthCm} cm</td>
                      <td className="py-3">{z.maxHeightCm} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="border-t border-[var(--c05-line)]">
          <div className="mx-auto max-w-[1400px] px-6 py-20">
            <div className="flex items-end justify-between">
              <Reveal>
                <p className="c05-mono text-[11px] uppercase tracking-[0.3em] text-[var(--c05-accent)]">Catalog</p>
                <h2 className="mt-4 text-[clamp(28px,3.6vw,48px)] font-light tracking-[-0.02em]">Alapdarabok.</h2>
              </Reveal>
              <Link href="/shop/" className="c05-mono text-[11px] uppercase tracking-[0.25em] text-[var(--c05-fg)]/60 hover:text-[var(--c05-fg)]">
                Összes →
              </Link>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 8).map((p, i) => (
                <Reveal key={p.slug} as="li" delay={(i % 4) * 0.05} className="c05-card rounded-2xl p-5">
                  <Link href={`/shop/product/?slug=${p.slug}`} className="block">
                    <div className="flex items-center justify-between">
                      <span className="c05-mono text-[10px] uppercase tracking-[0.25em] text-[var(--c05-fg)]/50">{String(i + 1).padStart(2, "0")}</span>
                      <span className="c05-mono text-[10px] uppercase tracking-[0.25em] text-[var(--c05-fg)]/50">{p.gender}</span>
                    </div>
                    <GarmentSilhouette kind={p.silhouette} color={colorHex(p.colorSlugs[Math.min(2, p.colorSlugs.length - 1)])} lineColor="rgba(255,255,255,0.12)" className="mx-auto my-4 h-48 w-auto" title={p.name} />
                    <h3 className="text-[15px] font-semibold">{p.name}</h3>
                    <p className="c05-mono mt-1 text-[11px] text-[var(--c05-fg)]/55">{formatHuf(p.basePriceHuf)}</p>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* GALLERY */}
        <section className="mx-auto max-w-[1400px] px-6 py-20">
          <Reveal>
            <p className="c05-mono text-[11px] uppercase tracking-[0.3em] text-[var(--c05-accent)]">Output</p>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,48px)] font-light tracking-[-0.02em]">Elkészült konfigurációk.</h2>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.slice(0, 6).map((g, i) => {
              const p = productBySlug(g.productSlug);
              if (!p) return null;
              return (
                <Reveal key={g.id} as="li" delay={(i % 3) * 0.06} className="c05-card rounded-2xl p-5">
                  <DesignOnGarment kind={p.silhouette} color={colorHex(g.colorSlug)} lineColor="rgba(255,255,255,0.12)" designUrl={assetUrl(g.designAssetSlug)} position={g.zoneKey as "front_center"} widthCm={g.widthCm} heightCm={g.heightCm} className="mx-auto h-52 w-auto" title={g.title} />
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[14px] font-semibold">{g.title}</p>
                      <p className="c05-mono mt-1 text-[11px] text-[var(--c05-fg)]/55">
                        {g.zoneKey} · {g.widthCm} × {g.heightCm} cm
                      </p>
                    </div>
                    <span className="c05-mono text-[11px] text-[var(--c05-accent)]">{g.likes} ♥</span>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </section>

        {/* CREATOR */}
        <section className="border-t border-[var(--c05-line)]">
          <div className="mx-auto max-w-[1400px] px-6 py-24">
            <Reveal className="rounded-[28px] border border-[var(--c05-line)] bg-[var(--c05-panel)] p-10 md:p-14">
              <div className="grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <p className="c05-mono text-[11px] uppercase tracking-[0.3em] text-[var(--c05-accent)]">{siteConfig.creatorProgram.programName}</p>
                  <h2 className="mt-4 text-[clamp(28px,3.6vw,48px)] font-light tracking-[-0.02em]">Alkotói program.</h2>
                </div>
                <div>
                  <p className="text-[15px] leading-relaxed text-[var(--c05-fg)]/65">{siteConfig.creatorProgram.benefit}</p>
                  <Link href="/creator/" className="mt-6 inline-block rounded-full bg-[var(--c05-accent)] px-7 py-3.5 text-[14px] font-semibold text-white hover:opacity-90">
                    Jelentkezés
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--c05-line)]">
        <div className="c05-mono mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-10 text-[11px] uppercase tracking-[0.2em] text-[var(--c05-fg)]/50 md:flex-row md:items-center md:justify-between">
          <p>{siteConfig.name}</p>
          <p>
            {siteConfig.contact.email} · {siteConfig.contact.address}
          </p>
          <p>ÁSZF · Adatkezelés · Cookie</p>
        </div>
      </footer>
      <ConceptFrame slug="05-future-fashion" />
    </div>
  );
}
