-- Seed adatok – idempotens (újrafuttatható), determinisztikus UUID-kkal (public.seed_uuid)
-- Ugyanaz a tartalom, mint a frontend mock katalógusa (src/data/mock-catalog.ts).

begin;

-- Admin bootstrap ---------------------------------------------------------
insert into public.admin_bootstrap_emails (email, note)
values ('azenegyediruham@gmail.com', 'Alapértelmezett admin (regisztrációkor automatikusan admin szerep)')
on conflict (email) do nothing;

-- Kategóriák --------------------------------------------------------------
insert into public.categories (id, slug, name, description, silhouette, sort_order) values
  (public.seed_uuid('category:polo'), 'polo', 'Póló', 'Klasszikus, slim és oversized pólók, 100% pamut.', 'tshirt', 1),
  (public.seed_uuid('category:pulover'), 'pulover', 'Pulóver', 'Kapucnis és kerek nyakú pulóverek, bolyhozott belsővel.', 'hoodie', 2),
  (public.seed_uuid('category:triko'), 'triko', 'Trikó', 'Ujjatlan felsők nyárra és edzéshez.', 'tank', 3),
  (public.seed_uuid('category:rovidnadrag'), 'rovidnadrag', 'Rövidnadrág', 'Kényelmes rövidnadrágok hímzett részletekkel.', 'shorts', 4),
  (public.seed_uuid('category:hosszunadrag'), 'hosszunadrag', 'Hosszúnadrág', 'Melegítő- és vászonnadrágok egyedi hímzéssel.', 'pants', 5),
  (public.seed_uuid('category:ruha'), 'ruha', 'Ruha', 'Könnyű, nyári ruhák és egyedi hímzett darabok.', 'dress', 6),
  (public.seed_uuid('category:szoknya'), 'szoknya', 'Szoknya', 'Midi és mini szoknyák saját mintával.', 'skirt', 7)
on conflict (slug) do update set name = excluded.name, description = excluded.description, silhouette = excluded.silhouette, sort_order = excluded.sort_order;

-- Fazonok -----------------------------------------------------------------
insert into public.fits (id, slug, name, description, sort_order) values
  (public.seed_uuid('fit:regular'), 'regular', 'Regular', 'Klasszikus, egyenes szabás.', 1),
  (public.seed_uuid('fit:slim'), 'slim', 'Slim', 'Testhezálló, karcsúsított szabás.', 2),
  (public.seed_uuid('fit:oversized'), 'oversized', 'Oversized', 'Bő, laza, lecsúszott vállú szabás.', 3),
  (public.seed_uuid('fit:relaxed'), 'relaxed', 'Relaxed', 'Kényelmes, kissé bővített szabás.', 4)
on conflict (slug) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order;

-- Színek ------------------------------------------------------------------
insert into public.colors (id, slug, name, hex, sort_order) values
  (public.seed_uuid('color:tortfeher'), 'tortfeher', 'Törtfehér', '#F4F2EC', 1),
  (public.seed_uuid('color:fekete'), 'fekete', 'Fekete', '#161616', 2),
  (public.seed_uuid('color:tengereszkek'), 'tengereszkek', 'Tengerészkék', '#1F2B47', 3),
  (public.seed_uuid('color:homok'), 'homok', 'Homok', '#D8C6A5', 4),
  (public.seed_uuid('color:oliva'), 'oliva', 'Olíva', '#5A6B3F', 5),
  (public.seed_uuid('color:bordo'), 'bordo', 'Bordó', '#6B1F2B', 6),
  (public.seed_uuid('color:puder'), 'puder', 'Púder rózsaszín', '#D9A8A8', 7),
  (public.seed_uuid('color:szurke'), 'szurke', 'Szürke melírozott', '#9C9C9C', 8),
  (public.seed_uuid('color:krem'), 'krem', 'Krém', '#F0E7D6', 9)
on conflict (slug) do update set name = excluded.name, hex = excluded.hex, sort_order = excluded.sort_order;

-- Méretek -----------------------------------------------------------------
insert into public.sizes (id, code, name, sort_order) values
  (public.seed_uuid('size:XS'), 'XS', 'XS', 1),
  (public.seed_uuid('size:S'), 'S', 'S', 2),
  (public.seed_uuid('size:M'), 'M', 'M', 3),
  (public.seed_uuid('size:L'), 'L', 'L', 4),
  (public.seed_uuid('size:XL'), 'XL', 'XL', 5),
  (public.seed_uuid('size:XXL'), 'XXL', 'XXL', 6)
on conflict (code) do update set name = excluded.name, sort_order = excluded.sort_order;

-- Mérettáblák -------------------------------------------------------------
insert into public.size_charts (id, slug, name, measurement_keys) values
  (public.seed_uuid('sizechart:tshirt-unisex'), 'tshirt-unisex', 'Unisex póló', array['chest', 'length', 'shoulder', 'sleeve']),
  (public.seed_uuid('sizechart:tshirt-women'), 'tshirt-women', 'Női slim póló', array['chest', 'length', 'shoulder', 'sleeve']),
  (public.seed_uuid('sizechart:hoodie'), 'hoodie', 'Pulóver', array['chest', 'length', 'shoulder', 'sleeve']),
  (public.seed_uuid('sizechart:shorts'), 'shorts', 'Rövidnadrág', array['waist', 'hip', 'length']),
  (public.seed_uuid('sizechart:pants'), 'pants', 'Hosszúnadrág', array['waist', 'hip', 'length']),
  (public.seed_uuid('sizechart:dress'), 'dress', 'Ruha', array['chest', 'waist', 'hip', 'length']),
  (public.seed_uuid('sizechart:skirt'), 'skirt', 'Szoknya', array['waist', 'hip', 'length'])
on conflict (slug) do update set name = excluded.name, measurement_keys = excluded.measurement_keys;

insert into public.size_chart_entries (id, size_chart_id, size_id, measurements)
select public.seed_uuid('sce:' || v.chart || ':' || v.code), c.id, s.id, v.m::jsonb
from (values
  ('tshirt-unisex', 'XS', '{"chest":92,"length":66,"shoulder":42,"sleeve":19}'),
  ('tshirt-unisex', 'S', '{"chest":96,"length":68,"shoulder":44,"sleeve":20}'),
  ('tshirt-unisex', 'M', '{"chest":100,"length":70,"shoulder":46,"sleeve":21}'),
  ('tshirt-unisex', 'L', '{"chest":106,"length":72,"shoulder":48,"sleeve":22}'),
  ('tshirt-unisex', 'XL', '{"chest":112,"length":74,"shoulder":50,"sleeve":23}'),
  ('tshirt-unisex', 'XXL', '{"chest":118,"length":76,"shoulder":52,"sleeve":24}'),
  ('tshirt-women', 'XS', '{"chest":84,"length":60,"shoulder":37,"sleeve":16}'),
  ('tshirt-women', 'S', '{"chest":88,"length":62,"shoulder":38,"sleeve":17}'),
  ('tshirt-women', 'M', '{"chest":92,"length":63,"shoulder":40,"sleeve":17}'),
  ('tshirt-women', 'L', '{"chest":96,"length":64,"shoulder":41,"sleeve":18}'),
  ('tshirt-women', 'XL', '{"chest":100,"length":66,"shoulder":43,"sleeve":19}'),
  ('hoodie', 'S', '{"chest":108,"length":68,"shoulder":50,"sleeve":60}'),
  ('hoodie', 'M', '{"chest":112,"length":70,"shoulder":52,"sleeve":61}'),
  ('hoodie', 'L', '{"chest":118,"length":72,"shoulder":54,"sleeve":62}'),
  ('hoodie', 'XL', '{"chest":124,"length":74,"shoulder":56,"sleeve":63}'),
  ('hoodie', 'XXL', '{"chest":130,"length":76,"shoulder":58,"sleeve":64}'),
  ('shorts', 'S', '{"waist":76,"hip":98,"length":44}'),
  ('shorts', 'M', '{"waist":82,"hip":104,"length":46}'),
  ('shorts', 'L', '{"waist":88,"hip":110,"length":48}'),
  ('shorts', 'XL', '{"waist":94,"hip":116,"length":50}'),
  ('pants', 'S', '{"waist":76,"hip":98,"length":102}'),
  ('pants', 'M', '{"waist":82,"hip":104,"length":104}'),
  ('pants', 'L', '{"waist":88,"hip":110,"length":106}'),
  ('pants', 'XL', '{"waist":94,"hip":116,"length":108}'),
  ('dress', 'XS', '{"chest":84,"waist":66,"hip":90,"length":92}'),
  ('dress', 'S', '{"chest":88,"waist":70,"hip":94,"length":94}'),
  ('dress', 'M', '{"chest":92,"waist":74,"hip":98,"length":96}'),
  ('dress', 'L', '{"chest":98,"waist":80,"hip":104,"length":98}'),
  ('dress', 'XL', '{"chest":104,"waist":86,"hip":110,"length":100}'),
  ('skirt', 'XS', '{"waist":64,"hip":90,"length":70}'),
  ('skirt', 'S', '{"waist":68,"hip":94,"length":71}'),
  ('skirt', 'M', '{"waist":72,"hip":98,"length":72}'),
  ('skirt', 'L', '{"waist":78,"hip":104,"length":73}'),
  ('skirt', 'XL', '{"waist":84,"hip":110,"length":74}')
) as v(chart, code, m)
join public.size_charts c on c.slug = v.chart
join public.sizes s on s.code = v.code
on conflict (size_chart_id, size_id) do update set measurements = excluded.measurements;

-- 3D ruhamodell + zónák ---------------------------------------------------
insert into public.garment_models (id, slug, name, model_path, mapping_mode, silhouette, charts, views) values (
  public.seed_uuid('garment:tshirt'), 'tshirt', 'Klasszikus póló (3D)', '/models/tshirt.glb', 'uv', 'tshirt',
  '[
    {"key":"torso","meshName":"Torso","widthCm":108,"heightCm":72},
    {"key":"left_sleeve","meshName":"SleeveL","widthCm":36,"heightCm":22},
    {"key":"right_sleeve","meshName":"SleeveR","widthCm":36,"heightCm":22}
  ]'::jsonb,
  '[
    {"key":"front","label":"Elöl","chartKey":"torso","crop":{"x":0,"y":0,"w":54,"h":72},"silhouette":"tshirt"},
    {"key":"back","label":"Hátul","chartKey":"torso","crop":{"x":54,"y":0,"w":54,"h":72},"silhouette":"tshirt"},
    {"key":"left_sleeve","label":"Bal ujj","chartKey":"left_sleeve","crop":{"x":9,"y":0,"w":18,"h":22},"silhouette":"tshirt"},
    {"key":"right_sleeve","label":"Jobb ujj","chartKey":"right_sleeve","crop":{"x":9,"y":0,"w":18,"h":22},"silhouette":"tshirt"}
  ]'::jsonb
)
on conflict (slug) do update set name = excluded.name, model_path = excluded.model_path, mapping_mode = excluded.mapping_mode, charts = excluded.charts, views = excluded.views;

insert into public.customization_zones (id, garment_model_id, key, display_name, view_key, rect_x, rect_y, rect_w, rect_h, min_width_cm, max_width_cm, max_height_cm, sort_order)
select public.seed_uuid('zone:tshirt:' || v.key), public.seed_uuid('garment:tshirt'), v.key, v.name, v.view::public.garment_view, v.x, v.y, v.w, v.h, v.minw, v.maxw, v.maxh, v.ord
from (values
  ('front_center', 'Elöl, középen', 'front', 13, 16, 28, 34, 4, 28, 34, 1),
  ('front_chest_left', 'Bal mellkas', 'front', 30, 13, 12, 12, 3, 12, 12, 2),
  ('front_chest_right', 'Jobb mellkas', 'front', 12, 13, 12, 12, 3, 12, 12, 3),
  ('back_center', 'Hátul, középen', 'back', 67, 18, 28, 34, 4, 28, 34, 4),
  ('upper_back', 'Felső hát (nyak alatt)', 'back', 69, 7, 24, 9, 3, 24, 9, 5),
  ('left_sleeve', 'Bal ujj', 'left_sleeve', 13, 5, 10, 10, 3, 10, 10, 6),
  ('right_sleeve', 'Jobb ujj', 'right_sleeve', 13, 5, 10, 10, 3, 10, 10, 7)
) as v(key, name, view, x, y, w, h, minw, maxw, maxh, ord)
on conflict (garment_model_id, key) do update set display_name = excluded.display_name, view_key = excluded.view_key,
  rect_x = excluded.rect_x, rect_y = excluded.rect_y, rect_w = excluded.rect_w, rect_h = excluded.rect_h,
  min_width_cm = excluded.min_width_cm, max_width_cm = excluded.max_width_cm, max_height_cm = excluded.max_height_cm, sort_order = excluded.sort_order;

-- Termékek ----------------------------------------------------------------
insert into public.products (id, slug, name, description, category_id, gender, garment_model_id, size_chart_id, silhouette, base_price_huf, is_featured, tags, sort_order)
select public.seed_uuid('product:' || v.slug), v.slug, v.name, v.description,
  (select id from public.categories where slug = v.category), v.gender::public.gender_type,
  case when v.garment is null then null else (select id from public.garment_models where slug = v.garment) end,
  (select id from public.size_charts where slug = v.chart),
  v.silhouette, v.price, v.featured, v.tags, v.ord
from (values
  ('classic-polo', 'Classic póló', 'Sűrű szövésű, 180 g/m² fésült pamut póló, dupla varrott szegéllyel. A hímzés alapja: elöl, hátul és az ujjakon is testreszabható.', 'polo', 'unisex', 'tshirt', 'tshirt-unisex', 'tshirt', 5990, true, array['bestseller', 'pamut'], 1),
  ('noi-slim-polo', 'Női slim póló', 'Karcsúsított szabású, puha, elasztikus pamut póló nőknek. Kis mellkasi logóhoz és nagy hátsó mintához egyaránt ideális.', 'polo', 'women', 'tshirt', 'tshirt-women', 'tshirt', 6490, true, array['női'], 2),
  ('oversize-polo', 'Oversize póló', 'Vastag, 240 g/m² pamut, lecsúszott váll, bő szabás. Streetwear alap nagy hátsó hímzésekhez.', 'polo', 'unisex', 'tshirt', 'tshirt-unisex', 'tshirt', 7490, true, array['heavyweight', 'streetwear'], 3),
  ('heavy-polo', 'Heavy pamut póló', 'Prémium, 260 g/m² organikus pamut, feszes gallér, klasszikus szabás. Az a póló, ami évekig megmarad.', 'polo', 'men', 'tshirt', 'tshirt-unisex', 'tshirt', 8990, false, array['organikus', 'prémium'], 4),
  ('kapucnis-pulover', 'Kapucnis pulóver', 'Bolyhozott belsejű, 320 g/m² pamut-poliészter pulóver kengurus zsebbel. Nagy hátsó és mellkasi hímzésekhez.', 'pulover', 'unisex', null, 'hoodie', 'hoodie', 12990, true, array['meleg'], 5),
  ('kerek-nyaku-pulover', 'Kerek nyakú pulóver', 'Klasszikus crewneck, bordás mandzsetta és derékrész, puha belső. Elegánsabb, mint a kapucnis, ideális céges hímzéshez.', 'pulover', 'unisex', null, 'hoodie', 'sweatshirt', 10990, false, array['céges'], 6),
  ('ferfi-triko', 'Férfi trikó', 'Ujjatlan, könnyű pamut felső nyárra és edzéshez. Kis mellkasi hímzés a klasszikus választás.', 'triko', 'men', null, 'tshirt-unisex', 'tank', 4990, false, array[]::text[], 7),
  ('noi-triko', 'Női trikó', 'Karcsúsított, puha pamut trikó vékony pánttal. Apró, finom hímzésekhez ajánlott.', 'triko', 'women', null, 'tshirt-women', 'tank', 4990, false, array[]::text[], 8),
  ('pamut-rovidnadrag', 'Pamut rövidnadrág', 'Kényelmes, gumis derekú rövidnadrág zsebekkel. A hímzés a bal combrészen kap helyet.', 'rovidnadrag', 'unisex', null, 'shorts', 'shorts', 8990, false, array[]::text[], 9),
  ('melegito-nadrag', 'Melegítő hosszúnadrág', 'Bolyhozott belsejű, egyenes szárú melegítőnadrág. Szett a kapucnis pulóverrel, azonos hímzéssel.', 'hosszunadrag', 'unisex', null, 'pants', 'pants', 11990, false, array[]::text[], 10),
  ('nyari-ruha', 'Nyári pamutruha', 'Könnyű, A-vonalú pamutruha rövid ujjal. Botanikus hímzés a mellrészen vagy a szegélyen.', 'ruha', 'women', null, 'dress', 'dress', 13990, true, array[]::text[], 11),
  ('midi-szoknya', 'Midi szoknya', 'Magas derekú, enyhén bővülő midi szoknya. Kis hímzés a zsebnél vagy a szegély fölött.', 'szoknya', 'women', null, 'skirt', 'skirt', 9990, false, array[]::text[], 12)
) as v(slug, name, description, category, gender, garment, chart, silhouette, price, featured, tags, ord)
on conflict (slug) do update set name = excluded.name, description = excluded.description, category_id = excluded.category_id,
  gender = excluded.gender, garment_model_id = excluded.garment_model_id, size_chart_id = excluded.size_chart_id,
  silhouette = excluded.silhouette, base_price_huf = excluded.base_price_huf, is_featured = excluded.is_featured,
  tags = excluded.tags, sort_order = excluded.sort_order;

-- Variánsok (fazon × szín × méret) ---------------------------------------
insert into public.product_variants (id, product_id, sku, fit_id, color_id, size_id, price_override_huf, stock_qty)
select
  public.seed_uuid('variant:' || p.slug || ':' || f.slug || ':' || c.slug || ':' || s.code),
  p.id,
  upper(replace(p.slug, '-', '')) || '-' || upper(left(f.slug, 3)) || '-' || upper(left(c.slug, 3)) || '-' || s.code,
  f.id, c.id, s.id,
  case when s.code = 'XXL' then p.base_price_huf + 500 else null end,
  12 + (abs(hashtext(p.slug || f.slug || c.slug || s.code)) % 20)
from (values
  ('classic-polo', array['regular', 'oversized'], array['tortfeher', 'fekete', 'tengereszkek', 'homok', 'oliva', 'bordo', 'szurke'], array['XS', 'S', 'M', 'L', 'XL', 'XXL']),
  ('noi-slim-polo', array['slim'], array['tortfeher', 'fekete', 'puder', 'krem', 'oliva'], array['XS', 'S', 'M', 'L', 'XL']),
  ('oversize-polo', array['oversized'], array['tortfeher', 'fekete', 'homok', 'szurke'], array['S', 'M', 'L', 'XL', 'XXL']),
  ('heavy-polo', array['regular', 'relaxed'], array['tortfeher', 'fekete', 'tengereszkek', 'oliva'], array['XS', 'S', 'M', 'L', 'XL', 'XXL']),
  ('kapucnis-pulover', array['regular', 'oversized'], array['fekete', 'szurke', 'tengereszkek', 'homok', 'bordo'], array['S', 'M', 'L', 'XL', 'XXL']),
  ('kerek-nyaku-pulover', array['regular'], array['tortfeher', 'fekete', 'szurke', 'oliva', 'krem'], array['S', 'M', 'L', 'XL', 'XXL']),
  ('ferfi-triko', array['regular'], array['tortfeher', 'fekete', 'szurke', 'tengereszkek'], array['S', 'M', 'L', 'XL']),
  ('noi-triko', array['slim'], array['tortfeher', 'fekete', 'puder', 'krem'], array['XS', 'S', 'M', 'L']),
  ('pamut-rovidnadrag', array['regular', 'relaxed'], array['fekete', 'szurke', 'homok', 'oliva'], array['S', 'M', 'L', 'XL']),
  ('melegito-nadrag', array['regular', 'relaxed'], array['fekete', 'szurke', 'tengereszkek', 'homok'], array['S', 'M', 'L', 'XL']),
  ('nyari-ruha', array['regular'], array['tortfeher', 'krem', 'puder', 'oliva', 'tengereszkek'], array['XS', 'S', 'M', 'L', 'XL']),
  ('midi-szoknya', array['regular'], array['fekete', 'krem', 'bordo', 'oliva'], array['XS', 'S', 'M', 'L', 'XL'])
) as spec(pslug, fits, colors, sizes)
join public.products p on p.slug = spec.pslug
join public.fits f on f.slug = any(spec.fits)
join public.colors c on c.slug = any(spec.colors)
join public.sizes s on s.code = any(spec.sizes)
on conflict (product_id, fit_id, color_id, size_id) do update set sku = excluded.sku, price_override_huf = excluded.price_override_huf;

-- Design assetek (saját, jogtiszta SVG-k a public/design-assets alatt) ---
insert into public.design_assets (id, slug, name, storage_path, tags, sort_order) values
  (public.seed_uuid('asset:mountain-line'), 'mountain-line', 'Hegyvonulat', '/design-assets/mountain-line.svg', array['vonalas', 'természet'], 1),
  (public.seed_uuid('asset:monogram'), 'monogram', 'Monogram AK', '/design-assets/monogram.svg', array['betű', 'minimal'], 2),
  (public.seed_uuid('asset:sun-wave'), 'sun-wave', 'Nap és hullám', '/design-assets/sun-wave.svg', array['nyár', 'geometrikus'], 3),
  (public.seed_uuid('asset:paw'), 'paw', 'Mancs', '/design-assets/paw.svg', array['állat', 'ikon'], 4),
  (public.seed_uuid('asset:botanical'), 'botanical', 'Botanikus ág', '/design-assets/botanical.svg', array['növény', 'finom'], 5),
  (public.seed_uuid('asset:lightning-badge'), 'lightning-badge', 'Villám embléma', '/design-assets/lightning-badge.svg', array['embléma', 'sport'], 6)
on conflict (slug) do update set name = excluded.name, storage_path = excluded.storage_path, tags = excluded.tags, sort_order = excluded.sort_order;

-- Galéria -----------------------------------------------------------------
insert into public.gallery_items (id, title, description, product_id, color_id, design_asset_id, zone_key, width_cm, height_cm, likes_count, is_published, sort_order)
select public.seed_uuid('gallery:' || v.ord), v.title, v.description,
  (select id from public.products where slug = v.product), (select id from public.colors where slug = v.color),
  (select id from public.design_assets where slug = v.asset), v.zone, v.w, v.h, v.likes, true, v.ord
from (values
  (1, 'Hegyek a mellkason', 'Vonalas hegyvonulat, tone-in-tone cérnával.', 'classic-polo', 'tortfeher', 'mountain-line', 'front_chest_left', 9, 6, 128),
  (2, 'Monogram, minimál', 'Két betű, három cérnaszín, oversize pólón.', 'oversize-polo', 'fekete', 'monogram', 'front_center', 14, 14, 96),
  (3, 'Nap a háton', 'Nagy hátsó hímzés, 24 cm széles.', 'classic-polo', 'homok', 'sun-wave', 'back_center', 24, 20, 211),
  (4, 'Botanikus ág a ruhán', 'Finom, egyszínű ág a mellrészen.', 'nyari-ruha', 'krem', 'botanical', 'front_chest_right', 8, 11, 74),
  (5, 'Mancs az ujjon', 'Apró hímzés a bal ujjon.', 'noi-slim-polo', 'puder', 'paw', 'left_sleeve', 5, 5, 58),
  (6, 'Csapatembléma pulóveren', 'Villám embléma egy sportklub csapatának.', 'kapucnis-pulover', 'tengereszkek', 'lightning-badge', 'front_center', 12, 12, 143),
  (7, 'Céges crewneck', 'Kis logó a mellkason, nagy a háton – 40 darabos rendelés.', 'kerek-nyaku-pulover', 'oliva', 'monogram', 'front_chest_left', 7, 7, 39),
  (8, 'Hullámok a szoknyán', 'Geometrikus minta a szegély fölött.', 'midi-szoknya', 'bordo', 'sun-wave', 'front_center', 10, 8, 61)
) as v(ord, title, description, product, color, asset, zone, w, h, likes)
on conflict (id) do update set title = excluded.title, description = excluded.description, product_id = excluded.product_id,
  color_id = excluded.color_id, design_asset_id = excluded.design_asset_id, zone_key = excluded.zone_key,
  width_cm = excluded.width_cm, height_cm = excluded.height_cm, likes_count = excluded.likes_count, sort_order = excluded.sort_order;

-- Oldalbeállítások (adminból szerkeszthető) -------------------------------
insert into public.site_settings (key, value) values
  ('brand', '{"name":"Az én egyedi ruhám","shortName":"AER","tagline":"Válassz ruhát, tedd rá a saját mintád, nézd meg 3D-ben, rendeld meg."}'),
  ('contact', '{"email":"azenegyediruham@gmail.com","phone":"","address":"1111 Budapest, Fiktív út 1.","openingHours":"H–P 9:00–17:00","note":"Ideiglenes, fiktív cím – később változik."}'),
  ('social', '{"instagram":"https://instagram.com/","tiktok":"https://tiktok.com/","facebook":"https://facebook.com/"}'),
  ('hero', '{"title":"A te mintád. A te ruhád.","subtitle":"Töltsd fel a grafikád, helyezd el a pólón, forgasd meg 3D-ben – mi pedig kihímezzük.","ctaPrimary":"Tervezd meg a sajátod","ctaSecondary":"Nézd meg a ruhákat"}'),
  ('featured', '{"productSlug":"classic-polo","categorySlugs":["polo","pulover","ruha"]}'),
  ('creator_program', '{"programName":"Stitch & Share","minFollowers":{"instagram":3000,"tiktok":5000,"youtube":2000,"facebook":3000},"benefit":"Ingyenes vagy kedvezményes hímzés a választott ruhára, közösségi média megjelenésért cserébe."}'),
  ('pricing', '{"embroideryBaseHuf":1490,"embroideryPerCm2Huf":38,"extraColorHuf":250,"includedColors":3,"extraPositionHuf":990,"rushSurchargePercent":25,"quantityTiers":[{"minQty":10,"discountPercent":10},{"minQty":25,"discountPercent":15},{"minQty":50,"discountPercent":20}]}'),
  ('production', '{"leadTimeDays":{"min":5,"max":10},"maxUploadMb":10,"acceptedFormats":["png","jpg","jpeg","webp","svg"]}'),
  ('legal', '{"notice":"Élesítés előtt jogi ellenőrzés szükséges.","reviewed":false}')
on conflict (key) do update set value = excluded.value;

commit;
