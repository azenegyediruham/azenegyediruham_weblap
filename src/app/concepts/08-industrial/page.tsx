import Link from "next/link";
import { ConceptFrame } from "@/components/concepts/ConceptFrame";
import { Reveal } from "@/components/concepts/Reveal";
import { DesignOnGarment } from "@/components/garments/DesignOnGarment";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { ShirtViewerLazy } from "@/components/three/ShirtViewerLazy";
import { ZoneSchematic } from "@/concepts/08-industrial/ZoneSchematic";
import { siteConfig } from "@/config/site";
import { assetUrl, colorHex, gallery, productBySlug, products } from "@/concepts/shared/data";
import { garmentModels, tshirtZones } from "@/data/mock-catalog";
import { formatHuf } from "@/lib/utils/format";

const PROCESS = [
  { code: "IN", name: "Fájl beérkezik", detail: "PNG / JPG / WebP / SVG", time: "0 nap" },
  { code: "CHK", name: "Ellenőrzés", detail: "felbontás, méret, zónák", time: "1 nap" },
  { code: "DIG", name: "Digitizálás", detail: "öltésterv, cérnaszínek", time: "1–2 nap" },
  { code: "HOOP", name: "Befogás", detail: "zóna szerinti keret", time: "–" },
  { code: "STCH", name: "Hímzés", detail: "gépi, ~800 öltés/perc", time: "1 nap" },
  { code: "QC", name: "Minőségellenőrzés", detail: "méret, szálvég, mosáspróba", time: "1 nap" },
  { code: "PACK", name: "Csomagolás", detail: "feladás, követés", time: "1 nap" },
];

const SPEC = [
  ["Anyag", "100% fésült pamut"],
  ["Súly", "180 g/m²"],
  ["Varrás", "dupla tűzött szegély"],
  ["Méret", "XS – XXL"],
  ["Zónák", "7 (elöl 3, hátul 2, ujj 2)"],
  ["3D modell", "tshirt.glb · UV cm-kalibrált"],
];

export default function IndustrialPage() {
  const tshirt = garmentModels[0];
  const front = tshirt.views.find((v) => v.key === "front")!;
  const back = tshirt.views.find((v) => v.key === "back")!;
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--c08-ink)] bg-[var(--c08-bg)]">
        <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between px-5">
          <p className="c08-mono text-[12px] font-semibold uppercase tracking-[0.2em]">
            {siteConfig.shortName} / Production unit 01 / Budapest
          </p>
          <nav className="c08-label hidden gap-6 md:flex" aria-label="Fő navigáció">
            {["Spec", "Process", "Catalog", "Samples", "Open call"].map((n) => (
              <a key={n} href="#" className="hover:text-[var(--c08-orange)]">
                {n}
              </a>
            ))}
          </nav>
          <span className="c08-tag">Kosár 00</span>
        </div>
        <div className="c08-label mx-auto flex max-w-[1440px] flex-wrap gap-x-8 gap-y-1 border-t border-[var(--c08-line)] px-5 py-2 text-[var(--c08-ink)]/60">
          <span>Lot 0042</span>
          <span>Rev A</span>
          <span>2026-09-09</span>
          <span>Unit: cm</span>
          <span className="text-[var(--c08-orange)]">Status: accepting orders</span>
        </div>
      </header>

      <main>
        {/* HERO + SPEC SHEET */}
        <section className="mx-auto grid max-w-[1440px] gap-6 px-5 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <Reveal>
              <p className="c08-label text-[var(--c08-orange)]">Egyedi hímzés · gyártói szemlélet</p>
              <h1 className="mt-5 text-[clamp(40px,6vw,88px)] font-semibold leading-[0.98] tracking-[-0.03em]">
                Gyártóműhely
                <br />a saját mintádnak.
              </h1>
              <p className="c08-mono mt-8 max-w-lg text-[14px] leading-relaxed text-[var(--c08-ink)]/70">
                Feltöltöd → ellenőrizzük → digitizáljuk → hímezzük. Minden lépés mérhető, minden méret centiméterben, minden zóna dokumentált.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/studio/" className="bg-[var(--c08-ink)] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--c08-bg)] hover:bg-[var(--c08-orange)]">
                  Új megrendelés →
                </Link>
                <Link href="/shop/" className="c08-box px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] hover:bg-[var(--c08-ink)] hover:text-[var(--c08-bg)]">
                  Katalógus
                </Link>
              </div>
            </Reveal>
            {/* vonalzó */}
            <svg viewBox="0 0 1100 40" className="mt-12 w-full" aria-hidden>
              {Array.from({ length: 109 }).map((_, i) => {
                const x = 10 + i * 10;
                const major = i % 10 === 0;
                return (
                  <g key={i}>
                    <line x1={x} y1="0" x2={x} y2={major ? 18 : i % 5 === 0 ? 12 : 7} stroke="#1a1a1a" strokeWidth="1" />
                    {major ? (
                      <text x={x} y="34" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="#1a1a1a">
                        {i}
                      </text>
                    ) : null}
                  </g>
                );
              })}
              <text x="1096" y="34" fontSize="10" fontFamily="monospace" textAnchor="end" fill="#ff5a1f">
                cm · torzó kerület
              </text>
            </svg>
          </div>
          <div className="md:col-span-5">
            <Reveal delay={0.1} className="c08-box c08-corner p-5">
              <div className="flex items-center justify-between">
                <p className="c08-label">Spec sheet · Classic póló</p>
                <span className="c08-tag text-[var(--c08-orange)]">SKU CLASSICPOLO-*</span>
              </div>
              <div className="mt-4 flex aspect-[4/3] items-center justify-center border border-[var(--c08-line)]">
                <ShirtViewerLazy color="#F4F2EC" className="h-full w-full" hint={false} zoom={false} />
              </div>
              <dl className="c08-mono mt-4 divide-y divide-[var(--c08-line)] text-[12px]">
                {SPEC.map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2">
                    <dt className="text-[var(--c08-ink)]/60">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* PROCESS SCHEMATIC */}
        <section className="border-y border-[var(--c08-ink)] bg-[var(--c08-bg)]">
          <div className="mx-auto max-w-[1440px] px-5 py-16">
            <div className="flex items-end justify-between">
              <Reveal>
                <p className="c08-label text-[var(--c08-orange)]">Process</p>
                <h2 className="mt-3 text-[clamp(28px,3.6vw,48px)] font-semibold tracking-[-0.02em]">A gyártási folyamat.</h2>
              </Reveal>
              <p className="c08-mono hidden text-[12px] text-[var(--c08-ink)]/60 md:block">Átfutás: 5–10 munkanap</p>
            </div>
            <ol className="mt-10 grid gap-3 md:grid-cols-7">
              {PROCESS.map((s, i) => (
                <Reveal key={s.code} as="li" delay={i * 0.04} className="c08-box relative p-4">
                  {i < PROCESS.length - 1 ? <span className="absolute -right-3 top-1/2 hidden h-px w-3 bg-[var(--c08-ink)] md:block" aria-hidden /> : null}
                  <p className="c08-mono text-[20px] font-semibold text-[var(--c08-orange)]">{s.code}</p>
                  <h3 className="mt-3 text-[14px] font-semibold">{s.name}</h3>
                  <p className="c08-mono mt-1 text-[11px] text-[var(--c08-ink)]/60">{s.detail}</p>
                  <p className="c08-label mt-4 text-[var(--c08-ink)]/50">t = {s.time}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ZÓNA MŰSZAKI RAJZ */}
        <section className="mx-auto max-w-[1440px] px-5 py-16">
          <Reveal>
            <p className="c08-label text-[var(--c08-orange)]">Tolerances</p>
            <h2 className="mt-3 text-[clamp(28px,3.6vw,48px)] font-semibold tracking-[-0.02em]">Hímzési zónák – méretarányos rajz.</h2>
            <p className="c08-mono mt-3 max-w-xl text-[13px] text-[var(--c08-ink)]/70">Az ábra közvetlenül az adatmodellből készül: a chart kivágása és a zónák cm-koordinátái ugyanazok, amiket a szerkesztő és a 3D textúra használ.</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-12">
            <Reveal className="c08-box c08-corner p-5 md:col-span-4">
              <p className="c08-label">Elöl · {front.crop.w} × {front.crop.h} cm</p>
              <ZoneSchematic view={front} zones={tshirtZones} className="mt-3 w-full" />
            </Reveal>
            <Reveal delay={0.05} className="c08-box c08-corner p-5 md:col-span-4">
              <p className="c08-label">Hátul · {back.crop.w} × {back.crop.h} cm</p>
              <ZoneSchematic view={back} zones={tshirtZones} className="mt-3 w-full" />
            </Reveal>
            <Reveal delay={0.1} className="c08-box p-5 md:col-span-4">
              <p className="c08-label">Zónatábla</p>
              <table className="c08-mono mt-3 w-full text-[11px]">
                <thead>
                  <tr className="border-b border-[var(--c08-ink)] text-left">
                    <th className="py-2 font-medium">key</th>
                    <th className="py-2 font-medium">min w</th>
                    <th className="py-2 font-medium">max w</th>
                    <th className="py-2 font-medium">max h</th>
                  </tr>
                </thead>
                <tbody>
                  {tshirtZones.map((z) => (
                    <tr key={z.key} className="c08-row border-b border-[var(--c08-line)]">
                      <td className="py-2 pr-2">{z.key}</td>
                      <td className="py-2">{z.minWidthCm}</td>
                      <td className="py-2">{z.maxWidthCm}</td>
                      <td className="py-2">{z.maxHeightCm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="c08-label mt-4 text-[var(--c08-ink)]/50">Egység: cm · forrás: customization_zones</p>
            </Reveal>
          </div>
        </section>

        {/* CATALOG TABLE */}
        <section className="border-t border-[var(--c08-ink)]">
          <div className="mx-auto max-w-[1440px] px-5 py-16">
            <div className="flex items-end justify-between">
              <Reveal>
                <p className="c08-label text-[var(--c08-orange)]">Catalog</p>
                <h2 className="mt-3 text-[clamp(28px,3.6vw,48px)] font-semibold tracking-[-0.02em]">Alapanyag-lista.</h2>
              </Reveal>
              <Link href="/shop/" className="c08-tag hover:bg-[var(--c08-ink)] hover:text-[var(--c08-bg)]">
                Összes tétel
              </Link>
            </div>
            <div className="c08-box mt-8 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-[13px]">
                <thead className="c08-label border-b border-[var(--c08-ink)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Preview</th>
                    <th className="px-4 py-3 font-medium">Megnevezés</th>
                    <th className="px-4 py-3 font-medium">Kategória</th>
                    <th className="px-4 py-3 font-medium">Fazon</th>
                    <th className="px-4 py-3 font-medium">Méretek</th>
                    <th className="px-4 py-3 font-medium">Színek</th>
                    <th className="px-4 py-3 text-right font-medium">Ár</th>
                  </tr>
                </thead>
                <tbody className="c08-mono">
                  {products.map((p, i) => (
                    <tr key={p.slug} className="c08-row border-b border-[var(--c08-line)]">
                      <td className="px-4 py-2 text-[var(--c08-ink)]/50">{String(i + 1).padStart(2, "0")}</td>
                      <td className="px-4 py-2">
                        <GarmentSilhouette kind={p.silhouette} color={colorHex(p.colorSlugs[0])} className="h-10 w-auto" title={p.name} />
                      </td>
                      <td className="px-4 py-2 font-sans font-semibold">
                        <Link href={`/shop/product/?slug=${p.slug}`} className="hover:text-[var(--c08-orange)]">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2">{p.categorySlug}</td>
                      <td className="px-4 py-2">{p.fitSlugs.join("/")}</td>
                      <td className="px-4 py-2">
                        {p.sizeCodes[0]}–{p.sizeCodes[p.sizeCodes.length - 1]}
                      </td>
                      <td className="px-4 py-2">
                        <span className="flex gap-1">
                          {p.colorSlugs.slice(0, 6).map((c) => (
                            <span key={c} className="h-3 w-3 border border-[var(--c08-line)]" style={{ backgroundColor: colorHex(c) }} />
                          ))}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">{formatHuf(p.basePriceHuf)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SAMPLES */}
        <section className="mx-auto max-w-[1440px] px-5 py-16">
          <Reveal>
            <p className="c08-label text-[var(--c08-orange)]">Samples</p>
            <h2 className="mt-3 text-[clamp(28px,3.6vw,48px)] font-semibold tracking-[-0.02em]">Legyártott minták.</h2>
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((g, i) => {
              const p = productBySlug(g.productSlug);
              if (!p) return null;
              return (
                <Reveal key={g.id} as="li" delay={(i % 4) * 0.04} className="c08-box p-4">
                  <div className="flex items-center justify-between">
                    <span className="c08-tag">Lot {String(40 + i).padStart(4, "0")}</span>
                    <span className="c08-label text-[var(--c08-ink)]/50">{g.zoneKey}</span>
                  </div>
                  <DesignOnGarment kind={p.silhouette} color={colorHex(g.colorSlug)} designUrl={assetUrl(g.designAssetSlug)} position={g.zoneKey as "front_center"} widthCm={g.widthCm} heightCm={g.heightCm} className="mx-auto my-3 h-40 w-auto" title={g.title} />
                  <p className="text-[13px] font-semibold">{g.title}</p>
                  <p className="c08-mono mt-1 text-[11px] text-[var(--c08-ink)]/60">
                    {g.widthCm} × {g.heightCm} cm · {p.name}
                  </p>
                </Reveal>
              );
            })}
          </ul>
        </section>

        {/* OPEN CALL */}
        <section className="bg-[var(--c08-orange)] text-[var(--c08-bg)]">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 md:grid-cols-2">
            <Reveal>
              <p className="c08-label text-[var(--c08-bg)]/80">Open call · {siteConfig.creatorProgram.programName}</p>
              <h2 className="mt-3 text-[clamp(30px,4.5vw,64px)] font-semibold leading-[1] tracking-[-0.02em]">Alkotók a gyártósorra.</h2>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col justify-end">
              <p className="c08-mono max-w-md text-[14px] leading-relaxed">{siteConfig.creatorProgram.benefit}</p>
              <Link href="/creator/" className="mt-6 w-fit bg-[var(--c08-ink)] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--c08-bg)] hover:bg-[var(--c08-bg)] hover:text-[var(--c08-ink)]">
                Jelentkezés →
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--c08-ink)]">
        <div className="c08-label mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-8 text-[var(--c08-ink)]/60 md:flex-row md:items-center md:justify-between">
          <p>{siteConfig.name}</p>
          <p>
            {siteConfig.contact.email} · {siteConfig.contact.address}
          </p>
          <p>ÁSZF · Adatkezelés · Cookie · Szállítás</p>
        </div>
      </footer>
      <ConceptFrame slug="08-industrial" />
    </div>
  );
}
