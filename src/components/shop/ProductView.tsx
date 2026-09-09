"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { ShirtViewerLazy } from "@/components/three/ShirtViewerLazy";
import { MEASUREMENT_LABELS } from "@/lib/catalog/types";
import { useCatalog } from "@/lib/catalog/useCatalog";
import { useCart } from "@/lib/store/cart";
import { formatHuf } from "@/lib/utils/format";

export function ProductView() {
  const params = useSearchParams();
  const slug = params.get("slug") ?? "";
  const { catalog, loading } = useCatalog();
  const cart = useCart();
  const product = catalog.products.find((p) => p.slug === slug);
  const [fit, setFit] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!product) return;
    const t = window.setTimeout(() => {
      setFit((f) => (f && product.fitSlugs.includes(f) ? f : product.fitSlugs[0]));
      setColor((c) => (c && product.colorSlugs.includes(c) ? c : product.colorSlugs[0]));
      setSize((s) => (s && product.sizeCodes.includes(s) ? s : product.sizeCodes.includes("M") ? "M" : product.sizeCodes[0]));
    }, 0);
    return () => window.clearTimeout(t);
  }, [product]);

  const colorObj = catalog.colors.find((c) => c.slug === color) ?? catalog.colors[0];
  const model = useMemo(() => (product ? catalog.garmentModels.find((g) => g.slug === product.garmentModelSlug) : undefined), [catalog.garmentModels, product]);
  const chart = product ? catalog.sizeCharts.find((s) => s.id === product.sizeChartId) : undefined;
  const variant = product?.variants.find((v) => v.fitSlug === fit && v.colorSlug === color && v.sizeCode === size);
  const price = variant?.priceHuf ?? product?.basePriceHuf ?? 0;
  const category = product ? catalog.categories.find((c) => c.slug === product.categorySlug) : undefined;

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">{loading ? "Termék betöltése…" : "A termék nem található"}</h1>
        {!loading ? (
          <Link href="/shop/" className="mt-6 inline-block underline">
            Vissza a ruhákhoz
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="text-xs text-muted" aria-label="Morzsa">
        <Link href="/shop/" className="hover:text-foreground">
          Ruhák
        </Link>{" "}
        / <span>{category?.name}</span> / <span className="text-foreground">{product.name}</span>
      </nav>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* GALÉRIA / 3D */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
            {model?.modelPath ? (
              <ShirtViewerLazy color={colorObj.hex} charts={model.charts} modelPath={model.modelPath} className="h-full w-full" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <GarmentSilhouette kind={product.silhouette} color={colorObj.hex} className="h-[80%] w-auto" title={product.name} />
              </div>
            )}
          </div>
          <ul className="mt-3 grid grid-cols-5 gap-2">
            {product.colorSlugs.slice(0, 5).map((slug) => {
              const c = catalog.colors.find((x) => x.slug === slug);
              return (
                <li key={slug}>
                  <button type="button" onClick={() => setColor(slug)} className={`flex aspect-square w-full items-center justify-center rounded-xl border bg-surface ${slug === color ? "border-foreground" : "border-line"}`} aria-label={c?.name}>
                    <GarmentSilhouette kind={product.silhouette} color={c?.hex ?? "#eee"} className="h-[70%] w-auto" />
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-muted">{model?.modelPath ? "3D: forgasd egérrel vagy ujjal, görgess a zoomhoz." : "Ehhez a ruhához még nincs 3D modell – 2D előnézet."} Termékfotók később adminból tölthetők fel.</p>
        </div>

        {/* ADATOK */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            {category?.name} · {product.gender === "women" ? "női" : product.gender === "men" ? "férfi" : "unisex"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-2 text-2xl">{formatHuf(price)}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

          <Group label="Fazon">
            {product.fitSlugs.map((f) => (
              <Pill key={f} active={f === fit} onClick={() => setFit(f)}>
                {catalog.fits.find((x) => x.slug === f)?.name ?? f}
              </Pill>
            ))}
          </Group>
          <Group label={`Szín · ${colorObj.name}`}>
            {product.colorSlugs.map((slug) => {
              const c = catalog.colors.find((x) => x.slug === slug);
              return <button key={slug} type="button" aria-label={c?.name} title={c?.name} onClick={() => setColor(slug)} className={`h-9 w-9 rounded-full border-2 ${slug === color ? "border-foreground ring-2 ring-foreground/20" : "border-black/10"}`} style={{ backgroundColor: c?.hex }} />;
            })}
          </Group>
          <Group label="Méret">
            {product.sizeCodes.map((s) => (
              <Pill key={s} active={s === size} onClick={() => setSize(s)}>
                {s}
              </Pill>
            ))}
          </Group>
          {variant ? <p className="mt-2 text-xs text-muted">Készleten: {variant.stockQty} db · SKU {variant.sku}</p> : null}

          {chart ? (
            <details className="mt-5 rounded-xl border border-line p-3 text-xs" open>
              <summary className="cursor-pointer font-semibold">Mérettáblázat · {chart.name}</summary>
              <table className="mt-2 w-full">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="py-1 font-medium">Méret</th>
                    {chart.measurementKeys.map((k) => (
                      <th key={k} className="py-1 font-medium">
                        {MEASUREMENT_LABELS[k]} (cm)
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.entries
                    .filter((e) => product.sizeCodes.includes(e.sizeCode))
                    .map((e) => (
                      <tr key={e.sizeCode} className={`border-t border-line ${e.sizeCode === size ? "font-semibold" : ""}`}>
                        <td className="py-1">{e.sizeCode}</td>
                        {chart.measurementKeys.map((k) => (
                          <td key={k} className="py-1">
                            {e.measurements[k] ?? "–"}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </details>
          ) : null}

          {model ? (
            <div className="mt-5 rounded-xl border border-line p-3 text-xs">
              <p className="font-semibold">Hímzési zónák</p>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-muted">
                {model.zones
                  .filter((z) => z.isActive)
                  .map((z) => (
                    <li key={z.key} className="flex justify-between">
                      <span>{z.displayName}</span>
                      <span>
                        max {z.maxWidthCm} × {z.maxHeightCm} cm
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {product.customizable ? (
              <Link href={`/studio/?product=${product.slug}`} className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground">
                Testreszabom a Studióban →
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => {
                cart.add({
                  productSlug: product.slug,
                  productName: product.name,
                  silhouette: product.silhouette,
                  fitSlug: fit ?? product.fitSlugs[0],
                  colorSlug: colorObj.slug,
                  colorHex: colorObj.hex,
                  sizeCode: size ?? product.sizeCodes[0],
                  quantity: 1,
                  unitPriceHuf: price,
                  garmentPriceHuf: price,
                  design: null,
                });
                setAdded(true);
              }}
              className="rounded-full border border-foreground px-6 py-3 text-sm font-medium hover:bg-foreground hover:text-background"
            >
              {added ? "Kosárban ✓" : "Kosárba minta nélkül"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-full border px-4 py-1.5 text-sm ${active ? "border-foreground bg-foreground text-background" : "border-line hover:border-foreground"}`}>
      {children}
    </button>
  );
}
