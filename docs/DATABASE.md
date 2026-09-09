# Adatbázis

PostgreSQL 17 (Supabase), séma: `public`. Minden tábla RLS-sel. Migrationök: `supabase/migrations/`, seed: `supabase/seed.sql`.

## Táblák

### Katalógus
| Tábla | Leírás | Kulcs kapcsolatok |
|---|---|---|
| `categories` | terméktípusok (póló, pulóver, …), sziluett kulccsal | – |
| `fits` | fazonok | – |
| `colors` | színek (hex) | – |
| `sizes` | méretkódok | – |
| `size_charts`, `size_chart_entries` | termékenként külön mérettáblázat; `measurement_keys` = csak a releváns mezők; sorok `measurements` jsonb (cm) | entries → charts, sizes |
| `garment_models` | 3D/2D ruhamodell: `model_path` (GLB), `mapping_mode` (uv/decal), `charts` és `views` jsonb (cm-kalibrált) | – |
| `customization_zones` | hímzési zónák modellenként: `key`, `view_key`, `rect_*` (cm), min/max méret, opcionális `mapping_3d` | → garment_models |
| `products` | ruha: kategória, nem, modell, mérettáblázat, alapár, featured/customizable | → categories, garment_models, size_charts |
| `product_variants` | fazon × szín × méret, SKU, készlet, ár-felülírás (unique a négyesre) | → products, fits, colors, sizes |
| `product_images` | képek (galéria/sablon), opcionálisan színhez | → products, colors |
| `design_assets` | beépített minták | – |
| `site_settings` | key/value jsonb (brand, contact, social, hero, featured, creator_program, pricing, production, legal) | – |
| `admin_bootstrap_emails` | regisztrációkor automatikusan admin | – |

### Felhasználók és designok
| Tábla | Leírás |
|---|---|
| `profiles` | auth.users 1:1, `role` (customer/admin); trigger hozza létre |
| `user_uploads` | feltöltött forrásfájlok (storage út, előnézet, méretek, `is_vector`, `sanitized`) |
| `saved_designs` | mentett design `public_code` (DES-XXXXXX), termék/variáns/szín/méret, előnézet, `is_public`, `likes_count`, `config` jsonb |
| `saved_design_items` | zónánként: forrás (upload/asset), x/y (zónaközéphez, cm), forgatás, `width_cm`/`height_cm`, `embroidery` jsonb |
| `design_likes` | like-ok (trigger tartja karban a `likes_count`-ot) |

### Vásárlás
| Tábla | Leírás |
|---|---|
| `carts`, `cart_items` | bejelentkezett kosár szinkronhoz (vendég kosár csak kliensen) |
| `orders` | rendelés: `order_number` (AER-ÉÉÉÉ-NNNNNN), státuszok, szállítási/fizetési mód (szöveg, szolgáltatófüggetlen), címek jsonb, összegek |
| `order_items` | tételek pillanatképpel (`variant_snapshot`, `design_snapshot`) |
| `order_status_history` | státuszváltozások (trigger írja) |
| `order_item_embroidery_files` | gyártási fájlok tételenként/zónánként: forrás, előnézet, digitizált fájl, gépformátum, öltésszám, cérnaszínek, fizikai méret, státusz |

### Közösség / kapcsolat
| Tábla | Leírás |
|---|---|
| `creator_applications` | Creator Program jelentkezések, státusz: submitted → reviewing → approved/rejected → fulfilled |
| `gallery_items` | inspirációs galéria |
| `contact_messages` | kapcsolati üzenetek |

## Enumok
`gender_type`, `user_role`, `order_status`, `payment_status`, `creator_application_status`, `design_item_source`, `product_image_kind`, `garment_view`, `mapping_mode`, `embroidery_file_status`.

## RLS elvek
- Katalógus: `select` anon+auth `is_active`-ra (vagy publikált), admin `for all` (`is_admin()`).
- Felhasználói adatok: `user_id = (select auth.uid())`; kapcsolt táblák `exists` a szülőre.
- `orders`: user insert/select saját; update/delete csak admin (státuszt admin állít).
- `creator_applications`, `contact_messages`: anon és auth **insert**; select saját / admin.
- `profiles`: saját olvasás/frissítés, `role` oszlop kliensből nem írható (`revoke update … grant update (display_name, avatar_path, phone)`).
- `is_admin()`: `security definer stable set search_path=''`, a tulajdonos megkerüli az RLS-t → nincs rekurzió.

## Storage bucketek
| Bucket | Publikus | Tartalom | Policy |
|---|---|---|---|
| `product-images` | igen | termék-, kategória-, galériaképek | olvasás mindenki, írás admin |
| `garment-models` | igen | GLB modellek, előnézetek | olvasás mindenki, írás admin |
| `design-assets` | igen | beépített minták | olvasás mindenki, írás admin |
| `user-designs` | nem | `{uid}/uploads/*`, `{uid}/previews/*` | saját mappa CRUD, admin olvasás |
| `order-previews` | nem | rendelési előnézetek | saját mappa olvasás, admin minden |
| `creator-applications` | nem | képernyőképek `{uid}|anonymous/*` | insert anon+auth (saját mappa), olvasás saját/admin |

Méret- és MIME-korlátok bucketenként (10–50 MB).

## Migration workflow
```bash
# új migration
supabase/migrations/2026MMDDHHMMSS_leiras.sql
npm run db:push          # remote (SUPABASE_DB_URL a .env.local-ból); --dry-run támogatott
npm run db:seed          # idempotens seed
npm run db:types         # típusok (Docker szükséges a pg-meta image-hez)
```
A migration history a `supabase_migrations.schema_migrations` táblában van. Lokális stack (`supabase start`) opcionális.

## Seed
`public.seed_uuid(key)` determinisztikus UUID-t ad (uuid v5), így a seed újrafuttatható és a rekordok stabilan hivatkozhatók. A seed tükrözi a frontend mock katalógusát (`src/data/mock-catalog.ts`).

## DES-kód
`generate_design_code()` 6 karakteres, nem összetéveszthető karakterekből (ABCDEFGHJKLMNPQRSTUVWXYZ23456789) generál egyedi kódot: `DES-84F2KD`. Megosztás: `/design/?code=DES-84F2KD`.
