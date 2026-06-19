# Prototype Build Plan

End-to-end vertical slice: **Creator Studio → Supabase → Published Story → Mobile Reader**.

## Database model
```
stories (id uuid pk, title text, slug text unique, status text['draft'|'published'],
         published_at timestamptz?, created_at, updated_at)
sections (id uuid pk, story_id fk→stories cascade, name text, position int, created_at, updated_at)
chapters (id uuid pk, story_id fk→stories cascade, section_id fk→sections set-null?,
          position int,            -- global reading order, 1..N
          name text, headline text, body text,
          tags text[],             -- contextual tags
          image_url text?,         -- Supabase Storage public URL
          place_name text?, longitude double precision?, latitude double precision?,
          place_id text?,          -- canonical OSM/external id
          camera jsonb?,           -- { zoom, pitch, bearing }
          created_at, updated_at)
```
Indexes: `chapters(story_id, position)`, `chapters(section_id)`, `sections(story_id, position)`,
`stories(slug)`. Migrations in `supabase/migrations/`. Storage bucket `chapter-images` (public read).

## Layering (no Supabase calls from components)
```
components/*  ──>  hooks (useStory…)  ──>  services/*  ──>  repositories/*  ──>  Supabase | localStorage
                                           domain/* (pure: ordering, validation, mapping, camera)
```

## Component boundaries
- **Studio:** `StoryEditor`, `StoryStructure`, `SectionList`, `ChapterList`, `ChapterEditor`,
  `ChapterMediaField`, `ChapterTagsField`, `PlacePicker`, `StoryMap`, `PreviewWorkspace`,
  `DevicePreview`, `PublishPanel`.
- **Reader:** `StoryReader`, `ReaderMap`, `ChapterCarousel`, `ChapterSlide`,
  `SectionIndicator`, `ReaderProgress`.
- **Domain/data:** `storyRepository`, `mediaRepository`, `placeSearchService`,
  `publishService`, `storyValidation`, `orderingUtilities`, `cameraDirector`.

## Routes
- `/` — story list (create / open / resume).
- `/studio/:storyId` — editor (structure + chapter editor + map).
- `/studio/:storyId/preview` — Desktop / Tablet / Mobile preview of the real Reader.
- `/story/:slug` — public mobile Reader.

## Build order (per brief)
1. Repo understanding ✓ 2. Source-of-truth ✓ 3. Schema + types + migrations
4. Repository/service layer + domain (ordering/validation/mapping/camera) + tests
5. Studio: story create + chapter editing 6. Sections + persisted ordering
7. Map placement + place search 8. Image upload 9. Responsive Preview
10. Publish flow 11. Mobile Reader 12. Tests + setup/deploy docs.

## Definition of done (tracked)
creator builds a Story with ≥20 located Chapters · reorder/section ops persist · each
Chapter stores image+name+headline+body+tags+location · preview desktop/tablet/mobile ·
publish (validated, slug, published_at) · Reader loads by slug · horizontal swipe + vertical
scroll · map follows active Chapter · refresh-safe · tests + docs.
