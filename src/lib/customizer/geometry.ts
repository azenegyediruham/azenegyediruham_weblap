import type { CustomizationZone, RectCm } from "@/lib/catalog/types";
import { rotatedBounds } from "./texture-composer";

export interface PlacementTransform {
  xCm: number;
  yCm: number;
  widthCm: number;
  heightCm: number;
  rotationDeg: number;
}

export function zoneCenter(zone: Pick<CustomizationZone, "rectCm">): { x: number; y: number } {
  return { x: zone.rectCm.x + zone.rectCm.w / 2, y: zone.rectCm.y + zone.rectCm.h / 2 };
}

/** A design méretének korlátozása a zóna szabályaihoz (min/max szélesség, max magasság), arány megtartásával. */
export function clampSize(widthCm: number, aspect: number, zone: Pick<CustomizationZone, "rectCm" | "minWidthCm" | "maxWidthCm" | "maxHeightCm">): { widthCm: number; heightCm: number } {
  const safeAspect = aspect > 0 ? aspect : 1; // width / height
  let w = Math.max(zone.minWidthCm, Math.min(zone.maxWidthCm, zone.rectCm.w, widthCm));
  let h = w / safeAspect;
  const maxH = Math.min(zone.maxHeightCm, zone.rectCm.h);
  if (h > maxH) {
    h = maxH;
    w = h * safeAspect;
  }
  if (w < zone.minWidthCm) {
    // ha a magasságkorlát a minimum alá szorítaná, a minimum szélességet tartjuk
    w = Math.min(zone.minWidthCm, zone.rectCm.w);
    h = w / safeAspect;
  }
  return { widthCm: round2(w), heightCm: round2(h) };
}

/** A forgatott befoglaló téglalap a zónán belül maradjon: a középpontot toljuk vissza. */
export function clampPosition(t: PlacementTransform, zone: Pick<CustomizationZone, "rectCm">): { xCm: number; yCm: number } {
  const b = rotatedBounds(t);
  const r = zone.rectCm;
  let x = t.xCm;
  let y = t.yCm;
  if (b.w >= r.w) x = r.x + r.w / 2;
  else {
    if (b.x < r.x) x += r.x - b.x;
    if (b.x + b.w > r.x + r.w) x -= b.x + b.w - (r.x + r.w);
  }
  if (b.h >= r.h) y = r.y + r.h / 2;
  else {
    if (b.y < r.y) y += r.y - b.y;
    if (b.y + b.h > r.y + r.h) y -= b.y + b.h - (r.y + r.h);
  }
  return { xCm: round2(x), yCm: round2(y) };
}

/** Teljes normalizálás: méret + pozíció + forgatás normalizálva. */
export function constrainToZone(t: PlacementTransform, zone: Pick<CustomizationZone, "rectCm" | "minWidthCm" | "maxWidthCm" | "maxHeightCm">): PlacementTransform {
  const aspect = t.heightCm > 0 ? t.widthCm / t.heightCm : 1;
  const size = clampSize(t.widthCm, aspect, zone);
  const rotationDeg = normalizeDeg(t.rotationDeg);
  // ha elforgatva nem fér a zónába, kicsinyítjük, amíg befér
  let { widthCm, heightCm } = size;
  for (let i = 0; i < 40; i++) {
    const b = rotatedBounds({ xCm: t.xCm, yCm: t.yCm, widthCm, heightCm, rotationDeg });
    if (b.w <= zone.rectCm.w + 1e-6 && b.h <= zone.rectCm.h + 1e-6) break;
    widthCm *= 0.96;
    heightCm *= 0.96;
  }
  widthCm = round2(widthCm);
  heightCm = round2(heightCm);
  const pos = clampPosition({ ...t, widthCm, heightCm, rotationDeg }, zone);
  return { ...pos, widthCm, heightCm, rotationDeg };
}

export function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d > 180) d -= 360;
  if (d <= -180) d += 360;
  return round1(d);
}

/** A zóna kezdeti (alapértelmezett) elhelyezése egy adott képaránnyal: középre, a zóna 70%-ára. */
export function initialPlacement(zone: CustomizationZone, aspect: number): PlacementTransform {
  const c = zoneCenter(zone);
  const size = clampSize(zone.rectCm.w * 0.7, aspect, zone);
  return { xCm: c.x, yCm: c.y, ...size, rotationDeg: 0 };
}

export function rectContains(outer: RectCm, inner: RectCm): boolean {
  // 0,02 cm tolerancia (kerekítés miatt) – fizikailag elhanyagolható
  const eps = 0.02;
  return inner.x >= outer.x - eps && inner.y >= outer.y - eps && inner.x + inner.w <= outer.x + outer.w + eps && inner.y + inner.h <= outer.y + outer.h + eps;
}

/** cm -> px konverzió egy nézet-kivágás (crop) és skála alapján. */
export function cmToPx(cm: number, pxPerCm: number): number {
  return cm * pxPerCm;
}

export function pxToCm(px: number, pxPerCm: number): number {
  return pxPerCm > 0 ? px / pxPerCm : 0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
