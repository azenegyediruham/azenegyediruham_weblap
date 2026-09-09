"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { ShirtViewerLazy } from "@/components/three/ShirtViewerLazy";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { CustomizationZone, GarmentView } from "@/lib/catalog/types";
import { useCatalog } from "@/lib/catalog/useCatalog";
import type { DesignSource } from "@/lib/customizer/upload";
import { saveDesign } from "@/lib/designs/save-design";
import { getPricing } from "@/lib/pricing";
import { useCart } from "@/lib/store/cart";
import { useDesignSession } from "@/lib/store/design-session";
import { formatHuf, formatSizeCm } from "@/lib/utils/format";
import { DesignEditor } from "./DesignEditor";
import { DesignLibrary } from "./DesignLibrary";
import { PlacementControls } from "./PlacementControls";
import { UploadDropzone } from "./UploadDropzone";

const STEPS = ["Ruha", "Fazon · szín · méret", "Minta elhelyezése", "3D előnézet", "Mentés és kosár"] as const;

export function StudioApp() {
  const { catalog, source: catalogSource } = useCatalog();
  const session = useDesignSession();
  const cart = useCart();
  const auth = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState(() => (params.get("product") ? 2 : 1));
  const [viewKey, setViewKey] = useState<GarmentView["key"]>("front");
  const [zoneKey, setZoneKey] = useState<string | null>(null);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<string | null>(null);
  const [embroideryPreview, setEmbroideryPreview] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [designName, setDesignName] = useState("Saját design");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const customizable = useMemo(() => catalog.products.filter((p) => p.customizable && p.isActive), [catalog.products]);
  const product = useMemo(() => catalog.products.find((p) => p.slug === session.state.productSlug) ?? null, [catalog.products, session.state.productSlug]);
  const model = useMemo(() => (product ? catalog.garmentModels.find((g) => g.slug === product.garmentModelSlug) ?? null : null), [catalog.garmentModels, product]);
  const view = model?.views.find((v) => v.key === viewKey) ?? model?.views[0] ?? null;
  const zones = model?.zones ?? [];
  const viewZones = zones.filter((z) => z.viewKey === (view?.key ?? "front") && z.isActive);
  const color = catalog.colors.find((c) => c.slug === session.state.colorSlug) ?? catalog.colors[0];
  const fit = catalog.fits.find((f) => f.slug === session.state.fitSlug);
  const variant = product?.variants.find((v) => v.fitSlug === session.state.fitSlug && v.colorSlug === session.state.colorSlug && v.sizeCode === session.state.sizeCode);
  const garmentPrice = variant?.priceHuf ?? product?.basePriceHuf ?? 0;

  // ?product=slug előválasztás
  useEffect(() => {
    const slug = params.get("product");
    if (!slug || !session.hydrated) return;
    if (session.state.productSlug !== slug && catalog.products.some((p) => p.slug === slug)) {
      session.selectProduct(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, session.hydrated, catalog.products]);

  // alapértelmezett variáns
  useEffect(() => {
    if (!product) return;
    const patch: Partial<{ fitSlug: string; colorSlug: string; sizeCode: string }> = {};
    if (!session.state.fitSlug || !product.fitSlugs.includes(session.state.fitSlug)) patch.fitSlug = product.fitSlugs[0];
    if (!session.state.colorSlug || !product.colorSlugs.includes(session.state.colorSlug)) patch.colorSlug = product.colorSlugs[0];
    if (!session.state.sizeCode || !product.sizeCodes.includes(session.state.sizeCode)) patch.sizeCode = product.sizeCodes.includes("M") ? "M" : product.sizeCodes[0];
    if (Object.keys(patch).length) session.setVariant(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.slug]);

  // ha nincs kijelölt zóna a nézetben, az elsőt választjuk
  useEffect(() => {
    if (!viewZones.length) return;
    if (!zoneKey || !viewZones.some((z) => z.key === zoneKey)) {
      const t = window.setTimeout(() => setZoneKey(viewZones[0].key), 0);
      return () => window.clearTimeout(t);
    }
  }, [viewZones, zoneKey]);

  const selectedZone: CustomizationZone | null = zones.find((z) => z.key === zoneKey) ?? null;
  const selectedPlacement = session.state.placements.find((p) => p.id === selectedPlacementId) ?? null;

  const quote = useMemo(
    () =>
      getPricing().quote({
        garmentPriceHuf: garmentPrice,
        items: session.state.placements.map((p) => ({ widthCm: p.widthCm, heightCm: p.heightCm, colorCount: 2 })),
        quantity,
      }),
    [garmentPrice, session.state.placements, quantity],
  );

  const handleSource = async (src: DesignSource) => {
    await session.addSource(src);
    if (!view) return;
    if (replaceTarget) {
      const target = session.state.placements.find((p) => p.id === replaceTarget);
      const zone = zones.find((z) => z.key === target?.zoneKey);
      if (target && zone) session.replacePlacementSource(target.id, src, zone);
      setReplaceTarget(null);
      return;
    }
    const zone = selectedZone && selectedZone.viewKey === view.key ? selectedZone : viewZones[0];
    if (!zone) return;
    const placement = session.addPlacement(src, zone, view.chartKey);
    setSelectedPlacementId(placement.id);
    setZoneKey(zone.key);
  };

  const canProceedFrom3 = session.state.placements.length > 0;

  const handleSave = async () => {
    if (!auth.user || !product) return;
    setSaving(true);
    setSaveError(null);
    try {
      const result = await saveDesign({ userId: auth.user.id, name: designName, product, catalog, session: session.state, sources: session.sources, colorHex: color.hex });
      session.setSavedDesignCode(result.publicCode);
      setSavedCode(result.publicCode);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "A mentés nem sikerült.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    cart.add({
      productSlug: product.slug,
      productName: product.name,
      silhouette: product.silhouette,
      fitSlug: session.state.fitSlug ?? product.fitSlugs[0],
      colorSlug: color.slug,
      colorHex: color.hex,
      sizeCode: session.state.sizeCode ?? product.sizeCodes[0],
      quantity,
      unitPriceHuf: quote.unitTotalHuf,
      garmentPriceHuf: garmentPrice,
      design: session.state.placements.length
        ? { placements: session.state.placements, sourceMeta: session.state.sourceMeta, savedDesignCode: session.state.savedDesignCode ?? savedCode, embroideryTotalHuf: quote.unitEmbroideryHuf }
        : null,
    });
    setAdded(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">Design Studio</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Saját ruhám</h1>
        </div>
        <p className="text-xs text-muted">
          Katalógus: {catalogSource === "supabase" ? "élő (Supabase)" : catalogSource === "mock" ? "minta adatok" : "betöltés…"}
        </p>
      </div>

      {/* STEPPER */}
      <ol className="mt-6 grid grid-cols-5 gap-1 text-xs">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const enabled = n === 1 || (product && (n <= 3 || (n >= 4 && canProceedFrom3)));
          return (
            <li key={label}>
              <button
                type="button"
                disabled={!enabled}
                onClick={() => setStep(n)}
                className={`w-full rounded-lg border px-2 py-2 text-left transition ${step === n ? "border-foreground bg-foreground text-background" : "border-line bg-surface hover:border-foreground disabled:opacity-40 disabled:hover:border-line"}`}
              >
                <span className="font-mono">0{n}</span> <span className="hidden sm:inline">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* STEP 1 – RUHA */}
      {step === 1 ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Válassz ruhát</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {customizable.map((p) => {
              const active = p.slug === session.state.productSlug;
              const has3d = Boolean(catalog.garmentModels.find((g) => g.slug === p.garmentModelSlug)?.modelPath);
              return (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      session.selectProduct(p.slug);
                      setStep(2);
                    }}
                    className={`w-full rounded-2xl border p-3 text-left transition hover:border-foreground ${active ? "border-foreground" : "border-line"}`}
                  >
                    <div className="flex aspect-square items-center justify-center rounded-xl bg-surface">
                      <GarmentSilhouette kind={p.silhouette} color={catalog.colors.find((c) => c.slug === p.colorSlugs[0])?.hex ?? "#eee"} className="h-[80%] w-auto" title={p.name} />
                    </div>
                    <p className="mt-2 text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted">
                      {formatHuf(p.basePriceHuf)}-tól {has3d ? "· 3D" : "· 2D"}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* STEP 2 – VARIÁNS */}
      {step === 2 && product ? (
        <section className="mt-8 grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-surface">
            <GarmentSilhouette kind={product.silhouette} color={color.hex} className="h-[80%] w-auto" title={product.name} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-1 text-sm text-muted">{product.description}</p>
            <Chooser label="Fazon" options={product.fitSlugs.map((s) => ({ value: s, label: catalog.fits.find((f) => f.slug === s)?.name ?? s }))} value={session.state.fitSlug} onChange={(v) => session.setVariant({ fitSlug: v })} />
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Szín · {color.name}</p>
              <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Szín">
                {product.colorSlugs.map((slug) => {
                  const c = catalog.colors.find((x) => x.slug === slug);
                  if (!c) return null;
                  const active = slug === session.state.colorSlug;
                  return <button key={slug} type="button" role="radio" aria-checked={active} aria-label={c.name} onClick={() => session.setVariant({ colorSlug: slug })} className={`h-9 w-9 rounded-full border-2 ${active ? "border-foreground ring-2 ring-foreground/20" : "border-black/10"}`} style={{ backgroundColor: c.hex }} />;
                })}
              </div>
            </div>
            <Chooser label="Méret" options={product.sizeCodes.map((s) => ({ value: s, label: s }))} value={session.state.sizeCode} onChange={(v) => session.setVariant({ sizeCode: v })} />
            <SizeChartTable product={product} catalog={catalog} />
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm">
                Alapár: <strong>{formatHuf(garmentPrice)}</strong>
                {variant ? <span className="text-xs text-muted"> · készleten {variant.stockQty} db</span> : null}
              </p>
              <button type="button" onClick={() => setStep(3)} className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground">
                Tovább a mintához →
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {/* STEP 3 – MINTA */}
      {step === 3 && product && model && view ? (
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {model.views.map((v) => (
                <button key={v.key} type="button" onClick={() => setViewKey(v.key)} className={`rounded-full px-4 py-1.5 text-sm ${v.key === view.key ? "bg-foreground text-background" : "border border-line hover:border-foreground"}`}>
                  {v.label}
                </button>
              ))}
              <span className="ml-auto text-xs text-muted">{view.crop.w} × {view.crop.h} cm</span>
            </div>
            <div className="mt-3 rounded-2xl border border-line bg-surface p-2">
              <DesignEditor
                view={view}
                silhouette={product.silhouette}
                color={color.hex}
                zones={zones}
                placements={session.state.placements}
                sources={session.sources}
                selectedZoneKey={zoneKey}
                selectedPlacementId={selectedPlacementId}
                onSelectZone={setZoneKey}
                onSelectPlacement={setSelectedPlacementId}
                onChange={(id, patch, zone) => session.updatePlacement(id, patch, zone)}
                onDelete={(id) => {
                  session.removePlacement(id);
                  setSelectedPlacementId(null);
                }}
                className="mx-auto max-h-[70vh] w-full"
              />
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {viewZones.map((z) => {
                const has = session.state.placements.some((p) => p.zoneKey === z.key);
                return (
                  <li key={z.key}>
                    <button type="button" onClick={() => setZoneKey(z.key)} className={`rounded-full border px-3 py-1 text-xs ${z.key === zoneKey ? "border-foreground bg-foreground text-background" : "border-line hover:border-foreground"}`}>
                      {z.displayName} {has ? "●" : ""}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{replaceTarget ? "Csere: válassz új képet" : `Minta ide: ${selectedZone?.displayName ?? "—"}`}</p>
              <div className="mt-3">
                <UploadDropzone onSource={handleSource} compact />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Vagy válassz a mintáinkból</p>
              <div className="mt-2">
                <DesignLibrary assets={catalog.designAssets} onSource={handleSource} />
              </div>
              {replaceTarget ? (
                <button type="button" onClick={() => setReplaceTarget(null)} className="mt-3 text-xs underline">
                  Mégse
                </button>
              ) : null}
            </div>
            {selectedPlacement && selectedZone ? (
              <PlacementControls
                placement={selectedPlacement}
                zone={zones.find((z) => z.key === selectedPlacement.zoneKey) ?? selectedZone}
                source={session.sources[selectedPlacement.sourceId]}
                onChange={(patch) => session.updatePlacement(selectedPlacement.id, patch, zones.find((z) => z.key === selectedPlacement.zoneKey) ?? selectedZone)}
                onDelete={() => {
                  session.removePlacement(selectedPlacement.id);
                  setSelectedPlacementId(null);
                }}
                onReplace={() => setReplaceTarget(selectedPlacement.id)}
                onEmbroidery={(on) => session.setEmbroidery(selectedPlacement.id, on)}
              />
            ) : (
              <p className="rounded-2xl border border-dashed border-line p-4 text-xs text-muted">Tölts fel egy képet vagy válassz mintát – a kijelölt zónába kerül. Utána húzd, forgasd, méretezd. A méretet valós centiméterben látod.</p>
            )}
            {session.state.placements.length ? (
              <ul className="rounded-2xl border border-line bg-surface p-4 text-xs">
                <p className="mb-2 font-semibold uppercase tracking-[0.2em] text-muted">Elhelyezett minták</p>
                {session.state.placements.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-1">
                    <button
                      type="button"
                      className="text-left hover:underline"
                      onClick={() => {
                        setViewKey(p.viewKey as GarmentView["key"]);
                        setZoneKey(p.zoneKey);
                        setSelectedPlacementId(p.id);
                      }}
                    >
                      {zones.find((z) => z.key === p.zoneKey)?.displayName ?? p.zoneKey}
                    </button>
                    <span className="text-muted">{formatSizeCm(p.widthCm, p.heightCm)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="rounded-full border border-line px-5 py-2.5 text-sm">
                ← Vissza
              </button>
              <button type="button" disabled={!canProceedFrom3} onClick={() => setStep(4)} className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-40">
                3D előnézet →
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {/* STEP 4 – 3D */}
      {step === 4 && product && model ? (
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Előnézet</h2>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={embroideryPreview} onChange={(e) => setEmbroideryPreview(e.target.checked)} /> Hímzés-effekt
            </label>
          </div>
          {model.modelPath ? (
            <div className="mt-4 h-[70vh] rounded-2xl bg-surface">
              <ShirtViewerLazy color={color.hex} placements={session.resolvedPlacements} charts={model.charts} modelPath={model.modelPath} embroidery={embroideryPreview} autoRotate={false} className="h-full w-full" />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {model.views.map((v) => (
                <div key={v.key} className="rounded-2xl border border-line bg-surface p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{v.label}</p>
                  <DesignEditor view={v} silhouette={product.silhouette} color={color.hex} zones={[]} placements={session.state.placements} sources={session.sources} selectedZoneKey={null} selectedPlacementId={null} onSelectZone={() => {}} onSelectPlacement={() => {}} onChange={() => {}} onDelete={() => {}} readOnly className="w-full" />
                </div>
              ))}
              <p className="text-xs text-muted md:col-span-2">Ehhez a ruhához még nincs 3D modell – a 2D előnézet mutatja az elhelyezést. A 3D modellek Blenderből, GLB formátumban kerülnek be.</p>
            </div>
          )}
          <div className="mt-4 flex justify-between">
            <button type="button" onClick={() => setStep(3)} className="rounded-full border border-line px-5 py-2.5 text-sm">
              ← Szerkesztés
            </button>
            <button type="button" onClick={() => setStep(5)} className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground">
              Mentés és kosár →
            </button>
          </div>
        </section>
      ) : null}

      {/* STEP 5 – ÖSSZEGZÉS */}
      {step === 5 && product ? (
        <section className="mt-8 grid gap-6 md:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-lg font-semibold">Összegzés</h2>
            <dl className="mt-3 space-y-1 text-sm">
              <Row k="Ruha" v={product.name} />
              <Row k="Fazon" v={fit?.name ?? "—"} />
              <Row k="Szín" v={color.name} />
              <Row k="Méret" v={session.state.sizeCode ?? "—"} />
              {session.state.placements.map((p) => (
                <Row key={p.id} k={zones.find((z) => z.key === p.zoneKey)?.displayName ?? p.zoneKey} v={formatSizeCm(p.widthCm, p.heightCm)} />
              ))}
            </dl>
            <label className="mt-4 block text-sm">
              Darabszám
              <input type="number" min={1} max={500} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} className="ml-3 w-20 rounded-lg border border-line px-2 py-1" />
            </label>
            <ul className="mt-4 space-y-1 border-t border-line pt-3 text-sm">
              {quote.lines.map((l) => (
                <li key={l.label} className="flex justify-between">
                  <span className="text-muted">{l.label}</span>
                  <span>{formatHuf(l.amountHuf)}</span>
                </li>
              ))}
              <li className="flex justify-between border-t border-line pt-2 text-base font-semibold">
                <span>Összesen ({quantity} db)</span>
                <span>{formatHuf(quote.totalHuf)}</span>
              </li>
              <li className="text-xs text-muted">Becsült öltésszám: ~{quote.estimatedStitches.toLocaleString("hu-HU")}. Az árak mock szabályok szerint számolt tájékoztató árak.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-semibold">Design mentése</h3>
              <label className="mt-2 block text-sm">
                Név
                <input value={designName} onChange={(e) => setDesignName(e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
              </label>
              {savedCode ? (
                <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
                  Elmentve. Kód: <strong>{savedCode}</strong> ·{" "}
                  <Link href={`/design/?code=${savedCode}`} className="underline">
                    megosztható link
                  </Link>
                </p>
              ) : auth.user ? (
                <button type="button" disabled={saving} onClick={handleSave} className="mt-3 rounded-full border border-foreground px-5 py-2.5 text-sm font-medium hover:bg-foreground hover:text-background disabled:opacity-50">
                  {saving ? "Mentés…" : "Mentés a profilomba"}
                </button>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  A mentéshez{" "}
                  <Link href="/auth/login/?next=/studio/" className="underline">
                    jelentkezz be
                  </Link>{" "}
                  vagy{" "}
                  <Link href="/auth/register/?next=/studio/" className="underline">
                    regisztrálj
                  </Link>
                  . {auth.configured ? "" : "(Supabase nincs konfigurálva.)"}
                </p>
              )}
              {saveError ? (
                <p role="alert" className="mt-2 text-xs text-red-700">
                  {saveError}
                </p>
              ) : null}
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-semibold">Kosár</h3>
              {added ? (
                <p className="mt-2 text-sm">
                  A kosárba került.{" "}
                  <button type="button" onClick={() => router.push("/cart/")} className="underline">
                    Kosár megtekintése
                  </button>
                </p>
              ) : (
                <button type="button" onClick={handleAddToCart} className="mt-3 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground">
                  Kosárba – {formatHuf(quote.totalHuf)}
                </button>
              )}
            </div>
            <button type="button" onClick={() => setStep(4)} className="rounded-full border border-line px-5 py-2.5 text-sm">
              ← Vissza
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Chooser({ label, options, value, onChange }: { label: string; options: { value: string; label: string }[]; value: string | null; onChange: (v: string) => void }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value} onClick={() => onChange(o.value)} className={`rounded-full border px-4 py-1.5 text-sm ${o.value === value ? "border-foreground bg-foreground text-background" : "border-line hover:border-foreground"}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function SizeChartTable({ product, catalog }: { product: ReturnType<typeof useCatalog>["catalog"]["products"][number]; catalog: ReturnType<typeof useCatalog>["catalog"] }) {
  const chart = catalog.sizeCharts.find((s) => s.id === product.sizeChartId);
  if (!chart) return null;
  const labels: Record<string, string> = { chest: "Mellbőség", length: "Hossz", shoulder: "Váll", sleeve: "Ujj", waist: "Derék", hip: "Csípő" };
  return (
    <details className="mt-5 rounded-xl border border-line p-3 text-xs">
      <summary className="cursor-pointer font-semibold">Mérettáblázat · {chart.name}</summary>
      <table className="mt-2 w-full">
        <thead>
          <tr className="text-left text-muted">
            <th className="py-1 font-medium">Méret</th>
            {chart.measurementKeys.map((k) => (
              <th key={k} className="py-1 font-medium">
                {labels[k] ?? k} (cm)
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.entries
            .filter((e) => product.sizeCodes.includes(e.sizeCode))
            .map((e) => (
              <tr key={e.sizeCode} className="border-t border-line">
                <td className="py-1 font-semibold">{e.sizeCode}</td>
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
  );
}
