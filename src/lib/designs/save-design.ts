import type { Catalog, Product } from "@/lib/catalog/types";
import { getSupabase } from "@/lib/supabase/client";
import type { DesignSessionState } from "@/lib/store/design-session";
import type { DesignSource } from "@/lib/customizer/upload";
import { composeChartTexture } from "@/lib/customizer/texture-composer";
import { zoneCenter } from "@/lib/customizer/geometry";

export interface SaveDesignResult {
  id: string;
  publicCode: string;
}

function extFor(mime: string): string {
  if (mime === "image/svg+xml") return "svg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

/** Elöl nézet előnézeti PNG a kompozíció alapján (max 1024 px széles). */
export async function renderPreviewBlob(product: Product, catalog: Catalog, session: DesignSessionState, sources: Record<string, DesignSource>, colorHex: string): Promise<Blob | null> {
  const model = catalog.garmentModels.find((g) => g.slug === product.garmentModelSlug);
  if (!model) return null;
  const view = model.views.find((v) => v.key === "front") ?? model.views[0];
  const chart = model.charts.find((c) => c.key === view.chartKey);
  if (!chart) return null;
  const canvas = document.createElement("canvas");
  const pxPerCm = Math.min(12, 1024 / chart.widthCm);
  composeChartTexture(canvas, chart, {
    baseColor: colorHex,
    pxPerCm,
    fabric: true,
    embroidery: true,
    placements: session.placements
      .filter((p) => p.chartKey === chart.key)
      .map((p) => ({ id: p.id, chartKey: p.chartKey, zoneKey: p.zoneKey, image: sources[p.sourceId]?.image ?? null, xCm: p.xCm, yCm: p.yCm, widthCm: p.widthCm, heightCm: p.heightCm, rotationDeg: p.rotationDeg, embroidery: p.embroidery })),
  });
  // kivágás a nézetre
  const crop = document.createElement("canvas");
  crop.width = Math.round(view.crop.w * pxPerCm);
  crop.height = Math.round(view.crop.h * pxPerCm);
  crop.getContext("2d")?.drawImage(canvas, view.crop.x * pxPerCm, view.crop.y * pxPerCm, crop.width, crop.height, 0, 0, crop.width, crop.height);
  return new Promise((resolve) => crop.toBlob((b) => resolve(b), "image/png", 0.92));
}

/**
 * Mentés Supabase-be: feltöltések a user-designs bucketbe ({uid}/uploads/...),
 * user_uploads + saved_designs + saved_design_items sorok. Bejelentkezés szükséges.
 */
export async function saveDesign(params: {
  userId: string;
  name: string;
  product: Product;
  catalog: Catalog;
  session: DesignSessionState;
  sources: Record<string, DesignSource>;
  colorHex: string;
  isPublic?: boolean;
}): Promise<SaveDesignResult> {
  const { userId, name, product, catalog, session, sources, colorHex, isPublic = false } = params;
  const supabase = getSupabase();
  const model = catalog.garmentModels.find((g) => g.slug === product.garmentModelSlug);

  // 1) források feltöltése (csak upload típus; asset esetén design_asset_id)
  const uploadIds = new Map<string, string>();
  for (const p of session.placements) {
    const src = sources[p.sourceId];
    if (!src || src.kind !== "upload" || !src.blob || uploadIds.has(src.id)) continue;
    const ext = extFor(src.mime);
    const path = `${userId}/uploads/${src.id}.${ext}`;
    const { error: upErr } = await supabase.storage.from("user-designs").upload(path, src.blob, { contentType: src.mime, upsert: true });
    if (upErr) throw new Error(`Feltöltés sikertelen: ${upErr.message}`);
    // raszter előnézet SVG-hez
    let previewPath: string | null = null;
    if (src.isVector) {
      const c = document.createElement("canvas");
      c.width = src.image.naturalWidth;
      c.height = src.image.naturalHeight;
      c.getContext("2d")?.drawImage(src.image, 0, 0);
      const pngBlob = await new Promise<Blob | null>((r) => c.toBlob((b) => r(b), "image/png"));
      if (pngBlob) {
        previewPath = `${userId}/uploads/${src.id}.preview.png`;
        await supabase.storage.from("user-designs").upload(previewPath, pngBlob, { contentType: "image/png", upsert: true });
      }
    }
    const { data: row, error } = await supabase
      .from("user_uploads")
      .insert({
        user_id: userId,
        bucket_id: "user-designs",
        storage_path: path,
        preview_path: previewPath,
        original_filename: src.name,
        mime_type: src.mime,
        size_bytes: src.blob.size,
        width_px: src.widthPx,
        height_px: src.heightPx,
        is_vector: src.isVector,
        sanitized: src.isVector,
      })
      .select("id")
      .single();
    if (error) throw new Error(`Feltöltés mentése sikertelen: ${error.message}`);
    uploadIds.set(src.id, row.id);
  }

  // 2) előnézet
  let previewPath: string | null = null;
  const preview = await renderPreviewBlob(product, catalog, session, sources, colorHex);
  if (preview) {
    previewPath = `${userId}/previews/${crypto.randomUUID()}.png`;
    const { error } = await supabase.storage.from("user-designs").upload(previewPath, preview, { contentType: "image/png", upsert: true });
    if (error) previewPath = null;
  }

  // 3) saved_designs
  const fit = catalog.fits.find((f) => f.slug === session.fitSlug);
  const color = catalog.colors.find((c) => c.slug === session.colorSlug);
  const size = catalog.sizes.find((s) => s.code === session.sizeCode);
  const variant = product.variants.find((v) => v.fitSlug === session.fitSlug && v.colorSlug === session.colorSlug && v.sizeCode === session.sizeCode);
  const { data: design, error: dErr } = await supabase
    .from("saved_designs")
    .insert({
      user_id: userId,
      name,
      product_id: product.id.startsWith("prod-") ? null : product.id,
      variant_id: variant && !variant.id.includes("-v") ? variant.id : null,
      fit_id: fit && !fit.id.startsWith("fit-") ? fit.id : null,
      color_id: color && !color.id.startsWith("col-") ? color.id : null,
      size_id: size && !size.id.startsWith("size-") ? size.id : null,
      preview_path: previewPath,
      is_public: isPublic,
      config: {
        productSlug: product.slug,
        fitSlug: session.fitSlug,
        colorSlug: session.colorSlug,
        sizeCode: session.sizeCode,
        garmentModelSlug: product.garmentModelSlug,
      },
    })
    .select("id, public_code")
    .single();
  if (dErr) throw new Error(`Design mentése sikertelen: ${dErr.message}`);

  // 4) tételek
  const items = session.placements.map((p, i) => {
    const src = sources[p.sourceId];
    const zone = model?.zones.find((z) => z.key === p.zoneKey);
    const center = zone ? zoneCenter(zone) : { x: 0, y: 0 };
    const assetId = src?.kind === "asset" ? catalog.designAssets.find((a) => a.slug === src.assetSlug)?.id : undefined;
    return {
      saved_design_id: design.id,
      zone_id: zone && !zone.id.startsWith("zone-") ? zone.id : null,
      zone_key: p.zoneKey,
      source_type: (src?.kind === "asset" ? "asset" : "upload") as "asset" | "upload",
      user_upload_id: src?.kind === "upload" ? uploadIds.get(src.id) ?? null : null,
      design_asset_id: src?.kind === "asset" && assetId && !assetId.startsWith("asset-") ? assetId : null,
      x_cm: p.xCm - center.x,
      y_cm: p.yCm - center.y,
      rotation_deg: p.rotationDeg,
      scale: 1,
      width_cm: p.widthCm,
      height_cm: p.heightCm,
      embroidery: { effect: p.embroidery ? "satin" : "flat", chartKey: p.chartKey, viewKey: p.viewKey },
      sort_order: i,
    };
  });
  if (items.length) {
    const { error: iErr } = await supabase.from("saved_design_items").insert(items);
    if (iErr) throw new Error(`Design elemek mentése sikertelen: ${iErr.message}`);
  }

  return { id: design.id, publicCode: design.public_code };
}
