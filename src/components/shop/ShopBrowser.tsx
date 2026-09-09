"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import type { Gender } from "@/lib/catalog/types";
import { useCatalog } from "@/lib/catalog/useCatalog";
import { formatHuf } from "@/lib/utils/format";

const GENDERS: { value: Gender | "all"; label: string }[] = [
  { value: "all", label: "Mind" },
  { value: "women", label: "Női" },
  { value: "men", label: "Férfi" },
  { value: "unisex", label: "Unisex" },
];

export function ShopBrowser() {
  const { catalog, source } = useCatalog();
  const params = useSearchParams();
  const [gender, setGender] = useState<Gender | "all">("all");
  const [category, setCategory] = useState<string>(params.get("category") ?? "all");
  const [fit, setFit] = useState("all");
  const [size, setSize] = useState("all");
  const [color, setColor] = useState("all");
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

  const products = useMemo(() => {
    let list = catalog.products.filter((p) => p.isActive);
    if (gender !== "all") list = list.filter((p) => p.gender === gender || (gender !== "unisex" && p.gender === "unisex"));
    if (category !== "all") list = list.filter((p) => p.categorySlug === category);
    if (fit !== "all") list = list.filter((p) => p.fitSlugs.includes(fit));
    if (size !== "all") list = list.filter((p) => p.sizeCodes.includes(size));
    if (color !== "all") list = list.filter((p) => p.colorSlugs.includes(color));
    list = list.filter((p) => p.basePriceHuf <= maxPrice);
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.basePriceHuf - b.basePriceHuf);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.basePriceHuf - a.basePriceHuf);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name, "hu"));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }
    return list;
  }, [catalog.products, gender, category, fit, size, color, maxPrice, sort]);

  const selectClass = "rounded-lg border border-line bg-surface px-3 py-2 text-sm";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">Ruhák</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Válassz alapot a mintádnak</h1>
          <p className="mt-2 text-sm text-muted">Minden ruha testreszabható: a termékoldalon látod a hímzési zónákat, a Studióban elhelyezed a mintát.</p>
        </div>
        <p className="text-xs text-muted">
          {products.length} termék · {source === "supabase" ? "élő katalógus" : "minta adatok"}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-5 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Kinek</p>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Nem">
              {GENDERS.map((g) => (
                <button key={g.value} type="button" role="radio" aria-checked={gender === g.value} onClick={() => setGender(g.value)} className={`rounded-full border px-3 py-1 ${gender === g.value ? "border-foreground bg-foreground text-background" : "border-line hover:border-foreground"}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Kategória</p>
            <ul className="mt-2 space-y-1">
              <li>
                <button type="button" onClick={() => setCategory("all")} className={category === "all" ? "font-semibold" : "text-muted hover:text-foreground"}>
                  Összes
                </button>
              </li>
              {catalog.categories
                .filter((c) => c.isActive)
                .map((c) => (
                  <li key={c.slug}>
                    <button type="button" onClick={() => setCategory(c.slug)} className={category === c.slug ? "font-semibold" : "text-muted hover:text-foreground"}>
                      {c.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Fazon</span>
            <select value={fit} onChange={(e) => setFit(e.target.value)} className={`mt-2 w-full ${selectClass}`}>
              <option value="all">Mind</option>
              {catalog.fits.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Méret</span>
            <select value={size} onChange={(e) => setSize(e.target.value)} className={`mt-2 w-full ${selectClass}`}>
              <option value="all">Mind</option>
              {catalog.sizes.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Szín</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => setColor("all")} className={`rounded-full border px-2 py-1 text-xs ${color === "all" ? "border-foreground" : "border-line"}`}>
                Mind
              </button>
              {catalog.colors
                .filter((c) => c.isActive)
                .map((c) => (
                  <button key={c.slug} type="button" aria-label={c.name} title={c.name} onClick={() => setColor(c.slug)} className={`h-7 w-7 rounded-full border-2 ${color === c.slug ? "border-foreground" : "border-black/10"}`} style={{ backgroundColor: c.hex }} />
                ))}
            </div>
          </div>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Ár max: {formatHuf(maxPrice)}</span>
            <input type="range" min={4000} max={20000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="mt-2 w-full accent-[var(--accent)]" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Rendezés</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={`mt-2 w-full ${selectClass}`}>
              <option value="featured">Kiemelt</option>
              <option value="price-asc">Ár szerint növekvő</option>
              <option value="price-desc">Ár szerint csökkenő</option>
              <option value="name">Név</option>
            </select>
          </label>
        </aside>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {products.map((p) => {
            const c = catalog.colors.find((x) => x.slug === (color !== "all" && p.colorSlugs.includes(color) ? color : p.colorSlugs[0]));
            const cat = catalog.categories.find((x) => x.slug === p.categorySlug);
            return (
              <li key={p.slug} className="group rounded-2xl border border-line bg-surface p-3 transition hover:border-foreground">
                <Link href={`/shop/product/?slug=${p.slug}`} className="block">
                  <div className="flex aspect-[4/5] items-center justify-center rounded-xl bg-background">
                    <GarmentSilhouette kind={p.silhouette} color={c?.hex ?? "#eee"} className="h-[78%] w-auto transition group-hover:scale-[1.03]" title={p.name} />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <h2 className="text-sm font-semibold">{p.name}</h2>
                    <p className="text-sm">{formatHuf(p.basePriceHuf)}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {cat?.name} · {p.gender === "women" ? "női" : p.gender === "men" ? "férfi" : "unisex"} · {p.colorSlugs.length} szín
                  </p>
                  <div className="mt-2 flex gap-1">
                    {p.colorSlugs.slice(0, 7).map((slug) => (
                      <span key={slug} className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: catalog.colors.find((x) => x.slug === slug)?.hex }} />
                    ))}
                  </div>
                </Link>
              </li>
            );
          })}
          {products.length === 0 ? <li className="col-span-full rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">Nincs a szűrőknek megfelelő termék.</li> : null}
        </ul>
      </div>
    </div>
  );
}
