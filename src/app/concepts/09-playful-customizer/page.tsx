import Link from "next/link";
import { ConceptFrame } from "@/components/concepts/ConceptFrame";
import { Reveal } from "@/components/concepts/Reveal";
import { DesignOnGarment } from "@/components/garments/DesignOnGarment";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { MiniCustomizer } from "@/concepts/09-playful-customizer/MiniCustomizer";
import { siteConfig } from "@/config/site";
import { FAQ_SHORT, STEPS, assetUrl, colorHex, gallery, productBySlug, products } from "@/concepts/shared/data";
import { formatHuf } from "@/lib/utils/format";

const STEP_BG = ["#FFD166", "#FF6B4A", "#2BB3A3", "#8F7CFF", "#FF8FAB", "#5BC0EB", "#1F1F1F"];

export default function PlayfulCustomizerPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-[var(--c09-bg)]/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-5">
          <Link href="/" className="text-[18px] font-extrabold tracking-tight">
            {siteConfig.name}
            <span className="text-[var(--c09-coral)]">.</span>
          </Link>
          <nav className="hidden gap-7 text-[14px] font-semibold md:flex" aria-label="Fő navigáció">
            {["Ruhák", "Tervező", "Ötletek", "GYIK"].map((n) => (
              <a key={n} href="#" className="hover:text-[var(--c09-coral)]">
                {n}
              </a>
            ))}
          </nav>
          <a href="#" className="c09-pill bg-[var(--c09-ink)] text-white">
            Kosár · 0
          </a>
        </div>
      </header>

      <main>
        {/* HERO = CUSTOMIZER */}
        <section className="relative mx-auto max-w-[1360px] px-5 pb-16 pt-8 md:pt-12">
          <div className="c09-blob -left-20 top-10 h-72 w-72 bg-[var(--c09-yellow)]" aria-hidden />
          <div className="c09-blob right-0 top-40 h-80 w-80 bg-[var(--c09-teal)]" aria-hidden />
          <Reveal className="relative text-center">
            <p className="inline-block rounded-full bg-white px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--c09-coral)]">Próbáld ki most – nem kell regisztrálni</p>
            <h1 className="mt-5 text-[clamp(38px,6vw,80px)] font-extrabold leading-[1] tracking-[-0.03em]">
              Tedd rá a mintád. <span className="text-[var(--c09-coral)]">Nézd meg 3D-ben.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[17px] text-[var(--c09-ink)]/70">Válassz színt, húzd a mintát a pólóra, állítsd be a méretet centiméterben – aztán forgasd meg. Ha tetszik, kihímezzük.</p>
          </Reveal>
          <div className="relative mt-10">
            <MiniCustomizer />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/studio/" className="c09-pill bg-[var(--c09-coral)] text-white hover:opacity-90">
              Saját képet töltök fel →
            </Link>
            <Link href="/shop/" className="c09-pill border-2 border-[var(--c09-ink)]">
              Más ruhát választok
            </Link>
          </div>
        </section>

        {/* STEPS – buborékok */}
        <section className="mx-auto max-w-[1360px] px-5 py-16">
          <Reveal>
            <h2 className="text-center text-[clamp(30px,4vw,52px)] font-extrabold tracking-[-0.02em]">Hét lépés, nulla stressz.</h2>
          </Reveal>
          <ol className="mt-10 flex flex-wrap justify-center gap-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} as="li" delay={i * 0.05} className="w-[200px] rounded-[28px] p-5" style={{ backgroundColor: STEP_BG[i], color: i === 6 ? "white" : "#1F1F1F" }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[14px] font-extrabold text-[var(--c09-ink)]">{s.n}</span>
                <h3 className="mt-4 text-[17px] font-bold leading-tight">{s.title}</h3>
                <p className="mt-2 text-[13px] opacity-80">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* PRODUCTS */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1360px] px-5 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Reveal>
                <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--c09-teal)]">Ruhák</p>
                <h2 className="mt-2 text-[clamp(30px,4vw,52px)] font-extrabold tracking-[-0.02em]">Mire tegyük?</h2>
              </Reveal>
              <Link href="/shop/" className="c09-pill bg-[var(--c09-bg)]">
                Mind a 12 →
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {products.slice(0, 8).map((p, i) => (
                <Reveal key={p.slug} as="li" delay={(i % 4) * 0.05} className="c09-card border border-[var(--c09-ink)]/5 p-4">
                  <Link href={`/shop/product/?slug=${p.slug}`} className="block">
                    <div className="flex aspect-square items-center justify-center rounded-3xl bg-[var(--c09-bg)]">
                      <GarmentSilhouette kind={p.silhouette} color={colorHex(p.colorSlugs[i % p.colorSlugs.length])} className="h-[78%] w-auto" title={p.name} />
                    </div>
                    <h3 className="mt-3 text-[16px] font-bold">{p.name}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-[13px] text-[var(--c09-ink)]/60">{p.colorSlugs.length} szín</p>
                      <p className="rounded-full bg-[var(--c09-yellow)] px-2.5 py-0.5 text-[12px] font-bold">{formatHuf(p.basePriceHuf)}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* IDEAS */}
        <section className="mx-auto max-w-[1360px] px-5 py-16">
          <Reveal>
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--c09-coral)]">Ötletek</p>
            <h2 className="mt-2 text-[clamp(30px,4vw,52px)] font-extrabold tracking-[-0.02em]">Ilyeneket csináltak mások.</h2>
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.slice(0, 8).map((g, i) => {
              const p = productBySlug(g.productSlug);
              if (!p) return null;
              return (
                <Reveal key={g.id} as="li" delay={(i % 4) * 0.05} className="c09-card p-4">
                  <DesignOnGarment kind={p.silhouette} color={colorHex(g.colorSlug)} designUrl={assetUrl(g.designAssetSlug)} position={g.zoneKey as "front_center"} widthCm={g.widthCm} heightCm={g.heightCm} className="mx-auto h-44 w-auto" title={g.title} />
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[14px] font-bold">{g.title}</p>
                    <span className="text-[12px] font-bold text-[var(--c09-coral)]">♥ {g.likes}</span>
                  </div>
                  <p className="text-[12px] text-[var(--c09-ink)]/60">
                    {g.widthCm} × {g.heightCm} cm
                  </p>
                </Reveal>
              );
            })}
          </ul>
        </section>

        {/* FAQ + CREATOR */}
        <section className="mx-auto grid max-w-[1360px] gap-6 px-5 py-16 md:grid-cols-2">
          <Reveal className="rounded-[32px] bg-white p-8">
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em]">Gyors kérdések</h2>
            <dl className="mt-6 space-y-5">
              {FAQ_SHORT.map((f) => (
                <div key={f.q}>
                  <dt className="text-[15px] font-bold">{f.q}</dt>
                  <dd className="mt-1 text-[14px] text-[var(--c09-ink)]/70">{f.a}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-between rounded-[32px] bg-[var(--c09-teal)] p-8 text-white">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/80">{siteConfig.creatorProgram.programName}</p>
              <h2 className="mt-3 text-[clamp(28px,3.4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.02em]">Content creator vagy? Hímzünk neked ingyen.</h2>
              <p className="mt-4 text-[15px] text-white/85">{siteConfig.creatorProgram.benefit}</p>
            </div>
            <Link href="/creator/" className="c09-pill mt-8 w-fit bg-white text-[var(--c09-teal)]">
              Jelentkezem →
            </Link>
          </Reveal>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1360px] flex-col gap-3 px-5 py-10 text-[13px] text-[var(--c09-ink)]/60 md:flex-row md:items-center md:justify-between">
        <p className="font-bold text-[var(--c09-ink)]">{siteConfig.name}</p>
        <p>
          {siteConfig.contact.email} · {siteConfig.contact.address}
        </p>
        <p>ÁSZF · Adatkezelés · Cookie</p>
      </footer>
      <ConceptFrame slug="09-playful-customizer" />
    </div>
  );
}
