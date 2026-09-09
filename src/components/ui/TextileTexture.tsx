import type { CSSProperties } from "react";

interface TextileTextureProps {
  variant?: "weave" | "knit" | "grain" | "thread";
  /** alap szín a textúra alatt */
  color?: string;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
  seed?: number;
}

/**
 * Procedurális textil-textúra SVG szűrőkkel (feTurbulence). Nem stock fotó,
 * skálázható, könnyű – háttérként vagy dekoratív felületként használható.
 */
export function TextileTexture({ variant = "weave", color = "#E8E3D8", opacity = 1, className, style, seed = 3 }: TextileTextureProps) {
  const id = `tex-${variant}-${seed}`;
  return (
    <svg
      className={className}
      style={style}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {variant === "weave" && (
          <filter id={id} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.08" numOctaves="2" seed={seed} result="warp" />
            <feTurbulence type="fractalNoise" baseFrequency="0.08 0.9" numOctaves="2" seed={seed + 1} result="weft" />
            <feBlend in="warp" in2="weft" mode="multiply" result="cloth" />
            <feColorMatrix in="cloth" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0" />
          </filter>
        )}
        {variant === "knit" && (
          <filter id={id} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.05 0.3" numOctaves="3" seed={seed} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
          </filter>
        )}
        {variant === "grain" && (
          <filter id={id} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed={seed} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
          </filter>
        )}
        {variant === "thread" && (
          <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="rgba(0,0,0,0.18)" strokeWidth="3" />
            <line x1="7" y1="0" x2="7" y2="14" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
          </pattern>
        )}
      </defs>
      <rect width="400" height="400" fill={color} />
      {variant === "thread" ? (
        <rect width="400" height="400" fill={`url(#${id})`} opacity={opacity} />
      ) : (
        <rect width="400" height="400" filter={`url(#${id})`} opacity={opacity} />
      )}
    </svg>
  );
}
