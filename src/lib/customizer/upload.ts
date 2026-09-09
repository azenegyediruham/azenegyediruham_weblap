import type { DesignAsset } from "@/lib/catalog/types";
import { asset } from "@/lib/asset-url";
import { canvasToImage, loadImage, looksLikeSvg, rasterizeSvg, sanitizeSvg } from "./svg";

export const ACCEPTED_MIME = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"] as const;
export const ACCEPTED_EXT = ["png", "jpg", "jpeg", "webp", "svg"] as const;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/** ez alatt figyelmeztetünk: a hímzés részletei elveszhetnek */
export const MIN_RECOMMENDED_PX = 600;

export interface DesignSource {
  id: string;
  kind: "upload" | "asset";
  name: string;
  mime: string;
  image: HTMLImageElement;
  /** eredeti (SVG esetén tisztított) fájl */
  blob: Blob | null;
  /** tisztított SVG forrás (vektoros, digitizáláshoz) */
  svgText?: string;
  widthPx: number;
  heightPx: number;
  isVector: boolean;
  warnings: string[];
  assetSlug?: string;
}

export class UploadError extends Error {}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function extOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

/** Feltöltött fájl ellenőrzése, SVG tisztítás + raszterizálás, kép betöltése. */
export async function processUploadedFile(file: File): Promise<DesignSource> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError(`A fájl túl nagy (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum 10 MB.`);
  }
  const ext = extOf(file.name);
  const mime = file.type || (ext === "svg" ? "image/svg+xml" : "");
  const isSvg = mime === "image/svg+xml" || ext === "svg";
  if (!isSvg && !ACCEPTED_MIME.includes(mime as (typeof ACCEPTED_MIME)[number])) {
    throw new UploadError("Nem támogatott formátum. PNG, JPG, WebP vagy SVG tölthető fel.");
  }
  const warnings: string[] = [];

  if (isSvg) {
    const text = await file.text();
    if (!looksLikeSvg(text)) throw new UploadError("A fájl nem érvényes SVG.");
    const clean = sanitizeSvg(text);
    if (!clean) throw new UploadError("Az SVG nem dolgozható fel (tisztítás után üres).");
    if (clean.length < text.length * 0.5) warnings.push("Az SVG-ből biztonsági okból elemeket távolítottunk el (script, külső hivatkozás).");
    const canvas = await rasterizeSvg(clean, 1024);
    const image = await canvasToImage(canvas);
    return {
      id: newId(),
      kind: "upload",
      name: file.name,
      mime: "image/svg+xml",
      image,
      blob: new Blob([clean], { type: "image/svg+xml" }),
      svgText: clean,
      widthPx: canvas.width,
      heightPx: canvas.height,
      isVector: true,
      warnings,
    };
  }

  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    const w = image.naturalWidth;
    const h = image.naturalHeight;
    if (!w || !h) throw new UploadError("A kép nem olvasható.");
    if (Math.min(w, h) < MIN_RECOMMENDED_PX) {
      warnings.push(`Alacsony felbontás (${w} × ${h} px). Legalább ${MIN_RECOMMENDED_PX} px javasolt, különben a hímzés részletei elveszhetnek.`);
    }
    if (mime === "image/jpeg") warnings.push("JPG-nél nincs átlátszó háttér – a teljes téglalap kerül a ruhára. PNG vagy SVG ajánlott.");
    return { id: newId(), kind: "upload", name: file.name, mime, image, blob: file, widthPx: w, heightPx: h, isVector: false, warnings };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err instanceof UploadError ? err : new UploadError("A kép nem tölthető be.");
  }
}

/** Beépített design asset betöltése forrásként. */
export async function sourceFromAsset(item: DesignAsset): Promise<DesignSource> {
  const image = await loadImage(asset(item.url));
  return {
    id: `asset-${item.slug}`,
    kind: "asset",
    name: item.name,
    mime: "image/svg+xml",
    image,
    blob: null,
    widthPx: image.naturalWidth,
    heightPx: image.naturalHeight,
    isVector: true,
    warnings: [],
    assetSlug: item.slug,
  };
}

/** Blob-ból (IndexedDB) forrás visszaállítása újratöltés után. */
export async function sourceFromBlob(id: string, name: string, mime: string, blob: Blob): Promise<DesignSource> {
  if (mime === "image/svg+xml") {
    const text = await blob.text();
    const canvas = await rasterizeSvg(text, 1024);
    const image = await canvasToImage(canvas);
    return { id, kind: "upload", name, mime, image, blob, svgText: text, widthPx: canvas.width, heightPx: canvas.height, isVector: true, warnings: [] };
  }
  const url = URL.createObjectURL(blob);
  const image = await loadImage(url);
  return { id, kind: "upload", name, mime, image, blob, widthPx: image.naturalWidth, heightPx: image.naturalHeight, isVector: false, warnings: [] };
}
