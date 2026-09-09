-- 0006 – Creator Program jelentkezések, galéria, kapcsolatfelvételi üzenetek

create table public.creator_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  platform text not null,            -- instagram | tiktok | youtube | facebook | other
  social_username text not null,
  profile_url text,
  follower_count integer not null default 0 check (follower_count >= 0),
  content_idea text not null default '',
  post_plan text not null default '',
  screenshot_path text,              -- creator-applications bucket
  notes text,
  status public.creator_application_status not null default 'submitted',
  admin_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_creator_applications_status on public.creator_applications(status);
create index idx_creator_applications_user on public.creator_applications(user_id);
create trigger trg_creator_applications_updated before update on public.creator_applications for each row execute function public.set_updated_at();

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_path text,
  saved_design_id uuid references public.saved_designs(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  color_id uuid references public.colors(id) on delete set null,
  design_asset_id uuid references public.design_assets(id) on delete set null,
  zone_key text,
  width_cm numeric,
  height_cm numeric,
  tags text[] not null default '{}',
  likes_count integer not null default 0,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_gallery_items_published on public.gallery_items(is_published, sort_order);
create trigger trg_gallery_items_updated before update on public.gallery_items for each row execute function public.set_updated_at();

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null check (length(message) between 1 and 5000),
  status text not null default 'new',   -- new | answered | archived
  created_at timestamptz not null default now()
);
create index idx_contact_messages_status on public.contact_messages(status);
