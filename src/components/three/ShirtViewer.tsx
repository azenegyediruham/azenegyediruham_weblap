"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useProgress } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { detectCapabilities } from "@/lib/three/capabilities";
import type { DesignPlacement } from "@/lib/customizer/texture-composer";
import type { PanelChart } from "@/lib/catalog/types";
import { ShirtModel, TSHIRT_CHARTS } from "./ShirtModel";

export interface ShirtViewerProps {
  color?: string;
  placements?: DesignPlacement[];
  charts?: PanelChart[];
  modelPath?: string;
  embroidery?: boolean;
  /** automatikus lassú forgás tétlenségnél */
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  /** görgővel/pinch-csel zoomolható */
  zoom?: boolean;
  /** egérrel/touch-csal forgatható */
  interactive?: boolean;
  /** háttér: null = átlátszó */
  background?: string | null;
  /** kamera induló pozíció (m) */
  cameraPosition?: [number, number, number];
  fov?: number;
  className?: string;
  /** kezdeti Y forgatás (rad) – pl. hátsó nézet: Math.PI */
  rotationY?: number;
  /** padló-árnyék */
  contactShadow?: boolean;
  /** környezeti fény erőssége (0.2–1.2) */
  lightIntensity?: number;
  /** kulcsfény színe */
  keyLightColor?: string;
  /** feliratkozás betöltésre */
  onLoaded?: () => void;
  ariaLabel?: string;
  /** a canvas alatti extra tartalom (pl. utasítás) */
  hint?: boolean;
}

function LoadingOverlay({ label }: { label: string }) {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-xs" aria-live="polite">
      <div className="h-px w-32 overflow-hidden bg-current/15">
        <div className="h-full bg-current transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>
      <span className="opacity-70">{label}</span>
    </div>
  );
}

export default function ShirtViewer({
  color = "#F4F2EC",
  placements = [],
  charts = TSHIRT_CHARTS,
  modelPath,
  embroidery = true,
  autoRotate = true,
  autoRotateSpeed = 0.9,
  zoom = true,
  interactive = true,
  background = null,
  cameraPosition = [0, 0.06, 1.75],
  fov = 30,
  className,
  rotationY = 0,
  contactShadow = true,
  lightIntensity = 1,
  keyLightColor = "#ffffff",
  onLoaded,
  ariaLabel = "Forgatható 3D póló",
  hint = true,
}: ShirtViewerProps) {
  const caps = useMemo(() => detectCapabilities(), []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const idleTimer = useRef<number | null>(null);
  const [visible, setVisible] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [touched, setTouched] = useState(false);
  const spinning = autoRotate && !caps.reducedMotion && !userPaused;

  // Csak akkor renderelünk folyamatosan, ha látszik és forog; különben on-demand.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleStart = useCallback(() => {
    setUserPaused(true);
    setTouched(true);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
  }, []);

  const handleEnd = useCallback(() => {
    if (!autoRotate || caps.reducedMotion) return;
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setUserPaused(false), 4000);
  }, [autoRotate, caps.reducedMotion]);

  useEffect(() => () => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
  }, []);

  const frameloop = visible && spinning ? "always" : "demand";
  const shadows = !caps.lowEnd;

  return (
    <div ref={wrapperRef} className={`relative ${className ?? ""}`} role="img" aria-label={ariaLabel}>
      <Canvas
        dpr={[1, caps.maxDpr]}
        frameloop={frameloop}
        shadows={shadows ? "percentage" : false}
        camera={{ position: cameraPosition, fov, near: 0.05, far: 20 }}
        gl={{ antialias: true, alpha: background == null, powerPreference: "high-performance", preserveDrawingBuffer: false }}
        style={{ background: background ?? "transparent", touchAction: interactive ? "none" : "auto" }}
        onCreated={() => onLoaded?.()}
      >
        <hemisphereLight intensity={0.75 * lightIntensity} color="#ffffff" groundColor="#c9c4ba" />
        <directionalLight
          position={[1.6, 2.6, 2.2]}
          intensity={1.5 * lightIntensity}
          color={keyLightColor}
          castShadow={shadows}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
        />
        <directionalLight position={[-2.2, 1.2, -1]} intensity={0.45 * lightIntensity} />
        <directionalLight position={[0.2, 2.4, -3]} intensity={0.9 * lightIntensity} />
        <Suspense fallback={null}>
          <group rotation={[0, rotationY, 0]}>
            <ShirtModel color={color} placements={placements} charts={charts} modelPath={modelPath} embroidery={embroidery} castShadow={shadows} />
          </group>
          {contactShadow ? (
            <ContactShadows position={[0, -0.375, 0]} opacity={0.45} scale={2.2} blur={2.6} far={0.8} resolution={512} frames={frameloop === "always" ? Infinity : 1} />
          ) : null}
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enabled={interactive}
          enablePan={false}
          enableZoom={zoom}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.8}
          minDistance={0.8}
          maxDistance={3.2}
          minPolarAngle={0.35}
          maxPolarAngle={1.9}
          autoRotate={spinning}
          autoRotateSpeed={autoRotateSpeed}
          onStart={handleStart}
          onEnd={handleEnd}
          target={[0, 0, 0]}
        />
      </Canvas>
      <LoadingOverlay label="3D modell betöltése…" />
      {hint && interactive && !touched ? (
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] tracking-wide opacity-60">
          Húzd a forgatáshoz{zoom ? " · görgess a zoomhoz" : ""}
        </p>
      ) : null}
    </div>
  );
}
