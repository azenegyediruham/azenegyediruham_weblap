/**
 * Textúra-kompozíció: a ruha egy panel-chartja (cm-kalibrált) -> canvas.
 * Ugyanez a canvas a 3D modell textúrája (glTF UV konvenció: y=0 a kép teteje)
 * és a gyártási preview alapja.
 */
export interface ChartSpec {
  key: string;
  widthCm: number;
  heightCm: number;
}

export type DesignImageSource = HTMLImageElement | ImageBitmap | HTMLCanvasElement;

export interface DesignPlacement {
  id: string;
  chartKey: string;
  zoneKey: string;
  image: DesignImageSource | null;
  /** középpont a chart koordinátarendszerében, cm */
  xCm: number;
  yCm: number;
  widthCm: number;
  heightCm: number;
  rotationDeg: number;
  /** hímzés-effekt bekapcsolva */
  embroidery?: boolean;
}

export interface ComposeOptions {
  baseColor: string;
  placements: DesignPlacement[];
  pxPerCm: number;
  fabric?: boolean;
  /** hímzés-effekt globális kapcsoló */
  embroidery?: boolean;
}

const fabricTileCache = new Map<string, HTMLCanvasElement>();

/** Procedurális szövet-minta csempe (enyhe szálirány, világos/sötét szemcsék). */
export function fabricTile(size = 32, strength = 0.035): HTMLCanvasElement {
  const key = `${size}:${strength}`;
  const cached = fabricTileCache.get(key);
  if (cached) return cached;
  const tile = document.createElement("canvas");
  tile.width = size;
  tile.height = size;
  const ctx = tile.getContext("2d");
  if (!ctx) return tile;
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const weave = ((x + y) % 4 < 2 ? 1 : -1) * 0.5;
      const noise = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      const v = (weave + (noise - 0.5)) * strength * 255;
      const dark = v < 0;
      img.data[i] = dark ? 0 : 255;
      img.data[i + 1] = dark ? 0 : 255;
      img.data[i + 2] = dark ? 0 : 255;
      img.data[i + 3] = Math.min(255, Math.abs(v));
    }
  }
  ctx.putImageData(img, 0, 0);
  fabricTileCache.set(key, tile);
  return tile;
}

/** Öltés-minta csempe (átlós cérnasorok) a hímzés-effekthez. */
export function stitchTile(spacingPx = 4): HTMLCanvasElement {
  const key = `stitch:${spacingPx}`;
  const cached = fabricTileCache.get(key);
  if (cached) return cached;
  const size = spacingPx * 4;
  const tile = document.createElement("canvas");
  tile.width = size;
  tile.height = size;
  const ctx = tile.getContext("2d");
  if (!ctx) return tile;
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = Math.max(1, spacingPx * 0.35);
  for (let d = -size; d < size * 2; d += spacingPx) {
    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d + size, size);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(0,0,0,0.28)";
  for (let d = -size + spacingPx / 2; d < size * 2; d += spacingPx) {
    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d + size, size);
    ctx.stroke();
  }
  fabricTileCache.set(key, tile);
  return tile;
}

function imageSize(img: DesignImageSource): { w: number; h: number } {
  if (img instanceof HTMLImageElement) return { w: img.naturalWidth || img.width, h: img.naturalHeight || img.height };
  return { w: img.width, h: img.height };
}

/** A design egy rétegen, hímzés-effekttel (source-atop öltésminta + kontúr). */
function drawDesign(ctx: CanvasRenderingContext2D, p: DesignPlacement, pxPerCm: number, embroidery: boolean) {
  if (!p.image) return;
  const { w, h } = imageSize(p.image);
  if (!w || !h) return;
  const wPx = p.widthCm * pxPerCm;
  const hPx = p.heightCm * pxPerCm;
  const layer = document.createElement("canvas");
  layer.width = Math.max(2, Math.ceil(wPx));
  layer.height = Math.max(2, Math.ceil(hPx));
  const lctx = layer.getContext("2d");
  if (!lctx) return;
  lctx.imageSmoothingEnabled = true;
  lctx.imageSmoothingQuality = "high";
  lctx.drawImage(p.image, 0, 0, layer.width, layer.height);

  if (embroidery) {
    // öltésminta csak a design alfa-területén belül
    lctx.globalCompositeOperation = "source-atop";
    const pattern = lctx.createPattern(stitchTile(Math.max(2, Math.round(pxPerCm * 0.12))), "repeat");
    if (pattern) {
      lctx.fillStyle = pattern;
      lctx.fillRect(0, 0, layer.width, layer.height);
    }
    // enyhe belső fény a "domborulat" érzetéhez
    const grad = lctx.createLinearGradient(0, 0, 0, layer.height);
    grad.addColorStop(0, "rgba(255,255,255,0.10)");
    grad.addColorStop(1, "rgba(0,0,0,0.12)");
    lctx.fillStyle = grad;
    lctx.fillRect(0, 0, layer.width, layer.height);
    lctx.globalCompositeOperation = "source-over";
  }

  ctx.save();
  ctx.translate(p.xCm * pxPerCm, p.yCm * pxPerCm);
  ctx.rotate((p.rotationDeg * Math.PI) / 180);
  if (embroidery) {
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = Math.max(1, pxPerCm * 0.08);
    ctx.shadowOffsetX = pxPerCm * 0.03;
    ctx.shadowOffsetY = pxPerCm * 0.05;
  }
  ctx.drawImage(layer, -wPx / 2, -hPx / 2, wPx, hPx);
  ctx.restore();
}

/** Szín (map) textúra összeállítása egy charthoz. */
export function composeChartTexture(canvas: HTMLCanvasElement, chart: ChartSpec, opts: ComposeOptions): void {
  const w = Math.max(4, Math.round(chart.widthCm * opts.pxPerCm));
  const h = Math.max(4, Math.round(chart.heightCm * opts.pxPerCm));
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = opts.baseColor;
  ctx.fillRect(0, 0, w, h);

  if (opts.fabric !== false) {
    const pattern = ctx.createPattern(fabricTile(), "repeat");
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);
    }
  }

  for (const p of opts.placements) {
    if (p.chartKey !== chart.key) continue;
    drawDesign(ctx, p, opts.pxPerCm, Boolean(opts.embroidery ?? p.embroidery));
  }
}

/**
 * Normal map a hímzés-reliefhez: alap lapos (128,128,255), a design területén
 * öltésirányú, váltakozó normálok -> a fény "cérna" domborulatot mutat.
 */
export function composeChartNormalMap(canvas: HTMLCanvasElement, chart: ChartSpec, opts: ComposeOptions): boolean {
  const w = Math.max(4, Math.round(chart.widthCm * opts.pxPerCm));
  const h = Math.max(4, Math.round(chart.heightCm * opts.pxPerCm));
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgb(128,128,255)";
  ctx.fillRect(0, 0, w, h);

  let drewAny = false;
  for (const p of opts.placements) {
    if (p.chartKey !== chart.key || !p.image) continue;
    if (!(opts.embroidery ?? p.embroidery)) continue;
    const wPx = p.widthCm * opts.pxPerCm;
    const hPx = p.heightCm * opts.pxPerCm;
    const layer = document.createElement("canvas");
    layer.width = Math.max(2, Math.ceil(wPx));
    layer.height = Math.max(2, Math.ceil(hPx));
    const lctx = layer.getContext("2d");
    if (!lctx) continue;
    lctx.drawImage(p.image, 0, 0, layer.width, layer.height);
    // alfa-maszk -> öltéssorok normálja
    lctx.globalCompositeOperation = "source-in";
    lctx.fillStyle = "rgb(128,128,255)";
    lctx.fillRect(0, 0, layer.width, layer.height);
    lctx.globalCompositeOperation = "source-atop";
    const spacing = Math.max(2, Math.round(opts.pxPerCm * 0.12));
    for (let d = -layer.height; d < layer.width + layer.height; d += spacing) {
      lctx.strokeStyle = "rgb(160,112,236)";
      lctx.lineWidth = spacing * 0.45;
      lctx.beginPath();
      lctx.moveTo(d, 0);
      lctx.lineTo(d + layer.height, layer.height);
      lctx.stroke();
      lctx.strokeStyle = "rgb(96,144,236)";
      lctx.beginPath();
      lctx.moveTo(d + spacing / 2, 0);
      lctx.lineTo(d + spacing / 2 + layer.height, layer.height);
      lctx.stroke();
    }
    ctx.save();
    ctx.translate(p.xCm * opts.pxPerCm, p.yCm * opts.pxPerCm);
    ctx.rotate((p.rotationDeg * Math.PI) / 180);
    ctx.drawImage(layer, -wPx / 2, -hPx / 2, wPx, hPx);
    ctx.restore();
    drewAny = true;
  }
  return drewAny;
}

/** Egy design befoglaló téglalapja a forgatás után (cm, chart koordináták). */
export function rotatedBounds(p: Pick<DesignPlacement, "xCm" | "yCm" | "widthCm" | "heightCm" | "rotationDeg">) {
  const rad = (p.rotationDeg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const w = p.widthCm * cos + p.heightCm * sin;
  const h = p.widthCm * sin + p.heightCm * cos;
  return { x: p.xCm - w / 2, y: p.yCm - h / 2, w, h };
}
