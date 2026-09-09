import DOMPurify from "dompurify";

/**
 * SVG tisztítás: script, event handler, külső hivatkozás, foreignObject eltávolítása.
 * A tisztított SVG-t tároljuk (vektoros forrás a későbbi digitizáláshoz),
 * a képernyőn és a textúrán pedig a raszterizált PNG változat jelenik meg.
 */
export function sanitizeSvg(svgText: string): string {
  const clean = DOMPurify.sanitize(svgText, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ["script", "foreignObject", "iframe", "object", "embed", "a"],
    FORBID_ATTR: ["onload", "onerror", "onclick", "href", "xlink:href"],
    ADD_TAGS: ["use"],
  });
  // csak a <svg> gyökér maradjon
  const match = clean.match(/<svg[\s\S]*<\/svg>/i);
  return match ? match[0] : "";
}

/** Egyszerű strukturális ellenőrzés. */
export function looksLikeSvg(text: string): boolean {
  return /<svg[\s>]/i.test(text) && /<\/svg>/i.test(text);
}

interface SvgSize {
  width: number;
  height: number;
}

function parseLength(value: string | null): number | null {
  if (!value) return null;
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Az SVG természetes mérete (viewBox vagy width/height alapján). */
export function svgIntrinsicSize(svgText: string): SvgSize {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const root = doc.documentElement;
  const w = parseLength(root.getAttribute("width"));
  const h = parseLength(root.getAttribute("height"));
  if (w && h) return { width: w, height: h };
  const vb = root.getAttribute("viewBox")?.split(/[\s,]+/).map(Number);
  if (vb && vb.length === 4 && vb[2] > 0 && vb[3] > 0) return { width: vb[2], height: vb[3] };
  return { width: 512, height: 512 };
}

/**
 * SVG -> raszter (canvas). Explicit width/height kerül a gyökérre
 * (Firefox 0×0-ra rajzol nélküle), a hosszabb oldal `maxPx` pixel.
 */
export async function rasterizeSvg(svgText: string, maxPx = 1024): Promise<HTMLCanvasElement> {
  const size = svgIntrinsicSize(svgText);
  const scale = maxPx / Math.max(size.width, size.height);
  const width = Math.max(1, Math.round(size.width * scale));
  const height = Math.max(1, Math.round(size.height * scale));

  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const root = doc.documentElement;
  root.setAttribute("width", String(width));
  root.setAttribute("height", String(height));
  if (!root.getAttribute("viewBox")) root.setAttribute("viewBox", `0 0 ${size.width} ${size.height}`);
  if (!root.getAttribute("xmlns")) root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const serialized = new XMLSerializer().serializeToString(root);
  const blob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Nincs 2D canvas kontextus");
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`A kép nem tölthető be: ${src.slice(0, 80)}`));
    img.src = src;
  });
}

export function canvasToImage(canvas: HTMLCanvasElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("A canvas nem konvertálható"));
      const url = URL.createObjectURL(blob);
      loadImage(url).then(resolve, reject);
    }, "image/png");
  });
}
