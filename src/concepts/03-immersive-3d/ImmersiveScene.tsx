"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import Link from "next/link";
import { ShirtModel } from "@/components/three/ShirtModel";
import { detectCapabilities } from "@/lib/three/capabilities";
import { loadImage } from "@/lib/customizer/svg";
import { asset } from "@/lib/asset-url";
import type { DesignPlacement } from "@/lib/customizer/texture-composer";

/** Kamera-kulcskockák a scroll-progress mentén: [progress, orbit fok, magasság, távolság, cél-y] */
const KEYS: [number, number, number, number, number][] = [
  [0.0, -12, 0.12, 2.05, 0.02],
  [0.18, 8, 0.05, 1.5, 0.05],
  [0.36, 95, 0.22, 1.35, 0.0],
  [0.55, 180, 0.1, 1.4, 0.03],
  [0.74, 250, 0.3, 1.2, 0.02],
  [0.9, 330, 0.02, 0.85, 0.12],
  [1.0, 350, 0.0, 0.8, 0.12],
];

const BG_STOPS: [number, string][] = [
  [0, "#0b0c10"],
  [0.35, "#141a2a"],
  [0.6, "#1c2333"],
  [0.85, "#c9c2b3"],
  [1, "#e6e1d6"],
];

function sampleKeys(p: number) {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (p >= a[0] && p <= b[0]) {
      const t = (p - a[0]) / (b[0] - a[0] || 1);
      const s = t * t * (3 - 2 * t);
      return {
        angle: a[1] + (b[1] - a[1]) * s,
        height: a[2] + (b[2] - a[2]) * s,
        dist: a[3] + (b[3] - a[3]) * s,
        targetY: a[4] + (b[4] - a[4]) * s,
      };
    }
  }
  const k = KEYS[KEYS.length - 1];
  return { angle: k[1], height: k[2], dist: k[3], targetY: k[4] };
}

function sampleBg(p: number): THREE.Color {
  for (let i = 0; i < BG_STOPS.length - 1; i++) {
    const [pa, ca] = BG_STOPS[i];
    const [pb, cb] = BG_STOPS[i + 1];
    if (p >= pa && p <= pb) {
      const t = (p - pa) / (pb - pa || 1);
      return new THREE.Color(ca).lerp(new THREE.Color(cb), t);
    }
  }
  return new THREE.Color(BG_STOPS[BG_STOPS.length - 1][1]);
}

function CameraRig({ progressRef, reduced }: { progressRef: React.RefObject<number>; reduced: boolean }) {
  const targetRef = useRef(new THREE.Vector3());
  const bgRef = useRef(new THREE.Color("#0b0c10"));
  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const k = sampleKeys(reduced ? Math.round(p * 4) / 4 : p);
    const rad = (k.angle * Math.PI) / 180;
    state.camera.position.set(Math.sin(rad) * k.dist, k.height, Math.cos(rad) * k.dist);
    targetRef.current.set(0, k.targetY, 0);
    state.camera.lookAt(targetRef.current);
    bgRef.current.copy(sampleBg(p));
    state.scene.background = bgRef.current;
  });
  return null;
}

export function ImmersiveScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reduced = useReducedMotion() ?? false;
  const caps = useMemo(() => detectCapabilities(), []);
  const [visible, setVisible] = useState(true);
  const [designs, setDesigns] = useState<DesignPlacement[]>([]);
  const [revealed, setRevealed] = useState(false);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    const shouldReveal = v > 0.42;
    if (shouldReveal !== revealed) setRevealed(shouldReveal);
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadImage(asset("/design-assets/sun-wave.svg")), loadImage(asset("/design-assets/monogram.svg"))]).then(([sun, mono]) => {
      if (cancelled) return;
      setDesigns([
        { id: "back", chartKey: "torso", zoneKey: "back_center", image: sun, xCm: 81, yCm: 34, widthCm: 24, heightCm: 19.2, rotationDeg: 0, embroidery: true },
        { id: "chest", chartKey: "torso", zoneKey: "front_chest_left", image: mono, xCm: 36, yCm: 19, widthCm: 8, heightCm: 8, rotationDeg: 0, embroidery: true },
      ]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const textDark = useTransform(scrollYProgress, [0.78, 0.9], [0, 1]);
  const o1 = useTransform(scrollYProgress, [0, 0.1, 0.18], [1, 1, 0]);
  const o2 = useTransform(scrollYProgress, [0.2, 0.28, 0.38, 0.46], [0, 1, 1, 0]);
  const o3 = useTransform(scrollYProgress, [0.5, 0.58, 0.68, 0.76], [0, 1, 1, 0]);
  const o4 = useTransform(scrollYProgress, [0.84, 0.94, 1], [0, 1, 1]);
  const ring = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);

  return (
    <div ref={containerRef} className="relative" style={{ height: reduced ? "400vh" : "520vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {caps.webgl ? (
          <Canvas
            dpr={[1, caps.maxDpr]}
            frameloop={visible ? "always" : "demand"}
            shadows={!caps.lowEnd ? "percentage" : false}
            camera={{ position: [0, 0.1, 2], fov: 34, near: 0.05, far: 20 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            className="absolute inset-0"
          >
            <CameraRig progressRef={progressRef} reduced={reduced} />
            <hemisphereLight intensity={0.9} color="#e8eeff" groundColor="#4a4034" />
            <directionalLight position={[2, 3, 2]} intensity={2.4} color="#fff4e0" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
            <directionalLight position={[-3, 1.5, -2]} intensity={1.6} color="#8fa8ff" />
            <directionalLight position={[0, 2, -3]} intensity={2.2} color="#ffffff" />
            <spotLight position={[0, 3.5, 1.5]} angle={0.5} penumbra={0.8} intensity={6} color="#f0e6d2" />
            <Suspense fallback={null}>
              <ShirtModel color="#2E3D63" placements={revealed ? designs : []} embroidery />
              <ContactShadows position={[0, -0.375, 0]} opacity={0.5} scale={2.4} blur={2.2} far={0.9} resolution={512} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0b0c10] text-[#e6e1d6]">A 3D nézet ezen az eszközön nem elérhető.</div>
        )}

        {/* szöveg-panelek a modell körül */}
        <motion.div style={{ opacity: o1 }} className="pointer-events-none absolute inset-x-0 top-[12vh] px-6 text-center text-[#e6e1d6] md:top-[16vh]">
          <p className="text-[11px] uppercase tracking-[0.4em] opacity-70">Egyedi hímzett ruhák</p>
          <h1 className="c03-display mx-auto mt-5 max-w-4xl text-[clamp(44px,7.5vw,112px)] leading-[0.95]">
            Egy póló.
            <br />A te történeted.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[15px] opacity-70">Görgess – a kamera körbevezet, a hímzés menet közben jelenik meg.</p>
        </motion.div>

        <motion.div style={{ opacity: o2 }} className="pointer-events-none absolute left-6 top-1/2 max-w-sm -translate-y-1/2 text-[#e6e1d6] md:left-[8vw]">
          <p className="text-[11px] uppercase tracking-[0.4em] opacity-70">01 · Az anyag</p>
          <h2 className="c03-display mt-4 text-[clamp(30px,4.5vw,64px)] leading-[1]">Sűrű szövésű pamut, ami tartja a cérnát.</h2>
          <p className="mt-4 text-[14px] opacity-70">240 g/m², dupla varrott szegély. Kilenc szín, XS–XXL.</p>
        </motion.div>

        <motion.div style={{ opacity: o3 }} className="pointer-events-none absolute right-6 top-1/2 max-w-sm -translate-y-1/2 text-right text-[#e6e1d6] md:right-[8vw]">
          <p className="text-[11px] uppercase tracking-[0.4em] opacity-70">02 · A hímzés</p>
          <h2 className="c03-display mt-4 text-[clamp(30px,4.5vw,64px)] leading-[1]">A háton 24 cm. Pontosan ott, ahová tetted.</h2>
          <p className="mt-4 text-[14px] opacity-70">Nem nyomat: cérna, mélység, fény. A 2D szerkesztőben cm-ben látod.</p>
          <motion.span style={{ scaleX: ring }} className="mt-6 block h-px w-40 origin-right bg-[#c9a66b] md:ml-auto" aria-hidden />
        </motion.div>

        <motion.div style={{ opacity: o4 }} className="absolute inset-x-0 bottom-[10vh] px-6 text-center">
          <motion.div style={{ color: textDark.get() > 0.5 ? "#0b0c10" : "#e6e1d6" }}>
            <p className="text-[11px] uppercase tracking-[0.4em] opacity-70 text-[#0b0c10]">03 · A tiéd</p>
            <h2 className="c03-display mt-4 text-[clamp(30px,5vw,72px)] leading-[1] text-[#0b0c10]">Tervezd meg. Nézd meg 3D-ben. Rendeld meg.</h2>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/studio/" className="rounded-full bg-[#0b0c10] px-7 py-3.5 text-[14px] font-medium text-[#e6e1d6] hover:bg-[#1c2333]">
                Design Studio
              </Link>
              <Link href="/shop/" className="rounded-full border border-[#0b0c10]/40 px-7 py-3.5 text-[14px] font-medium text-[#0b0c10] hover:bg-[#0b0c10]/10">
                Ruhák
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-[#e6e1d6]/50 mix-blend-difference">Scroll</div>
      </div>
    </div>
  );
}
