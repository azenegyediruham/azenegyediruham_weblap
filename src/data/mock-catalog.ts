import type {
  Catalog,
  Category,
  Color,
  CustomizationZone,
  DesignAsset,
  Fit,
  GalleryItem,
  GarmentModel,
  Product,
  ProductVariant,
  Size,
  SizeChart,
} from "@/lib/catalog/types";

/**
 * Mock katalógus: ugyanazt az adatot használja mind a 10 design koncepció,
 * és fallbackként a shop is, ha nincs Supabase konfiguráció.
 * A supabase/seed.sql ugyanezt az adatot tölti be az adatbázisba.
 */

export const categories: Category[] = [
  { id: "cat-polo", slug: "polo", name: "Póló", description: "Klasszikus, slim és oversized pólók, 100% pamut.", silhouette: "tshirt", sortOrder: 1, isActive: true },
  { id: "cat-pulover", slug: "pulover", name: "Pulóver", description: "Kapucnis és kerek nyakú pulóverek, bolyhozott belsővel.", silhouette: "hoodie", sortOrder: 2, isActive: true },
  { id: "cat-triko", slug: "triko", name: "Trikó", description: "Ujjatlan felsők nyárra és edzéshez.", silhouette: "tank", sortOrder: 3, isActive: true },
  { id: "cat-rovidnadrag", slug: "rovidnadrag", name: "Rövidnadrág", description: "Kényelmes rövidnadrágok hímzett részletekkel.", silhouette: "shorts", sortOrder: 4, isActive: true },
  { id: "cat-hosszunadrag", slug: "hosszunadrag", name: "Hosszúnadrág", description: "Melegítő- és vászonnadrágok egyedi hímzéssel.", silhouette: "pants", sortOrder: 5, isActive: true },
  { id: "cat-ruha", slug: "ruha", name: "Ruha", description: "Könnyű, nyári ruhák és egyedi hímzett darabok.", silhouette: "dress", sortOrder: 6, isActive: true },
  { id: "cat-szoknya", slug: "szoknya", name: "Szoknya", description: "Midi és mini szoknyák saját mintával.", silhouette: "skirt", sortOrder: 7, isActive: true },
];

export const fits: Fit[] = [
  { id: "fit-regular", slug: "regular", name: "Regular", description: "Klasszikus, egyenes szabás." },
  { id: "fit-slim", slug: "slim", name: "Slim", description: "Testhezálló, karcsúsított szabás." },
  { id: "fit-oversized", slug: "oversized", name: "Oversized", description: "Bő, laza, lecsúszott vállú szabás." },
  { id: "fit-relaxed", slug: "relaxed", name: "Relaxed", description: "Kényelmes, kissé bővített szabás." },
];

export const colors: Color[] = [
  { id: "col-tortfeher", slug: "tortfeher", name: "Törtfehér", hex: "#F4F2EC", isActive: true },
  { id: "col-fekete", slug: "fekete", name: "Fekete", hex: "#161616", isActive: true },
  { id: "col-tengereszkek", slug: "tengereszkek", name: "Tengerészkék", hex: "#1F2B47", isActive: true },
  { id: "col-homok", slug: "homok", name: "Homok", hex: "#D8C6A5", isActive: true },
  { id: "col-oliva", slug: "oliva", name: "Olíva", hex: "#5A6B3F", isActive: true },
  { id: "col-bordo", slug: "bordo", name: "Bordó", hex: "#6B1F2B", isActive: true },
  { id: "col-puder", slug: "puder", name: "Púder rózsaszín", hex: "#D9A8A8", isActive: true },
  { id: "col-szurke", slug: "szurke", name: "Szürke melírozott", hex: "#9C9C9C", isActive: true },
  { id: "col-krem", slug: "krem", name: "Krém", hex: "#F0E7D6", isActive: true },
];

export const sizes: Size[] = [
  { id: "size-xs", code: "XS", name: "XS", sortOrder: 1 },
  { id: "size-s", code: "S", name: "S", sortOrder: 2 },
  { id: "size-m", code: "M", name: "M", sortOrder: 3 },
  { id: "size-l", code: "L", name: "L", sortOrder: 4 },
  { id: "size-xl", code: "XL", name: "XL", sortOrder: 5 },
  { id: "size-xxl", code: "XXL", name: "XXL", sortOrder: 6 },
];

export const sizeCharts: SizeChart[] = [
  {
    id: "sc-tshirt-unisex",
    name: "Unisex póló",
    measurementKeys: ["chest", "length", "shoulder", "sleeve"],
    entries: [
      { sizeCode: "XS", measurements: { chest: 92, length: 66, shoulder: 42, sleeve: 19 } },
      { sizeCode: "S", measurements: { chest: 96, length: 68, shoulder: 44, sleeve: 20 } },
      { sizeCode: "M", measurements: { chest: 100, length: 70, shoulder: 46, sleeve: 21 } },
      { sizeCode: "L", measurements: { chest: 106, length: 72, shoulder: 48, sleeve: 22 } },
      { sizeCode: "XL", measurements: { chest: 112, length: 74, shoulder: 50, sleeve: 23 } },
      { sizeCode: "XXL", measurements: { chest: 118, length: 76, shoulder: 52, sleeve: 24 } },
    ],
  },
  {
    id: "sc-tshirt-women",
    name: "Női slim póló",
    measurementKeys: ["chest", "length", "shoulder", "sleeve"],
    entries: [
      { sizeCode: "XS", measurements: { chest: 84, length: 60, shoulder: 37, sleeve: 16 } },
      { sizeCode: "S", measurements: { chest: 88, length: 62, shoulder: 38, sleeve: 17 } },
      { sizeCode: "M", measurements: { chest: 92, length: 63, shoulder: 40, sleeve: 17 } },
      { sizeCode: "L", measurements: { chest: 96, length: 64, shoulder: 41, sleeve: 18 } },
      { sizeCode: "XL", measurements: { chest: 100, length: 66, shoulder: 43, sleeve: 19 } },
    ],
  },
  {
    id: "sc-hoodie",
    name: "Pulóver",
    measurementKeys: ["chest", "length", "shoulder", "sleeve"],
    entries: [
      { sizeCode: "S", measurements: { chest: 108, length: 68, shoulder: 50, sleeve: 60 } },
      { sizeCode: "M", measurements: { chest: 112, length: 70, shoulder: 52, sleeve: 61 } },
      { sizeCode: "L", measurements: { chest: 118, length: 72, shoulder: 54, sleeve: 62 } },
      { sizeCode: "XL", measurements: { chest: 124, length: 74, shoulder: 56, sleeve: 63 } },
      { sizeCode: "XXL", measurements: { chest: 130, length: 76, shoulder: 58, sleeve: 64 } },
    ],
  },
  {
    id: "sc-shorts",
    name: "Rövidnadrág",
    measurementKeys: ["waist", "hip", "length"],
    entries: [
      { sizeCode: "S", measurements: { waist: 76, hip: 98, length: 44 } },
      { sizeCode: "M", measurements: { waist: 82, hip: 104, length: 46 } },
      { sizeCode: "L", measurements: { waist: 88, hip: 110, length: 48 } },
      { sizeCode: "XL", measurements: { waist: 94, hip: 116, length: 50 } },
    ],
  },
  {
    id: "sc-pants",
    name: "Hosszúnadrág",
    measurementKeys: ["waist", "hip", "length"],
    entries: [
      { sizeCode: "S", measurements: { waist: 76, hip: 98, length: 102 } },
      { sizeCode: "M", measurements: { waist: 82, hip: 104, length: 104 } },
      { sizeCode: "L", measurements: { waist: 88, hip: 110, length: 106 } },
      { sizeCode: "XL", measurements: { waist: 94, hip: 116, length: 108 } },
    ],
  },
  {
    id: "sc-dress",
    name: "Ruha",
    measurementKeys: ["chest", "waist", "hip", "length"],
    entries: [
      { sizeCode: "XS", measurements: { chest: 84, waist: 66, hip: 90, length: 92 } },
      { sizeCode: "S", measurements: { chest: 88, waist: 70, hip: 94, length: 94 } },
      { sizeCode: "M", measurements: { chest: 92, waist: 74, hip: 98, length: 96 } },
      { sizeCode: "L", measurements: { chest: 98, waist: 80, hip: 104, length: 98 } },
      { sizeCode: "XL", measurements: { chest: 104, waist: 86, hip: 110, length: 100 } },
    ],
  },
  {
    id: "sc-skirt",
    name: "Szoknya",
    measurementKeys: ["waist", "hip", "length"],
    entries: [
      { sizeCode: "XS", measurements: { waist: 64, hip: 90, length: 70 } },
      { sizeCode: "S", measurements: { waist: 68, hip: 94, length: 71 } },
      { sizeCode: "M", measurements: { waist: 72, hip: 98, length: 72 } },
      { sizeCode: "L", measurements: { waist: 78, hip: 104, length: 73 } },
      { sizeCode: "XL", measurements: { waist: 84, hip: 110, length: 74 } },
    ],
  },
];

/**
 * Póló zónák a cm-kalibrált chartokon.
 * Torzó chart: 108 × 72 cm (u = kerület a viselő jobb oldali varrásától indulva az elején át, v = magasság).
 * Elülső nézet: x 0–54, hátsó nézet: x 54–108. Ujj chart: 36 × 22 cm, a külső fele látszik (x 9–27).
 */
export const tshirtZones: CustomizationZone[] = [
  { id: "zone-front-center", key: "front_center", displayName: "Elöl, középen", viewKey: "front", rectCm: { x: 13, y: 16, w: 28, h: 34 }, minWidthCm: 4, maxWidthCm: 28, maxHeightCm: 34, isActive: true, sortOrder: 1 },
  { id: "zone-front-chest-left", key: "front_chest_left", displayName: "Bal mellkas", viewKey: "front", rectCm: { x: 30, y: 13, w: 12, h: 12 }, minWidthCm: 3, maxWidthCm: 12, maxHeightCm: 12, isActive: true, sortOrder: 2 },
  { id: "zone-front-chest-right", key: "front_chest_right", displayName: "Jobb mellkas", viewKey: "front", rectCm: { x: 12, y: 13, w: 12, h: 12 }, minWidthCm: 3, maxWidthCm: 12, maxHeightCm: 12, isActive: true, sortOrder: 3 },
  { id: "zone-back-center", key: "back_center", displayName: "Hátul, középen", viewKey: "back", rectCm: { x: 67, y: 18, w: 28, h: 34 }, minWidthCm: 4, maxWidthCm: 28, maxHeightCm: 34, isActive: true, sortOrder: 4 },
  { id: "zone-upper-back", key: "upper_back", displayName: "Felső hát (nyak alatt)", viewKey: "back", rectCm: { x: 69, y: 7, w: 24, h: 9 }, minWidthCm: 3, maxWidthCm: 24, maxHeightCm: 9, isActive: true, sortOrder: 5 },
  { id: "zone-left-sleeve", key: "left_sleeve", displayName: "Bal ujj", viewKey: "left_sleeve", rectCm: { x: 13, y: 5, w: 10, h: 10 }, minWidthCm: 3, maxWidthCm: 10, maxHeightCm: 10, isActive: true, sortOrder: 6 },
  { id: "zone-right-sleeve", key: "right_sleeve", displayName: "Jobb ujj", viewKey: "right_sleeve", rectCm: { x: 13, y: 5, w: 10, h: 10 }, minWidthCm: 3, maxWidthCm: 10, maxHeightCm: 10, isActive: true, sortOrder: 7 },
];

export const garmentModels: GarmentModel[] = [
  {
    id: "gm-tshirt",
    slug: "tshirt",
    name: "Klasszikus póló (3D)",
    modelPath: "/models/tshirt.glb",
    mappingMode: "uv",
    silhouette: "tshirt",
    charts: [
      { key: "torso", meshName: "Torso", widthCm: 108, heightCm: 72 },
      { key: "left_sleeve", meshName: "SleeveL", widthCm: 36, heightCm: 22 },
      { key: "right_sleeve", meshName: "SleeveR", widthCm: 36, heightCm: 22 },
    ],
    views: [
      { key: "front", label: "Elöl", chartKey: "torso", crop: { x: 0, y: 0, w: 54, h: 72 }, silhouette: "tshirt" },
      { key: "back", label: "Hátul", chartKey: "torso", crop: { x: 54, y: 0, w: 54, h: 72 }, silhouette: "tshirt" },
      { key: "left_sleeve", label: "Bal ujj", chartKey: "left_sleeve", crop: { x: 9, y: 0, w: 18, h: 22 }, silhouette: "tshirt" },
      { key: "right_sleeve", label: "Jobb ujj", chartKey: "right_sleeve", crop: { x: 9, y: 0, w: 18, h: 22 }, silhouette: "tshirt" },
    ],
    zones: tshirtZones,
  },
];

interface ProductSeed {
  id: string;
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
  gender: Product["gender"];
  garmentModelSlug: string | null;
  silhouette: Product["silhouette"];
  sizeChartId: string;
  basePriceHuf: number;
  isFeatured?: boolean;
  tags?: string[];
  fitSlugs: string[];
  colorSlugs: string[];
  sizeCodes: string[];
  customizable?: boolean;
}

function makeVariants(seed: ProductSeed): ProductVariant[] {
  const variants: ProductVariant[] = [];
  let i = 0;
  for (const fit of seed.fitSlugs) {
    for (const color of seed.colorSlugs) {
      for (const size of seed.sizeCodes) {
        i += 1;
        const extra = size === "XXL" ? 500 : 0;
        variants.push({
          id: `${seed.id}-v${i}`,
          sku: `${seed.slug.toUpperCase().replace(/-/g, "")}-${fit.slice(0, 3).toUpperCase()}-${color.slice(0, 3).toUpperCase()}-${size}`,
          fitSlug: fit,
          colorSlug: color,
          sizeCode: size,
          priceHuf: seed.basePriceHuf + extra,
          stockQty: 12 + ((i * 7) % 20),
          isActive: true,
        });
      }
    }
  }
  return variants;
}

function makeProduct(seed: ProductSeed): Product {
  return {
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    description: seed.description,
    categorySlug: seed.categorySlug,
    gender: seed.gender,
    garmentModelSlug: seed.garmentModelSlug,
    silhouette: seed.silhouette,
    sizeChartId: seed.sizeChartId,
    basePriceHuf: seed.basePriceHuf,
    isFeatured: seed.isFeatured ?? false,
    isActive: true,
    tags: seed.tags ?? [],
    images: [],
    variants: makeVariants(seed),
    fitSlugs: seed.fitSlugs,
    colorSlugs: seed.colorSlugs,
    sizeCodes: seed.sizeCodes,
    customizable: seed.customizable ?? true,
  };
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CORE_SIZES = ["S", "M", "L", "XL"];

export const productSeeds: ProductSeed[] = [
  {
    id: "prod-classic-polo",
    slug: "classic-polo",
    name: "Classic póló",
    description:
      "Sűrű szövésű, 180 g/m² fésült pamut póló, dupla varrott szegéllyel. A hímzés alapja: elöl, hátul és az ujjakon is testreszabható.",
    categorySlug: "polo",
    gender: "unisex",
    garmentModelSlug: "tshirt",
    silhouette: "tshirt",
    sizeChartId: "sc-tshirt-unisex",
    basePriceHuf: 5990,
    isFeatured: true,
    tags: ["bestseller", "pamut"],
    fitSlugs: ["regular", "oversized"],
    colorSlugs: ["tortfeher", "fekete", "tengereszkek", "homok", "oliva", "bordo", "szurke"],
    sizeCodes: ALL_SIZES,
  },
  {
    id: "prod-noi-slim-polo",
    slug: "noi-slim-polo",
    name: "Női slim póló",
    description: "Karcsúsított szabású, puha, elasztikus pamut póló nőknek. Kis mellkasi logóhoz és nagy hátsó mintához egyaránt ideális.",
    categorySlug: "polo",
    gender: "women",
    garmentModelSlug: "tshirt",
    silhouette: "tshirt",
    sizeChartId: "sc-tshirt-women",
    basePriceHuf: 6490,
    isFeatured: true,
    tags: ["női"],
    fitSlugs: ["slim"],
    colorSlugs: ["tortfeher", "fekete", "puder", "krem", "oliva"],
    sizeCodes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "prod-oversize-polo",
    slug: "oversize-polo",
    name: "Oversize póló",
    description: "Vastag, 240 g/m² pamut, lecsúszott váll, bő szabás. Streetwear alap nagy hátsó hímzésekhez.",
    categorySlug: "polo",
    gender: "unisex",
    garmentModelSlug: "tshirt",
    silhouette: "tshirt",
    sizeChartId: "sc-tshirt-unisex",
    basePriceHuf: 7490,
    isFeatured: true,
    tags: ["heavyweight", "streetwear"],
    fitSlugs: ["oversized"],
    colorSlugs: ["tortfeher", "fekete", "homok", "szurke"],
    sizeCodes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "prod-heavy-polo",
    slug: "heavy-polo",
    name: "Heavy pamut póló",
    description: "Prémium, 260 g/m² organikus pamut, feszes gallér, klasszikus szabás. Az a póló, ami évekig megmarad.",
    categorySlug: "polo",
    gender: "men",
    garmentModelSlug: "tshirt",
    silhouette: "tshirt",
    sizeChartId: "sc-tshirt-unisex",
    basePriceHuf: 8990,
    tags: ["organikus", "prémium"],
    fitSlugs: ["regular", "relaxed"],
    colorSlugs: ["tortfeher", "fekete", "tengereszkek", "oliva"],
    sizeCodes: ALL_SIZES,
  },
  {
    id: "prod-kapucnis-pulover",
    slug: "kapucnis-pulover",
    name: "Kapucnis pulóver",
    description: "Bolyhozott belsejű, 320 g/m² pamut-poliészter pulóver kengurus zsebbel. Nagy hátsó és mellkasi hímzésekhez.",
    categorySlug: "pulover",
    gender: "unisex",
    garmentModelSlug: null,
    silhouette: "hoodie",
    sizeChartId: "sc-hoodie",
    basePriceHuf: 12990,
    isFeatured: true,
    tags: ["meleg"],
    fitSlugs: ["regular", "oversized"],
    colorSlugs: ["fekete", "szurke", "tengereszkek", "homok", "bordo"],
    sizeCodes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "prod-kerek-nyaku-pulover",
    slug: "kerek-nyaku-pulover",
    name: "Kerek nyakú pulóver",
    description: "Klasszikus crewneck, bordás mandzsetta és derékrész, puha belső. Elegánsabb, mint a kapucnis, ideális céges hímzéshez.",
    categorySlug: "pulover",
    gender: "unisex",
    garmentModelSlug: null,
    silhouette: "sweatshirt",
    sizeChartId: "sc-hoodie",
    basePriceHuf: 10990,
    tags: ["céges"],
    fitSlugs: ["regular"],
    colorSlugs: ["tortfeher", "fekete", "szurke", "oliva", "krem"],
    sizeCodes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "prod-ferfi-triko",
    slug: "ferfi-triko",
    name: "Férfi trikó",
    description: "Ujjatlan, könnyű pamut felső nyárra és edzéshez. Kis mellkasi hímzés a klasszikus választás.",
    categorySlug: "triko",
    gender: "men",
    garmentModelSlug: null,
    silhouette: "tank",
    sizeChartId: "sc-tshirt-unisex",
    basePriceHuf: 4990,
    fitSlugs: ["regular"],
    colorSlugs: ["tortfeher", "fekete", "szurke", "tengereszkek"],
    sizeCodes: CORE_SIZES,
  },
  {
    id: "prod-noi-triko",
    slug: "noi-triko",
    name: "Női trikó",
    description: "Karcsúsított, puha pamut trikó vékony pánttal. Apró, finom hímzésekhez ajánlott.",
    categorySlug: "triko",
    gender: "women",
    garmentModelSlug: null,
    silhouette: "tank",
    sizeChartId: "sc-tshirt-women",
    basePriceHuf: 4990,
    fitSlugs: ["slim"],
    colorSlugs: ["tortfeher", "fekete", "puder", "krem"],
    sizeCodes: ["XS", "S", "M", "L"],
  },
  {
    id: "prod-rovidnadrag",
    slug: "pamut-rovidnadrag",
    name: "Pamut rövidnadrág",
    description: "Kényelmes, gumis derekú rövidnadrág zsebekkel. A hímzés a bal combrészen kap helyet.",
    categorySlug: "rovidnadrag",
    gender: "unisex",
    garmentModelSlug: null,
    silhouette: "shorts",
    sizeChartId: "sc-shorts",
    basePriceHuf: 8990,
    fitSlugs: ["regular", "relaxed"],
    colorSlugs: ["fekete", "szurke", "homok", "oliva"],
    sizeCodes: CORE_SIZES,
  },
  {
    id: "prod-melegito-nadrag",
    slug: "melegito-nadrag",
    name: "Melegítő hosszúnadrág",
    description: "Bolyhozott belsejű, egyenes szárú melegítőnadrág. Szett a kapucnis pulóverrel, azonos hímzéssel.",
    categorySlug: "hosszunadrag",
    gender: "unisex",
    garmentModelSlug: null,
    silhouette: "pants",
    sizeChartId: "sc-pants",
    basePriceHuf: 11990,
    fitSlugs: ["regular", "relaxed"],
    colorSlugs: ["fekete", "szurke", "tengereszkek", "homok"],
    sizeCodes: CORE_SIZES,
  },
  {
    id: "prod-nyari-ruha",
    slug: "nyari-ruha",
    name: "Nyári pamutruha",
    description: "Könnyű, A-vonalú pamutruha rövid ujjal. Botanikus hímzés a mellrészen vagy a szegélyen.",
    categorySlug: "ruha",
    gender: "women",
    garmentModelSlug: null,
    silhouette: "dress",
    sizeChartId: "sc-dress",
    basePriceHuf: 13990,
    isFeatured: true,
    fitSlugs: ["regular"],
    colorSlugs: ["tortfeher", "krem", "puder", "oliva", "tengereszkek"],
    sizeCodes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "prod-midi-szoknya",
    slug: "midi-szoknya",
    name: "Midi szoknya",
    description: "Magas derekú, enyhén bővülő midi szoknya. Kis hímzés a zsebnél vagy a szegély fölött.",
    categorySlug: "szoknya",
    gender: "women",
    garmentModelSlug: null,
    silhouette: "skirt",
    sizeChartId: "sc-skirt",
    basePriceHuf: 9990,
    fitSlugs: ["regular"],
    colorSlugs: ["fekete", "krem", "bordo", "oliva"],
    sizeCodes: ["XS", "S", "M", "L", "XL"],
  },
];

export const products: Product[] = productSeeds.map(makeProduct);

export const designAssets: DesignAsset[] = [
  { id: "asset-mountain", slug: "mountain-line", name: "Hegyvonulat", url: "/design-assets/mountain-line.svg", tags: ["vonalas", "természet"] },
  { id: "asset-monogram", slug: "monogram", name: "Monogram AK", url: "/design-assets/monogram.svg", tags: ["betű", "minimal"] },
  { id: "asset-sunwave", slug: "sun-wave", name: "Nap és hullám", url: "/design-assets/sun-wave.svg", tags: ["nyár", "geometrikus"] },
  { id: "asset-paw", slug: "paw", name: "Mancs", url: "/design-assets/paw.svg", tags: ["állat", "ikon"] },
  { id: "asset-botanical", slug: "botanical", name: "Botanikus ág", url: "/design-assets/botanical.svg", tags: ["növény", "finom"] },
  { id: "asset-bolt", slug: "lightning-badge", name: "Villám embléma", url: "/design-assets/lightning-badge.svg", tags: ["embléma", "sport"] },
];

export const gallery: GalleryItem[] = [
  { id: "g1", title: "Hegyek a mellkason", description: "Vonalas hegyvonulat, tone-in-tone cérnával.", productSlug: "classic-polo", colorSlug: "tortfeher", designAssetSlug: "mountain-line", zoneKey: "front_chest_left", widthCm: 9, heightCm: 6, likes: 128 },
  { id: "g2", title: "Monogram, minimál", description: "Két betű, három cérnaszín, oversize pólón.", productSlug: "oversize-polo", colorSlug: "fekete", designAssetSlug: "monogram", zoneKey: "front_center", widthCm: 14, heightCm: 14, likes: 96 },
  { id: "g3", title: "Nap a háton", description: "Nagy hátsó hímzés, 24 cm széles.", productSlug: "classic-polo", colorSlug: "homok", designAssetSlug: "sun-wave", zoneKey: "back_center", widthCm: 24, heightCm: 20, likes: 211 },
  { id: "g4", title: "Botanikus ág a ruhán", description: "Finom, egyszínű ág a mellrészen.", productSlug: "nyari-ruha", colorSlug: "krem", designAssetSlug: "botanical", zoneKey: "front_chest_right", widthCm: 8, heightCm: 11, likes: 74 },
  { id: "g5", title: "Mancs az ujjon", description: "Apró hímzés a bal ujjon.", productSlug: "noi-slim-polo", colorSlug: "puder", designAssetSlug: "paw", zoneKey: "left_sleeve", widthCm: 5, heightCm: 5, likes: 58 },
  { id: "g6", title: "Csapatembléma pulóveren", description: "Villám embléma egy sportklub csapatának.", productSlug: "kapucnis-pulover", colorSlug: "tengereszkek", designAssetSlug: "lightning-badge", zoneKey: "front_center", widthCm: 12, heightCm: 12, likes: 143 },
  { id: "g7", title: "Céges crewneck", description: "Kis logó a mellkason, nagy a háton – 40 darabos rendelés.", productSlug: "kerek-nyaku-pulover", colorSlug: "oliva", designAssetSlug: "monogram", zoneKey: "front_chest_left", widthCm: 7, heightCm: 7, likes: 39 },
  { id: "g8", title: "Hullámok a szoknyán", description: "Geometrikus minta a szegély fölött.", productSlug: "midi-szoknya", colorSlug: "bordo", designAssetSlug: "sun-wave", zoneKey: "front_center", widthCm: 10, heightCm: 8, likes: 61 },
];

export const mockCatalog: Catalog = {
  categories,
  fits,
  colors,
  sizes,
  sizeCharts,
  garmentModels,
  products,
  designAssets,
  gallery,
};

export function findProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function findColor(slug: string): Color | undefined {
  return colors.find((c) => c.slug === slug);
}

export function findCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function findGarmentModel(slug: string | null): GarmentModel | undefined {
  if (!slug) return undefined;
  return garmentModels.find((g) => g.slug === slug);
}

export function findSizeChart(id: string): SizeChart | undefined {
  return sizeCharts.find((s) => s.id === id);
}
