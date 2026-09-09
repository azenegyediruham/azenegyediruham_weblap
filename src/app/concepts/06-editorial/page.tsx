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

const LOOKS = gallery.slice(0, 4);

export default function EditorialPage() {
  return (
    <div className="min-h-screen">
      {/* MASTHEAD */}
      <header className="mx-auto max-w-[1280px] px-6 pt-8">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[var(--c06-fg)]/60">
          <p>No. 01 · Ősz 2026</p>
          <p>Budapest</p>
          <p>Egyedi hímzett ruhák</p>
        </div>
        <h1 className="c06-serif mt-3 text-center text-[clamp(40px,9vw,140px)] font-black uppercase leading-[0.9] tracking-[-0.03em]">{siteConfig.name}</h1>
        <div className="c06-rule-thick mt-4" />
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3 text-[12px] font-medium uppercase tracking-[0.18em]" aria-label="Fő navigáció">
          {["Cover story", "Lookbook", "Hogyan működik", "Darabok", "Casting", "Kolofon"].map((n) => (
            <a key={n} href="#" className="hover:text-[var(--c06-red)]">
              {n}
            </a>
          ))}
        </nav>
        <div className="c06-rule" />
      </header>

      <main className="mx-auto max-w-[1280px] px-6">
        {/* COVER STORY */}
        <section className="grid gap-10 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5 md:pt-10">
            <Reveal>
              <p className="c06-caption text-[var(--c06-red)]">Cover story</p>
              <h2 className="c06-serif mt-4 text-[clamp(38px,5vw,72px)] font-medium italic leading-[1.02]">A minta, amit te rajzoltál – és amit mi kihímeztünk.</h2>
              <p className="mt-6 text-[16px] leading-relaxed text-[var(--c06-fg)]/75">
                Nem kollekció, hanem folyamat: feltöltöd a grafikát, elhelyezed a ruhán, 3D-ben megnézed, mi pedig cérnával rakjuk rá. Egy darabtól.
              </p>
              <p className="c06-caption mt-6">Szöveg: a műhely · Fotó: 3D render</p>
              <div className="mt-8 flex gap-4">
                <Link href="/studio/" className="bg-[var(--c06-fg)] px-6 py-3 text-[13px] font-medium uppercase tracking-[0.15em] text-white hover:bg-[var(--c06-red)]">
                  Tervezés
                </Link>
                <Link href="/shop/" className="border border-[var(--c06-fg)] px-6 py-3 text-[13px] font-medium uppercase tracking-[0.15em] hover:bg-[var(--c06-paper)]">
                  Darabok
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal delay={0.1}>
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--c06-paper)]">
                  <TextileTexture variant="grain" color="#E8E4DC" className="absolute inset-0 h-full w-full opacity-70" />
                  <DesignOnGarment kind="tshirt" color="#F4F2EC" designUrl={assetUrl("sun-wave")} position="front_center" widthCm={20} heightCm={16} className="absolute inset-0 h-full w-full p-10" title="Nap és hullám hímzés" />
                </div>
                <figcaption className="c06-caption mt-3 flex justify-between">
                  <span>Classic póló · Nap és hullám · 20 × 16 cm</span>
                  <span className="c06-folio">p. 01</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* BEVEZETŐ – drop cap, két hasáb */}
        <section className="c06-rule py-14">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="c06-caption text-[var(--c06-red)]">Szerkesztői levél</p>
              <p className="c06-serif mt-3 text-[22px] italic">Miért hímzés?</p>
            </div>
            <div className="md:col-span-9">
              <div className="c06-columns text-[15px] leading-[1.75] text-[var(--c06-fg)]/80">
                <p className="c06-dropcap">
                  A nyomat felületre kerül, a hímzés a szövetbe. Ez a különbség nem csak tapintható, hanem évekkel mérhető: a cérna nem reped, nem fakul, nem pereg le. Amikor elkezdtük, egyetlen kérdést tettünk fel: mi lenne, ha bárki – tervezői tudás nélkül – valós méretben látná, hogyan fog kinézni a saját rajza egy pólón, mielőtt megrendeli?
                </p>
                <p className="mt-5">
                  Ebből lett a szerkesztő: feltöltöd a képet, a ruha zónáiban elhelyezed, a méret centiméterben jelenik meg, a 3D nézetben körbeforgatod. Ami a képernyőn van, az kerül a gépbe. Ez a szám erről szól: darabokról, folyamatról, és arról, ami a végén kikerül a műhelyből.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LOOKBOOK */}
        <section className="c06-rule py-14">
          <div className="flex items-baseline justify-between">
            <h2 className="c06-serif text-[clamp(32px,4vw,56px)] font-medium">Lookbook</h2>
            <p className="c06-folio text-[14px]">01 – 04</p>
          </div>
          <div className="mt-10 space-y-16">
            {LOOKS.map((g, i) => {
              const p = productBySlug(g.productSlug);
              if (!p) return null;
              const flip = i % 2 === 1;
              return (
                <Reveal key={g.id} as="article" className="grid items-end gap-8 md:grid-cols-12">
                  <figure className={`md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}>
                    <div className="flex aspect-[5/4] items-center justify-center bg-[var(--c06-paper)]">
                      <DesignOnGarment kind={p.silhouette} color={colorHex(g.colorSlug)} designUrl={assetUrl(g.designAssetSlug)} position={g.zoneKey as "front_center"} widthCm={g.widthCm} heightCm={g.heightCm} className="h-[86%] w-auto" title={g.title} />
                    </div>
                  </figure>
                  <div className={`md:col-span-4 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}>
                    <p className="c06-serif text-[64px] font-black leading-none text-[var(--c06-paper)]">0{i + 1}</p>
                    <h3 className="c06-serif -mt-6 text-[28px] font-medium italic">{g.title}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-[var(--c06-fg)]/70">{g.description}</p>
                    <dl className="c06-caption mt-5 grid grid-cols-2 gap-y-1">
                      <dt>Ruha</dt>
                      <dd className="text-right normal-case tracking-normal text-[var(--c06-fg)]">{p.name}</dd>
                      <dt>Méret</dt>
                      <dd className="text-right normal-case tracking-normal text-[var(--c06-fg)]">
                        {g.widthCm} × {g.heightCm} cm
                      </dd>
                      <dt>Zóna</dt>
                      <dd className="text-right normal-case tracking-normal text-[var(--c06-fg)]">{g.zoneKey.replace(/_/g, " ")}</dd>
                    </dl>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* PULL QUOTE */}
        <section className="c06-rule py-16 text-center">
          <Reveal>
            <p className="c06-serif mx-auto max-w-4xl text-[clamp(28px,4.2vw,58px)] font-medium italic leading-[1.15]">
              „A képernyőn tizenegy centiméter. A pólón tizenegy centiméter. Ennyi a titok.”
            </p>
            <p className="c06-caption mt-6">— a műhely</p>
          </Reveal>
        </section>

        {/* HOGYAN MŰKÖDIK + 3D SIDEBAR */}
        <section className="c06-rule grid gap-10 py-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="c06-serif text-[clamp(32px,4vw,56px)] font-medium">Hogyan működik</h2>
            <ol className="mt-8 divide-y divide-[var(--c06-fg)]/15">
              {STEPS.map((s) => (
                <li key={s.n} className="grid grid-cols-[48px_1fr] gap-4 py-4">
                  <span className="c06-serif text-[26px] italic text-[var(--c06-red)]">{s.n}.</span>
                  <div>
                    <h3 className="text-[16px] font-semibold">{s.title}</h3>
                    <p className="mt-1 text-[14px] text-[var(--c06-fg)]/70">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <aside className="md:col-span-5">
            <div className="border border-[var(--c06-fg)] p-4">
              <p className="c06-caption text-[var(--c06-red)]">Interaktív · forgasd meg</p>
              <div className="mt-3 aspect-[4/5]">
                <ShirtViewerLazy color="#F4F2EC" className="h-full w-full" hint={false} zoom={false} />
              </div>
              <p className="c06-caption mt-3">Classic póló · 3D előnézet</p>
            </div>
          </aside>
        </section>

        {/* DARABOK – lista */}
        <section className="c06-rule py-14">
          <div className="flex items-baseline justify-between">
            <h2 className="c06-serif text-[clamp(32px,4vw,56px)] font-medium">A számban szereplő darabok</h2>
            <Link href="/shop/" className="text-[12px] uppercase tracking-[0.18em] hover:text-[var(--c06-red)]">
              Összes →
            </Link>
          </div>
          <ul className="mt-8 divide-y divide-[var(--c06-fg)]/15 border-y border-[var(--c06-fg)]/15">
            {featuredProducts.map((p, i) => (
              <li key={p.slug}>
                <Link href={`/shop/product/?slug=${p.slug}`} className="grid grid-cols-[64px_1fr_auto] items-center gap-5 py-4 hover:bg-[var(--c06-paper)]/60 md:grid-cols-[80px_1fr_1fr_auto_auto]">
                  <GarmentSilhouette kind={p.silhouette} color={colorHex(p.colorSlugs[0])} className="h-16 w-auto" title={p.name} />
                  <div>
                    <p className="c06-serif text-[20px]">{p.name}</p>
                    <p className="c06-caption mt-1">
                      {p.colorSlugs.length} szín · {p.fitSlugs.join(", ")}
                    </p>
                  </div>
                  <p className="hidden text-[13px] text-[var(--c06-fg)]/70 md:block">{p.description.slice(0, 80)}…</p>
                  <p className="text-[14px] font-medium">{formatHuf(p.basePriceHuf)}</p>
                  <p className="c06-folio hidden text-[13px] md:block">p. {12 + i}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* CASTING */}
        <section className="c06-rule py-14">
          <Reveal className="border-[6px] border-double border-[var(--c06-fg)] p-8 text-center md:p-14">
            <p className="c06-caption text-[var(--c06-red)]">Casting · {siteConfig.creatorProgram.programName}</p>
            <h2 className="c06-serif mt-4 text-[clamp(30px,4vw,56px)] font-black uppercase leading-[1]">Alkotókat keresünk</h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--c06-fg)]/75">{siteConfig.creatorProgram.benefit}</p>
            <Link href="/creator/" className="mt-8 inline-block bg-[var(--c06-red)] px-7 py-3 text-[13px] font-medium uppercase tracking-[0.15em] text-white hover:bg-[var(--c06-fg)]">
              Jelentkezem
            </Link>
          </Reveal>
        </section>
      </main>

      <footer className="mx-auto max-w-[1280px] px-6 pb-14">
        <div className="c06-rule-thick pt-6">
          <div className="grid gap-6 text-[12px] text-[var(--c06-fg)]/70 md:grid-cols-3">
            <p>
              <span className="c06-serif text-[16px] text-[var(--c06-fg)]">Kolofon.</span> Kiadja: {siteConfig.name}. {siteConfig.contact.address}. {siteConfig.contact.email}
            </p>
            <p>Betűk: Playfair Display, Inter. Illusztráció: SVG sziluettek, 3D render.</p>
            <p className="md:text-right">ÁSZF · Adatkezelés · Cookie · Szállítás · Elállás</p>
          </div>
        </div>
      </footer>
      <ConceptFrame slug="06-editorial" />
    </div>
  );
}
