-- 0001_init.sql — Story / Section / Chapter schema for LOCATIAL Creator Studio.
-- Run with the service role (psql, Supabase SQL editor, or `supabase db push`).

create extension if not exists "pgcrypto";

-- updated_at trigger helper -------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- stories -------------------------------------------------------------------
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

-- sections ------------------------------------------------------------------
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

-- chapters ------------------------------------------------------------------
create table if not exists chapters (
  id         uuid primary key default gen_random_uuid(),
  story_id   uuid not null references stories(id) on delete cascade,
  section_id uuid references sections(id) on delete set null,
  position   integer not null default 0,         -- global reading order, 1..N
  name       text not null default '',
  headline   text not null default '',
  body       text not null default '',
  tags       text[] not null default '{}',
  image_url  text,
  place_name text,
  longitude  double precision,
  latitude   double precision,
  place_id   text,                                -- canonical OSM/external id
  camera     jsonb,                               -- { zoom, pitch, bearing }
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists chapters_story_position_idx on chapters (story_id, position);
create index if not exists chapters_section_idx on chapters (section_id);
drop trigger if exists chapters_updated_at on chapters;
create trigger chapters_updated_at before update on chapters
  for each row execute function set_updated_at();
