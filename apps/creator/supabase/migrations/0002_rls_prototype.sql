-- 0002_rls_prototype.sql — TEMPORARY permissive RLS for the auth-deferred prototype.
--
-- Auth is deferred (see docs/implementation/DECISIONS_AND_CONFLICTS.md D4). These policies
-- let the anon key read AND write everything so the open Studio works without login.
-- This is NOT production-safe. Replace with 0003_secure_rls.sql.example once Supabase Auth
-- is added. Product code never depends on these policies, so the swap is additive.

alter table stories  enable row level security;
alter table sections enable row level security;
alter table chapters enable row level security;

-- stories
drop policy if exists stories_anon_all on stories;
create policy stories_anon_all on stories
  for all to anon using (true) with check (true);

-- sections
drop policy if exists sections_anon_all on sections;
create policy sections_anon_all on sections
  for all to anon using (true) with check (true);

-- chapters
drop policy if exists chapters_anon_all on chapters;
create policy chapters_anon_all on chapters
  for all to anon using (true) with check (true);
