-- ============================================================================
-- LOCATIAL — one-paste Supabase setup.
-- Paste this whole file into the Supabase dashboard → SQL Editor → New query → Run.
-- It creates the tables, opens prototype access (auth deferred), creates the image
-- bucket, and seeds one demo story. Safe to run more than once.
-- ============================================================================

create extension if not exists "pgcrypto";

-- updated_at trigger helper --------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- stories --------------------------------------------------------------------
create table if not exists stories (
  id           uuid primary key default gen_random_uuid(),
  title        text not null default '',
  slug         text unique,
  status       text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists stories_slug_idx on stories (slug);
drop trigger if exists stories_updated_at on stories;
create trigger stories_updated_at before update on stories
  for each row execute function set_updated_at();

-- sections -------------------------------------------------------------------
create table if not exists sections (
  id         uuid primary key default gen_random_uuid(),
  story_id   uuid not null references stories(id) on delete cascade,
  name       text not null default '',
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sections_story_position_idx on sections (story_id, position);
drop trigger if exists sections_updated_at on sections;
create trigger sections_updated_at before update on sections
  for each row execute function set_updated_at();

-- chapters -------------------------------------------------------------------
create table if not exists chapters (
  id         uuid primary key default gen_random_uuid(),
  story_id   uuid not null references stories(id) on delete cascade,
  section_id uuid references sections(id) on delete set null,
  position   integer not null default 0,
  name       text not null default '',
  headline   text not null default '',
  body       text not null default '',
  tags       text[] not null default '{}',
  image_url  text,
  place_name text,
  longitude  double precision,
  latitude   double precision,
  place_id   text,
  camera     jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists chapters_story_position_idx on chapters (story_id, position);
create index if not exists chapters_section_idx on chapters (section_id);
drop trigger if exists chapters_updated_at on chapters;
create trigger chapters_updated_at before update on chapters
  for each row execute function set_updated_at();

-- prototype RLS (auth deferred — anon can read+write; NOT production-safe) ----
alter table stories  enable row level security;
alter table sections enable row level security;
alter table chapters enable row level security;

drop policy if exists stories_anon_all on stories;
create policy stories_anon_all on stories for all to anon using (true) with check (true);
drop policy if exists sections_anon_all on sections;
create policy sections_anon_all on sections for all to anon using (true) with check (true);
drop policy if exists chapters_anon_all on chapters;
create policy chapters_anon_all on chapters for all to anon using (true) with check (true);

-- storage: public image bucket + prototype object policies -------------------
insert into storage.buckets (id, name, public)
values ('chapter-images', 'chapter-images', true)
on conflict (id) do nothing;

drop policy if exists chapter_images_read on storage.objects;
create policy chapter_images_read on storage.objects
  for select to anon, authenticated using (bucket_id = 'chapter-images');
drop policy if exists chapter_images_write on storage.objects;
create policy chapter_images_write on storage.objects
  for all to anon using (bucket_id = 'chapter-images') with check (bucket_id = 'chapter-images');

-- demo seed: one published London story, 2 sections, 20 located chapters ------
do $$
declare
  v_story uuid; v_west uuid; v_east uuid; i integer;
  base_lng double precision := -0.1278; base_lat double precision := 51.5074;
begin
  delete from stories where slug = 'a-london-evening';
  insert into stories (title, slug, status, published_at)
  values ('A London Evening', 'a-london-evening', 'published', now())
  returning id into v_story;
  insert into sections (story_id, name, position) values (v_story, 'West London', 0) returning id into v_west;
  insert into sections (story_id, name, position) values (v_story, 'East London', 1) returning id into v_east;
  for i in 1..20 loop
    insert into chapters (story_id, section_id, position, name, headline, body, tags, longitude, latitude, place_name)
    values (
      v_story, case when i <= 10 then v_west else v_east end, i,
      'Stop ' || i, 'Headline for stop ' || i,
      'Body copy describing the ' || i || 'th stop on this London evening. Scroll for more — '
        || 'this paragraph runs below the fold so the vertical scroll inside a chapter is demonstrable.',
      array['bar','good vibes'],
      base_lng + (i - 10) * 0.004, base_lat + (i - 10) * 0.0025,
      'Venue ' || i || ', London'
    );
  end loop;
end $$;
