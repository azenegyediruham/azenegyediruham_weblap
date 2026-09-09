import type { CustomizationZone, GarmentView } from "@/lib/catalog/types";

interface ZoneSchematicProps {
  view: GarmentView;
  zones: CustomizationZone[];
  ink?: string;
  accent?: string;
  className?: string;
}

/**
 * Műszaki rajz: a nézet (chart-kivágás) cm-hálója és a hímzési zónák méretarányosan,
 * közvetlenül az adatmodellből. Minden szám cm.
 */
export function ZoneSchematic({ view, zones, ink = "#1A1A1A", accent = "#FF5A1F", className }: ZoneSchematicProps) {
  const { crop } = view;
  const pad = 8;
  const W = crop.w + pad * 2;
  const H = crop.h + pad * 2;
  const visible = zones.filter((z) => z.viewKey === view.key && z.isActive);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={`${view.label} nézet hímzési zónái`}>
      <defs>
        <pattern id={`grid-${view.key}`} width="2" height="2" patternUnits="userSpaceOnUse">
          <path d="M2 0H0V2" fill="none" stroke={ink} strokeOpacity="0.12" strokeWidth="0.08" />
        </pattern>
      </defs>
      <rect x={pad} y={pad} width={crop.w} height={crop.h} fill={`url(#grid-${view.key})`} stroke={ink} strokeWidth="0.25" />
      {/* méretvonalak */}
      <line x1={pad} y1={pad - 3} x2={pad + crop.w} y2={pad - 3} stroke={ink} strokeWidth="0.2" />
      <text x={pad + crop.w / 2} y={pad - 4} textAnchor="middle" fontSize="2.4" fontFamily="monospace" fill={ink}>
        {crop.w} cm
      </text>
      <line x1={pad - 3} y1={pad} x2={pad - 3} y2={pad + crop.h} stroke={ink} strokeWidth="0.2" />
      <text x={pad - 4} y={pad + crop.h / 2} textAnchor="middle" fontSize="2.4" fontFamily="monospace" fill={ink} transform={`rotate(-90 ${pad - 4} ${pad + crop.h / 2})`}>
        {crop.h} cm
      </text>
      {visible.map((z) => {
        const x = pad + (z.rectCm.x - crop.x);
        const y = pad + (z.rectCm.y - crop.y);
        return (
          <g key={z.key}>
            <rect x={x} y={y} width={z.rectCm.w} height={z.rectCm.h} fill={accent} fillOpacity="0.1" stroke={accent} strokeWidth="0.3" strokeDasharray="1 0.6" />
            <text x={x + 0.8} y={y + 2.6} fontSize="2" fontFamily="monospace" fill={ink}>
              {z.key}
            </text>
            <text x={x + 0.8} y={y + 5} fontSize="1.8" fontFamily="monospace" fill={ink} fillOpacity="0.7">
              max {z.maxWidthCm}×{z.maxHeightCm}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
