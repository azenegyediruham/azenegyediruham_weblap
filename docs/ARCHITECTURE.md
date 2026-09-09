# Architektúra

## Alapelv

**Statikus frontend + Supabase backend, futó szerver nélkül.** A Next.js `output: 'export'` módban HTML/JS/CSS-t generál, amit GitHub Pages szolgál ki. Minden dinamikus művelet (katalógus, auth, feltöltés, mentés, rendelés, admin) böngészőből, `@supabase/supabase-js`-sel, a publishable kulccsal történik; a jogosultságot kizárólag a Postgres RLS és a Storage policy-k adják.

```
Böngésző (Next static export, React 19)
 ├─ Katalógus repo ── Supabase REST (RLS: public read) ── fallback: mock katalógus
 ├─ Auth (implicit flow) ── Supabase Auth ── profiles (trigger, admin bootstrap)
 ├─ Studio ── design session (localStorage + IndexedDB) ── mentés: Storage (user-designs) + saved_designs
 ├─ Kosár (localStorage) ── checkout: orders + order_items (RLS: saját user_id)
 └─ Admin ── generikus CRUD (is_admin() RLS) + Storage uploadok
```

## Rétegek

| Réteg | Hely | Felelősség |
|---|---|---|
| Route-ok | `src/app/**` | oldalak; a dinamikus tartalmú oldalak kliens komponensek `Suspense`-ben |
| Domain típusok | `src/lib/catalog/types.ts` | UI-független modell (Product, GarmentModel, CustomizationZone…) |
| Repository | `src/lib/catalog/repo.ts` | Supabase sorok → domain típusok; 60 s cache; mock fallback hiba/konfig hiánya esetén |
| Állapot | `src/lib/store/*` | design session (perzisztens), kosár (perzisztens) – React context |
| Auth | `src/lib/auth/AuthProvider.tsx` | session + profil + `isAdmin` |
| Beállítások | `src/lib/settings/SiteSettingsProvider.tsx` | `site_settings` → kontakt, hero, creator szabályok, pricing (alapértékek: `src/config/site.ts`) |
| Customizer | `src/lib/customizer/*` | geometria (zóna-clamp), textúra-kompozíció, SVG sanitization, feltöltés-pipeline |
| 3D | `src/components/three/*` | GLB betöltés, canvas textúrák, viewer |
| Árazás | `src/lib/pricing/` | `PricingStrategy` interface, szabályalapú mock, `site_settings.pricing` felülírás |
| Admin | `src/lib/admin/resources.ts` + `src/components/admin/*` | deklaratív erőforrás-definíciók → generikus tábla+űrlap |

## Miért query-paraméteres termékoldal?

Static exporton a `/shop/[slug]` route-hoz build időben ismerni kellene minden slugot, és minden új termék rebuildet igényelne. Ehelyett `/shop/product/?slug=…` egyetlen statikus oldal, ami kliensen tölti a terméket. A „szép” linkeket (`/shop/<slug>/`, `/design/<kód>/`) a 404 oldal kliensoldalon irányítja át (`PrettyUrlRedirect`), mert GitHub Pages ismeretlen útvonalra `404.html`-t ad.

## basePath

GitHub Pages a repó neve alatt szolgál ki. A `next.config.ts` a `PAGES_BASE_PATH` env-ből állítja a `basePath`/`assetPrefix`-et és `NEXT_PUBLIC_BASE_PATH`-ként kiadja; minden nem-Next hivatkozás (GLB, SVG, képek) az `asset()` helperen megy át (`src/lib/asset-url.ts`).

## Adatfolyam a Studióban

1. Termék + variáns kiválasztása → `design-session` (productSlug, fit/color/size).
2. Feltöltés (`processUploadedFile`) → validáció → SVG sanitization + raszterizálás → `DesignSource` (kép + blob); a blob IndexedDB-be kerül, a meta localStorage-ba.
3. Elhelyezés: `StoredPlacement` (zóna, chart, x/y/w/h cm, forgatás) – `constrainToZone` minden módosításnál.
4. 3D: `resolvedPlacements` (kép + cm adatok) → `ShirtModel` → panelenként canvas textúra (`composeChartTexture`) + normal map (hímzés).
5. Mentés (login): Storage feltöltés `user-designs/{uid}/…`, `user_uploads`, `saved_designs` (DES-kód), `saved_design_items` (zóna-relatív cm koordináták).
6. Kosár: snapshot (placements + source meta + DES-kód + hímzés ár) → checkout → `orders`/`order_items` (`design_snapshot` jsonb).

## Kliens-oldali guardok vs. RLS

Az admin és a profil oldalak kliensen ellenőrzik a bejelentkezést/szerepet (UX), de a valódi védelem az RLS: az `is_admin()` SECURITY DEFINER függvény a `profiles.role`-t nézi, a `role` oszlopot a felhasználó nem írhatja.

## Bővítési pontok

- **Fizetés:** Edge Function (Stripe Checkout session + webhook → `orders.payment_status`).
- **E-mail:** Edge Function / DB webhook (Resend) rendelés- és státuszváltozásra.
- **Szállítás:** `orders.shipping_method` szöveges; FOXPOST automata-választó a checkoutba, `shipping_reference` a címkéhez.
- **Közösség:** `saved_designs.is_public`, `design_likes`, designer profil – a séma készen áll.
- **B2B:** `pricing.quantityTiers`, egyedi ajánlat a kapcsolat űrlapon; később `quotes` tábla.
- **Több 3D modell:** `garment_models` + `customization_zones` adminból, GLB a `garment-models` bucketben.
