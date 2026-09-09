"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { GarmentSilhouette } from "@/components/garments/GarmentSilhouette";
import { detectCapabilities } from "@/lib/three/capabilities";
import type { ShirtViewerProps } from "./ShirtViewer";

const ShirtViewer = dynamic(() => import("./ShirtViewer"), {
  ssr: false,
  loading: () => <Skeleton />,
});

function Skeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <div className="h-2/3 w-1/2 max-w-[240px] animate-pulse rounded-[40%_40%_30%_30%] bg-current/10" />
    </div>
  );
}

/**
 * Lazy 3D póló: csak kliensen, code-splitting-gel töltődik; ha nincs WebGL,
 * statikus SVG sziluettre esik vissza (ugyanabban a színben).
 */
export function ShirtViewerLazy(props: ShirtViewerProps & { fallbackLabel?: string }) {
  // Szerveren/hidratáláskor null, kliensen a valódi WebGL-képesség.
  const supported = useSyncExternalStore(
    () => () => {},
    () => detectCapabilities().webgl,
    () => null,
  );

  if (supported === null) {
    return (
      <div className={`relative ${props.className ?? ""}`}>
        <Skeleton />
      </div>
    );
  }

  if (!supported) {
    return (
      <div className={`relative flex flex-col items-center justify-center ${props.className ?? ""}`} role="img" aria-label={props.ariaLabel ?? "Póló előnézet"}>
        <GarmentSilhouette kind="tshirt" color={props.color ?? "#F4F2EC"} className="h-3/4 w-auto" />
        <p className="mt-2 text-xs opacity-60">{props.fallbackLabel ?? "A 3D nézet ezen az eszközön nem elérhető."}</p>
      </div>
    );
  }

  return <ShirtViewer {...props} />;
}
