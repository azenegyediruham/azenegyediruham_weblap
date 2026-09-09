import type { Metadata } from "next";
import Link from "next/link";
import { concepts } from "@/concepts/registry";
import { ConceptThumb } from "@/components/concepts/ConceptThumb";

export const metadata: Metadata = {
  title: "Design koncepciók",
  description: "Tíz különböző design irány ugyanahhoz a márkához. Nyisd meg, hasonlítsd össze, válassz.",
};

export default function ConceptsPage() {
  return (
    <main className="min-h-screen bg-[#f2f1ec] text-[#161616]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Link href="/" className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6b6b66] hover:text-[#161616]">
              ← Vissza a kezdőlapra
            </Link>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Design Concept Selector</h1>
            <p className="mt-4 max-w-2xl text-[#6b6b66]">
              Tíz valóban különböző irány: eltérő layout, hero, tipográfia, navigáció, grid, animáció és 3D-hangsúly. Mind ugyanazt a
              mock termékadatot használja. Nyisd meg mindet desktopon és mobilon, és válaszd ki a végleges irányt.
            </p>
          </div>
          <p className="font-mono text-xs text-[#6b6b66]">10 koncepció · 1 backend · 1 döntés</p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {concepts.map((c) => (
            <li key={c.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-[#e2e0d8] bg-white">
              <Link href={`/concepts/${c.slug}/`} aria-label={`${c.name} megnyitása`} className="block">
                <ConceptThumb concept={c} />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg font-semibold tracking-tight">
                    <span className="mr-2 font-mono text-xs text-[#6b6b66]">{c.number}</span>
                    {c.name}
                  </h2>
                </div>
                <p className="mt-1 text-sm font-medium text-[#3a3a36]">{c.tagline}</p>
                <p className="mt-3 text-sm text-[#6b6b66]">{c.description}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#6b6b66]">
                  <dt className="font-semibold text-[#3a3a36]">Betűk</dt>
                  <dd>{c.fonts}</dd>
                  <dt className="font-semibold text-[#3a3a36]">3D szerepe</dt>
                  <dd>{c.threeD}</dd>
                  <dt className="font-semibold text-[#3a3a36]">Hangulat</dt>
                  <dd>{c.mood}</dd>
                </dl>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex gap-1" aria-hidden>
                    {c.palette.map((hex) => (
                      <span key={hex} className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                    ))}
                  </div>
                  <Link
                    href={`/concepts/${c.slug}/`}
                    className="rounded-full bg-[#161616] px-4 py-2 text-sm font-medium text-white transition group-hover:opacity-90"
                  >
                    Megnyitás
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
