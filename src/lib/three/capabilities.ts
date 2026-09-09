export interface RenderCapabilities {
  webgl: boolean;
  lowEnd: boolean;
  reducedMotion: boolean;
  maxDpr: number;
}

let cached: RenderCapabilities | null = null;

/** WebGL és eszközképesség-becslés (csak böngészőben). */
export function detectCapabilities(): RenderCapabilities {
  if (cached) return cached;
  if (typeof window === "undefined") {
    return { webgl: false, lowEnd: true, reducedMotion: true, maxDpr: 1 };
  }
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webgl = false;
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const lowEnd = cores <= 2 || memory <= 2;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  cached = {
    webgl,
    lowEnd,
    reducedMotion,
    maxDpr: lowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 1.75),
  };
  return cached;
}
