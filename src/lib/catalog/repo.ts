import { mockCatalog } from "@/data/mock-catalog";
import { tryGetSupabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import type { Catalog, Category, Color, CustomizationZone, DesignAsset, Fit, GalleryItem, GarmentModel, GarmentView, MeasurementKey, PanelChart, Product, ProductVariant, Size, SizeChart } from "./types";

type Row<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

/**
 * Katalógus repository: Supabase-ből tölt, ha van konfiguráció (és elérhető),
 * különben a mock katalógust adja. A UI mindkét esetben ugyanazt a Catalog típust kapja.
 */
export interface CatalogRepository {
  getCatalog(): Promise<Catalog>;
  source: "supabase" | "mock";
}

let cache: { at: number; catalog: Catalog; source: "supabase" | "mock" } | null = null;
const CACHE_MS = 60_000;

export async function loadCatalog(force = false): Promise<{ catalog: Catalog; source: "supabase" | "mock" }> {
  if (!force && cache && Date.now() - cache.at < CACHE_MS) return { catalog: cache.catalog, source: cache.source };
  const supabase = tryGetSupabase();
  if (!supabase) {
    cache = { at: Date.now(), catalog: mockCatalog, source: "mock" };
    return { catalog: mockCatalog, source: "mock" };
  }
  try {
    const catalog = await fetchSupabaseCatalog(supabase);
    cache = { at: Date.now(), catalog, source: "supabase" };
    return { catalog, source: "supabase" };
  } catch (err) {
    console.warn("Supabase katalógus nem elérhető, mock fallback:", err);
    cache = { at: Date.now(), catalog: mockCatalog, source: "mock" };
    return { catalog: mockCatalog, source: "mock" };
  }
}

async function fetchSupabaseCatalog(supabase: NonNullable<ReturnType<typeof tryGetSupabase>>): Promise<Catalog> {
  const [categories, fits, colors, sizes, sizeCharts, sizeChartEntries, garmentModels, zones, products, variants, images, assets, gallery] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("fits").select("*").order("sort_order"),
    supabase.from("colors").select("*").order("sort_order"),
    supabase.from("sizes").select("*").order("sort_order"),
    supabase.from("size_charts").select("*"),
    supabase.from("size_chart_entries").select("*"),
    supabase.from("garment_models").select("*"),
    supabase.from("customization_zones").select("*").order("sort_order"),
    supabase.from("products").select("*").order("sort_order"),
    supabase.from("product_variants").select("*"),
    supabase.from("product_images").select("*").order("sort_order"),
    supabase.from("design_assets").select("*").order("sort_order"),
    supabase.from("gallery_items").select("*").order("sort_order"),
  ]);
  const results = [categories, fits, colors, sizes, sizeCharts, sizeChartEntries, garmentModels, zones, products, variants, images, assets, gallery];
  for (const r of results) if (r.error) throw r.error;

  const sizeById = new Map((sizes.data ?? []).map((s) => [s.id, s]));
  const fitById = new Map((fits.data ?? []).map((f) => [f.id, f]));
  const colorById = new Map((colors.data ?? []).map((c) => [c.id, c]));
  const categoryById = new Map((categories.data ?? []).map((c) => [c.id, c]));
  const modelById = new Map((garmentModels.data ?? []).map((g) => [g.id, g]));
  const assetById = new Map((assets.data ?? []).map((a) => [a.id, a]));
  const productById = new Map((products.data ?? []).map((p) => [p.id, p]));

  const mappedSizeCharts: SizeChart[] = (sizeCharts.data ?? []).map((sc) => ({
    id: sc.slug,
    name: sc.name,
    measurementKeys: sc.measurement_keys as MeasurementKey[],
    entries: (sizeChartEntries.data ?? [])
      .filter((e) => e.size_chart_id === sc.id)
      .map((e) => ({ sizeCode: sizeById.get(e.size_id)?.code ?? "", measurements: (e.measurements ?? {}) as SizeChart["entries"][number]["measurements"] }))
      .sort((a, b) => (sizeById.get([...sizeById.values()].find((s) => s.code === a.sizeCode)?.id ?? "")?.sort_order ?? 0) - (sizeById.get([...sizeById.values()].find((s) => s.code === b.sizeCode)?.id ?? "")?.sort_order ?? 0)),
  }));
  const chartSlugById = new Map((sizeCharts.data ?? []).map((sc) => [sc.id, sc.slug]));

  const mappedModels: GarmentModel[] = (garmentModels.data ?? []).map((g) => ({
    id: g.id,
    slug: g.slug,
    name: g.name,
    modelPath: g.model_path,
    mappingMode: g.mapping_mode,
    silhouette: g.silhouette as GarmentModel["silhouette"],
    charts: (g.charts ?? []) as unknown as PanelChart[],
    views: (g.views ?? []) as unknown as GarmentView[],
    zones: (zones.data ?? [])
      .filter((z) => z.garment_model_id === g.id)
      .map(mapZone),
  }));

  const mappedProducts: Product[] = (products.data ?? []).map((p) => {
    const pv = (variants.data ?? []).filter((v) => v.product_id === p.id);
    const model = p.garment_model_id ? modelById.get(p.garment_model_id) : null;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      categorySlug: categoryById.get(p.category_id)?.slug ?? "",
      gender: p.gender,
      garmentModelSlug: model?.slug ?? null,
      silhouette: p.silhouette as Product["silhouette"],
      sizeChartId: (p.size_chart_id && chartSlugById.get(p.size_chart_id)) || "",
      basePriceHuf: p.base_price_huf,
      isFeatured: p.is_featured,
      isActive: p.is_active,
      tags: p.tags ?? [],
      images: (images.data ?? [])
        .filter((im) => im.product_id === p.id)
        .map((im) => ({ id: im.id, url: im.storage_path, alt: im.alt, kind: im.kind, colorSlug: im.color_id ? colorById.get(im.color_id)?.slug ?? null : null, sortOrder: im.sort_order })),
      variants: pv.map(
        (v): ProductVariant => ({
          id: v.id,
          sku: v.sku,
          fitSlug: fitById.get(v.fit_id)?.slug ?? "",
          colorSlug: colorById.get(v.color_id)?.slug ?? "",
          sizeCode: sizeById.get(v.size_id)?.code ?? "",
          priceHuf: v.price_override_huf ?? p.base_price_huf,
          stockQty: v.stock_qty,
          isActive: v.is_active,
        }),
      ),
      fitSlugs: unique(pv.map((v) => fitById.get(v.fit_id)?.slug ?? "")),
      colorSlugs: unique(pv.map((v) => colorById.get(v.color_id)?.slug ?? "")),
      sizeCodes: unique(pv.map((v) => sizeById.get(v.size_id)?.code ?? "")),
      customizable: p.is_customizable,
    };
  });

  return {
    categories: (categories.data ?? []).map(
      (c): Category => ({ id: c.id, slug: c.slug, name: c.name, description: c.description, silhouette: c.silhouette as Category["silhouette"], sortOrder: c.sort_order, isActive: c.is_active }),
    ),
    fits: (fits.data ?? []).map((f): Fit => ({ id: f.id, slug: f.slug, name: f.name, description: f.description })),
    colors: (colors.data ?? []).map((c): Color => ({ id: c.id, slug: c.slug, name: c.name, hex: c.hex, isActive: c.is_active })),
    sizes: (sizes.data ?? []).map((s): Size => ({ id: s.id, code: s.code, name: s.name, sortOrder: s.sort_order })),
    sizeCharts: mappedSizeCharts,
    garmentModels: mappedModels,
    products: mappedProducts,
    designAssets: (assets.data ?? []).map((a): DesignAsset => ({ id: a.id, slug: a.slug, name: a.name, url: a.storage_path, tags: a.tags ?? [] })),
    gallery: (gallery.data ?? []).map(
      (g): GalleryItem => ({
        id: g.id,
        title: g.title,
        description: g.description,
        productSlug: g.product_id ? productById.get(g.product_id)?.slug ?? "" : "",
        colorSlug: g.color_id ? colorById.get(g.color_id)?.slug ?? "" : "",
        designAssetSlug: g.design_asset_id ? assetById.get(g.design_asset_id)?.slug ?? "" : "",
        zoneKey: g.zone_key ?? "front_center",
        widthCm: Number(g.width_cm ?? 10),
        heightCm: Number(g.height_cm ?? 10),
        likes: g.likes_count,
      }),
    ),
  };
}

function mapZone(z: Row<"customization_zones">): CustomizationZone {
  return {
    id: z.id,
    key: z.key,
    displayName: z.display_name,
    viewKey: z.view_key,
    rectCm: { x: Number(z.rect_x), y: Number(z.rect_y), w: Number(z.rect_w), h: Number(z.rect_h) },
    minWidthCm: Number(z.min_width_cm),
    maxWidthCm: Number(z.max_width_cm),
    maxHeightCm: Number(z.max_height_cm),
    isActive: z.is_active,
    sortOrder: z.sort_order,
    mapping3d: (z.mapping_3d as CustomizationZone["mapping3d"]) ?? null,
  };
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr.filter(Boolean)));
}
