-- seed.sql — demo data: one published London story, 2 sections, 20 located chapters.
-- Requires service role (or run while prototype anon RLS is active). Idempotent on slug.
-- See docs/SETUP.md. The Studio also has a "Create demo story" action that seeds the
-- same shape through the repository layer (works with the localStorage fallback too).

do $$
declare
  v_story   uuid;
  v_west    uuid;
  v_east    uuid;
  i         integer;
  base_lng  double precision := -0.1278;  -- central London
  base_lat  double precision := 51.5074;
begin
  delete from stories where slug = 'a-london-evening';

  insert into stories (title, slug, status, published_at)
  values ('A London Evening', 'a-london-evening', 'published', now())
  returning id into v_story;

  insert into sections (story_id, name, position) values (v_story, 'West London', 0)
  returning id into v_west;
  insert into sections (story_id, name, position) values (v_story, 'East London', 1)
  returning id into v_east;

  for i in 1..20 loop
    insert into chapters (
      story_id, section_id, position, name, headline, body, tags,
      longitude, latitude, place_name
    ) values (
      v_story,
      case when i <= 10 then v_west else v_east end,
      i,
      'Stop ' || i,
      'Headline for stop ' || i,
      'Body copy describing the ' || i || 'th stop on this London evening. '
        || 'Scroll for more — this paragraph is long enough to run below the fold so the '
        || 'vertical scroll behaviour inside a chapter is demonstrable.',
      array['bar','good vibes'],
      base_lng + (i - 10) * 0.004,
      base_lat + (i - 10) * 0.0025,
      'Venue ' || i || ', London'
    );
  end loop;
end $$;
