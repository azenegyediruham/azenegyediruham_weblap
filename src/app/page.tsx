import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/config/site";
import { concepts } from "@/concepts/registry";

const STEPS = [
  { n: "01", title: "Válassz ruhát", text: "Póló, pulóver, trikó, nadrág, ruha vagy szoknya – fazonnal, színnel, mérettel." },
  { n: "02", title: "Töltsd fel a mintád", text: "PNG, JPG, WebP vagy SVG. Logó, rajz, felirat – ami neked fontos." },
  { n: "03", title: "Helyezd el", text: "Húzd, forgasd, méretezd a megengedett hímzési zónákon belül, valós centiméterben." },
  { n: "04", title: "Nézd meg 3D-ben", text: "Forgasd meg a ruhát, nézd meg közelről a hímzést, mielőtt rendelsz." },
  { n: "05", title: "Rendeld meg", text: "Mi kihímezzük és elküldjük. 5–10 munkanap." },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 md:pt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">Egyedi hímzett ruhák</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {siteConfig.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">{siteConfig.hero.subtitle}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/studio/" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90">
              {siteConfig.hero.ctaPrimary}
            </Link>
            <Link href="/shop/" className="rounded-full border border-foreground px-6 py-3 text-sm font-medium transition hover:bg-foreground hover:text-background">
              {siteConfig.hero.ctaSecondary}
            </Link>
          </div>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-5">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="font-mono text-xs text-muted">{s.n}</p>
                <h2 className="mt-2 text-base font-semibold">{s.title}</h2>
                <p className="mt-2 text-sm text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">Design irány</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">10 design koncepció, egy döntés</h2>
              <p className="mt-3 max-w-xl text-muted">
                A végleges arculat kiválasztásáig ez a semleges kezdőlap él. Nézd végig mind a tíz irányt, és válassz.
              </p>
            </div>
            <Link href="/concepts/" className="rounded-full border border-foreground px-5 py-2.5 text-sm font-medium transition hover:bg-foreground hover:text-background">
              Összes koncepció
            </Link>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {concepts.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/concepts/${c.slug}/`}
                  className="block rounded-xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-foreground"
                >
                  <div className="flex gap-1">
                    {c.palette.map((hex) => (
                      <span key={hex} className="h-6 flex-1 rounded-sm border border-black/5" style={{ backgroundColor: hex }} />
                    ))}
                  </div>
                  <p className="mt-3 font-mono text-xs text-muted">{c.number}</p>
                  <p className="font-semibold">{c.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
