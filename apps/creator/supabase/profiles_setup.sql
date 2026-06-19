-- ============================================================================
-- LOCATIAL — one identity for Studio + consumer app, with auto-filled profiles.
-- A single Supabase Auth user IS the LOCATIAL account. This adds a `profiles`
-- row per user, auto-populated from whatever provider they used (Google gives
-- name + photo; email magic link gives just the email). "Creator" is a flag on
-- the same account — never a second signup.
-- One-paste: Supabase dashboard -> SQL Editor -> paste -> Run. Safe to re-run.
-- ============================================================================

create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url   text,
  handle       text unique,
  is_creator   boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table profiles enable row level security;

-- Public can read profiles (so a creator's name/photo can show on their public
-- stories). Each user can edit only their own profile.
drop policy if exists profiles_public_read on profiles;
create policy profiles_public_read on profiles for select to anon, authenticated using (true);

drop policy if exists profiles_self_write on profiles;
create policy profiles_self_write on profiles
  for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile when a new auth user signs up, pulling name/photo from
-- the provider's metadata (Google: full_name + avatar_url; others may be null).
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Backfill profiles for any users that already exist.
insert into public.profiles (id, display_name, avatar_url)
select id,
       coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
       raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;
