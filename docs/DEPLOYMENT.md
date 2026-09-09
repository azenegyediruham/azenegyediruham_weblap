# Deployment

## Production
- URL: https://azenegyediruham.github.io/azenegyediruham_weblap/
- Forrás: GitHub Actions (`.github/workflows/deploy.yml`), trigger: push a `main`-re vagy manuális `workflow_dispatch`.
- Pages beállítás: repo Settings → Pages → Source: **GitHub Actions** (API-val bekapcsolva: `build_type=workflow`).

## Pipeline
1. `actions/checkout`, `actions/setup-node` (Node 24, npm cache)
2. `npm ci`
3. `npm run lint` – ESLint (hibára megáll)
4. `npm run typecheck` – `tsc --noEmit`
5. `npm test` – Vitest
6. `actions/configure-pages` → `base_path` és `origin` outputok
7. `npm run build` env-ekkel:
   - `PAGES_BASE_PATH=${{ steps.setup_pages.outputs.base_path }}` → `next.config.ts` `basePath`/`assetPrefix`
   - `NEXT_PUBLIC_SITE_URL=origin+base_path`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` a repository **variables**-ból (`gh variable set …`)
8. `touch out/.nojekyll` (a `_next/` mappa miatt), `actions/upload-pages-artifact` (`out/`), `actions/deploy-pages`

Nincs szerveroldali secret a pipeline-ban; a DB migrationök a fejlesztői gépről futnak (`npm run db:push`).

## Static export korlátok és megoldások
- Nincs `next/image` optimalizálás (`images.unoptimized`), nincs middleware/route handler/server action.
- Dinamikus útvonalak: csak lokális tartalmú `generateStaticParams` (`/legal/[slug]`, `/admin/[resource]`); termékek és designok query-paraméterrel.
- `trailingSlash: true` → minden URL `/`-re végződik (GitHub Pages 301-ez egyébként).
- 404: `app/not-found.tsx` → `out/404.html`; kliensoldali átirányítás a szép URL-ekről.

## Saját domain
1. DNS: `www` CNAME → `azenegyediruham.github.io`; apex: A rekordok 185.199.108–111.153 (GitHub Pages).
2. Settings → Pages → Custom domain (+ Enforce HTTPS). A workflow-ba `public/CNAME` fájl a domainnel.
3. `configure-pages` saját domainnél üres `base_path`-ot ad → az oldal gyökérből szolgál ki, kód nem változik.
4. Supabase Auth → URL Configuration: Site URL és Redirect URL az új domainre.

## Supabase Auth URL-ek (egyszeri manuális lépés)
Authentication → URL Configuration:
- Site URL: `https://azenegyediruham.github.io/azenegyediruham_weblap`
- Redirect URLs: `http://localhost:3000/**`, `https://azenegyediruham.github.io/azenegyediruham_weblap/**`

A `**` a mélyebb útvonalakat is engedi (`/auth/callback/`, `/auth/reset-password/`). Az alkalmazás implicit flow-t használ, így az e-mail link más eszközön megnyitva is működik.

## Rollback
GitHub → Actions → korábbi sikeres run → „Re-run all jobs”, vagy `git revert` a `main`-en (új deploy).

## Helyi ellenőrzés a deploy előtt
```bash
PAGES_BASE_PATH=/azenegyediruham_weblap npm run build   # subpath-os build
npx serve out   # vagy bármilyen statikus szerver; a subpath miatt /azenegyediruham_weblap/ alatt nyisd
```
