import Link from "next/link";
import { ConceptFrame } from "@/components/concepts/ConceptFrame";
import { Reveal } from "@/components/concepts/Reveal";
import { DesignOnGarment } from "@/components/garments/DesignOnGarment";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { ShirtViewerLazy } from "@/components/three/ShirtViewerLazy";
import { TextileTexture } from "@/components/ui/TextileTexture";
import { siteConfig } from "@/config/site";
import { BENEFITS, STEPS, assetUrl, colorHex, featuredProducts, gallery, productBySlug } from "@/concepts/shared/data";
import { formatHuf } from "@/lib/utils/format";

const NAV = ["Ruhák", "Studio", "Inspiráció", "Rólunk"];

export default function PremiumMinimalPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[var(--c01-line)] bg-[color:var(--c01-bg)]/85 backdrop-blur-md">
        <div className="mx-auto grid h-14 max-w-[1400px] grid-cols-3 items-center px-6">
          <nav className="hidden gap-7 text-[13px] text-[var(--c01-muted)] md:flex" aria-label="Fő navigáció">
            {NAV.map((n) => (
              <a key={n} href="#" className="c01-link hover:text-[var(--c01-fg)]">
                {n}
              </a>
            ))}
          </nav>
          <p className="col-start-2 text-center text-[11px] font-medium uppercase tracking-[0.32em]">{siteConfig.name}</p>
          <div className="flex justify-end gap-6 text-[13px]">
            <a href="#" className="c01-link">
              Belépés
            </a>
            <a href="#" className="c01-link">
              Kosár · 0
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="mx-auto grid max-w-[1400px] grid-cols-12 items-center gap-6 px-6 pb-20 pt-16 md:min-h-[86vh] md:pt-8">
          <div className="col-span-12 md:col-span-6">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--c01-muted)]">Egyedi hímzett ruhák</p>
              <h1 className="mt-8 text-[clamp(52px,8.4vw,132px)] font-medium leading-[0.92] tracking-[-0.035em]">
                A te mintád.
                <br />
                <span className="c01-serif italic font-normal">a te ruhád.</span>
              </h1>
              <p className="mt-10 max-w-md text-[17px] leading-relaxed text-[var(--c01-muted)]">
                Válassz ruhát, töltsd fel a grafikád, helyezd el centiméter-pontosan, nézd meg 3D-ben. Mi kihímezzük.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link href="/studio/" className="rounded-full bg-[var(--c01-fg)] px-7 py-3.5 text-[14px] font-medium text-[var(--c01-bg)] transition hover:opacity-85">
                  Tervezd meg a sajátod
                </Link>
                <Link href="/shop/" className="c01-link text-[14px]">
                  Ruhák megtekintése
                </Link>
              </div>
              <p className="mt-14 text-[12px] tracking-wide text-[var(--c01-muted)]">Hímzés · 3D előnézet · Egy darabtól · 5–10 munkanap</p>
            </Reveal>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="relative aspect-[4/5] w-full md:aspect-auto md:h-[72vh]">
              <ShirtViewerLazy color="#F4F2EC" zoom={false} autoRotate autoRotateSpeed={0.6} className="h-full w-full" hint={false} lightIntensity={1.05} />
            </div>
          </div>
        </section>

        {/* STATEMENT */}
        <section className="c01-hairline mx-auto max-w-[1400px] px-6 py-24 text-center">
          <Reveal>
            <p className="c01-serif mx-auto max-w-3xl text-[clamp(30px,4.2vw,58px)] leading-[1.12] tracking-[-0.01em]">
              Nem nyomtatunk. <span className="italic">Hímzünk.</span> Cérna, fény és mélység – ami mosás után is ugyanolyan marad.
            </p>
          </Reveal>
        </section>

        {/* STEPS */}
        <section className="mx-auto max-w-[1400px] px-6 pb-28">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-5">
            {STEPS.slice(0, 5).map((s, i) => (
              <Reveal key={s.n} delay={i * 0.06} className="c01-hairline pt-5">
                <p className="c01-serif text-[28px] italic leading-none text-[var(--c01-muted)]">0{s.n}</p>
                <h2 className="mt-5 text-[15px] font-medium">{s.title}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--c01-muted)]">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="mx-auto max-w-[1400px] px-6 pb-28">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-[clamp(28px,3.4vw,44px)] font-medium tracking-[-0.02em]">Kiválasztott darabok</h2>
            <Link href="/shop/" className="c01-link text-[13px]">
              Összes ruha
            </Link>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 6).map((p, i) => (
              <Reveal key={p.slug} as="li" delay={(i % 3) * 0.08} className="c01-card">
                <Link href={`/shop/product/?slug=${p.slug}`} className="block">
                  <div className="flex aspect-[4/5] items-center justify-center bg-[var(--c01-soft)]">
                    <GarmentSilhouette kind={p.silhouette} color={colorHex(p.colorSlugs[0])} className="c01-garment h-[74%] w-auto" title={p.name} />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between">
                    <h3 className="text-[15px] font-medium">{p.name}</h3>
                    <p className="text-[13px] text-[var(--c01-muted)]">{formatHuf(p.basePriceHuf)}</p>
                  </div>
                  <div className="c01-swatches mt-3 flex gap-1.5">
                    {p.colorSlugs.slice(0, 6).map((c) => (
                      <span key={c} className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: colorHex(c) }} />
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* EMBROIDERY CLOSE-UP */}
        <section className="c01-hairline">
          <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-8 px-6 py-24">
            <div className="col-span-12 md:col-span-7">
              <Reveal className="relative aspect-[4/3] overflow-hidden bg-[var(--c01-soft)]">
                <TextileTexture variant="weave" color="#ECE8DE" className="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <DesignOnGarment kind="tshirt" color="#F4F2EC" designUrl={assetUrl("mountain-line")} position="front_chest_left" widthCm={11} heightCm={7.4} className="h-[92%] w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.08)]" />
                </div>
              </Reveal>
            </div>
            <div className="col-span-12 flex flex-col justify-center md:col-span-5 md:pl-8">
              <Reveal delay={0.1}>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--c01-muted)]">A hímzés</p>
                <h2 className="c01-serif mt-5 text-[clamp(32px,3.8vw,52px)] leading-[1.05]">Valós méretben, pontosan oda, ahová szánod.</h2>
                <dl className="mt-10 grid grid-cols-3 gap-6">
                  {[
                    ["11,0 × 7,4 cm", "hímzés mérete"],
                    ["6 400", "öltés"],
                    ["2", "cérnaszín"],
                  ].map(([v, l]) => (
                    <div key={l} className="c01-hairline pt-4">
                      <dt className="text-[20px] font-medium tracking-tight">{v}</dt>
                      <dd className="mt-1 text-[12px] text-[var(--c01-muted)]">{l}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-10 space-y-4">
                  {BENEFITS.map((b) => (
                    <li key={b.title} className="flex gap-4 text-[14px]">
                      <span className="mt-2 h-px w-6 shrink-0 bg-[var(--c01-fg)]" aria-hidden />
                      <span>
                        <strong className="font-medium">{b.title}.</strong> <span className="text-[var(--c01-muted)]">{b.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="mx-auto max-w-[1400px] px-6 py-24">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-[clamp(28px,3.4vw,44px)] font-medium tracking-[-0.02em]">Elkészült darabok</h2>
            <Link href="/inspiration/" className="c01-link text-[13px]">
              Inspiráció
            </Link>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {gallery.slice(0, 8).map((g, i) => {
              const p = productBySlug(g.productSlug);
              if (!p) return null;
              return (
                <Reveal key={g.id} as="li" delay={(i % 4) * 0.06}>
                  <div className="flex aspect-[4/5] items-center justify-center bg-[var(--c01-soft)]">
                    <DesignOnGarment kind={p.silhouette} color={colorHex(g.colorSlug)} designUrl={assetUrl(g.designAssetSlug)} position={g.zoneKey as "front_center"} widthCm={g.widthCm} heightCm={g.heightCm} className="h-[78%] w-auto" title={g.title} />
                  </div>
                  <p className="mt-4 text-[13px] font-medium">{g.title}</p>
                  <p className="mt-1 text-[12px] text-[var(--c01-muted)]">
                    {g.widthCm} × {g.heightCm} cm · {p.name}
                  </p>
                </Reveal>
              );
            })}
          </ul>
        </section>

        {/* CREATOR */}
        <section className="c01-hairline">
          <div className="mx-auto max-w-[1400px] px-6 py-28 text-center">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--c01-muted)]">{siteConfig.creatorProgram.programName}</p>
              <h2 className="c01-serif mx-auto mt-6 max-w-2xl text-[clamp(30px,4vw,56px)] leading-[1.08]">Alkotó vagy? Hímzünk neked – te pedig megmutatod.</h2>
              <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-[var(--c01-muted)]">{siteConfig.creatorProgram.benefit}</p>
              <Link href="/creator/" className="c01-link mt-10 inline-block text-[14px]">
                Jelentkezem a programba
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="c01-hairline">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 text-[12px] text-[var(--c01-muted)] md:grid-cols-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--c01-fg)]">{siteConfig.name}</p>
            <p className="mt-4 max-w-xs leading-relaxed">{siteConfig.tagline}</p>
          </div>
          <div>
            <p className="text-[var(--c01-fg)]">Vásárlás</p>
            <p className="mt-3 leading-7">Ruhák · Studio · Inspiráció · GYIK</p>
          </div>
          <div>
            <p className="text-[var(--c01-fg)]">Kapcsolat</p>
            <p className="mt-3 leading-7">
              {siteConfig.contact.email}
              <br />
              {siteConfig.contact.address}
            </p>
          </div>
          <div>
            <p className="text-[var(--c01-fg)]">Jogi</p>
            <p className="mt-3 leading-7">ÁSZF · Adatkezelés · Cookie · Szállítás · Elállás</p>
          </div>
        </div>
      </footer>
      <ConceptFrame slug="01-premium-minimal" />
    </div>
  );
}
