-- 0007 – Row Level Security minden táblán
-- Elvek:
--  * katalógus: mindenki olvashatja az aktív sorokat, csak admin írhat
--  * felhasználói adatok: csak a tulajdonos (user_id = auth.uid()) és az admin
--  * anonim insert csak creator_applications és contact_messages táblákra
--  * (select auth.uid()) forma: soronként egyszer értékelődik ki (performance)

-- Katalógus ---------------------------------------------------------------
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select to anon, authenticated using (is_active or public.is_admin());
create policy "categories admin all" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.fits enable row level security;
create policy "fits public read" on public.fits for select to anon, authenticated using (is_active or public.is_admin());
create policy "fits admin all" on public.fits for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.colors enable row level security;
create policy "colors public read" on public.colors for select to anon, authenticated using (is_active or public.is_admin());
create policy "colors admin all" on public.colors for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.sizes enable row level security;
create policy "sizes public read" on public.sizes for select to anon, authenticated using (is_active or public.is_admin());
create policy "sizes admin all" on public.sizes for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.size_charts enable row level security;
create policy "size_charts public read" on public.size_charts for select to anon, authenticated using (true);
create policy "size_charts admin all" on public.size_charts for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.size_chart_entries enable row level security;
create policy "size_chart_entries public read" on public.size_chart_entries for select to anon, authenticated using (true);
create policy "size_chart_entries admin all" on public.size_chart_entries for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.garment_models enable row level security;
create policy "garment_models public read" on public.garment_models for select to anon, authenticated using (is_active or public.is_admin());
create policy "garment_models admin all" on public.garment_models for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.customization_zones enable row level security;
create policy "customization_zones public read" on public.customization_zones for select to anon, authenticated using (is_active or public.is_admin());
create policy "customization_zones admin all" on public.customization_zones for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.products enable row level security;
create policy "products public read" on public.products for select to anon, authenticated using (is_active or public.is_admin());
create policy "products admin all" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.product_variants enable row level security;
create policy "product_variants public read" on public.product_variants for select to anon, authenticated using (is_active or public.is_admin());
create policy "product_variants admin all" on public.product_variants for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.product_images enable row level security;
create policy "product_images public read" on public.product_images for select to anon, authenticated using (true);
create policy "product_images admin all" on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.design_assets enable row level security;
create policy "design_assets public read" on public.design_assets for select to anon, authenticated using (is_active or public.is_admin());
create policy "design_assets admin all" on public.design_assets for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.site_settings enable row level security;
create policy "site_settings public read" on public.site_settings for select to anon, authenticated using (true);
create policy "site_settings admin all" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.admin_bootstrap_emails enable row level security;
create policy "admin_bootstrap_emails admin all" on public.admin_bootstrap_emails for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Profilok ----------------------------------------------------------------
alter table public.profiles enable row level security;
create policy "profiles read own" on public.profiles for select to authenticated using (id = (select auth.uid()) or public.is_admin());
create policy "profiles update own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "profiles admin all" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Feltöltések, designok ---------------------------------------------------
alter table public.user_uploads enable row level security;
create policy "user_uploads own" on public.user_uploads for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "user_uploads admin read" on public.user_uploads for select to authenticated using (public.is_admin());

alter table public.saved_designs enable row level security;
create policy "saved_designs read own or public" on public.saved_designs for select to anon, authenticated
  using (is_public or user_id = (select auth.uid()) or public.is_admin());
create policy "saved_designs insert own" on public.saved_designs for insert to authenticated with check (user_id = (select auth.uid()));
create policy "saved_designs update own" on public.saved_designs for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "saved_designs delete own" on public.saved_designs for delete to authenticated using (user_id = (select auth.uid()));
create policy "saved_designs admin all" on public.saved_designs for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.saved_design_items enable row level security;
create policy "saved_design_items read via design" on public.saved_design_items for select to anon, authenticated
  using (exists (select 1 from public.saved_designs d where d.id = saved_design_id and (d.is_public or d.user_id = (select auth.uid()))) or public.is_admin());
create policy "saved_design_items write own" on public.saved_design_items for all to authenticated
  using (exists (select 1 from public.saved_designs d where d.id = saved_design_id and d.user_id = (select auth.uid())))
  with check (exists (select 1 from public.saved_designs d where d.id = saved_design_id and d.user_id = (select auth.uid())));
create policy "saved_design_items admin all" on public.saved_design_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.design_likes enable row level security;
create policy "design_likes read" on public.design_likes for select to anon, authenticated using (true);
create policy "design_likes insert own" on public.design_likes for insert to authenticated with check (user_id = (select auth.uid()));
create policy "design_likes delete own" on public.design_likes for delete to authenticated using (user_id = (select auth.uid()));

-- Kosár -------------------------------------------------------------------
alter table public.carts enable row level security;
create policy "carts own" on public.carts for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "carts admin read" on public.carts for select to authenticated using (public.is_admin());

alter table public.cart_items enable row level security;
create policy "cart_items own" on public.cart_items for all to authenticated
  using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid())))
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid())));
create policy "cart_items admin read" on public.cart_items for select to authenticated using (public.is_admin());

-- Rendelések --------------------------------------------------------------
alter table public.orders enable row level security;
create policy "orders read own" on public.orders for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
create policy "orders insert own" on public.orders for insert to authenticated with check (user_id = (select auth.uid()));
create policy "orders admin update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "orders admin delete" on public.orders for delete to authenticated using (public.is_admin());

alter table public.order_items enable row level security;
create policy "order_items read own" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())) or public.is_admin());
create policy "order_items insert own" on public.order_items for insert to authenticated
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
create policy "order_items admin write" on public.order_items for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "order_items admin delete" on public.order_items for delete to authenticated using (public.is_admin());

alter table public.order_status_history enable row level security;
create policy "order_status_history read own" on public.order_status_history for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())) or public.is_admin());
create policy "order_status_history admin insert" on public.order_status_history for insert to authenticated with check (public.is_admin());

alter table public.order_item_embroidery_files enable row level security;
create policy "embroidery_files read own" on public.order_item_embroidery_files for select to authenticated
  using (exists (
    select 1 from public.order_items oi join public.orders o on o.id = oi.order_id
    where oi.id = order_item_id and o.user_id = (select auth.uid())
  ) or public.is_admin());
create policy "embroidery_files admin all" on public.order_item_embroidery_files for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Creator program, galéria, kapcsolat ------------------------------------
alter table public.creator_applications enable row level security;
create policy "creator_applications insert" on public.creator_applications for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));
create policy "creator_applications read own" on public.creator_applications for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());
create policy "creator_applications admin update" on public.creator_applications for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "creator_applications admin delete" on public.creator_applications for delete to authenticated using (public.is_admin());

alter table public.gallery_items enable row level security;
create policy "gallery_items public read" on public.gallery_items for select to anon, authenticated using (is_published or public.is_admin());
create policy "gallery_items admin all" on public.gallery_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.contact_messages enable row level security;
create policy "contact_messages insert" on public.contact_messages for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));
create policy "contact_messages admin read" on public.contact_messages for select to authenticated using (public.is_admin());
create policy "contact_messages admin update" on public.contact_messages for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "contact_messages admin delete" on public.contact_messages for delete to authenticated using (public.is_admin());
