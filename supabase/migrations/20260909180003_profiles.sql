-- 0003 – Profilok, admin szerepkör, auth trigger

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_path text,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_profiles_role on public.profiles(role);
create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();

-- Új auth user -> profil; bootstrap emailek automatikusan adminok
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role public.user_role := 'customer';
begin
  if exists (select 1 from public.admin_bootstrap_emails a where lower(a.email) = lower(new.email)) then
    v_role := 'admin';
  end if;

  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1)),
    v_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin ellenőrzés RLS policy-khoz. SECURITY DEFINER: a profiles RLS-t megkerüli,
-- így nincs rekurzió; a tulajdonos (postgres) bypass-olja az RLS-t.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- A role oszlopot a felhasználó nem módosíthatja (oszlopszintű jog)
revoke update on public.profiles from authenticated;
grant update (display_name, avatar_path, phone) on public.profiles to authenticated;
