"use client";

import { useState } from "react";
import { ShirtViewerLazy } from "@/components/three/ShirtViewerLazy";
import { colors } from "@/data/mock-catalog";

const HUD = [
  { label: "MATERIAL", value: "240 g/m² · fésült pamut", pos: "left-4 top-6 md:left-8 md:top-10" },
  { label: "ZONE", value: "front_center · max 28 × 34 cm", pos: "left-4 bottom-6 md:left-8 md:bottom-10" },
  { label: "PREVIEW", value: "3D · valós méret", pos: "right-4 top-6 md:right-8 md:top-10 text-right" },
  { label: "LEAD TIME", value: "5–10 munkanap", pos: "right-4 bottom-6 md:right-8 md:bottom-10 text-right" },
];

/** Interaktív "fényszínpad": anyag/szín váltó + HUD-szerű specifikációk a 3D modell körül. */
export function MaterialStage() {
  const [color, setColor] = useState(colors[2]);
  return (
    <div className="relative">
      <div className="c05-stage relative aspect-[4/5] w-full overflow-hidden rounded-[28px] sm:aspect-[16/11]">
        <div className="c05-stage-floor" aria-hidden />
        <div className="c05-stage-lines" aria-hidden />
        <ShirtViewerLazy color={color.hex} className="absolute inset-0 h-full w-full" hint={false} lightIntensity={1.15} keyLightColor="#eef0ff" zoom={false} />
        {HUD.map((h) => (
          <div key={h.label} className={`pointer-events-none absolute ${h.pos} c05-mono text-[10px] uppercase tracking-[0.25em] text-[var(--c05-fg)]/50`}>
            <span className="text-[var(--c05-accent)]">{h.label}</span>
            <br />
            <span className="text-[var(--c05-fg)]/80">{h.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Anyag színe">
          {colors.map((c) => {
            const active = c.slug === color.slug;
            return (
              <button
                key={c.slug}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={c.name}
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full border transition ${active ? "scale-110 border-[var(--c05-accent)] ring-2 ring-[var(--c05-accent)]/30" : "border-white/15 hover:border-white/50"}`}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
        <p className="c05-mono text-[11px] uppercase tracking-[0.25em] text-[var(--c05-fg)]/60">
          {color.name} · {color.hex}
        </p>
      </div>
    </div>
  );
}
