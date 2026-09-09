"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import type { Category, Product } from "@/lib/catalog/types";
import { formatHuf } from "@/lib/utils/format";

export interface BlockSpec {
  category: Category;
  bg: string;
  fg: string;
  garmentColor: string;
  products: Product[];
}

/**
 * Kategóriánként teljes háttérszín-váltás scrollra: az éppen látható blokk
 * színét a wrapper háttérszíne veszi fel (CSS transition), IntersectionObserverrel.
 */
export function ColorSections({ blocks, intro }: { blocks: BlockSpec[]; intro: ReactNode }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.index);
            setActive(idx);
          }
        }
      },
      { threshold: 0.5 },
    );
    for (const el of refs.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  const current = blocks[active] ?? blocks[0];

  return (
    <div className="c07-canvas" style={{ backgroundColor: current.bg, color: current.fg }}>
      {intro}
      <nav className="sticky top-16 z-30 mx-auto flex max-w-[1400px] flex-wrap gap-2 px-5 py-3" aria-label="Kategóriák">
        {blocks.map((b, i) => (
          <a
            key={b.category.slug}
            href={`#c07-${b.category.slug}`}
            className={`c07-chip ${i === active ? "c07-chip-active" : ""}`}
            style={i === active ? { backgroundColor: b.fg, color: b.bg, borderColor: b.fg } : undefined}
          >
            {b.category.name}
          </a>
        ))}
      </nav>
      {blocks.map((b, i) => (
        <section
          key={b.category.slug}
          id={`c07-${b.category.slug}`}
          data-index={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="mx-auto max-w-[1400px] px-5 py-20 md:py-28"
        >
          <p className="c07-mono text-[12px] uppercase tracking-[0.3em] opacity-70">
            0{i + 1} / 0{blocks.length}
          </p>
          <h2 className="c07-display mt-3 break-words text-[clamp(44px,7.4vw,132px)] leading-[0.92] [overflow-wrap:anywhere]">{b.category.name}</h2>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-6">
              <p className="max-w-md text-[17px] leading-relaxed opacity-80">{b.category.description}</p>
              <Link href={`/shop/?category=${b.category.slug}`} className="c07-btn mt-8 inline-block" style={{ backgroundColor: b.fg, color: b.bg }}>
                {b.category.name} megnézése →
              </Link>
            </div>
            <div className="md:col-span-6">
              <GarmentSilhouette kind={b.category.silhouette} color={b.garmentColor} lineColor="rgba(0,0,0,0.25)" className="mx-auto h-[300px] w-auto drop-shadow-[0_40px_40px_rgba(0,0,0,0.15)] md:h-[400px]" title={b.category.name} />
            </div>
          </div>
          {b.products.length > 0 ? (
            <ul className="mt-12 flex snap-x gap-4 overflow-x-auto pb-4">
              {b.products.map((p) => (
                <li key={p.slug} className="c07-product w-[240px] shrink-0 snap-start" style={{ borderColor: b.fg }}>
                  <Link href={`/shop/product/?slug=${p.slug}`} className="block p-4">
                    <GarmentSilhouette kind={p.silhouette} color={b.garmentColor} lineColor="rgba(0,0,0,0.2)" className="mx-auto h-40 w-auto" title={p.name} />
                    <p className="c07-display mt-3 text-[18px]">{p.name}</p>
                    <p className="c07-mono mt-1 text-[12px] opacity-70">{formatHuf(p.basePriceHuf)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
