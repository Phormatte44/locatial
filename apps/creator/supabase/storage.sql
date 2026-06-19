-- storage.sql — create the public image bucket + prototype policies.
-- Requires the SERVICE ROLE (bucket creation is privileged). Run in the Supabase SQL
-- editor or via a trusted script. See docs/SETUP.md.

insert into storage.buckets (id, name, public)
values ('chapter-images', 'chapter-images', true)
on conflict (id) do nothing;

-- Prototype: anyone may read; anon may upload/update/delete (auth deferred).
-- Tighten to authenticated owners alongside 0003_secure_rls.sql.
drop policy if exists chapter_images_read on storage.objects;
create policy chapter_images_read on storage.objects
  for select to anon, authenticated using (bucket_id = 'chapter-images');

drop policy if exists chapter_images_write on storage.objects;
create policy chapter_images_write on storage.objects
  for all to anon using (bucket_id = 'chapter-images') with check (bucket_id = 'chapter-images');
