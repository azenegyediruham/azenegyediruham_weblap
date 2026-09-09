import Link from "next/link";
import { ConceptFrame } from "@/components/concepts/ConceptFrame";
import { Reveal } from "@/components/concepts/Reveal";
import { DesignOnGarment } from "@/components/garments/DesignOnGarment";
import { ShirtViewerLazy } from "@/components/three/ShirtViewerLazy";
import { ColorSections, type BlockSpec } from "@/concepts/07-color-block/ColorSections";
import { siteConfig } from "@/config/site";
import { STEPS, assetUrl, categories, colorHex, gallery, productBySlug, products } from "@/concepts/shared/data";

const PALETTE: Record<string, { bg: string; fg: string; garment: string }> = {
  polo: { bg: "#F2C230", fg: "#111111", garment: "#FFF8E7" },
  pulover: { bg: "#E04E39", fg: "#FFF8E7", garment: "#161616" },
  triko: { bg: "#2F6BFF", fg: "#FFF8E7", garment: "#F4F2EC" },
  rovidnadrag: { bg: "#1FA971", fg: "#FFF8E7", garment: "#D8C6A5" },
  hosszunadrag: { bg: "#7B4BFF", fg: "#FFF8E7", garment: "#161616" },
  ruha: { bg: "#FF6FA5", fg: "#111111", garment: "#F0E7D6" },
  szoknya: { bg: "#FF8A2B", fg: "#111111", garment: "#6B1F2B" },
};

const STEP_COLORS = ["#F2C230", "#E04E39", "#2F6BFF", "#1FA971", "#7B4BFF", "#FF6FA5", "#FF8A2B"];

export default function ColorBlockPage() {
  const blocks: BlockSpec[] = categories.map((c) => ({
    category: c,
    bg: PALETTE[c.slug]?.bg ?? "#F2C230",
    fg: PALETTE[c.slug]?.fg ?? "#111111",
    garmentColor: PALETTE[c.slug]?.garment ?? "#FFFFFF",
    products: products.filter((p) => p.categorySlug === c.slug),
  }));

  const intro = (
    <>
      <header className="sticky top-0 z-40 mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5">
        <Link href="/" className="c07-display text-[16px]">
          {siteConfig.shortName}·
        </Link>
        <nav className="hidden gap-6 text-[13px] font-semibold uppercase tracking-[0.12em] md:flex" aria-label="Fő navigáció">
          {["Ruhák", "Studio", "Galéria", "Creator"].map((n) => (
            <a key={n} href="#" className="hover:underline underline-offset-4">
              {n}
            </a>
          ))}
        </nav>
        <a href="#" className="c07-chip">
          Kosár 0
        </a>
      </header>

      <section className="mx-auto grid max-w-[1400px] items-center gap-8 px-5 pb-16 pt-10 md:grid-cols-12 md:pb-24">
        <div className="md:col-span-7">
          <Reveal>
            <h1 className="c07-display text-[clamp(56px,12vw,200px)] leading-[0.86]">
              Szín.
              <br />
              Minta.
              <br />
              Te.
            </h1>
            <p className="mt-8 max-w-md text-[18px] leading-relaxed">Hét kategória, hét szín. Válassz ruhát, tedd rá a saját mintád, nézd meg 3D-ben. Görgess – a háttér veled vált.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/studio/" className="c07-btn bg-[var(--c07-ink)] text-[#FFF8E7]">
                Tervezz most →
              </Link>
              <Link href="/shop/" className="c07-btn border-2 border-[var(--c07-ink)]">
                Ruhák
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="md:col-span-5">
          <div className="aspect-[4/5] w-full">
            <ShirtViewerLazy color="#FFF8E7" className="h-full w-full" hint={false} zoom={false} lightIntensity={1.1} />
          </div>
        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      <main>
        <ColorSections blocks={blocks} intro={intro} />

        {/* STEPS – színsávok */}
        <section className="bg-[var(--c07-ink)] text-[#FFF8E7]">
          <div className="mx-auto max-w-[1400px] px-5 py-20">
            <Reveal>
              <h2 className="c07-display text-[clamp(40px,7vw,110px)] leading-[0.9]">Hét lépés.</h2>
            </Reveal>
            <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} as="li" delay={i * 0.04} className="c07-step" style={{ backgroundColor: STEP_COLORS[i], color: [1, 2, 3, 4].includes(i) ? "#FFF8E7" : "#111111" }}>
                  <p className="c07-display text-[40px]">0{s.n}</p>
                  <div>
                    <h3 className="c07-display text-[18px]">{s.title}</h3>
                    <p className="mt-2 text-[13px] opacity-85">{s.text}</p>
                  </div>
                </Reveal>
              ))}
              <li className="c07-step border-2 border-[#FFF8E7]/30">
                <p className="c07-display text-[40px]">→</p>
                <Link href="/studio/" className="c07-display text-[18px] underline underline-offset-4">
                  Kezdd el
                </Link>
              </li>
            </ol>
          </div>
        </section>

        {/* GALLERY */}
        <section className="bg-[#FFF8E7]">
          <div className="mx-auto max-w-[1400px] px-5 py-20">
            <div className="flex items-end justify-between">
              <Reveal>
                <h2 className="c07-display text-[clamp(40px,7vw,110px)] leading-[0.9]">Mások mintái.</h2>
              </Reveal>
              <Link href="/inspiration/" className="c07-chip">
                Inspiráció
              </Link>
            </div>
            <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {gallery.slice(0, 8).map((g, i) => {
                const p = productBySlug(g.productSlug);
                if (!p) return null;
                return (
                  <Reveal key={g.id} as="li" delay={(i % 4) * 0.05} className="rounded-3xl p-5" style={{ backgroundColor: STEP_COLORS[i % STEP_COLORS.length] }}>
                    <DesignOnGarment kind={p.silhouette} color={colorHex(g.colorSlug)} designUrl={assetUrl(g.designAssetSlug)} position={g.zoneKey as "front_center"} widthCm={g.widthCm} heightCm={g.heightCm} className="mx-auto h-48 w-auto" title={g.title} />
                    <p className="c07-display mt-3 text-[15px]" style={{ color: [1, 2, 3, 4].includes(i % 7) ? "#FFF8E7" : "#111111" }}>
                      {g.title}
                    </p>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        {/* CREATOR */}
        <section className="bg-[#2F6BFF] text-[#FFF8E7]">
          <div className="mx-auto max-w-[1400px] px-5 py-24">
            <Reveal>
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em]">{siteConfig.creatorProgram.programName}</p>
              <h2 className="c07-display mt-4 max-w-4xl text-[clamp(36px,6vw,96px)] leading-[0.92]">Alkotó vagy? Hímzünk – te posztolsz.</h2>
              <p className="mt-6 max-w-lg text-[16px]">{siteConfig.creatorProgram.benefit}</p>
              <Link href="/creator/" className="c07-btn mt-8 inline-block bg-[#FFF8E7] text-[#111111]">
                Jelentkezem →
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--c07-ink)] text-[#FFF8E7]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-10 text-[13px] md:flex-row md:items-center md:justify-between">
          <p className="c07-display">{siteConfig.name}</p>
          <p className="opacity-70">
            {siteConfig.contact.email} · {siteConfig.contact.address}
          </p>
          <p className="opacity-70">ÁSZF · Adatkezelés · Cookie</p>
        </div>
      </footer>
      <ConceptFrame slug="07-color-block" />
    </div>
  );
}
