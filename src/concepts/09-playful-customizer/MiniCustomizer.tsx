"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShirtViewerLazy } from "@/components/three/ShirtViewerLazy";
import { colors, designAssets, tshirtZones } from "@/data/mock-catalog";
import { asset } from "@/lib/asset-url";
import { constrainToZone, initialPlacement, type PlacementTransform } from "@/lib/customizer/geometry";
import { loadImage } from "@/lib/customizer/svg";
import type { DesignPlacement } from "@/lib/customizer/texture-composer";
import { formatSizeCm } from "@/lib/utils/format";

const ZONE = tshirtZones.find((z) => z.key === "front_center")!;
/** Póló eleje cm-koordinátákban (a torzó chart 0–54 × 0–72 tartománya + ujjak). */
const TSHIRT_FRONT_PATH = "M18 0 Q27 7 36 0 L50 1 L66 9 L62 24 L54 21 L54 72 L0 72 L0 21 L-8 24 L-12 9 L4 1 Z";

interface Props {
  className?: string;
}

/**
 * Mini customizer a hero-ba: színválasztó, minta kiválasztása, drag a zónán belül,
 * méret/forgatás csúszkák valós cm-ben, 3D előnézet ugyanazzal az elhelyezéssel.
 */
export function MiniCustomizer({ className }: Props) {
  const [colorSlug, setColorSlug] = useState("tortfeher");
  const [assetSlug, setAssetSlug] = useState("sun-wave");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [placement, setPlacement] = useState<PlacementTransform>(() => initialPlacement(ZONE, 1.25));
  const [mode, setMode] = useState<"2d" | "3d">("2d");
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origin: PlacementTransform } | null>(null);

  const color = colors.find((c) => c.slug === colorSlug) ?? colors[0];
  const design = designAssets.find((a) => a.slug === assetSlug) ?? designAssets[0];

  useEffect(() => {
    let cancelled = false;
    loadImage(asset(design.url)).then((img) => {
      if (cancelled) return;
      setImage(img);
      const aspect = img.naturalWidth / img.naturalHeight || 1;
      setPlacement((p) => constrainToZone({ ...p, heightCm: p.widthCm / aspect }, ZONE));
    });
    return () => {
      cancelled = true;
    };
  }, [design.url]);

  const aspect = image ? image.naturalWidth / image.naturalHeight || 1 : placement.widthCm / placement.heightCm;

  const toCm = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }, []);

  const onPointerDown = (e: React.PointerEvent<SVGGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toCm(e.clientX, e.clientY);
    dragRef.current = { startX: p.x, startY: p.y, origin: placement };
  };
  const onPointerMove = (e: React.PointerEvent<SVGGElement>) => {
    if (!dragRef.current) return;
    const p = toCm(e.clientX, e.clientY);
    const { startX, startY, origin } = dragRef.current;
    setPlacement(constrainToZone({ ...origin, xCm: origin.xCm + (p.x - startX), yCm: origin.yCm + (p.y - startY) }, ZONE));
  };
  const onPointerUp = (e: React.PointerEvent<SVGGElement>) => {
    dragRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const setWidth = (w: number) => setPlacement((p) => constrainToZone({ ...p, widthCm: w, heightCm: w / aspect }, ZONE));
  const setRotation = (deg: number) => setPlacement((p) => constrainToZone({ ...p, rotationDeg: deg }, ZONE));

  const placements: DesignPlacement[] = useMemo(
    () =>
      image
        ? [{ id: "mini", chartKey: "torso", zoneKey: ZONE.key, image, xCm: placement.xCm, yCm: placement.yCm, widthCm: placement.widthCm, heightCm: placement.heightCm, rotationDeg: placement.rotationDeg, embroidery: true }]
        : [],
    [image, placement],
  );

  const onKey = (e: React.KeyboardEvent<SVGGElement>) => {
    const step = e.shiftKey ? 1 : 0.25;
    const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const d = map[e.key];
    if (!d) return;
    e.preventDefault();
    setPlacement((p) => constrainToZone({ ...p, xCm: p.xCm + d[0], yCm: p.yCm + d[1] }, ZONE));
  };

  return (
    <div className={`grid gap-6 lg:grid-cols-[1.1fr_1fr] ${className ?? ""}`}>
      <div className="c09-panel relative overflow-hidden rounded-[32px] bg-white p-4">
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex gap-1 rounded-full bg-[var(--c09-bg)] p-1" role="tablist" aria-label="Nézet">
            {(["2d", "3d"] as const).map((m) => (
              <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${mode === m ? "bg-[var(--c09-ink)] text-white" : "text-[var(--c09-ink)]/70 hover:text-[var(--c09-ink)]"}`}>
                {m === "2d" ? "Szerkesztés" : "3D nézet"}
              </button>
            ))}
          </div>
          <motion.p key={formatSizeCm(placement.widthCm, placement.heightCm)} initial={{ scale: 0.9, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="rounded-full bg-[var(--c09-teal)]/15 px-3 py-1 text-[13px] font-semibold text-[var(--c09-teal)]">
            {formatSizeCm(placement.widthCm, placement.heightCm)}
          </motion.p>
        </div>
        <div className="relative mt-3 aspect-[4/5] w-full">
          {mode === "2d" ? (
            <svg ref={svgRef} viewBox="-16 -6 86 84" className="h-full w-full touch-none select-none" role="application" aria-label="Minta elhelyezése a pólón">
              <path d={TSHIRT_FRONT_PATH} fill={color.hex} stroke="rgba(0,0,0,0.25)" strokeWidth="0.35" strokeLinejoin="round" />
              <path d="M18 0 Q27 9 36 0" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.35" />
              <rect x={ZONE.rectCm.x} y={ZONE.rectCm.y} width={ZONE.rectCm.w} height={ZONE.rectCm.h} fill="none" stroke="var(--c09-teal)" strokeWidth="0.35" strokeDasharray="1.2 0.8" rx="0.6" />
              <text x={ZONE.rectCm.x} y={ZONE.rectCm.y - 1.2} fontSize="1.8" fill="var(--c09-teal)" fontFamily="inherit" fontWeight="600">
                {ZONE.displayName} · max {ZONE.maxWidthCm} × {ZONE.maxHeightCm} cm
              </text>
              {image ? (
                <g
                  tabIndex={0}
                  role="img"
                  aria-label={`${design.name}, húzással mozgatható`}
                  transform={`translate(${placement.xCm} ${placement.yCm}) rotate(${placement.rotationDeg})`}
                  className="cursor-grab outline-none focus-visible:[&>rect]:stroke-[var(--c09-coral)] active:cursor-grabbing"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  onKeyDown={onKey}
                >
                  <rect x={-placement.widthCm / 2 - 0.6} y={-placement.heightCm / 2 - 0.6} width={placement.widthCm + 1.2} height={placement.heightCm + 1.2} fill="transparent" stroke="var(--c09-coral)" strokeWidth="0.3" strokeDasharray="0.8 0.6" />
                  <image href={asset(design.url)} x={-placement.widthCm / 2} y={-placement.heightCm / 2} width={placement.widthCm} height={placement.heightCm} preserveAspectRatio="xMidYMid meet" style={{ filter: "drop-shadow(0 0.2px 0.3px rgba(0,0,0,0.35))" }} />
                  {[-1, 1].map((sx) =>
                    [-1, 1].map((sy) => <circle key={`${sx}${sy}`} cx={(sx * placement.widthCm) / 2} cy={(sy * placement.heightCm) / 2} r="0.9" fill="white" stroke="var(--c09-coral)" strokeWidth="0.3" />),
                  )}
                </g>
              ) : null}
            </svg>
          ) : (
            <ShirtViewerLazy color={color.hex} placements={placements} embroidery className="h-full w-full" hint zoom autoRotate={false} />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="c09-panel rounded-[28px] bg-white p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--c09-ink)]/60">1 · Szín</p>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Póló színe">
            {colors.map((c) => (
              <motion.button
                key={c.slug}
                type="button"
                role="radio"
                aria-checked={c.slug === colorSlug}
                aria-label={c.name}
                onClick={() => setColorSlug(c.slug)}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                className={`h-9 w-9 rounded-full border-2 ${c.slug === colorSlug ? "border-[var(--c09-coral)] ring-4 ring-[var(--c09-coral)]/20" : "border-black/10"}`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
        <div className="c09-panel rounded-[28px] bg-white p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--c09-ink)]/60">2 · Add your design</p>
          <div className="mt-3 grid grid-cols-6 gap-2" role="radiogroup" aria-label="Minta">
            {designAssets.map((a) => (
              <motion.button
                key={a.slug}
                type="button"
                role="radio"
                aria-checked={a.slug === assetSlug}
                aria-label={a.name}
                onClick={() => setAssetSlug(a.slug)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.92 }}
                className={`aspect-square rounded-2xl border-2 bg-[var(--c09-bg)] p-2 ${a.slug === assetSlug ? "border-[var(--c09-coral)]" : "border-transparent"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(a.url)} alt="" className="h-full w-full object-contain" />
              </motion.button>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-[var(--c09-ink)]/60">Saját fájl (PNG, JPG, SVG) feltöltése a Design Studióban.</p>
        </div>
        <div className="c09-panel rounded-[28px] bg-white p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--c09-ink)]/60">3 · Méret és forgatás</p>
          <label className="mt-3 block text-[13px] font-medium">
            Szélesség: {placement.widthCm.toFixed(1).replace(".", ",")} cm
            <input type="range" min={ZONE.minWidthCm} max={ZONE.maxWidthCm} step={0.5} value={placement.widthCm} onChange={(e) => setWidth(Number(e.target.value))} className="c09-range mt-2 w-full" />
          </label>
          <label className="mt-4 block text-[13px] font-medium">
            Forgatás: {Math.round(placement.rotationDeg)}°
            <input type="range" min={-45} max={45} step={1} value={placement.rotationDeg} onChange={(e) => setRotation(Number(e.target.value))} className="c09-range mt-2 w-full" />
          </label>
          <p className="mt-3 text-[12px] text-[var(--c09-ink)]/60">Húzd a mintát a pólón – nem tud kimenni a zónából. Nyilakkal is mozgatható.</p>
        </div>
      </div>
    </div>
  );
}
