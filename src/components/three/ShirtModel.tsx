"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { asset } from "@/lib/asset-url";
import type { PanelChart } from "@/lib/catalog/types";
import { composeChartNormalMap, composeChartTexture, type DesignPlacement } from "@/lib/customizer/texture-composer";

export const TSHIRT_MODEL_PATH = "/models/tshirt.glb";

/** A generált póló chartjai (megegyezik a garment_models seed adattal). */
export const TSHIRT_CHARTS: PanelChart[] = [
  { key: "torso", meshName: "Torso", widthCm: 108, heightCm: 72 },
  { key: "left_sleeve", meshName: "SleeveL", widthCm: 36, heightCm: 22 },
  { key: "right_sleeve", meshName: "SleeveR", widthCm: 36, heightCm: 22 },
];

export interface ShirtModelProps {
  color?: string;
  placements?: DesignPlacement[];
  charts?: PanelChart[];
  modelPath?: string;
  embroidery?: boolean;
  /** textúra felbontás (px/cm). 2048 px széles torzó = ~19 px/cm */
  pxPerCm?: number;
  fabric?: boolean;
  castShadow?: boolean;
}

interface ChartTextures {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  mapCanvas: HTMLCanvasElement;
  normalCanvas: HTMLCanvasElement;
}

function darken(hex: string, amount: number): string {
  const c = new THREE.Color(hex);
  c.multiplyScalar(1 - amount);
  return `#${c.getHexString()}`;
}

function placementsKey(placements: DesignPlacement[]): string {
  return placements
    .map(
      (p) =>
        `${p.id}:${p.chartKey}:${p.xCm.toFixed(2)}:${p.yCm.toFixed(2)}:${p.widthCm.toFixed(2)}:${p.heightCm.toFixed(2)}:${p.rotationDeg.toFixed(1)}:${p.image ? 1 : 0}:${p.embroidery ? 1 : 0}`,
    )
    .join("|");
}

function createTextures(charts: PanelChart[], maxAnisotropy: number): Record<string, ChartTextures> {
  const out: Record<string, ChartTextures> = {};
  for (const chart of charts) {
    const mapCanvas = document.createElement("canvas");
    const normalCanvas = document.createElement("canvas");
    const map = new THREE.CanvasTexture(mapCanvas);
    map.flipY = false; // glTF UV konvenció: v=0 a kép teteje
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = Math.min(8, maxAnisotropy);
    map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
    const normalMap = new THREE.CanvasTexture(normalCanvas);
    normalMap.flipY = false;
    normalMap.wrapS = normalMap.wrapT = THREE.ClampToEdgeWrapping;
    out[chart.key] = { map, normalMap, mapCanvas, normalCanvas };
  }
  return out;
}

/**
 * A GLB póló mesh-ei, panelenként canvas-textúrával (UV compositing).
 * A geometriák megosztottak (useGLTF cache), az anyagok példányonként készülnek.
 * A textúrák ref-ekben élnek és effectekben frissülnek (React Compiler-kompatibilis).
 */
export function ShirtModel({
  color = "#F4F2EC",
  placements = [],
  charts = TSHIRT_CHARTS,
  modelPath = TSHIRT_MODEL_PATH,
  embroidery = true,
  pxPerCm = 18,
  fabric = true,
  castShadow = true,
}: ShirtModelProps) {
  const { nodes } = useGLTF(asset(modelPath)) as unknown as { nodes: Record<string, THREE.Mesh> };
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);

  const texturesRef = useRef<Record<string, ChartTextures>>({});
  const materialRefs = useRef<Record<string, THREE.MeshStandardMaterial | null>>({});

  // Textúra objektumok létrehozása / felszabadítása
  useEffect(() => {
    const created = createTextures(charts, gl.capabilities.getMaxAnisotropy());
    texturesRef.current = created;
    return () => {
      for (const t of Object.values(created)) {
        t.map.dispose();
        t.normalMap.dispose();
      }
      texturesRef.current = {};
    };
  }, [charts, gl]);

  const key = placementsKey(placements);

  // Kompozíció: alapszín + szövet + designok (+ hímzés normal map)
  useEffect(() => {
    for (const chart of charts) {
      const t = texturesRef.current[chart.key];
      const material = materialRefs.current[chart.key];
      if (!t || !material) continue;
      composeChartTexture(t.mapCanvas, chart, { baseColor: color, placements, pxPerCm, fabric, embroidery });
      t.map.needsUpdate = true;
      const drew = composeChartNormalMap(t.normalCanvas, chart, { baseColor: color, placements, pxPerCm, embroidery });
      t.normalMap.needsUpdate = true;
      material.map = t.map;
      material.normalMap = embroidery && drew ? t.normalMap : null;
      material.needsUpdate = true;
    }
    invalidate();
    // A placements tömb tartalmát a `key` reprezentálja (stabil összehasonlítás).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, key, embroidery, pxPerCm, fabric, charts, invalidate]);

  const collarColor = darken(color, 0.08);

  return (
    <group position={[0, -0.36, 0]}>
      {charts.map((chart) => {
        const node = nodes[chart.meshName];
        if (!node) return null;
        return (
          <mesh key={chart.key} geometry={node.geometry} castShadow={castShadow} receiveShadow>
            <meshStandardMaterial
              ref={(m) => {
                materialRefs.current[chart.key] = m;
              }}
              color="#ffffff"
              normalScale={new THREE.Vector2(0.6, 0.6)}
              roughness={0.92}
              metalness={0}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
      {nodes.Collar ? (
        <mesh geometry={nodes.Collar.geometry} castShadow={castShadow} receiveShadow>
          <meshStandardMaterial color={collarColor} roughness={0.95} metalness={0} side={THREE.DoubleSide} />
        </mesh>
      ) : null}
    </group>
  );
}

export function preloadShirtModel(modelPath = TSHIRT_MODEL_PATH) {
  useGLTF.preload(asset(modelPath));
}
