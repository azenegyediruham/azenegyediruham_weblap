-- 0001 – Kiterjesztések, enumok, közös segédfüggvények
-- Projekt: Az én egyedi ruhám (azenegyediruham)

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Enumok ------------------------------------------------------------------
create type public.gender_type as enum ('women', 'men', 'unisex');
create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum (
  'pending',        -- leadva, még nem visszaigazolt
  'confirmed',      -- visszaigazolva
  'in_production',  -- gyártás / hímzés alatt
  'ready',          -- elkészült, csomagolásra vár
  'shipped',        -- feladva
  'delivered',      -- kézbesítve
  'cancelled',
  'refunded'
);
create type public.payment_status as enum ('unpaid', 'pending', 'paid', 'refunded', 'failed');
create type public.creator_application_status as enum ('submitted', 'reviewing', 'approved', 'rejected', 'fulfilled');
create type public.design_item_source as enum ('upload', 'asset');
create type public.product_image_kind as enum ('gallery', 'thumbnail', 'template_front', 'template_back');
create type public.garment_view as enum ('front', 'back', 'left_sleeve', 'right_sleeve');
create type public.mapping_mode as enum ('uv', 'decal');
create type public.embroidery_file_status as enum ('pending', 'digitizing', 'ready', 'rejected');

-- Segédfüggvények ----------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Determinisztikus UUID seed adatokhoz (uuid v5, projekt-namespace)
create or replace function public.seed_uuid(key text)
returns uuid
language sql
immutable
set search_path = ''
as $$
  select extensions.uuid_generate_v5(extensions.uuid_ns_url(), 'https://azenegyediruham.hu/seed/' || key);
$$;
