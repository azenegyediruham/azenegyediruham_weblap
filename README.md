# Az én egyedi ruhám – 3D customizer webshop

Egyedi hímzett ruhák webshopja: a látogató ruhát választ, feltölti a saját grafikáját, **2D-ben, valós centiméterben** elhelyezi a megengedett hímzési zónákon belül, **3D-ben** megnézi, elmenti, kosárba teszi.

- **Production (GitHub Pages):** https://azenegyediruham.github.io/azenegyediruham_weblap/
- **Design koncepciók (10 db):** https://azenegyediruham.github.io/azenegyediruham_weblap/concepts/
- **Design Studio:** https://azenegyediruham.github.io/azenegyediruham_weblap/studio/
- **Repository:** https://github.com/azenegyediruham/azenegyediruham_weblap
- **Supabase projekt:** `tenrfvzhduqtagjxirjv`

> Állapot: MVP / első mérföldkő. A fizetés, szállítás és e-mail integráció mock, a jogi oldalak placeholderek („Élesítés előtt jogi ellenőrzés szükséges”).

---

## Tartalom

1. [Stack](#stack)
2. [Gyors indítás](#gyors-indítás)
3. [Környezeti változók](#környezeti-változók)
4. [Supabase beállítás](#supabase-beállítás)
5. [Fejlesztés, tesztek, build](#fejlesztés-tesztek-build)
6. [Deployment (GitHub Pages)](#deployment-github-pages)
7. [Saját domain](#saját-domain)
8. [3D asset workflow](#3d-asset-workflow)
9. [Új termék / ruha / méret / hímzési zóna](#új-termék--ruha--méret--hímzési-zóna)
10. [Projektstruktúra](#projektstruktúra)
11. [Hiányzó kulcsok és külső szolgáltatások](#hiányzó-kulcsok-és-külső-szolgáltatások)
12. [Dokumentáció](#dokumentáció)

---

## Stack

| Réteg | Technológia |
|---|---|
| Frontend | Next.js 16.3 (App Router, **static export**), React 19.2, TypeScript 5.9, Tailwind CSS 4 |
| 3D | three.js 0.185, @react-three/fiber 9, @react-three/drei 10, saját GLB generátor (@gltf-transform) |
| Animáció | framer-motion 13, GSAP (csak a scroll-storytelling koncepcióban), CSS |
| Űrlapok | react-hook-form 7 + zod 4 |
| Backend | Supabase (PostgreSQL 17, Auth, Storage, RLS) – kizárólag böngészőből, publishable kulccsal |
| Tesztek | Vitest (unit), Playwright + telepített Chrome (vizuális/smoke) |
| CI/CD | GitHub Actions → GitHub Pages |

React a 19.2-es sorra van pinelve, mert a `@react-three/fiber@9.7` peer dependency-je `react >=19 <19.3`.

## Gyors indítás

```bash
git clone https://github.com/azenegyediruham/azenegyediruham_weblap.git
cd azenegyediruham_weblap
npm install
cp .env.example .env.local   # töltsd ki (lásd lent)
npm run dev                  # http://localhost:3000
```

Node 20.9+ (fejlesztve Node 24-gyel), npm 10+. Supabase konfiguráció nélkül is fut: ilyenkor a katalógus a beépített mock adatokból jön, a mentés/rendelés/admin pedig jelzi, hogy backend szükséges.

## Környezeti változók

`.env.example` tartalmazza az összes nevet. **Csak `NEXT_PUBLIC_*` értékek kerülnek a kliensbe** (build időben inline-olva). A `.env.local` gitignore alatt van.

| Változó | Kliens? | Mire kell |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | igen | Supabase projekt URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | igen | publishable (anon szerepű) kulcs – RLS védi az adatot |
| `NEXT_PUBLIC_SITE_URL` | igen | abszolút URL (auth redirect, megosztás); CI-ben automatikus |
| `PAGES_BASE_PATH` | build | GitHub Pages subpath (`/azenegyediruham_weblap`); lokálisan üres |
| `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | **nem** | csak szerveroldali/adminisztratív scriptekhez; a frontend soha nem használja |
| `SUPABASE_DB_PASSWORD`, `SUPABASE_DB_URL` | nem | migrationök és seed futtatása a fejlesztői gépről |
| `SUPABASE_ACCESS_TOKEN` | nem | opcionális: Supabase CLI link / Management API |
| `RESEND_API_KEY` | nem | tranzakciós e-mail (később) |
| `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | – | fizetés (később) |
| `FOXPOST_API_USERNAME`, `FOXPOST_API_PASSWORD` | nem | szállítás (később) |

## Supabase beállítás

A séma **migrationökből** épül fel (`supabase/migrations/`), a kezdő adatok a `supabase/seed.sql`-ből. A CI-nek nincs adatbázis-hozzáférése; a migrationök a fejlesztői gépről futnak.

```bash
npm run db:push    # migrationök alkalmazása (supabase db push --db-url, nem kell login)
npm run db:seed    # seed.sql futtatása psql-lel (idempotens, újrafuttatható)
npm run db:types   # TypeScript típusok -> src/lib/supabase/database.types.ts (Docker kell hozzá)
```

Mit hoz létre: 28 tábla (katalógus, profilok, designok, kosár, rendelések, hímzőfájlok, creator jelentkezések, galéria, üzenetek, beállítások), enumok, RLS minden táblán, 6 storage bucket policy-kkal. Részletek: [docs/DATABASE.md](docs/DATABASE.md).

**Admin:** az `admin_bootstrap_emails` táblában szereplő címek (seed: `azenegyediruham@gmail.com`) regisztrációkor automatikusan `admin` szerepet kapnak. Más felhasználót az adminban (Felhasználók → Szerep) lehet adminná tenni.

**Auth URL-konfiguráció (egyszeri, manuális a Supabase dashboardon):** Authentication → URL Configuration:
- Site URL: `https://azenegyediruham.github.io/azenegyediruham_weblap`
- Redirect URLs: `http://localhost:3000/**`, `https://azenegyediruham.github.io/azenegyediruham_weblap/**`

Enélkül a megerősítő/jelszó-visszaállító linkek a Site URL-re esnek vissza.

## Fejlesztés, tesztek, build

```bash
npm run dev          # Turbopack dev szerver
npm run lint         # ESLint 9 (eslint-config-next, React Compiler szabályok)
npm run typecheck    # tsc --noEmit
npm test             # Vitest unit tesztek (geometria, árazás, asset helper)
npm run build        # statikus export -> out/
npm run shot -- http://localhost:3000/concepts/01-premium-minimal/ shots/01.png   # görgetett full-page screenshot
node scripts/smoke-studio.mjs shots   # Studio smoke-teszt (termék -> minta -> drag -> 3D -> kosár)
npm run models:generate               # public/models/tshirt.glb újragenerálása
```

## Deployment (GitHub Pages)

Minden `main`-re történő push lefuttatja a `.github/workflows/deploy.yml`-t:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. `npm run build` (static export, `PAGES_BASE_PATH` az `actions/configure-pages` outputjából)
6. `.nojekyll` + `actions/upload-pages-artifact` → `actions/deploy-pages`

A Supabase publikus értékek repository **variables**-ként vannak beállítva (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). A Pages forrása „GitHub Actions”. Részletek: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Nincs futó Node szerver: minden dinamikus funkció böngészőből, Supabase-en keresztül működik (RLS-sel), a termékoldalak query-paraméteresek (`/shop/product/?slug=…`), így adminból felvett termék rebuild nélkül elérhető.

## Saját domain

1. DNS: `CNAME www → azenegyediruham.github.io` (vagy apex A rekordok a GitHub Pages IP-ire).
2. Repo → Settings → Pages → Custom domain; a workflow-ba `public/CNAME` kerül.
3. Saját domainnél nincs subpath: a `configure-pages` üres `base_path`-ot ad, a config automatikusan alkalmazkodik.
4. Supabase Auth URL-ek frissítése az új domainre; `NEXT_PUBLIC_SITE_URL` automatikus.

## 3D asset workflow

- A jelenlegi póló (`public/models/tshirt.glb`) **generált** modell (`scripts/generate-tshirt-glb.mjs`): valós méret (1 unit = 1 m), külön mesh-ek (`Torso`, `SleeveL`, `SleeveR`, `Collar`).
- **cm-kalibrált UV**: a torzó chart 108 × 72 cm (u = kerület, v = magasság; elöl nézet x 0–54, hátul 54–108), az ujj chart 36 × 22 cm. A 2D szerkesztő cm-koordinátái közvetlenül textúra-koordináták, ezért a 3D előnézet méretpontos.
- Blenderből exportált GLB csere: ugyanezt a chart-konvenciót kell tartani (mesh nevek, UV kiosztás), majd `garment_models` sor (charts/views JSON) és `customization_zones` felvétele adminból. Részletek: [docs/3D-CUSTOMIZER.md](docs/3D-CUSTOMIZER.md).

## Új termék / ruha / méret / hímzési zóna

Mind adminból (`/admin/`), kódmódosítás nélkül:

- **Új terméktípus (kategória):** Kategóriák → Új (slug, név, sziluett).
- **Új ruha (termék):** Termékek → Új (kategória, nem, 3D/2D modell, mérettáblázat, alapár) → Termékvariánsok → Új (fazon × szín × méret, készlet).
- **Új méret:** Méretek → Új; majd Mérettáblázat sorok → Új (cm értékek JSON-ben).
- **Új mérettáblázat:** Mérettáblázatok → Új (`measurement_keys`: chest, length, shoulder, sleeve, waist, hip – csak a releváns mezők).
- **Új hímzési zóna:** Hímzési zónák → Új (modell, kulcs, nézet, cm bounding box, min/max méret).
- **Új 3D modell:** 3D ruhamodellek → Új (GLB feltöltés a `garment-models` bucketbe, charts/views JSON).
- **Kontakt, hero, featured, creator szabályok, árazás:** Oldalbeállítások (JSON kulcsonként).

Ugyanezek seedelhetők is (`supabase/seed.sql`, determinisztikus UUID-kkal).

## Projektstruktúra

```
src/app/                 route-ok (static export): /, /concepts/*, /shop, /studio, /auth/*, /admin/*, ...
src/components/          three (3D viewer), customizer (2D szerkesztő), shop, forms, admin, layout
src/concepts/            a 10 design koncepció saját komponensei/stílusai
src/lib/catalog/         domain típusok, Supabase repository + mock fallback
src/lib/customizer/      geometria (zóna-clamp), textúra-kompozíció, SVG sanitization, feltöltés
src/lib/store/           design session (localStorage + IndexedDB), kosár
src/lib/pricing/         cserélhető árazási stratégia
src/lib/admin/           admin erőforrás-definíciók
src/data/mock-catalog.ts mock katalógus (= seed tartalma)
supabase/migrations/     séma, RLS, storage; supabase/seed.sql
scripts/                 GLB generátor, db helper, screenshot, smoke teszt
docs/                    architektúra, adatbázis, 3D/customizer, deployment, hímzés workflow, koncepciók
```

## Hiányzó kulcsok és külső szolgáltatások

| Szolgáltatás | Kulcs | Mire kell | Kötelező most? | Hol szerezhető |
|---|---|---|---|---|
| Supabase | `SUPABASE_ACCESS_TOKEN` (sbp_…) | CLI link, Management API (Auth URL config automatizálása) | nem – a dashboard lépés elég | supabase.com/dashboard/account/tokens |
| Supabase SMTP | saját SMTP (pl. Resend) | megbízható auth e-mailek (a beépített küldő órás limitje 2–4 e-mail) | élesítés előtt igen | Authentication → SMTP Settings |
| Resend | `RESEND_API_KEY` | rendelés-visszaigazolás, státusz e-mail, creator értesítés (Edge Function) | nem | resend.com |
| Stripe | `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | kártyás fizetés (Edge Function + webhook) | nem (mock checkout) | dashboard.stripe.com |
| FOXPOST | `FOXPOST_API_USERNAME`, `FOXPOST_API_PASSWORD` | csomagautomata-választó, címke | nem | foxpost.hu partner |
| Instagram / TikTok API | app credentials | automatikus követőszám-ellenőrzés | nem (manuális) | developers.facebook.com, developers.tiktok.com |

## Biztonság

- Secretek soha nem kerülnek a repóba; a kliens csak a publishable kulcsot kapja, minden adat RLS mögött.
- SVG feltöltés DOMPurify-jal tisztítva (script, event handler, külső hivatkozás eltávolítva), raszterizálva jelenik meg.
- Felhasználói fájlok privát bucketben, `{user_id}/…` mappában; olvasás aláírt URL-lel.
- A `profiles.role` oszlopot kliensből nem lehet módosítani (oszlopszintű grant), admin csak `is_admin()`-nel.
- **Javaslat:** a fejlesztés során chatben megosztott GitHub PAT és Supabase service_role/secret kulcs rotálása.

## Dokumentáció

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) – rétegek, adatfolyam, state, routing static exporton
- [docs/DATABASE.md](docs/DATABASE.md) – táblák, enumok, RLS, storage, migration workflow
- [docs/3D-CUSTOMIZER.md](docs/3D-CUSTOMIZER.md) – GLB, cm-kalibrált UV, textúra-kompozíció, decal mód, hímzés-effekt, editor
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) – GitHub Pages, basePath, variables, saját domain, Auth URL-ek
- [docs/EMBROIDERY-WORKFLOW.md](docs/EMBROIDERY-WORKFLOW.md) – fájloktól a hímzőgépig, adatmodell-előkészítés
- [docs/DESIGN-CONCEPTS.md](docs/DESIGN-CONCEPTS.md) – a 10 koncepció összehasonlítása
