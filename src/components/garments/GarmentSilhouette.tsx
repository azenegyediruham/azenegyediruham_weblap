import type { SVGProps } from "react";
import type { SilhouetteKey } from "@/lib/catalog/types";

interface GarmentSilhouetteProps extends Omit<SVGProps<SVGSVGElement>, "fill"> {
  kind: SilhouetteKey;
  /** ruha színe (hex) */
  color?: string;
  /** varrás/kontúr színe */
  lineColor?: string;
  /** hátsó nézet (pl. customizer back view) */
  back?: boolean;
  title?: string;
}

/**
 * Egyszerű, jogtiszta ruha-sziluettek (200×240 viewBox), színezhetők.
 * Termékfotó-placeholder, customizer sablon és a koncepciók vizuális alapja.
 */
export function GarmentSilhouette({ kind, color = "#F4F2EC", lineColor, back = false, title, ...rest }: GarmentSilhouetteProps) {
  const stroke = lineColor ?? "rgba(0,0,0,0.28)";
  return (
    <svg viewBox="0 0 200 240" role={title ? "img" : "presentation"} aria-label={title} {...rest}>
      {title ? <title>{title}</title> : null}
      <g fill={color} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round">
        {shape(kind, back, stroke)}
      </g>
    </svg>
  );
}

function shape(kind: SilhouetteKey, back: boolean, stroke: string) {
  switch (kind) {
    case "tshirt":
      return (
        <>
          <path d="M70 26 C82 42 118 42 130 26 L168 42 L190 90 L158 104 L152 90 L152 218 L48 218 L48 90 L42 104 L10 90 L32 42 Z" />
          {back ? (
            <path d="M74 27 C84 34 116 34 126 27" fill="none" />
          ) : (
            <path d="M70 26 C78 48 122 48 130 26" fill="none" />
          )}
          <path d="M48 96 L152 96" fill="none" strokeDasharray="2 3" opacity="0.5" />
          <path d="M52 212 L148 212" fill="none" opacity="0.5" />
        </>
      );
    case "hoodie":
      return (
        <>
          <path d="M64 40 C70 22 130 22 136 40 L172 52 L192 104 L160 116 L154 100 L154 220 L46 220 L46 100 L40 116 L8 104 L28 52 Z" />
          <path d="M64 40 C60 14 140 14 136 40 C126 54 74 54 64 40 Z" opacity="0.9" />
          <path d="M60 160 L140 160 L146 208 L54 208 Z" fill="none" />
          <path d="M92 62 L92 92 M108 62 L108 92" fill="none" opacity="0.6" />
          <path d="M50 214 L150 214" fill="none" opacity="0.5" />
        </>
      );
    case "sweatshirt":
      return (
        <>
          <path d="M70 28 C82 44 118 44 130 28 L170 44 L196 150 L166 158 L154 112 L154 220 L46 220 L46 112 L34 158 L4 150 L30 44 Z" />
          <path d="M70 28 C78 46 122 46 130 28" fill="none" />
          <path d="M46 204 L154 204" fill="none" opacity="0.5" />
          <path d="M4 150 L34 158 M166 158 L196 150" fill="none" opacity="0.5" />
        </>
      );
    case "tank":
      return (
        <>
          <path d="M60 22 L84 22 L84 44 C84 66 116 66 116 44 L116 22 L140 22 L150 74 C136 84 128 100 128 118 L128 218 L72 218 L72 118 C72 100 64 84 50 74 Z" />
          <path d="M76 212 L124 212" fill="none" opacity="0.5" />
        </>
      );
    case "shorts":
      return (
        <>
          <path d="M40 40 L160 40 L172 146 L110 152 L100 100 L90 152 L28 146 Z" />
          <path d="M40 52 L160 52" fill="none" opacity="0.6" />
          <path d="M52 62 L66 90 M148 62 L134 90" fill="none" opacity="0.5" />
          <path d="M100 52 L100 100" fill="none" opacity="0.4" />
        </>
      );
    case "pants":
      return (
        <>
          <path d="M46 24 L154 24 L168 228 L112 230 L100 104 L88 230 L32 228 Z" />
          <path d="M46 36 L154 36" fill="none" opacity="0.6" />
          <path d="M100 36 L100 104" fill="none" opacity="0.4" />
          <path d="M34 214 L86 216 M114 216 L166 214" fill="none" opacity="0.5" />
        </>
      );
    case "dress":
      return (
        <>
          <path d="M72 22 C80 36 120 36 128 22 L150 34 L164 70 L138 80 L130 66 L168 228 L32 228 L70 66 L62 80 L36 70 L50 34 Z" />
          <path d="M72 22 C80 44 120 44 128 22" fill="none" />
          <path d="M72 100 L128 100" fill="none" strokeDasharray="2 3" opacity="0.5" />
        </>
      );
    case "skirt":
      return (
        <>
          <path d="M54 40 L146 40 L176 228 L24 228 Z" />
          <path d="M54 54 L146 54" fill="none" opacity="0.6" />
          <path d="M100 54 L100 228" fill="none" opacity="0.25" strokeDasharray="3 4" />
        </>
      );
    default:
      return <rect x="40" y="40" width="120" height="160" stroke={stroke} />;
  }
}
