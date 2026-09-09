"use client";

import type { CustomizationZone } from "@/lib/catalog/types";
import type { PlacementTransform } from "@/lib/customizer/geometry";
import type { DesignSource } from "@/lib/customizer/upload";
import type { StoredPlacement } from "@/lib/store/design-session";
import { formatSizeCm } from "@/lib/utils/format";

interface Props {
  placement: StoredPlacement;
  zone: CustomizationZone;
  source: DesignSource | undefined;
  onChange: (patch: Partial<PlacementTransform>) => void;
  onDelete: () => void;
  onReplace: () => void;
  onEmbroidery: (on: boolean) => void;
}

export function PlacementControls({ placement, zone, source, onChange, onDelete, onReplace, onEmbroidery }: Props) {
  const aspect = placement.widthCm / placement.heightCm || 1;
  const maxW = Math.min(zone.maxWidthCm, zone.maxHeightCm * aspect, zone.rectCm.w);
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{source?.name ?? "Minta"}</p>
          <p className="text-xs text-muted">
            {zone.displayName} · <strong className="text-foreground">{formatSizeCm(placement.widthCm, placement.heightCm)}</strong>
          </p>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={onReplace} className="rounded-full border border-line px-3 py-1 text-xs hover:border-foreground">
            Csere
          </button>
          <button type="button" onClick={onDelete} className="rounded-full border border-line px-3 py-1 text-xs text-red-700 hover:border-red-700">
            Törlés
          </button>
        </div>
      </div>
      <label className="mt-4 block text-xs font-medium">
        Szélesség: {placement.widthCm.toFixed(1).replace(".", ",")} cm <span className="text-muted">(min {zone.minWidthCm}, max {maxW.toFixed(1).replace(".", ",")})</span>
        <input type="range" min={zone.minWidthCm} max={maxW} step={0.1} value={Math.min(placement.widthCm, maxW)} onChange={(e) => onChange({ widthCm: Number(e.target.value), heightCm: Number(e.target.value) / aspect })} className="mt-1 w-full accent-[var(--accent)]" />
      </label>
      <label className="mt-3 block text-xs font-medium">
        Forgatás: {Math.round(placement.rotationDeg)}°
        <input type="range" min={-180} max={180} step={1} value={placement.rotationDeg} onChange={(e) => onChange({ rotationDeg: Number(e.target.value) })} className="mt-1 w-full accent-[var(--accent)]" />
      </label>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <button type="button" onClick={() => onChange({ rotationDeg: 0 })} className="rounded-full border border-line px-3 py-1 hover:border-foreground">
          Egyenes
        </button>
        <button type="button" onClick={() => onChange({ xCm: zone.rectCm.x + zone.rectCm.w / 2, yCm: zone.rectCm.y + zone.rectCm.h / 2 })} className="rounded-full border border-line px-3 py-1 hover:border-foreground">
          Középre
        </button>
        <label className="ml-auto flex items-center gap-2">
          <input type="checkbox" checked={placement.embroidery} onChange={(e) => onEmbroidery(e.target.checked)} /> Hímzés-effekt
        </label>
      </div>
      {source?.warnings.length ? (
        <ul className="mt-3 space-y-1">
          {source.warnings.map((w) => (
            <li key={w} className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {w}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
