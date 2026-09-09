import type { GarmentView, RectCm, SilhouetteKey } from "@/lib/catalog/types";

export interface GarmentOutline {
  /** fő kontúr (kitöltött), a nézet-kivágás cm-koordinátáiban */
  body: string;
  /** részletvonalak (nyakkivágás, szegély, zseb) – csak kontúr */
  details: string[];
  /** a rajz teljes kiterjedése (az ujjak kilóghatnak a kivágásból) */
  bounds: RectCm;
}

/**
 * Ruha-kontúrok cm-koordinátákban a 2D szerkesztőhöz. A kontúr a nézet
 * kivágásának (crop) koordinátarendszerében van (0,0 = a kivágás bal-felső sarka),
 * így a zónák és a textúra-chart ugyanabban a térben vannak.
 */
export function garmentOutline(kind: SilhouetteKey, view: GarmentView): GarmentOutline {
  const { w, h } = view.crop;
  const isBack = view.key === "back";
  const isSleeve = view.key === "left_sleeve" || view.key === "right_sleeve";

  if (isSleeve) {
    return {
      body: `M0 0 L${w} 0 L${w - 1} ${h} L1 ${h} Z`,
      details: [`M1.5 ${h - 2.5} L${w - 1.5} ${h - 2.5}`],
      bounds: { x: -2, y: -2, w: w + 4, h: h + 4 },
    };
  }

  const neckFront = "M18 0 Q27 7 36 0";
  const neckBack = "M18 0 Q27 2.5 36 0";
  const neck = isBack ? neckBack : neckFront;

  switch (kind) {
    case "tshirt":
      return {
        body: `${neck} L50 1 L66 9 L62 24 L54 21 L54 ${h} L0 ${h} L0 21 L-8 24 L-12 9 L4 1 Z`,
        details: [isBack ? "M18 0 Q27 4 36 0" : "M18 0 Q27 9 36 0", `M0.5 ${h - 2} L${w - 0.5} ${h - 2}`],
        bounds: { x: -14, y: -4, w: w + 28, h: h + 6 },
      };
    case "sweatshirt":
      return {
        body: `${neck} L50 1 L60 4 L70 60 L58 63 L54 30 L54 ${h} L0 ${h} L0 30 L-4 63 L-16 60 L-6 4 L4 1 Z`,
        details: [isBack ? "M18 0 Q27 4 36 0" : "M18 0 Q27 9 36 0", `M0.5 ${h - 5} L${w - 0.5} ${h - 5}`, "M58 56 L70 54", "M-16 54 L-4 56"],
        bounds: { x: -18, y: -4, w: w + 36, h: h + 6 },
      };
    case "hoodie":
      return {
        body: `M18 0 C15 -12 39 -12 36 0 L50 1 L60 4 L70 60 L58 63 L54 30 L54 ${h} L0 ${h} L0 30 L-4 63 L-16 60 L-6 4 L4 1 Z`,
        details: [isBack ? "M18 0 C20 -8 34 -8 36 0" : "M18 0 C16 -9 38 -9 36 0 Q27 8 18 0", isBack ? "" : `M12 48 L42 48 L42 ${h - 4} L12 ${h - 4} Z`, `M0.5 ${h - 5} L${w - 0.5} ${h - 5}`, isBack ? "" : "M24 4 L24 12 M30 4 L30 12"].filter(Boolean),
        bounds: { x: -18, y: -14, w: w + 36, h: h + 16 },
      };
    case "tank":
      return {
        body: `M7 0 L14 0 L14 9 Q${w / 2} 19 ${w - 14} 9 L${w - 14} 0 L${w - 7} 0 L${w} 17 Q${w - 6} 24 ${w - 6} 32 L${w - 6} ${h} L6 ${h} L6 32 Q6 24 0 17 Z`,
        details: [`M6.5 ${h - 2} L${w - 6.5} ${h - 2}`],
        bounds: { x: -2, y: -2, w: w + 4, h: h + 4 },
      };
    case "shorts":
      return {
        body: `M0 0 L${w} 0 L${w + 4} ${h} L${w / 2 + 4} ${h + 2} L${w / 2} ${h * 0.55} L${w / 2 - 4} ${h + 2} L-4 ${h} Z`,
        details: [`M0.5 5 L${w - 0.5} 5`, isBack ? "" : "M8 8 L14 18", isBack ? "" : `M${w - 8} 8 L${w - 14} 18`, `M${w / 2} 5 L${w / 2} ${h * 0.55}`].filter(Boolean),
        bounds: { x: -6, y: -2, w: w + 12, h: h + 6 },
      };
    case "pants":
      return {
        body: `M2 0 L${w - 2} 0 L${w + 2} ${h} L${w / 2 + 4} ${h + 1} L${w / 2} ${h * 0.38} L${w / 2 - 4} ${h + 1} L-2 ${h} Z`,
        details: [`M2.5 5 L${w - 2.5} 5`, `M${w / 2} 5 L${w / 2} ${h * 0.38}`, isBack ? "" : "M8 8 L13 20", isBack ? "" : `M${w - 8} 8 L${w - 13} 20`].filter(Boolean),
        bounds: { x: -4, y: -2, w: w + 8, h: h + 5 },
      };
    case "dress":
      return {
        body: `${neck} L46 3 L52 14 L44 18 L42 14 L${w + 6} ${h} L-6 ${h} L12 14 L10 18 L2 14 L8 3 Z`,
        details: [isBack ? "M18 0 Q27 4 36 0" : "M18 0 Q27 9 36 0", "M12 34 L42 34"],
        bounds: { x: -8, y: -2, w: w + 16, h: h + 4 },
      };
    case "skirt":
      return {
        body: `M4 0 L${w - 4} 0 L${w + 6} ${h} L-6 ${h} Z`,
        details: ["M4.5 6 L49.5 6", isBack ? "" : `M${w / 2} 6 L${w / 2} ${h}`].filter(Boolean),
        bounds: { x: -8, y: -2, w: w + 16, h: h + 4 },
      };
    default:
      return { body: `M0 0 L${w} 0 L${w} ${h} L0 ${h} Z`, details: [], bounds: { x: -2, y: -2, w: w + 4, h: h + 4 } };
  }
}
