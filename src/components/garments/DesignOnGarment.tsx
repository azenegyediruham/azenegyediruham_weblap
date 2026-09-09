import { GarmentSilhouette } from "./GarmentSilhouette";
import { asset } from "@/lib/asset-url";
import type { SilhouetteKey } from "@/lib/catalog/types";

type Position = "front_center" | "front_chest_left" | "front_chest_right" | "back_center" | "upper_back" | "left_sleeve" | "right_sleeve";

/** A sziluett 200×240-es koordinátarendszerében a zónák középpontja (px). */
const ANCHORS: Record<SilhouetteKey, Partial<Record<Position, [number, number]>>> = {
  tshirt: { front_center: [100, 124], front_chest_left: [124, 84], front_chest_right: [76, 84], back_center: [100, 124], upper_back: [100, 60], left_sleeve: [176, 72], right_sleeve: [24, 72] },
  hoodie: { front_center: [100, 120], front_chest_left: [126, 92], front_chest_right: [74, 92], back_center: [100, 124], upper_back: [100, 64] },
  sweatshirt: { front_center: [100, 122], front_chest_left: [126, 88], front_chest_right: [74, 88], back_center: [100, 124] },
  tank: { front_center: [100, 130], front_chest_left: [118, 96], front_chest_right: [82, 96], back_center: [100, 130] },
  shorts: { front_center: [64, 100], front_chest_left: [64, 100], front_chest_right: [136, 100] },
  pants: { front_center: [68, 120], front_chest_left: [68, 120], front_chest_right: [132, 120] },
  dress: { front_center: [100, 120], front_chest_left: [120, 76], front_chest_right: [80, 76], back_center: [100, 130] },
  skirt: { front_center: [100, 140], front_chest_left: [130, 110], front_chest_right: [70, 110] },
};

const PX_PER_CM = 2.2;

interface DesignOnGarmentProps {
  kind: SilhouetteKey;
  color: string;
  designUrl: string;
  position?: Position;
  widthCm?: number;
  heightCm?: number;
  rotationDeg?: number;
  /** hímzés-szerű megjelenés (öltés-textúra + árnyék) */
  stitched?: boolean;
  className?: string;
  title?: string;
  lineColor?: string;
}

/**
 * 2D illusztráció: ruha-sziluett + design a megadott zónában (közelítő cm-skálával).
 * Galéria, koncepció oldalak, termékkártyák placeholder-vizualizációja.
 */
export function DesignOnGarment({
  kind,
  color,
  designUrl,
  position = "front_center",
  widthCm = 12,
  heightCm = 12,
  rotationDeg = 0,
  stitched = true,
  className,
  title,
  lineColor,
}: DesignOnGarmentProps) {
  const anchor = ANCHORS[kind]?.[position] ?? ANCHORS[kind]?.front_center ?? [100, 120];
  const w = widthCm * PX_PER_CM;
  const h = heightCm * PX_PER_CM;
  const filterId = `stitch-${kind}-${position}`;
  return (
    <svg viewBox="0 0 200 240" className={className} role={title ? "img" : "presentation"} aria-label={title}>
      {title ? <title>{title}</title> : null}
      <defs>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="warped" />
          <feDropShadow dx="0.4" dy="0.7" stdDeviation="0.5" floodOpacity="0.35" />
        </filter>
      </defs>
      <GarmentSilhouetteInline kind={kind} color={color} lineColor={lineColor} />
      <g transform={`translate(${anchor[0]} ${anchor[1]}) rotate(${rotationDeg})`} filter={stitched ? `url(#${filterId})` : undefined}>
        <image href={asset(designUrl)} x={-w / 2} y={-h / 2} width={w} height={h} preserveAspectRatio="xMidYMid meet" />
      </g>
    </svg>
  );
}

function GarmentSilhouetteInline({ kind, color, lineColor }: { kind: SilhouetteKey; color: string; lineColor?: string }) {
  // a GarmentSilhouette svg-t beágyazzuk (nested svg), hogy egy koordinátarendszerben legyünk
  return <GarmentSilhouette kind={kind} color={color} lineColor={lineColor} x="0" y="0" width="200" height="240" />;
}
