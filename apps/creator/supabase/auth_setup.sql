-- ============================================================================
-- LOCATIAL — enable real auth (email magic link) with owner-scoped security.
-- Replaces the prototype "anyone can write" rules (0002) with:
--   • Public can READ published stories (so the Reader stays open / shareable).
--   • Signed-in creators have full control of THEIR OWN stories only.
--   • Image uploads require sign-in; images remain publicly viewable.
-- One-paste: Supabase dashboard → SQL Editor → paste → Run. Safe to re-run.
-- ============================================================================

-- 1. Ownership column (auto-set to the signed-in user on insert) --------------
alter table stories add column if not exists owner_id uuid references auth.users(id);
alter table stories alter column owner_id set default auth.uid();

-- 2. Remove the open prototype policies --------------------------------------
drop policy if exists stories_anon_all  on stories;
drop policy if exists sections_anon_all on sections;
drop policy if exists chapters_anon_all on chapters;

-- 3. Public READ of published content (Reader is open to everyone) ------------
drop policy if exists stories_public_read on stories;
create policy stories_public_read on stories
  for select to anon, authenticated using (status = 'published');

drop policy if exists sections_public_read on sections;
create policy sections_public_read on sections
  for select to anon, authenticated using (
    exists (select 1 from stories s where s.id = sections.story_id and s.status = 'published')
  );

drop policy if exists chapters_public_read on chapters;
create policy chapters_public_read on chapters
  for select to anon, authenticated using (
    exists (select 1 from stories s where s.id = chapters.story_id and s.status = 'published')
  );

-- 4. Owners have full control of their own stories (drafts included) ----------
drop policy if exists stories_owner_all on stories;
create policy stories_owner_all on stories
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists sections_owner_all on sections;
create policy sections_owner_all on sections
  for all to authenticated using (
    exists (select 1 from stories s where s.id = sections.story_id and s.owner_id = auth.uid())
  ) with check (
    exists (select 1 from stories s where s.id = sections.story_id and s.owner_id = auth.uid())
  );

drop policy if exists chapters_owner_all on chapters;
create policy chapters_owner_all on chapters
  for all to authenticated using (
    exists (select 1 from stories s where s.id = chapters.story_id and s.owner_id = auth.uid())
  ) with check (
    exists (select 1 from stories s where s.id = chapters.story_id and s.owner_id = auth.uid())
  );

-- 5. Storage: public read, signed-in write -----------------------------------
drop policy if exists chapter_images_write on storage.objects;
create policy chapter_images_write on storage.objects
  for all to authenticated using (bucket_id = 'chapter-images') with check (bucket_id = 'chapter-images');
-- (chapter_images_read from setup_all.sql stays: anyone can view images.)

-- Note: the existing demo story "A London Evening" has no owner, so it stays a
-- public published demo (visible in the Reader) but won't appear in any creator's
-- Studio list. That's intended.
