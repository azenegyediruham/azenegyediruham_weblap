-- 0002 – Katalógus: kategóriák, fazonok, színek, méretek, mérettáblák,
--        3D ruhamodellek, hímzési zónák, termékek, variánsok, képek, design assetek,
--        oldalbeállítások, admin bootstrap

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  silhouette text not null default 'tshirt',
  image_path text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_categories_updated before update on public.categories for each row execute function public.set_updated_at();

create table public.fits (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table public.colors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  hex text not null check (hex ~ '^#[0-9A-Fa-f]{6}$'),
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table public.sizes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table public.size_charts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  -- csak a releváns mezők jelennek meg: pl. {chest,length,shoulder,sleeve} vagy {waist,hip,length}
  measurement_keys text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_size_charts_updated before update on public.size_charts for each row execute function public.set_updated_at();

create table public.size_chart_entries (
  id uuid primary key default gen_random_uuid(),
  size_chart_id uuid not null references public.size_charts(id) on delete cascade,
  size_id uuid not null references public.sizes(id) on delete cascade,
  -- {"chest": 100, "length": 70, ...} cm-ben
  measurements jsonb not null default '{}'::jsonb,
  unique (size_chart_id, size_id)
);
create index idx_size_chart_entries_chart on public.size_chart_entries(size_chart_id);

create table public.garment_models (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  -- storage path a garment-models bucketben, vagy public/ alatti út (pl. /models/tshirt.glb)
  model_path text,
  preview_image_path text,
  mapping_mode public.mapping_mode not null default 'uv',
  silhouette text not null default 'tshirt',
  -- cm-kalibrált textúra-chartok: [{key, meshName, widthCm, heightCm}]
  charts jsonb not null default '[]'::jsonb,
  -- szerkesztő nézetek: [{key, label, chartKey, crop:{x,y,w,h}, silhouette}]
  views jsonb not null default '[]'::jsonb,
  scale numeric not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_garment_models_updated before update on public.garment_models for each row execute function public.set_updated_at();

create table public.customization_zones (
  id uuid primary key default gen_random_uuid(),
  garment_model_id uuid not null references public.garment_models(id) on delete cascade,
  key text not null,
  display_name text not null,
  view_key public.garment_view not null default 'front',
  -- 2D bounding area cm-ben a chart koordinátarendszerében
  rect_x numeric not null,
  rect_y numeric not null,
  rect_w numeric not null check (rect_w > 0),
  rect_h numeric not null check (rect_h > 0),
  min_width_cm numeric not null default 2 check (min_width_cm > 0),
  max_width_cm numeric not null check (max_width_cm >= min_width_cm),
  max_height_cm numeric not null check (max_height_cm > 0),
  -- opcionális 3D mapping (decal módhoz): {meshName, anchor, right, up, depth}
  mapping_3d jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  unique (garment_model_id, key)
);
create index idx_customization_zones_model on public.customization_zones(garment_model_id);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  category_id uuid not null references public.categories(id) on delete restrict,
  gender public.gender_type not null default 'unisex',
  garment_model_id uuid references public.garment_models(id) on delete set null,
  size_chart_id uuid references public.size_charts(id) on delete set null,
  silhouette text not null default 'tshirt',
  base_price_huf integer not null check (base_price_huf >= 0),
  currency text not null default 'HUF',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_customizable boolean not null default true,
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_products_category on public.products(category_id);
create index idx_products_gender on public.products(gender);
create index idx_products_active_featured on public.products(is_active, is_featured);
create trigger trg_products_updated before update on public.products for each row execute function public.set_updated_at();

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  fit_id uuid not null references public.fits(id) on delete restrict,
  color_id uuid not null references public.colors(id) on delete restrict,
  size_id uuid not null references public.sizes(id) on delete restrict,
  price_override_huf integer check (price_override_huf is null or price_override_huf >= 0),
  stock_qty integer not null default 0 check (stock_qty >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, fit_id, color_id, size_id)
);
create index idx_product_variants_product on public.product_variants(product_id);
create index idx_product_variants_color on public.product_variants(color_id);
create index idx_product_variants_size on public.product_variants(size_id);
create trigger trg_product_variants_updated before update on public.product_variants for each row execute function public.set_updated_at();

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  color_id uuid references public.colors(id) on delete set null,
  storage_path text not null,
  alt text not null default '',
  kind public.product_image_kind not null default 'gallery',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index idx_product_images_product on public.product_images(product_id);

create table public.design_assets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  storage_path text not null,
  thumbnail_path text,
  tags text[] not null default '{}',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Központi, adminból szerkeszthető beállítások (kontakt, hero, featured, creator szabályok, pricing...)
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger trg_site_settings_updated before update on public.site_settings for each row execute function public.set_updated_at();

-- Regisztrációkor ezek az emailek automatikusan admin szerepet kapnak
create table public.admin_bootstrap_emails (
  email text primary key,
  note text,
  created_at timestamptz not null default now()
);
