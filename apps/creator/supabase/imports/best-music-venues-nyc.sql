-- Pilot import: 'Best Music Venues in NYC' from locatial.io (Webflow) -> Supabase
-- Run in Supabase SQL Editor (runs as postgres; bypasses RLS). Safe to re-run.
do $$
declare v_story uuid; v_owner uuid;
  v_sec0 uuid;
  v_sec1 uuid;
begin
  select id into v_owner from auth.users where email='michael.o.mccann@gmail.com' limit 1;
  delete from public.stories where slug='best-music-venues-in-nyc';
  insert into public.stories(title,slug,status,published_at,owner_id)
  values ('Best Music Venues in NYC','best-music-venues-in-nyc','published',now(),v_owner) returning id into v_story;
  insert into public.sections(story_id,name,position) values (v_story,'Manhattan',0) returning id into v_sec0;
  insert into public.sections(story_id,name,position) values (v_story,'Brooklyn',1) returning id into v_sec1;
  insert into public.chapters(story_id,section_id,position,name,headline,body,tags,image_url,place_name,longitude,latitude,camera) values (
    v_story,v_sec0,1,'Beacon Theatre','Uber Spacious','This spacious former vaudeville theater, resplendent after a recent renovation, hosts a variety of popular acts, from Steely Dan to Ryan Adams. While the vastness can seem daunting for performers and audience members alike, the gaudy interior and uptown location make you feel as though you’re having a real night out on the town.',
    array['live music']::text[],'https://uploads-ssl.webflow.com/64ea1f05f055c6958cd93deb/6626d1f327df43ed9ce42390_Ivn-WdXKBsg3oT3XyHE4G5XsI-Vk2dko7C4fefDHGm0.webp','Upper West Side, Manhattan',-73.979417,40.778059,jsonb_build_object('zoom',13.0,'pitch',60.0,'bearing',-10.0));
  insert into public.chapters(story_id,section_id,position,name,headline,body,tags,image_url,place_name,longitude,latitude,camera) values (
    v_story,v_sec0,2,'Village Vanguard','Old School Vibes','After more than 80 years, this basement club’s stage still hosts the crème de la crème of mainstream jazz talent. Plenty of history has been made here—John Coltrane, Miles Davis and Bill Evans have grooved in this hallowed hall—and the 16-piece Vanguard Jazz Orchestra has been the Monday-night regular since 1966. Thanks to the venue''s strict no cell phone policy, seeing a show here feels like stepping back and time. It''s just you and the music.',
    array['live music']::text[],'https://uploads-ssl.webflow.com/64ea1f05f055c6958cd93deb/6626d1f130118eb4bb5fcf82_AlvtOTTH5Ronm11PAoRHF89HaT_S08ykJh4z3_DCr6o.webp','West Village, Manhattan',-74.003144,40.734608,jsonb_build_object('zoom',13.0,'pitch',60.0,'bearing',-10.0));
  insert into public.chapters(story_id,section_id,position,name,headline,body,tags,image_url,place_name,longitude,latitude,camera) values (
    v_story,v_sec1,3,'Music Hall of Williamsburg','Cool Venue','Run by local promoter Bowery Presents, this Williamsburg outpost is basically a mirror image of similarly sized Bowery Ballroom, one upping its Manhattan counterpart with improved sightlights—including elevated areas on either side of the room—and a bit more breathing room. With booking that ranges from indie-rock bands to hip-hop acts, it''s one of the best rooms in New York to see a show.',
    array['live music']::text[],'https://uploads-ssl.webflow.com/64ea1f05f055c6958cd93deb/6626d1f2acd99b30448fd4cc_M9EAIcGVRgILGfxXedE9pGzOvAjSbvmnUMRwXhxH5RU.webp','Williamsburg, Brooklyn',-73.96169,40.719272,jsonb_build_object('zoom',13.0,'pitch',60.0,'bearing',-10.0));
  insert into public.chapters(story_id,section_id,position,name,headline,body,tags,image_url,place_name,longitude,latitude,camera) values (
    v_story,v_sec1,4,'Saint Vitus','The trendies hang out here','This Greenpoint club—moodily decorated with all-black walls and dead roses hanging above the bar—is one of the best places in the city to see metal, rock and more experimental heavy music, with reliably loud bands typically booked seven nights a week.',
    array['live music']::text[],'https://uploads-ssl.webflow.com/64ea1f05f055c6958cd93deb/6626d1f2ebfbd608772b5a89_8ckS4R2sLPmS80BTyL-QvUZcDF964hK28Rwj8L9FWks.webp','Greenpoint, Brooklyn',-73.947367,40.738202,jsonb_build_object('zoom',13.0,'pitch',60.0,'bearing',-10.0));
  insert into public.chapters(story_id,section_id,position,name,headline,body,tags,image_url,place_name,longitude,latitude,camera) values (
    v_story,v_sec1,5,'Elsewhere','Booming Sound System','Operated by the hip folks behind beloved art and music haven Glasslands, this 24,000 square-foot converted warehouse hosts live shows and DJ nights on three stages: two inside and one rooftop space. Its bookings feature a diverse mix of cutting-edge indie-rock, electronic music and more.',
    array['live music']::text[],'https://uploads-ssl.webflow.com/64ea1f05f055c6958cd93deb/6626d1f016ba7e50b4963cc7_Nw0mn2DvbGALeCczS4LMbSjX58Bw6i54mrwo1gXVtZo.webp','East Williamsburg, Brooklyn',-73.923855,40.708397,jsonb_build_object('zoom',13.0,'pitch',60.0,'bearing',-10.0));
end $$;
