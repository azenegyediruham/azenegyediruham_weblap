import Link from "next/link";
import { ConceptFrame } from "@/components/concepts/ConceptFrame";
import { Reveal } from "@/components/concepts/Reveal";
import { DesignOnGarment } from "@/components/garments/DesignOnGarment";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { ShirtViewerLazy } from "@/components/three/ShirtViewerLazy";
import { TextileTexture } from "@/components/ui/TextileTexture";
import { siteConfig } from "@/config/site";
import { STEPS, assetUrl, colorHex, gallery, productBySlug, products } from "@/concepts/shared/data";
import { formatHuf } from "@/lib/utils/format";

const TICKER = ["Saját minta", "3D preview", "Hímzés, nem nyomat", "Nincs minimum", "Budapest", "5–10 munkanap", "PNG · JPG · SVG"];

export default function StreetwearLabPage() {
  const tickerItems = [...TICKER, ...TICKER];
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="border-b-2 border-white">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="c02-display bg-[var(--c02-acid)] px-2.5 py-1.5 text-[18px] text-[var(--c02-bg)]">LAB</span>
            <span className="hidden text-[12px] font-bold uppercase tracking-[0.2em] sm:block">{siteConfig.name}</span>
          </Link>
          <nav className="hidden gap-8 text-[12px] font-bold uppercase tracking-[0.18em] md:flex" aria-label="Fő navigáció">
            {["Drop", "Ruhák", "Studio", "Lab results", "Creators"].map((n) => (
              <a key={n} href="#" className="hover:text-[var(--c02-acid)]">
                {n}
              </a>
            ))}
          </nav>
          <a href="#" className="c02-sticker">
            Kosár [0]
          </a>
        </div>
        <div className="overflow-hidden border-t-2 border-white bg-[var(--c02-acid)] text-[var(--c02-bg)]" aria-hidden>
          <div className="c02-ticker py-2 text-[12px] font-bold uppercase tracking-[0.2em]">
            {tickerItems.map((t, i) => (
              <span key={i} className="px-6">
                {t} <span className="px-4">✦</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-12 md:pt-20">
          <div className="grid grid-cols-12 gap-4">
            <div className="relative col-span-12 md:col-span-7">
              <Reveal>
                <p className="c02-sticker mb-8 border-[var(--c02-acid)] text-[var(--c02-acid)]">Kreatív ruhalabor · Nyitva</p>
                <h1 className="c02-display text-[clamp(56px,11vw,168px)]">
                  Te
                  <br />
                  tervezed.
                  <br />
                  <span className="c02-outline">Mi</span> <span className="bg-[var(--c02-acid)] px-3 text-[var(--c02-bg)]">hímezzük.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-10 max-w-md text-[16px] leading-relaxed text-[var(--c02-grey)]">
                  Töltsd fel a mintád, dobd rá a pólóra, forgasd meg 3D-ben. Ha tetszik, mi cérnával rakjuk rá. Egy darabtól.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/studio/" className="c02-display bg-white px-6 py-4 text-[16px] text-[var(--c02-bg)] hover:bg-[var(--c02-acid)]">
                    Nyisd meg a labort →
                  </Link>
                  <Link href="/shop/" className="c02-sticker self-center">
                    Ruhák
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="relative col-span-12 mt-10 md:col-span-5 md:mt-0">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] rotate-[-3deg] bg-white shadow-[10px_10px_0_var(--c02-acid)]">
                <span className="c02-tape left-[-24px] top-[18px] rotate-[-30deg]" aria-hidden />
                <span className="c02-tape right-[-24px] bottom-[26px] rotate-[24deg]" aria-hidden />
                <ShirtViewerLazy color="#161616" zoom={false} className="h-full w-full text-[var(--c02-bg)]" hint={false} lightIntensity={1.1} />
                <p className="absolute bottom-3 left-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--c02-bg)]/70">Sample 001 · Oversize · Fekete</p>
              </div>
              <div className="c02-badge-spin absolute -left-6 -top-8 hidden h-28 w-28 md:block" aria-hidden>
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <defs>
                    <path id="c02-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                  </defs>
                  <circle cx="50" cy="50" r="48" fill="var(--c02-acid)" />
                  <text fontSize="11" fontWeight="700" fill="#0f0f0f" letterSpacing="2">
                    <textPath href="#c02-circle">LAB-01 · EST. 2026 · LAB-01 · EST. 2026 ·</textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID */}
        <section className="mx-auto max-w-[1440px] px-5 pb-20">
          <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-2 gap-3 md:grid-cols-4">
            {STEPS.slice(0, 3).map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05} className="c02-card col-span-1 border-2 border-white bg-[var(--c02-panel)] p-5">
                <p className="c02-display text-[44px] text-[var(--c02-acid)]">0{s.n}</p>
                <h2 className="mt-4 text-[15px] font-bold uppercase tracking-wide">{s.title}</h2>
                <p className="mt-2 text-[13px] leading-relaxed opacity-70">{s.text}</p>
              </Reveal>
            ))}
            <Reveal delay={0.15} className="col-span-1 row-span-2 border-2 border-white bg-[var(--c02-panel)] p-5">
              <p className="c02-sticker">Drag & drop</p>
              <div className="relative mt-6 aspect-[3/4]">
                <GarmentSilhouette kind="tshirt" color="#F4F2EC" className="h-full w-full" />
                <div className="absolute left-1/2 top-[44%] h-[34%] w-[52%] -translate-x-1/2 border-2 border-dashed border-[var(--c02-acid)]" aria-hidden />
                <div className="absolute left-[52%] top-[30%] w-[38%] rotate-[8deg] border-2 border-[var(--c02-acid)] bg-white/95 p-2 shadow-[4px_4px_0_var(--c02-acid)]" aria-hidden>
                  <DesignOnGarment kind="tshirt" color="transparent" lineColor="transparent" designUrl={assetUrl("lightning-badge")} widthCm={30} heightCm={30} stitched={false} className="h-auto w-full" />
                </div>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed opacity-70">A minta csak a jelölt zónába tehető. A méretet cm-ben látod.</p>
            </Reveal>
            <Reveal delay={0.2} className="relative col-span-2 overflow-hidden border-2 border-white md:col-span-2">
              <TextileTexture variant="knit" color="#2a2a2a" className="absolute inset-0 h-full w-full" />
              <div className="relative flex h-full flex-col justify-between p-5">
                <p className="c02-sticker w-fit">Anyag</p>
                <p className="c02-display text-[clamp(28px,4vw,52px)]">
                  240 g/m² <span className="c02-outline">pamut</span>
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.25} className="c02-card col-span-1 flex flex-col justify-between border-2 border-white bg-[var(--c02-acid)] p-5 text-[var(--c02-bg)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em]">3D</p>
              <p className="c02-display text-[28px]">Forgasd meg rendelés előtt</p>
            </Reveal>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="border-y-2 border-white">
          <div className="mx-auto max-w-[1440px] px-5 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="c02-display text-[clamp(40px,6vw,88px)]">
                A <span className="c02-outline">drop</span>
              </h2>
              <Link href="/shop/" className="c02-sticker">
                Mind a 12 darab
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {products.slice(0, 8).map((p, i) => (
                <Reveal key={p.slug} as="li" delay={(i % 4) * 0.05} className="c02-card border-2 border-white bg-[var(--c02-panel)] p-4">
                  <Link href={`/shop/product/?slug=${p.slug}`} className="block">
                    <div className="relative">
                      <GarmentSilhouette kind={p.silhouette} color={colorHex(p.colorSlugs[Math.min(1, p.colorSlugs.length - 1)])} className="h-auto w-full" title={p.name} />
                      <span className="absolute right-0 top-2 rotate-[6deg] bg-white px-2 py-1 text-[11px] font-bold text-[var(--c02-bg)]">{formatHuf(p.basePriceHuf)}</span>
                    </div>
                    <h3 className="c02-display mt-3 text-[15px]">{p.name}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.15em] opacity-70">
                      {p.fitSlugs.join(" / ")} · {p.colorSlugs.length} szín
                    </p>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* LAB RESULTS */}
        <section className="mx-auto max-w-[1440px] px-5 py-16">
          <h2 className="c02-display text-[clamp(40px,6vw,88px)]">Lab results</h2>
          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.slice(0, 6).map((g, i) => {
              const p = productBySlug(g.productSlug);
              if (!p) return null;
              return (
                <Reveal key={g.id} as="li" delay={(i % 3) * 0.06} className="relative border-2 border-white bg-white p-6 text-[var(--c02-bg)]">
                  <span className="c02-display absolute left-4 top-4 bg-[var(--c02-bg)] px-2 py-1 text-[12px] text-white">#{String(i + 1).padStart(3, "0")}</span>
                  <DesignOnGarment kind={p.silhouette} color={colorHex(g.colorSlug)} designUrl={assetUrl(g.designAssetSlug)} position={g.zoneKey as "front_center"} widthCm={g.widthCm} heightCm={g.heightCm} className="mx-auto h-56 w-auto" title={g.title} />
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="c02-display text-[16px]">{g.title}</p>
                      <p className="text-[12px] opacity-70">
                        {g.widthCm} × {g.heightCm} cm · {p.name}
                      </p>
                    </div>
                    <span className="c02-sticker">♥ {g.likes}</span>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </section>

        {/* CREATOR */}
        <section className="bg-[var(--c02-acid)] text-[var(--c02-bg)]">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-20 md:grid-cols-2">
            <Reveal>
              <h2 className="c02-display text-[clamp(44px,7vw,110px)]">
                Creator?
                <br />
                <span className="c02-outline" style={{ WebkitTextStroke: "2px #0f0f0f" }}>
                  Stitch
                </span>{" "}
                & Share.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col justify-end">
              <p className="max-w-md text-[16px] leading-relaxed">{siteConfig.creatorProgram.benefit} Instagram, TikTok vagy YouTube – küldd el a profilod, és beszéljünk.</p>
              <Link href="/creator/" className="c02-display mt-8 w-fit bg-[var(--c02-bg)] px-6 py-4 text-[16px] text-white hover:bg-white hover:text-[var(--c02-bg)]">
                Jelentkezem →
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-[1440px] px-5 py-14">
        <p className="c02-display c02-outline text-[clamp(32px,8vw,120px)]">{siteConfig.name}</p>
        <div className="mt-8 flex flex-wrap justify-between gap-6 text-[12px] uppercase tracking-[0.15em] text-[var(--c02-grey)]">
          <p>
            {siteConfig.contact.email} · {siteConfig.contact.address}
          </p>
          <p>ÁSZF · Adatkezelés · Cookie · Szállítás</p>
        </div>
      </footer>
      <ConceptFrame slug="02-streetwear-lab" />
    </div>
  );
}
