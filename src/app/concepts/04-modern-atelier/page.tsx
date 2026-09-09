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

const MATERIALS = [
  { name: "Fésült pamut", variant: "weave" as const, color: "#E8DCC5", text: "180–260 g/m², sűrű szövés. A hímzés nem húzza össze." },
  { name: "Bolyhozott belső", variant: "knit" as const, color: "#D9CDB6", text: "Pulóverekhez. Puha, meleg, stabil hímzőalap." },
  { name: "Lenvászon keverék", variant: "grain" as const, color: "#E2D6BE", text: "Nyári ruhákhoz és szoknyákhoz. Természetes textúra." },
];

export default function ModernAtelierPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[var(--c04-fg)]/10 bg-[var(--c04-bg)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-6">
          <Link href="/" className="c04-display text-[22px]">
            {siteConfig.name}
          </Link>
          <nav className="hidden gap-8 text-[13px] font-medium md:flex" aria-label="Fő navigáció">
            {["Ruhák", "A műhely", "Anyagok", "Galéria", "Kapcsolat"].map((n) => (
              <a key={n} href="#" className="hover:text-[var(--c04-terra)]">
                {n}
              </a>
            ))}
          </nav>
          <p className="text-[12px] text-[var(--c04-fg)]/60">Műhely nyitva · {siteConfig.contact.openingHours}</p>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative mx-auto max-w-[1360px] px-6 pb-20 pt-14 md:pt-20">
          <svg className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-full w-full" viewBox="0 0 1360 700" preserveAspectRatio="none" aria-hidden>
            <path className="c04-thread" d="M-20 660 C 160 600, 300 700, 480 640 S 760 560, 900 620 S 1200 700, 1400 600" />
          </svg>
          <div className="relative grid grid-cols-12 items-center gap-8">
            <div className="col-span-12 md:col-span-6">
              <Reveal>
                <p className="text-[12px] font-medium uppercase tracking-[0.25em] text-[var(--c04-terra)]">Szabóság &amp; hímzőműhely · Budapest</p>
                <h1 className="c04-display mt-6 text-[clamp(44px,6.5vw,96px)] font-light leading-[1.02]">
                  Kézzel hímzett,
                  <br />
                  <em className="font-normal">a te rajzoddal.</em>
                </h1>
                <p className="mt-8 max-w-md text-[16px] leading-relaxed text-[var(--c04-fg)]/70">
                  Egy modern műhely, ahol a ruhád a te mintáddal készül el: feltöltöd, elhelyezed centiméter-pontosan, 3D-ben megnézed – mi pedig cérnával rakjuk rá.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/studio/" className="rounded-full bg-[var(--c04-terra)] px-7 py-3.5 text-[14px] font-medium text-white hover:bg-[#9d4432]">
                    Kezdd el a tervezést
                  </Link>
                  <Link href="/shop/" className="rounded-full border border-[var(--c04-fg)]/30 px-7 py-3.5 text-[14px] font-medium hover:border-[var(--c04-fg)]">
                    Ruhák
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Reveal delay={0.1}>
                <div className="c04-arch relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden bg-[var(--c04-bg2)]">
                  <TextileTexture variant="weave" color="#E7DCC7" className="absolute inset-0 h-full w-full opacity-80" />
                  <ShirtViewerLazy color="#D8C6A5" zoom={false} className="absolute inset-0 h-full w-full" hint={false} keyLightColor="#ffe9cf" lightIntensity={1.05} />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.25em] text-[var(--c04-fg)]/50">Classic póló · Homok</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* A MŰHELY – folyamat szabásminta háttérrel */}
        <section className="relative overflow-hidden border-y border-[var(--c04-fg)]/10 bg-[var(--c04-bg2)]">
          <svg className="pointer-events-none absolute right-[-60px] top-[-40px] h-[420px] w-[520px]" viewBox="0 0 520 420" aria-hidden>
            <path className="c04-pattern" d="M60 40 C90 20 150 20 180 40 L240 60 L270 140 L230 160 L230 400 L60 400 L60 160 L20 140 L50 60 Z" />
            <path className="c04-pattern" d="M320 60 L480 60 L500 240 L300 240 Z" />
            <text x="70" y="390" fontSize="11" fill="rgba(46,42,38,0.4)" fontFamily="monospace">ELŐ · 1x</text>
            <text x="310" y="232" fontSize="11" fill="rgba(46,42,38,0.4)" fontFamily="monospace">UJJ · 2x</text>
          </svg>
          <div className="relative mx-auto max-w-[1360px] px-6 py-24">
            <Reveal>
              <p className="text-[12px] font-medium uppercase tracking-[0.25em] text-[var(--c04-terra)]">A műhely</p>
              <h2 className="c04-display mt-4 max-w-2xl text-[clamp(32px,4.5vw,60px)] font-light leading-[1.05]">Feltöltéstől a kész darabig – így dolgozunk.</h2>
            </Reveal>
            <ol className="mt-14 grid gap-8 md:grid-cols-4">
              {STEPS.filter((s) => [1, 3, 4, 7].includes(s.n)).map((s, i) => (
                <Reveal key={s.n} as="li" delay={i * 0.08} className="relative border-l-2 border-[var(--c04-terra)]/40 pl-6">
                  <span className="c04-display absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--c04-terra)] text-[12px] text-white">{i + 1}</span>
                  <h3 className="c04-display text-[22px]">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--c04-fg)]/70">{s.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ANYAGOK */}
        <section className="mx-auto max-w-[1360px] px-6 py-24">
          <Reveal>
            <p className="text-[12px] font-medium uppercase tracking-[0.25em] text-[var(--c04-terra)]">Anyagok</p>
            <h2 className="c04-display mt-4 text-[clamp(32px,4.5vw,60px)] font-light leading-[1.05]">Textil, amit érdemes közelről nézni.</h2>
          </Reveal>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {MATERIALS.map((m, i) => (
              <Reveal key={m.name} as="li" delay={i * 0.08} className="c04-card overflow-hidden rounded-3xl bg-white/50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <TextileTexture variant={m.variant} color={m.color} seed={i + 2} className="absolute inset-0 h-full w-full" />
                </div>
                <div className="p-6">
                  <h3 className="c04-display text-[22px]">{m.name}</h3>
                  <p className="mt-2 text-[14px] text-[var(--c04-fg)]/70">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* HÍMZÉS */}
        <section className="bg-[var(--c04-fg)] text-[var(--c04-bg)]">
          <div className="mx-auto grid max-w-[1360px] items-center gap-12 px-6 py-24 md:grid-cols-2">
            <Reveal className="relative">
              <div className="c04-arch relative mx-auto aspect-[4/5] max-w-[440px] overflow-hidden bg-[#3a3531]">
                <DesignOnGarment kind="tshirt" color="#F0E7D6" designUrl={assetUrl("botanical")} position="front_chest_right" widthCm={8} heightCm={11} lineColor="rgba(0,0,0,0.25)" className="absolute inset-0 h-full w-full p-8" title="Botanikus hímzés" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[12px] font-medium uppercase tracking-[0.25em] text-[var(--c04-sand)]">A hímzés</p>
              <h2 className="c04-display mt-4 text-[clamp(32px,4.5vw,60px)] font-light leading-[1.05]">
                Cérna, nem festék. <em>Évekig.</em>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--c04-bg)]/70">
                A feltöltött rajzodból digitizált hímzőprogram készül. Az öltésszámot, a cérnaszíneket és a fizikai méretet mi ellenőrizzük, mielőtt a gép elindul.
              </p>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[var(--c04-bg)]/20 pt-6">
                {[
                  ["8 × 11 cm", "méret"],
                  ["3", "cérnaszín"],
                  ["≈ 9 200", "öltés"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="c04-display text-[26px]">{v}</dt>
                    <dd className="text-[12px] text-[var(--c04-bg)]/60">{l}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="mx-auto max-w-[1360px] px-6 py-24">
          <div className="flex items-end justify-between">
            <Reveal>
              <p className="text-[12px] font-medium uppercase tracking-[0.25em] text-[var(--c04-terra)]">Ruhák</p>
              <h2 className="c04-display mt-4 text-[clamp(32px,4.5vw,60px)] font-light leading-[1.05]">Amire hímzünk.</h2>
            </Reveal>
            <Link href="/shop/" className="text-[13px] font-medium underline-offset-4 hover:underline">
              Összes ruha
            </Link>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 6).map((p, i) => (
              <Reveal key={p.slug} as="li" delay={(i % 3) * 0.08} className="c04-card rounded-3xl bg-white/60 p-5">
                <Link href={`/shop/product/?slug=${p.slug}`} className="block">
                  <div className="c04-arch flex aspect-[4/5] items-center justify-center bg-[var(--c04-bg2)]">
                    <GarmentSilhouette kind={p.silhouette} color={colorHex(p.colorSlugs[0])} className="h-[72%] w-auto" title={p.name} />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between">
                    <h3 className="c04-display text-[22px]">{p.name}</h3>
                    <p className="text-[13px] text-[var(--c04-fg)]/70">{formatHuf(p.basePriceHuf)}-tól</p>
                  </div>
                  <p className="mt-1 text-[13px] text-[var(--c04-fg)]/60">
                    {p.colorSlugs.length} szín · {p.sizeCodes[0]}–{p.sizeCodes[p.sizeCodes.length - 1]}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* GALLERY */}
        <section className="border-t border-[var(--c04-fg)]/10 bg-[var(--c04-bg2)]">
          <div className="mx-auto max-w-[1360px] px-6 py-24">
            <Reveal>
              <p className="text-[12px] font-medium uppercase tracking-[0.25em] text-[var(--c04-terra)]">Galéria</p>
              <h2 className="c04-display mt-4 text-[clamp(32px,4.5vw,60px)] font-light leading-[1.05]">A műhelyből kikerült darabok.</h2>
            </Reveal>
            <ul className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              {gallery.slice(0, 8).map((g, i) => {
                const p = productBySlug(g.productSlug);
                if (!p) return null;
                return (
                  <Reveal key={g.id} as="li" delay={(i % 4) * 0.06}>
                    <div className="c04-arch flex aspect-[4/5] items-center justify-center bg-white/60 p-4">
                      <DesignOnGarment kind={p.silhouette} color={colorHex(g.colorSlug)} designUrl={assetUrl(g.designAssetSlug)} position={g.zoneKey as "front_center"} widthCm={g.widthCm} heightCm={g.heightCm} className="h-full w-auto" title={g.title} />
                    </div>
                    <p className="c04-display mt-4 text-[18px]">{g.title}</p>
                    <p className="text-[12px] text-[var(--c04-fg)]/60">
                      {g.widthCm} × {g.heightCm} cm · {p.name}
                    </p>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        {/* CREATOR */}
        <section className="mx-auto max-w-[1360px] px-6 py-24">
          <Reveal className="grid items-center gap-10 rounded-[40px] bg-[var(--c04-terra)] px-8 py-14 text-white md:grid-cols-2 md:px-14">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.25em] text-white/70">{siteConfig.creatorProgram.programName}</p>
              <h2 className="c04-display mt-4 text-[clamp(30px,4vw,56px)] font-light leading-[1.05]">Alkotóknak, akik szívesen mutatják meg.</h2>
            </div>
            <div>
              <p className="text-[15px] leading-relaxed text-white/85">{siteConfig.creatorProgram.benefit}</p>
              <Link href="/creator/" className="mt-8 inline-block rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-[var(--c04-terra)] hover:bg-[var(--c04-bg)]">
                Jelentkezem
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-[var(--c04-fg)]/10">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-4 px-6 py-10 text-[13px] text-[var(--c04-fg)]/60 md:flex-row md:items-center md:justify-between">
          <p className="c04-display text-[18px] text-[var(--c04-fg)]">{siteConfig.name}</p>
          <p>
            {siteConfig.contact.email} · {siteConfig.contact.address}
          </p>
          <p>ÁSZF · Adatkezelés · Cookie · Szállítás</p>
        </div>
      </footer>
      <ConceptFrame slug="04-modern-atelier" />
    </div>
  );
}
