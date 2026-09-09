-- 0005 – Kosár, rendelések, rendelési tételek, státusztörténet, hímzőfájlok

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  currency text not null default 'HUF',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_carts_updated before update on public.carts for each row execute function public.set_updated_at();

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid references public.product_variants(id) on delete set null,
  saved_design_id uuid references public.saved_designs(id) on delete set null,
  quantity integer not null default 1 check (quantity > 0 and quantity <= 500),
  unit_price_huf integer not null check (unit_price_huf >= 0),
  -- a design konfiguráció pillanatképe (zónák, elemek, cm méretek, színek)
  design_snapshot jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_cart_items_cart on public.cart_items(cart_id);
create trigger trg_cart_items_updated before update on public.cart_items for each row execute function public.set_updated_at();

create sequence if not exists public.order_number_seq start with 1000;

create or replace function public.generate_order_number()
returns text
language sql
volatile
set search_path = ''
as $$
  select 'AER-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text, 6, '0');
$$;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default public.generate_order_number(),
  user_id uuid references auth.users(id) on delete set null,
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'unpaid',
  -- szolgáltatófüggetlen: 'mock', 'stripe', 'transfer', 'cod' ...
  payment_method text not null default 'mock',
  payment_reference text,
  -- 'foxpost', 'home_delivery', 'pickup', ... (később bővíthető)
  shipping_method text not null default 'home_delivery',
  shipping_reference text,
  customer_name text not null,
  email text not null,
  phone text,
  shipping_address jsonb not null default '{}'::jsonb,
  billing_address jsonb,
  subtotal_huf integer not null default 0 check (subtotal_huf >= 0),
  shipping_fee_huf integer not null default 0 check (shipping_fee_huf >= 0),
  discount_huf integer not null default 0 check (discount_huf >= 0),
  total_huf integer not null default 0 check (total_huf >= 0),
  currency text not null default 'HUF',
  notes text,
  admin_notes text,
  placed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_placed on public.orders(placed_at desc);
create trigger trg_orders_updated before update on public.orders for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  saved_design_id uuid references public.saved_designs(id) on delete set null,
  product_name text not null,
  -- {fit, color, size, sku} pillanatkép
  variant_snapshot jsonb not null default '{}'::jsonb,
  design_snapshot jsonb,
  quantity integer not null check (quantity > 0),
  unit_price_huf integer not null check (unit_price_huf >= 0),
  line_total_huf integer not null check (line_total_huf >= 0),
  created_at timestamptz not null default now()
);
create index idx_order_items_order on public.order_items(order_id);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index idx_order_status_history_order on public.order_status_history(order_id);

-- Státuszváltozás naplózása automatikusan
create or replace function public.log_order_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.order_status_history (order_id, status, created_by)
    values (new.id, new.status, (select auth.uid()));
  end if;
  return new;
end;
$$;

create trigger trg_orders_log_status
  after insert or update of status on public.orders
  for each row execute function public.log_order_status();

-- Hímzőgép-workflow előkészítés (13. pont): rendelési tételenként, zónánként
create table public.order_item_embroidery_files (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  zone_key text not null,
  original_source_path text,       -- a user által feltöltött (tisztított) forrás
  preview_path text,               -- raszterizált / 3D preview
  digitized_path text,             -- digitizált hímzőfájl (később)
  embroidery_machine_format text,  -- pl. DST, PES, JEF – a gép ismeretében
  stitch_count integer check (stitch_count is null or stitch_count >= 0),
  thread_colors jsonb not null default '[]'::jsonb,
  physical_width_cm numeric check (physical_width_cm is null or physical_width_cm > 0),
  physical_height_cm numeric check (physical_height_cm is null or physical_height_cm > 0),
  status public.embroidery_file_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_embroidery_files_item on public.order_item_embroidery_files(order_item_id);
create trigger trg_embroidery_files_updated before update on public.order_item_embroidery_files for each row execute function public.set_updated_at();
