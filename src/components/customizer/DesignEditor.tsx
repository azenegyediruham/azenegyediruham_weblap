"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useGesture } from "@use-gesture/react";
import type { CustomizationZone, GarmentView, SilhouetteKey } from "@/lib/catalog/types";
import { garmentOutline } from "@/lib/customizer/garment-outlines";
import type { PlacementTransform } from "@/lib/customizer/geometry";
import type { DesignSource } from "@/lib/customizer/upload";
import type { StoredPlacement } from "@/lib/store/design-session";
import { formatSizeCm } from "@/lib/utils/format";

export interface DesignEditorProps {
  view: GarmentView;
  silhouette: SilhouetteKey;
  color: string;
  zones: CustomizationZone[];
  placements: StoredPlacement[];
  sources: Record<string, DesignSource>;
  selectedZoneKey: string | null;
  selectedPlacementId: string | null;
  onSelectZone: (key: string) => void;
  onSelectPlacement: (id: string | null) => void;
  onChange: (id: string, patch: Partial<PlacementTransform>, zone: CustomizationZone) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
  className?: string;
}

/**
 * 2D szerkesztő: SVG cm-koordinátákban (a nézet kivágása = chart tér).
 * Drag (egér/touch), sarok-skálázás, forgatás-fogantyú, pinch (zoom+forgatás),
 * kerék (méret), billentyűzet (nyilak, +/-, [ ], Delete). A zónán kívülre nem vihető.
 */
export function DesignEditor({ view, silhouette, color, zones, placements, sources, selectedZoneKey, selectedPlacementId, onSelectZone, onSelectPlacement, onChange, onDelete, readOnly = false, className }: DesignEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const outline = garmentOutline(silhouette, view);
  const { bounds } = outline;
  const viewZones = zones.filter((z) => z.viewKey === view.key && z.isActive);
  const viewPlacements = placements.filter((p) => p.viewKey === view.key);
  const selected = viewPlacements.find((p) => p.id === selectedPlacementId) ?? null;
  const selectedZone = selected ? zones.find((z) => z.key === selected.zoneKey) ?? null : null;

  // px -> cm skála (a viewBox szélessége / a rajzolt szélesség)
  const pxPerCm = () => {
    const svg = svgRef.current;
    if (!svg) return 10;
    return svg.getBoundingClientRect().width / bounds.w;
  };

  const toCm = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };

  // --- drag + pinch a kijelölt designon (use-gesture) ---
  const designRef = useRef<SVGGElement>(null);
  const gestureOrigin = useRef<PlacementTransform | null>(null);
  useGesture(
    {
      onDragStart: () => {
        if (selected) gestureOrigin.current = { ...selected };
      },
      onDrag: ({ movement: [mx, my], pinching, cancel }) => {
        if (readOnly || !selected || !selectedZone || !gestureOrigin.current) return;
        if (pinching) return cancel();
        const s = pxPerCm();
        onChange(selected.id, { xCm: gestureOrigin.current.xCm + mx / s, yCm: gestureOrigin.current.yCm + my / s }, selectedZone);
      },
      onPinchStart: () => {
        if (selected) gestureOrigin.current = { ...selected };
      },
      onPinch: ({ offset: [scale, angle] }) => {
        if (readOnly || !selected || !selectedZone || !gestureOrigin.current) return;
        const o = gestureOrigin.current;
        const aspect = o.widthCm / o.heightCm || 1;
        const w = o.widthCm * scale;
        onChange(selected.id, { widthCm: w, heightCm: w / aspect, rotationDeg: o.rotationDeg + angle }, selectedZone);
      },
      onWheel: ({ delta: [, dy], event }) => {
        if (readOnly || !selected || !selectedZone) return;
        event.preventDefault();
        const factor = dy > 0 ? 0.96 : 1.04;
        const aspect = selected.widthCm / selected.heightCm || 1;
        const w = selected.widthCm * factor;
        onChange(selected.id, { widthCm: w, heightCm: w / aspect }, selectedZone);
      },
    },
    {
      target: designRef,
      enabled: !readOnly && Boolean(selected),
      drag: { filterTaps: true, pointer: { touch: true } },
      pinch: { scaleBounds: { min: 0.2, max: 6 }, from: () => [1, 0] },
      eventOptions: { passive: false },
    },
  );

  // --- sarok (skálázás) és forgatás fogantyú: pointer events ---
  const handleRef = useRef<{ kind: "scale" | "rotate"; origin: PlacementTransform } | null>(null);
  const onHandleDown = (kind: "scale" | "rotate") => (e: React.PointerEvent<SVGElement>) => {
    if (readOnly || !selected) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    handleRef.current = { kind, origin: { ...selected } };
  };
  const onHandleMove = (e: React.PointerEvent<SVGElement>) => {
    if (!handleRef.current || !selected || !selectedZone) return;
    const { kind, origin } = handleRef.current;
    const p = toCm(e.clientX, e.clientY);
    const dx = p.x - origin.xCm;
    const dy = p.y - origin.yCm;
    if (kind === "rotate") {
      const deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      onChange(selected.id, { rotationDeg: e.shiftKey ? Math.round(deg / 15) * 15 : deg }, selectedZone);
    } else {
      const rad = (origin.rotationDeg * Math.PI) / 180;
      const lx = dx * Math.cos(rad) + dy * Math.sin(rad);
      const ly = -dx * Math.sin(rad) + dy * Math.cos(rad);
      const aspect = origin.widthCm / origin.heightCm || 1;
      const w = Math.max(Math.abs(lx) * 2, Math.abs(ly) * 2 * aspect);
      onChange(selected.id, { widthCm: w, heightCm: w / aspect }, selectedZone);
    }
  };
  const onHandleUp = (e: React.PointerEvent<SVGElement>) => {
    handleRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* már felszabadítva */
    }
  };

  const onKey = (e: ReactKeyboardEvent<SVGGElement>) => {
    if (readOnly || !selected || !selectedZone) return;
    const step = e.shiftKey ? 1 : 0.25;
    const aspect = selected.widthCm / selected.heightCm || 1;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => onChange(selected.id, { xCm: selected.xCm - step }, selectedZone),
      ArrowRight: () => onChange(selected.id, { xCm: selected.xCm + step }, selectedZone),
      ArrowUp: () => onChange(selected.id, { yCm: selected.yCm - step }, selectedZone),
      ArrowDown: () => onChange(selected.id, { yCm: selected.yCm + step }, selectedZone),
      "+": () => onChange(selected.id, { widthCm: selected.widthCm + 0.5, heightCm: (selected.widthCm + 0.5) / aspect }, selectedZone),
      "-": () => onChange(selected.id, { widthCm: selected.widthCm - 0.5, heightCm: (selected.widthCm - 0.5) / aspect }, selectedZone),
      "[": () => onChange(selected.id, { rotationDeg: selected.rotationDeg - 5 }, selectedZone),
      "]": () => onChange(selected.id, { rotationDeg: selected.rotationDeg + 5 }, selectedZone),
      Delete: () => onDelete(selected.id),
      Backspace: () => onDelete(selected.id),
    };
    const act = actions[e.key];
    if (act) {
      e.preventDefault();
      act();
    }
  };

  // deselect klikk a háttérre
  const [bgDown, setBgDown] = useState(false);
  useEffect(() => {
    if (!bgDown) return;
    const t = window.setTimeout(() => setBgDown(false), 0);
    return () => window.clearTimeout(t);
  }, [bgDown]);

  const handleSize = 1.1; // cm

  return (
    <svg
      ref={svgRef}
      viewBox={`${bounds.x} ${bounds.y} ${bounds.w} ${bounds.h}`}
      className={`touch-none select-none ${className ?? ""}`}
      role="application"
      aria-label={`${view.label} nézet – minta elhelyezése`}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onSelectPlacement(null);
      }}
    >
      <defs>
        <filter id="de-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.15" dy="0.25" stdDeviation="0.25" floodOpacity="0.35" />
        </filter>
        <pattern id="de-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M5 0H0V5" fill="none" stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.15" />
        </pattern>
      </defs>
      <rect x={bounds.x} y={bounds.y} width={bounds.w} height={bounds.h} fill="url(#de-grid)" onPointerDown={() => onSelectPlacement(null)} />
      <path d={outline.body} fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth="0.3" strokeLinejoin="round" onPointerDown={() => onSelectPlacement(null)} />
      {outline.details.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="0.25" />
      ))}

      {viewZones.map((z) => {
        const active = z.key === selectedZoneKey;
        const has = viewPlacements.some((p) => p.zoneKey === z.key);
        return (
          <g key={z.key} className="cursor-pointer" onPointerDown={() => onSelectZone(z.key)}>
            <rect x={z.rectCm.x} y={z.rectCm.y} width={z.rectCm.w} height={z.rectCm.h} rx="0.5" fill={active ? "rgba(43,179,163,0.08)" : "transparent"} stroke={active ? "#2bb3a3" : has ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.22)"} strokeWidth={active ? 0.35 : 0.25} strokeDasharray={active ? "1.2 0.7" : "0.8 0.8"} />
            <text x={z.rectCm.x} y={z.rectCm.y - 0.9} fontSize="1.6" fontWeight="600" fill={active ? "#2bb3a3" : "rgba(0,0,0,0.5)"}>
              {z.rectCm.w >= 20 ? `${z.displayName} · max ${z.maxWidthCm} × ${z.maxHeightCm} cm` : z.displayName}
            </text>
          </g>
        );
      })}

      {viewPlacements.map((p) => {
        const src = sources[p.sourceId];
        const isSel = p.id === selectedPlacementId;
        const hw = p.widthCm / 2;
        const hh = p.heightCm / 2;
        return (
          <g
            key={p.id}
            ref={isSel ? designRef : undefined}
            transform={`translate(${p.xCm} ${p.yCm}) rotate(${p.rotationDeg})`}
            tabIndex={readOnly ? -1 : 0}
            role="img"
            aria-label={`${src?.name ?? "Minta"}, ${formatSizeCm(p.widthCm, p.heightCm)}`}
            className={readOnly ? "" : "cursor-grab outline-none active:cursor-grabbing"}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (!readOnly) {
                onSelectPlacement(p.id);
                onSelectZone(p.zoneKey);
              }
            }}
            onKeyDown={onKey}
          >
            {src?.image ? (
              <image href={src.image.src} x={-hw} y={-hh} width={p.widthCm} height={p.heightCm} preserveAspectRatio="none" filter={p.embroidery ? "url(#de-shadow)" : undefined} style={{ imageRendering: "auto" }} />
            ) : (
              <rect x={-hw} y={-hh} width={p.widthCm} height={p.heightCm} fill="rgba(0,0,0,0.08)" />
            )}
            {isSel && !readOnly ? (
              <>
                <rect x={-hw - 0.4} y={-hh - 0.4} width={p.widthCm + 0.8} height={p.heightCm + 0.8} fill="transparent" stroke="#ff6b4a" strokeWidth="0.25" strokeDasharray="0.9 0.6" />
                {[-1, 1].map((sx) =>
                  [-1, 1].map((sy) => (
                    <rect
                      key={`${sx}${sy}`}
                      x={sx * hw - handleSize / 2}
                      y={sy * hh - handleSize / 2}
                      width={handleSize}
                      height={handleSize}
                      rx="0.2"
                      fill="white"
                      stroke="#ff6b4a"
                      strokeWidth="0.25"
                      className="cursor-nwse-resize"
                      onPointerDown={onHandleDown("scale")}
                      onPointerMove={onHandleMove}
                      onPointerUp={onHandleUp}
                      onPointerCancel={onHandleUp}
                    />
                  )),
                )}
                <line x1="0" y1={-hh - 0.4} x2="0" y2={-hh - 3} stroke="#ff6b4a" strokeWidth="0.2" />
                <circle cx="0" cy={-hh - 3.4} r={handleSize / 2 + 0.1} fill="white" stroke="#ff6b4a" strokeWidth="0.25" className="cursor-crosshair" onPointerDown={onHandleDown("rotate")} onPointerMove={onHandleMove} onPointerUp={onHandleUp} onPointerCancel={onHandleUp} />
                <text x={0} y={hh + 2.6} fontSize="1.7" fontWeight="600" textAnchor="middle" fill="#ff6b4a" transform={`rotate(${-p.rotationDeg} 0 ${hh + 2.6})`} style={{ pointerEvents: "none" }}>
                  {formatSizeCm(p.widthCm, p.heightCm)}
                </text>
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
