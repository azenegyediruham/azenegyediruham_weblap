import Link from "next/link";
import { ConceptFrame } from "@/components/concepts/ConceptFrame";
import { Reveal } from "@/components/concepts/Reveal";
import { DesignOnGarment } from "@/components/garments/DesignOnGarment";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { ShirtViewerLazy } from "@/components/three/ShirtViewerLazy";
import { TextileTexture } from "@/components/ui/TextileTexture";
import { siteConfig } from "@/config/site";
import { STEPS, assetUrl, colorHex, featuredProducts, gallery, productBySlug } from "@/concepts/shared/data";
import { formatHuf } from "@/lib/utils/format";

export default function LuxuryDarkPage() {
  return (
    <div className="min-h-screen">
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6">
          <nav className="c10-label hidden gap-8 md:flex" aria-label="Fő navigáció">
            {["Kollekció", "Atelier", "Galéria"].map((n) => (
              <a key={n} href="#" className="text-[var(--c10-cream)]/70 hover:text-[var(--c10-cream)]">
                {n}
              </a>
            ))}
          </nav>
          <Link href="/" className="c10-serif text-[26px] tracking-[0.02em] md:absolute md:left-1/2 md:-translate-x-1/2">
            {siteConfig.name}
          </Link>
          <div className="c10-label flex gap-8">
            <a href="#" className="text-[var(--c10-cream)]/70 hover:text-[var(--c10-cream)]">
              Belépés
            </a>
            <a href="#" className="text-[var(--c10-cream)]/70 hover:text-[var(--c10-cream)]">
              Kosár · 0
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO – nagy 3D, filmszerű fény */}
        <section className="relative min-h-screen">
          <div className="c10-vignette absolute inset-0" aria-hidden />
          <div className="absolute inset-0">
            <ShirtViewerLazy
              color="#2C2A28"
              className="h-full w-full"
              hint={false}
              zoom={false}
              autoRotateSpeed={0.45}
              lightIntensity={1.25}
              keyLightColor="#ffe6c4"
              cameraPosition={[0.3, 0.05, 1.55]}
              contactShadow={false}
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-[1400px] px-6 pb-14">
              <div className="grid items-end gap-8 md:grid-cols-12">
                <Reveal className="md:col-span-7">
                  <p className="c10-label">Egyedi hímzés · Budapest</p>
                  <h1 className="c10-serif mt-5 text-[clamp(44px,6.5vw,104px)] leading-[0.98]">
                    Csendes luxus,
                    <br />
                    <em>a te kézjegyeddel.</em>
                  </h1>
                </Reveal>
                <Reveal delay={0.1} className="pointer-events-auto md:col-span-5 md:pb-3">
                  <p className="max-w-sm text-[14px] leading-relaxed text-[var(--c10-cream)]/70">
                    Válassz egy darabot, töltsd fel a saját grafikád, helyezd el centiméter-pontosan, és nézd meg 3D-ben, mielőtt cérnát fűzünk a tűbe.
                  </p>
                  <div className="mt-8 flex gap-10">
                    <Link href="/studio/" className="c10-link text-[12px] uppercase tracking-[0.25em]">
                      Tervezés
                    </Link>
                    <Link href="/shop/" className="c10-link text-[12px] uppercase tracking-[0.25em]">
                      Kollekció
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <div className="c10-hairline mx-auto max-w-[1400px]" aria-hidden />

        {/* KOLLEKCIÓ */}
        <section className="mx-auto max-w-[1400px] px-6 py-28">
          <Reveal className="text-center">
            <p className="c10-label">Kollekció</p>
            <h2 className="c10-serif mt-5 text-[clamp(34px,4.5vw,64px)] leading-[1.05]">Alapdarabok, amelyekre érdemes hímezni.</h2>
          </Reveal>
          <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 6).map((p, i) => (
              <Reveal key={p.slug} as="li" delay={(i % 3) * 0.1} y={40} className="c10-card p-8">
                <Link href={`/shop/product/?slug=${p.slug}`} className="block">
                  <GarmentSilhouette kind={p.silhouette} color={i % 2 === 0 ? "#EDE6D8" : "#1A1A1A"} lineColor={i % 2 === 0 ? "rgba(0,0,0,0.2)" : "rgba(237,230,216,0.2)"} className="mx-auto h-64 w-auto" title={p.name} />
                  <div className="mt-8 flex items-baseline justify-between border-t border-[var(--c10-line)] pt-5">
                    <h3 className="c10-serif text-[24px]">{p.name}</h3>
                    <p className="text-[12px] tracking-[0.15em] text-[var(--c10-bronze)]">{formatHuf(p.basePriceHuf)}</p>
                  </div>
                  <p className="mt-2 text-[12px] text-[var(--c10-cream)]/50">
                    {p.colorSlugs.length} szín · {p.sizeCodes[0]}–{p.sizeCodes[p.sizeCodes.length - 1]}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* ATELIER – számok és folyamat */}
        <section className="bg-[var(--c10-bg2)]">
          <div className="mx-auto grid max-w-[1400px] gap-14 px-6 py-28 md:grid-cols-12">
            <Reveal className="md:col-span-5">
              <p className="c10-label">Atelier</p>
              <h2 className="c10-serif mt-5 text-[clamp(34px,4.5vw,64px)] leading-[1.05]">A hímzés ideje.</h2>
              <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-[var(--c10-cream)]/70">
                Minden minta digitizált öltéstervből készül. Az idő, amit a gép a szövetbe varr, a részletekben látszik.
              </p>
              <div className="relative mt-10 aspect-[4/3] overflow-hidden border border-[var(--c10-line)]">
                <TextileTexture variant="weave" color="#2A2724" className="absolute inset-0 h-full w-full opacity-80" />
                <DesignOnGarment kind="tshirt" color="#1A1A1A" lineColor="rgba(237,230,216,0.2)" designUrl={assetUrl("monogram")} position="front_chest_left" widthCm={8} heightCm={8} className="absolute inset-0 h-full w-full p-8" title="Monogram hímzés" />
              </div>
            </Reveal>
            <div className="md:col-span-6 md:col-start-7">
              <ol className="divide-y divide-[var(--c10-line)]">
                {STEPS.map((s, i) => (
                  <Reveal key={s.n} as="li" delay={i * 0.05} className="grid grid-cols-[72px_1fr] items-baseline gap-6 py-6">
                    <span className="c10-serif text-[40px] text-[var(--c10-bronze)]">{String(s.n).padStart(2, "0")}</span>
                    <div>
                      <h3 className="c10-serif text-[24px]">{s.title}</h3>
                      <p className="mt-1 text-[13px] text-[var(--c10-cream)]/60">{s.text}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* GALÉRIA – nagy, két oszlop */}
        <section className="mx-auto max-w-[1400px] px-6 py-28">
          <Reveal className="text-center">
            <p className="c10-label">Galéria</p>
            <h2 className="c10-serif mt-5 text-[clamp(34px,4.5vw,64px)] leading-[1.05]">Elkészült darabok.</h2>
          </Reveal>
          <ul className="mt-16 grid gap-6 md:grid-cols-2">
            {gallery.slice(0, 4).map((g, i) => {
              const p = productBySlug(g.productSlug);
              if (!p) return null;
              return (
                <Reveal key={g.id} as="li" delay={(i % 2) * 0.1} y={40} className="c10-card p-10">
                  <DesignOnGarment kind={p.silhouette} color={colorHex(g.colorSlug)} lineColor="rgba(0,0,0,0.2)" designUrl={assetUrl(g.designAssetSlug)} position={g.zoneKey as "front_center"} widthCm={g.widthCm} heightCm={g.heightCm} className="mx-auto h-80 w-auto" title={g.title} />
                  <div className="mt-8 flex items-baseline justify-between border-t border-[var(--c10-line)] pt-5">
                    <h3 className="c10-serif text-[26px] italic">{g.title}</h3>
                    <p className="text-[11px] tracking-[0.2em] text-[var(--c10-bronze)]">
                      {g.widthCm} × {g.heightCm} cm
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </section>

        {/* CREATOR */}
        <section className="border-y border-[var(--c10-line)] bg-[var(--c10-bg2)]">
          <div className="mx-auto max-w-[1400px] px-6 py-28 text-center">
            <Reveal>
              <p className="c10-label">{siteConfig.creatorProgram.programName}</p>
              <h2 className="c10-serif mx-auto mt-5 max-w-3xl text-[clamp(34px,4.5vw,64px)] leading-[1.05]">Alkotóknak: <em>hímzés a történetért.</em></h2>
              <p className="mx-auto mt-6 max-w-lg text-[14px] leading-relaxed text-[var(--c10-cream)]/60">{siteConfig.creatorProgram.benefit}</p>
              <Link href="/creator/" className="c10-link mt-10 inline-block text-[12px] uppercase tracking-[0.25em]">
                Jelentkezés
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 px-6 py-14 text-center">
          <p className="c10-serif text-[22px]">{siteConfig.name}</p>
          <p className="text-[11px] tracking-[0.2em] text-[var(--c10-cream)]/50">
            {siteConfig.contact.email} · {siteConfig.contact.address}
          </p>
          <p className="c10-label text-[var(--c10-cream)]/40">ÁSZF · Adatkezelés · Cookie · Szállítás · Elállás</p>
        </div>
      </footer>
      <ConceptFrame slug="10-luxury-dark" />
    </div>
  );
}
