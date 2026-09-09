-- 0008 – Storage bucketek és policy-k
-- public:  product-images, garment-models, design-assets
-- private: user-designs ({user_id}/...), order-previews ({user_id}/...), creator-applications ({user_id}|anonymous/...)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml']),
  ('garment-models', 'garment-models', true, 52428800, array['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'image/png', 'image/jpeg', 'image/webp']),
  ('design-assets', 'design-assets', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('user-designs', 'user-designs', false, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('order-previews', 'order-previews', false, 20971520, array['image/png', 'image/jpeg', 'image/webp', 'application/pdf']),
  ('creator-applications', 'creator-applications', false, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Publikus bucketek: bárki olvas, csak admin ír --------------------------
create policy "public buckets read" on storage.objects for select to anon, authenticated
  using (bucket_id in ('product-images', 'garment-models', 'design-assets'));
create policy "public buckets admin insert" on storage.objects for insert to authenticated
  with check (bucket_id in ('product-images', 'garment-models', 'design-assets') and public.is_admin());
create policy "public buckets admin update" on storage.objects for update to authenticated
  using (bucket_id in ('product-images', 'garment-models', 'design-assets') and public.is_admin())
  with check (bucket_id in ('product-images', 'garment-models', 'design-assets') and public.is_admin());
create policy "public buckets admin delete" on storage.objects for delete to authenticated
  using (bucket_id in ('product-images', 'garment-models', 'design-assets') and public.is_admin());

-- user-designs: csak a saját mappa ({auth.uid()}/...) -------------------
create policy "user-designs own insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'user-designs' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "user-designs own select" on storage.objects for select to authenticated
  using (bucket_id = 'user-designs' and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_admin()));
create policy "user-designs own update" on storage.objects for update to authenticated
  using (bucket_id = 'user-designs' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'user-designs' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "user-designs own delete" on storage.objects for delete to authenticated
  using (bucket_id = 'user-designs' and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_admin()));

-- order-previews: a vásárló a saját mappáját olvassa, admin mindent -------
create policy "order-previews own insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'order-previews' and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_admin()));
create policy "order-previews own select" on storage.objects for select to authenticated
  using (bucket_id = 'order-previews' and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_admin()));
create policy "order-previews admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'order-previews' and public.is_admin());

-- creator-applications: bejelentkezve saját mappa, vendégként 'anonymous/' mappa
create policy "creator-applications insert" on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'creator-applications'
    and (
      (storage.foldername(name))[1] = coalesce((select auth.uid())::text, 'anonymous')
    )
  );
create policy "creator-applications own select" on storage.objects for select to authenticated
  using (bucket_id = 'creator-applications' and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_admin()));
create policy "creator-applications admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'creator-applications' and public.is_admin());
