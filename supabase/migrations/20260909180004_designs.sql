-- 0004 – Felhasználói feltöltések, mentett designok, design elemek, like-ok

create table public.user_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket_id text not null default 'user-designs',
  -- eredeti (SVG esetén tisztított) forrásfájl: {user_id}/uploads/{uuid}.{ext}
  storage_path text not null,
  -- raszterizált PNG előnézet / textúra
  preview_path text,
  original_filename text,
  mime_type text,
  size_bytes bigint,
  width_px integer,
  height_px integer,
  is_vector boolean not null default false,
  sanitized boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_user_uploads_user on public.user_uploads(user_id);

-- Megosztható design kód, pl. DES-84F2KD (nem összetéveszthető karakterek)
create or replace function public.generate_design_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  i integer;
  bytes bytea;
begin
  loop
    bytes := extensions.gen_random_bytes(6);
    code := 'DES-';
    for i in 0..5 loop
      code := code || substr(alphabet, (get_byte(bytes, i) % length(alphabet)) + 1, 1);
    end loop;
    exit when not exists (select 1 from public.saved_designs d where d.public_code = code);
  end loop;
  return code;
end;
$$;

create table public.saved_designs (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Saját design',
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  fit_id uuid references public.fits(id) on delete set null,
  color_id uuid references public.colors(id) on delete set null,
  size_id uuid references public.sizes(id) on delete set null,
  preview_path text,
  is_public boolean not null default false,
  likes_count integer not null default 0,
  -- a teljes konfiguráció snapshotja (bővíthető: pricing, megjegyzés, stb.)
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_saved_designs_user on public.saved_designs(user_id);
create index idx_saved_designs_public on public.saved_designs(is_public) where is_public;
create trigger trg_saved_designs_updated before update on public.saved_designs for each row execute function public.set_updated_at();

-- public_code alapértelmezés (a függvény a táblára hivatkozik, ezért a tábla után)
alter table public.saved_designs alter column public_code set default public.generate_design_code();

create table public.saved_design_items (
  id uuid primary key default gen_random_uuid(),
  saved_design_id uuid not null references public.saved_designs(id) on delete cascade,
  zone_id uuid references public.customization_zones(id) on delete set null,
  zone_key text not null,
  source_type public.design_item_source not null,
  user_upload_id uuid references public.user_uploads(id) on delete set null,
  design_asset_id uuid references public.design_assets(id) on delete set null,
  -- pozíció a zóna közepéhez képest, cm-ben; forgatás fokban; skála (relatív)
  x_cm numeric not null default 0,
  y_cm numeric not null default 0,
  rotation_deg numeric not null default 0,
  scale numeric not null default 1 check (scale > 0),
  -- fizikai méret (árazás, gyártás, digitizálás alapja)
  width_cm numeric not null check (width_cm > 0 and width_cm <= 80),
  height_cm numeric not null check (height_cm > 0 and height_cm <= 80),
  -- hímzés opciók: {thread_colors: [...], effect: 'satin'|'flat', ...}
  embroidery jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint chk_design_item_source check (
    (source_type = 'upload' and user_upload_id is not null)
    or (source_type = 'asset' and design_asset_id is not null)
  )
);
create index idx_saved_design_items_design on public.saved_design_items(saved_design_id);

create table public.design_likes (
  saved_design_id uuid not null references public.saved_designs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (saved_design_id, user_id)
);

create or replace function public.sync_design_likes_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.saved_designs set likes_count = likes_count + 1 where id = new.saved_design_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.saved_designs set likes_count = greatest(likes_count - 1, 0) where id = old.saved_design_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger trg_design_likes_count
  after insert or delete on public.design_likes
  for each row execute function public.sync_design_likes_count();
