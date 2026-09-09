# A 10 design koncepció összehasonlítása

Selector: `/concepts/` – mind a tíz külön URL-en fut, ugyanazzal a mock katalógussal és ugyanazzal a 3D pólóval. **A végső irány kiválasztása a megrendelő döntése.** Több koncepció elemei kombinálhatók (pl. 01 layout + 09 hero-customizer + 08 spec-lapok a termékoldalon).

| # | Név / URL | Stílus | Erősség | Gyengeség | 3D hangsúly | Mobil | Prémium érzet | Technikai komplexitás | Célközönség |
|---|---|---|---|---|---|---|---|---|---|
| 01 | Premium Minimal `/concepts/01-premium-minimal` | high-fashion minimál, törtfehér, Inter Tight + Instrument Serif | időtálló, tipográfia viszi, könnyen bővíthető webshoppá | kevés „wow”, a hímzés tapinthatósága háttérbe szorul | hero (auto-forgás) | kiváló | ★★★★★ | alacsony | 25–45, minőségre érzékeny, design-tudatos |
| 02 | Streetwear Lab `/concepts/02-streetwear-lab` | fekete/sav-sárga, Archivo Black, matricák, bento grid, ticker | erős karakter, fiatalos energia, közösségi tartalomhoz ideális | polarizáló, prémium vásárlót elriaszthat; sok dekor | kiegészítő (rotált kártyában) | jó | ★★★ | közepes | 16–30, streetwear, kreatív közösség, creatorok |
| 03 | Immersive 3D `/concepts/03-immersive-3d` | cinematic, sticky 3D hero, scroll-vezérelt kamera, hímzés reveal | a 3D mint USP azonnal átjön, emlékezetes | nehezebb tartalom-bővítés, gyenge eszközön kompromisszum, scroll-hossz | főszereplő | közepes (reduced-motion fallback van) | ★★★★ | magas | design-érzékeny, tech-affinis, „élmény” vásárló |
| 04 | Modern Atelier `/concepts/04-modern-atelier` | meleg tónusok, Fraunces, textil makrók, szabásminta, cérna | a hímzés/kézműves érték hitelesen jelenik meg, bizalmat épít | kevésbé „tech”, a customizer másodlagosnak tűnhet | kiegészítő (arch-keret) | jó | ★★★★ | alacsony–közepes | 30–55, ajándék, céges, minőségközpontú |
| 05 | Future Fashion `/concepts/05-future-fashion` | grafit, Manrope + Plex Mono, fényrig, HUD-specifikáció, anyagváltó | a precizitás és a 3D technológia narratívája erős, interaktív | sötét UI-n a szövetszínek kevésbé hűek; könnyen „gamer” irányba csúszhat | színpad (interaktív) | jó | ★★★★ | közepes | 20–40, tech, teljesítmény/sport, csapatok |
| 06 | Editorial `/concepts/06-editorial` | magazin, Playfair, aszimmetrikus grid, lookbook, drop cap | storytelling, inspirációs tartalomhoz és fotókhoz kiváló | valódi fotók nélkül gyengébb; konverziós utak hosszabbak | kiegészítő (oldalsáv) | jó (hosszú) | ★★★★★ | alacsony | divatkövető, női közönség, tartalommarketing |
| 07 | Color Block `/concepts/07-color-block` | erős színblokkok, Unbounded, kategóriánként háttérváltás | kategória-navigáció vizuálisan azonnali, vidám, mobilon lendületes | prémium érzet alacsonyabb; a hímzés finomsága elveszhet | kiegészítő | kiváló | ★★ | közepes | 18–35, játékos, ajándék, gyerek/családi |
| 08 | Raw Industrial `/concepts/08-industrial` | grid-papír, Plex, spec-lapok, méretarányos zóna-rajz, gyártási folyamat | átláthatóság, bizalom (cm, folyamat), B2B/céges rendelésre kiváló | „fashion” érzet visszafogott, érzelmi kapcsolat kevesebb | kiegészítő (spec-lap) | jó | ★★★ | alacsony–közepes | céges/csapat/B2B, mérnöki, gyártás-tudatos |
| 09 | Playful Customizer `/concepts/09-playful-customizer` | Outfit, barátságos színek, a hero maga a szerkesztő | azonnali kipróbálás → legmagasabb aktiválási esély, a fő USP interaktív | prémium érzet közepes; a hero komplexitása mobilon figyelmet igényel | customizer + 3D váltó | jó | ★★★ | magas | széles B2C, első vásárlók, ajándék, fiatal családok |
| 10 | Luxury Dark `/concepts/10-luxury-dark` | charcoal/krém/bronz, Cormorant, rim-fény, lassú átmenetek | exkluzív, magasabb árpozíció támogatása, a 3D szép | sötét felületen a színválaszték nehezebben ítélhető meg; kevesebb infó fent | hero (fullscreen) | jó | ★★★★★ | közepes | prémium ajándék, exkluzív kis szériák, 30+ |

## Közös alap
Mind a tíz koncepció: reszponzív (mobil/tablet/desktop), valódi UI (nem wireframe), ugyanaz a mock adat (`src/data/mock-catalog.ts`), ugyanaz a 3D viewer (`ShirtViewerLazy`), `prefers-reduced-motion` tisztelet, egyetlen backend.

## Javasolt következő lépés
A választott irány(ok) alapján a semleges kezdőlap (`/`), a shop, a termékoldal és a Studio kap végleges arculatot; a többi koncepció megmarad referenciaként a `/concepts/` alatt vagy archiválható.
