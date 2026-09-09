/**
 * Alkalmazás-szintű domain típusok. A Supabase sorokat (database.types.ts)
 * a repository réteg képezi le ezekre, így a UI független az adatbázis-sémától.
 */
export type Gender = "women" | "men" | "unisex";

export type SilhouetteKey =
  | "tshirt"
  | "hoodie"
  | "sweatshirt"
  | "tank"
  | "shorts"
  | "pants"
  | "dress"
  | "skirt";

export type MeasurementKey = "chest" | "length" | "shoulder" | "sleeve" | "waist" | "hip";

export const MEASUREMENT_LABELS: Record<MeasurementKey, string> = {
  chest: "Mellbőség",
  length: "Hossz",
  shoulder: "Váll",
  sleeve: "Ujj",
  waist: "Derék",
  hip: "Csípő",
};

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  silhouette: SilhouetteKey;
  sortOrder: number;
  isActive: boolean;
}

export interface Fit {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface Color {
  id: string;
  slug: string;
  name: string;
  hex: string;
  isActive: boolean;
}

export interface Size {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
}

export interface SizeChartEntry {
  sizeCode: string;
  measurements: Partial<Record<MeasurementKey, number>>;
}

export interface SizeChart {
  id: string;
  name: string;
  measurementKeys: MeasurementKey[];
  entries: SizeChartEntry[];
}

/** cm-ben megadott téglalap egy panel-chart koordinátarendszerében (x jobbra, y lefelé). */
export interface RectCm {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Egy 3D mesh-hez tartozó, cm-kalibrált textúra-chart (u = kerület, v = magasság). */
export interface PanelChart {
  key: string; // pl. "torso", "left_sleeve"
  meshName: string; // a GLB-ben szereplő mesh neve
  widthCm: number;
  heightCm: number;
}

/** A szerkesztőben megjeleníthető nézet: egy chart kivágása + sziluett. */
export interface GarmentView {
  key: "front" | "back" | "left_sleeve" | "right_sleeve";
  label: string;
  chartKey: string;
  crop: RectCm;
  silhouette: SilhouetteKey;
  mirrored?: boolean;
}

export type MappingMode = "uv" | "decal";

export interface DecalMapping {
  meshName: string;
  anchor: [number, number, number];
  right: [number, number, number];
  up: [number, number, number];
  depth?: number;
}

export interface CustomizationZone {
  id: string;
  key: string;
  displayName: string;
  viewKey: GarmentView["key"];
  rectCm: RectCm;
  minWidthCm: number;
  maxWidthCm: number;
  maxHeightCm: number;
  isActive: boolean;
  sortOrder: number;
  mapping3d?: DecalMapping | null;
}

export interface GarmentModel {
  id: string;
  slug: string;
  name: string;
  modelPath: string | null;
  mappingMode: MappingMode;
  charts: PanelChart[];
  views: GarmentView[];
  zones: CustomizationZone[];
  silhouette: SilhouetteKey;
}

export type ProductImageKind = "gallery" | "thumbnail" | "template_front" | "template_back";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  kind: ProductImageKind;
  colorSlug?: string | null;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  fitSlug: string;
  colorSlug: string;
  sizeCode: string;
  priceHuf: number;
  stockQty: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
  gender: Gender;
  garmentModelSlug: string | null;
  silhouette: SilhouetteKey;
  sizeChartId: string;
  basePriceHuf: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  fitSlugs: string[];
  colorSlugs: string[];
  sizeCodes: string[];
  /** Ez a termék testreszabható-e (hímzési zónák elérhetők). */
  customizable: boolean;
}

export interface DesignAsset {
  id: string;
  slug: string;
  name: string;
  url: string;
  tags: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  productSlug: string;
  colorSlug: string;
  designAssetSlug: string;
  zoneKey: string;
  widthCm: number;
  heightCm: number;
  likes: number;
}

export interface Catalog {
  categories: Category[];
  fits: Fit[];
  colors: Color[];
  sizes: Size[];
  sizeCharts: SizeChart[];
  garmentModels: GarmentModel[];
  products: Product[];
  designAssets: DesignAsset[];
  gallery: GalleryItem[];
}
