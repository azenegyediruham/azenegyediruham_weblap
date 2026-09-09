# 3D viewer és customizer

## Áttekintés

A 2D szerkesztő az elsődleges, precíz eszköz; a 3D nézet ugyanazokból a cm-adatokból készül. A kulcs: **a 3D modell UV-chartjai centiméterben kalibráltak**, így a 2D vászon koordinátái közvetlenül textúra-koordináták.

## A generált póló (proof-of-concept)

`scripts/generate-tshirt-glb.mjs` → `public/models/tshirt.glb` (~300 kB, tömörítetlen, nincs Draco-függés).

- 1 unit = 1 m, Y felfelé, az eleje +Z. Magasság ~0,72 m.
- Mesh-ek: `Torso` (szuperellipszis keresztmetszet, kalibrált 108 cm kerület, lekerekített váll, nyakkivágás), `SleeveL` (viselő bal = +X), `SleeveR`, `Collar`.
- UV konvenció (glTF: v=0 a kép teteje):
  - Torzó chart **108 × 72 cm**: u = ívhossz a kerület mentén, a viselő jobb oldali varrásától (nézetből bal) indulva az elején át; u=0.25 elöl közép, u=0.5 a másik varrás, u=0.75 hátul közép. v = magasság (vállvonal = 0, alj = 72 cm).
  - Ujj chart **36 × 22 cm**: u = kerület (u=0.5 az ujj teteje, ide kerül a logó), v = gyökér(0) → mandzsetta(22).
- A váll környékén (kisebb kerület) az u a középvonalhoz igazítva marad cm-pontos; a varrás felé eső, nem használt sáv sima szövet.

## Chartok, nézetek, zónák (adatmodell)

`garment_models.charts`: `[{ key, meshName, widthCm, heightCm }]` – egy chart = egy mesh textúrája.
`garment_models.views`: `[{ key: front|back|left_sleeve|right_sleeve, label, chartKey, crop: {x,y,w,h}, silhouette }]` – a szerkesztő egy chart kivágását mutatja (pl. elöl = torzó x 0–54).
`customization_zones`: `view_key` + `rect_x/y/w/h` **a chart koordinátarendszerében**, `min_width_cm`, `max_width_cm`, `max_height_cm`.

Példa (póló): `front_center` = torzó chart x 13–41, y 16–50 → elöl nézet közepe; `back_center` = x 67–95 (a hátsó fél); `left_sleeve` = ujj chart x 13–23, y 5–15.

## Textúra-kompozíció (elsődleges mód, `mapping_mode = 'uv'`)

`src/lib/customizer/texture-composer.ts`
1. Chartonként offscreen canvas (`pxPerCm` ≈ 18 → torzó 1944 × 1296 px).
2. Alapszín + procedurális szövet-csempe (`fabricTile`).
3. Minden elhelyezés: a kép egy rétegen, hímzés-effekttel (öltés-minta `source-atop`, enyhe gradiens, árnyék), majd forgatva a középpontjára rajzolva (`xCm, yCm` = középpont).
4. Normal map canvas: a design alfa-területén öltésirányú normálok → relief.
5. `THREE.CanvasTexture` (`flipY=false` a glTF UV miatt, `SRGBColorSpace`), `needsUpdate` változáskor, `invalidate()` on-demand rendereléshez.

Előny: cm-pontos, nincs z-fighting, több design zónánként, ugyanaz a canvas a gyártási preview (`renderPreviewBlob`).

## Decal mód (másodlagos, `mapping_mode = 'decal'`)

Nem kalibrált UV-jú modellekhez. A zóna `mapping_3d` mezője: `{ meshName, anchor:[x,y,z], right:[x,y,z], up:[x,y,z], depth }`. Pozíció = `anchor + right·dx − up·dy` (dx/dy méterben a zóna közepétől), scale = `[w_m, h_m, depth]`, forgatás numerikus (drei `Decal` a legközelebbi csúcs normáljához igazít). `depthTest` bekapcsolva, `polygonOffset` a z-fighting ellen. Kód-szinten előkészítve (`mapping_3d`), a seed nem használja.

Megvizsgált alternatívák: decal projekció (egyszerű, de mélység/görbület problémák, ujjon torzul), UV compositing (választott), raycast alapú közvetlen 3D szerkesztés (később: raycast → chart cm koordináta a UV-ból, ugyanaz az adatmodell).

## 2D szerkesztő

`src/components/customizer/DesignEditor.tsx` – SVG, viewBox cm-ben.
- Ruha-kontúr sziluettenként/nézetenként (`garment-outlines.ts`), zónák szaggatott kerettel és feliratokkal.
- Interakció: drag (egér/touch, `@use-gesture`), pinch (skála + forgatás), kerék (méret), sarok-fogantyúk (arányos skálázás), forgatás-fogantyú (Shift: 15°-os lépések), billentyűk (nyilak, +/−, [ ], Delete).
- Korlátozás (`geometry.ts`): `clampSize` (min/max szélesség, max magasság, arány), `clampPosition` (forgatott bounding box a zónán belül), `constrainToZone` (ha forgatva nem fér, kicsinyít). Unit tesztek: `geometry.test.ts`.
- Kijelzés: `11,5 × 7,2 cm` élőben; tárolt mezők: zone, chart, view, x/y (cm), rotation, width/height (cm), embroidery, source.

## Feltöltés

`src/lib/customizer/upload.ts`: PNG/JPG/WebP/SVG, max 10 MB, felbontás-figyelmeztetés (< 600 px), JPG figyelmeztetés (nincs átlátszóság). SVG: `sanitizeSvg` (DOMPurify svg profil, script/foreignObject/href tiltva) → raszterizálás 1024 px-re (explicit width/height a Firefox miatt) → a tisztított SVG megmarad vektoros forrásnak.

## Viewer

`ShirtViewer` (R3F): OrbitControls (pan tiltva, zoom opcionális), 3 pontos világítás + `ContactShadows`, auto-forgás tétlenségnél (4 s), `frameloop="demand"` ha nem forog, láthatóság alapú szünet (IntersectionObserver), `dpr` cap (1.75, gyenge eszközön 1), árnyék kikapcsolva gyenge eszközön, `useProgress` loading, `prefers-reduced-motion` → nincs auto-forgás. `ShirtViewerLazy`: `dynamic(ssr:false)` + WebGL-detekció → SVG sziluett fallback.

## Blender export checklist (éles modellek)

1. Valós méret (m), origó a talpponton, +Z előre, +Y fel; Apply transforms.
2. Panelenként külön mesh (`Torso`, `SleeveL`, `SleeveR`, …), nevek a `charts.meshName`-mel egyezően.
3. UV: panelenként téglalap chart, u = kerület cm-arányosan, v = magasság; a chart cm-méretét a `charts` JSON rögzíti.
4. Nincs Draco (vagy a dekóder önállóan hosztolt), textúra nincs beégetve (a színt/textúrát a kliens adja).
5. GLB feltöltés adminból (`garment-models` bucket) → `garment_models.model_path` → zónák felvétele.
