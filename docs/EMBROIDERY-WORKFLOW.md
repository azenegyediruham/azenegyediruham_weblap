# Hímzési workflow

## Amit a vásárló lát
KÉP → RUHÁRA HELYEZÉS (zónán belül, cm-ben) → MÉRET → PREVIEW → 3D PREVIEW → RENDELÉS. A vásárlónak nem kell tudnia a hímzőgép fájlformátumáról.

## Amit a rendszer tárol rendeléskor
`order_items.design_snapshot` (jsonb):
```json
{
  "placements": [
    { "zoneKey": "front_center", "chartKey": "torso", "viewKey": "front",
      "xCm": 27, "yCm": 33, "widthCm": 19.6, "heightCm": 15.6, "rotationDeg": 0,
      "sourceId": "…", "embroidery": true }
  ],
  "sourceMeta": { "…": { "name": "logo.svg", "mime": "image/svg+xml", "kind": "upload" } },
  "savedDesignCode": "DES-84F2KD",
  "embroideryTotalHuf": 13139
}
```
Mentett designnál a forrásfájlok a `user-designs` bucketben vannak (`{uid}/uploads/{id}.svg|png`), a tisztított SVG vektorosan megőrizve.

## Gyártási fájlok táblája (előkészítve)
`order_item_embroidery_files` – tételenként és zónánként:
| Mező | Tartalom |
|---|---|
| `original_source_path` | a vásárló forrásfájlja (PNG/SVG) |
| `preview_path` | jóváhagyott előnézet (2D/3D render) |
| `digitized_path` | digitizált hímzőprogram (később) |
| `embroidery_machine_format` | pl. DST, PES, JEF, EXP – a gép ismeretében |
| `stitch_count` | öltésszám (becslés → digitizálás után pontos) |
| `thread_colors` | jsonb lista (pl. Madeira/Isacord kódok) |
| `physical_width_cm`, `physical_height_cm` | a vásárló által beállított fizikai méret |
| `status` | pending → digitizing → ready / rejected |

## Későbbi pipeline (ha ismert a gép és a szoftver)
1. **Fájl beérkezik** (rendelés) → automatikus sor a `order_item_embroidery_files`-ban minden zónára.
2. **Ellenőrzés**: felbontás, minimális vonalvastagság (≥ 0,8 mm), betűméret (≥ 4 mm), színek száma.
3. **Digitizálás**: szoftver (pl. Wilcom, Hatch, Embrilliance, Ink/Stitch) – a `physical_width_cm` a pontos méret; export gépformátumba.
4. **Gép**: befogás a zóna szerinti keretbe; a `chart`/zóna adatok a keret pozícióját is adják.
5. **QC**: méret ellenőrzése a rendelés cm-adataival; mosáspróba mintánként.
6. Státusz `ready` → `orders.status` `in_production` → `ready` → `shipped` (e-mail később Resenddel).

Ha nyílt forrású utat választotok: **Ink/Stitch** (Inkscape) SVG-ből DST/PES-t készít – a rendszerben tárolt tisztított SVG közvetlenül használható kiindulásnak.

## Becslés és árazás
`src/lib/pricing/`: öltésszám becslés `stitchesPerCm2` (alap 110) × terület; hímzés ára = alapdíj + cm² × egységár + extra színek + extra pozíciók; mennyiségi sávok, sürgősségi felár. A szabályok a `site_settings.pricing` kulcsból felülírhatók adminból; a digitizálás utáni valós öltésszám később visszaírható az `order_item_embroidery_files.stitch_count` mezőbe és az ár újraszámolható.

## Hímzés vizuális effekt (preview)
Csak vizuális: öltés-mintás overlay a design alfa-területén, enyhe belső gradiens és árnyék, valamint generált normal map a 3D anyagon (relief). Nem fizikai szimuláció; célja, hogy a vásárló értse, „cérna lesz, nem nyomat”.
