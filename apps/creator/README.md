# LOCATIAL — Creator Studio + Reader (technical prototype)

A working end-to-end vertical slice: **Creator Studio → Supabase → Published Story →
Mobile Reader**. A creator builds a *Story* of ordered *Chapters* (optionally grouped into
*Sections*), places each on a MapLibre map, previews it at three device sizes, and
publishes it to a public mobile Reader at `/story/:slug`.

This implements the authoring + reading layer described in the LOCATIAL docs bundle
(Channel/Place platform). See `docs/implementation/` for how the Story/Section/Chapter
model maps onto the documented vocabulary and every decision taken.

> **Priority of this build is working data flow, not visual polish.** The UI is neutral and
> semantic so the design system can be applied later without touching product logic.

## Quick start
```bash
npm install
npm run dev        # http://localhost:5310  (uses localStorage until Supabase is configured)
npm test           # 42 passing tests
npm run build      # production build
```
On the landing page click **Create demo story (20 chapters)** to populate data instantly.
Full Supabase + deployment steps: [`docs/SETUP.md`](docs/SETUP.md).

## Routes
| Route | Screen |
|---|---|
| `/` | Story list — create / open / resume; demo seeder; backend badge |
| `/studio/:storyId` | Editor — structure (sections + chapters) · chapter editor · live map · publish |
| `/studio/:storyId/preview` | Desktop / Tablet / Mobile preview of the **real** Reader |
| `/story/:slug` | Public mobile Reader (map top · swipeable chapters bottom) |

## Architecture
```
components/*  →  hooks/useStoryEditor  →  services/*  →  repositories/*  →  Supabase | localStorage
                                          domain/*  (pure: ordering · validation · mapping · camera)
```
- **No component calls Supabase directly.** Everything goes through a `StoryRepository`
  (`SupabaseStoryRepository` or `LocalStoryRepository`, chosen by env in
  `repositories/index.ts`).
- **Ordering** is persisted as explicit integer positions, never React-only. `chapters.position`
  is the global reading order; `sections.position` orders the outline; reorder operations
  (`domain/ordering.ts`) preserve chapter IDs.
- **Publishing** (`services/publishService.ts`) validates, assigns a unique slug, sets
  `published_at`, and refuses to publish for `actor: 'agent'`.
- **Camera** (`domain/cameraDirector.ts`) gives short hops a restrained `easeTo` and long
  hops a broad `flyTo`; honours per-chapter camera intent and `prefers-reduced-motion`.

### Key files
| Area | Files |
|---|---|
| Domain (pure) | `src/domain/{types,ordering,validation,cameraDirector}.ts` |
| Data layer | `src/repositories/{StoryRepository,SupabaseStoryRepository,LocalStoryRepository,mapping,mediaRepository,index}.ts` |
| Services | `src/services/{placeSearchService,publishService,seedDemoStory}.ts` |
| Studio | `src/components/studio/*` (StoryEditor, StoryStructure, SectionList, ChapterList, ChapterEditor, ChapterMediaField, ChapterTagsField, PlacePicker, StoryMap, PreviewWorkspace, DevicePreview, PublishPanel) |
| Reader | `src/components/reader/*` (StoryReader, ReaderMap, ChapterCarousel, ChapterSlide, SectionIndicator, ReaderProgress) |
| Map | `src/components/map/useMaplibre.ts` |
| DB | `supabase/migrations/*.sql`, `supabase/storage.sql`, `supabase/seed.sql` |
| Tests | `src/test/*` |

## Database model
`stories` ─< `sections`, `stories` ─< `chapters` (chapter → section is nullable, ON DELETE
SET NULL). Chapters carry image, name, headline, body, tags[], location (lng/lat),
optional `place_id`, optional `camera` jsonb, position, timestamps. Full DDL in
`supabase/migrations/0001_init.sql`; rationale in
[`docs/implementation/PROTOTYPE_BUILD_PLAN.md`](docs/implementation/PROTOTYPE_BUILD_PLAN.md).

## Tests
`npm test` — 42 tests covering: ordering (incl. *move Chapter 17 → position 7*), validation,
DB row↔domain mapping, camera director, the repository (create story, 20 chapters, sections,
reorder + persist, move between sections, slug uniqueness), publish rules (agent forbidden,
validation gates, slug disambiguation), the Reader carousel (touch/keyboard/buttons, order
preserved), and an end-to-end happy path (create → locate → group → reorder → publish →
read by slug → map-follows-chapter).

## Tech stack
React 18 · TypeScript · Vite · Tailwind v3 · MapLibre GL JS v5 · `@supabase/supabase-js` ·
react-router-dom · Vitest + Testing-Library. Map tiles: OpenFreeMap Positron (no key).
Geocoding: Nominatim (no key). Deploy: Vercel.

## Known limitations
See the bottom of this file's companion note in
[`docs/implementation/DECISIONS_AND_CONFLICTS.md`](docs/implementation/DECISIONS_AND_CONFLICTS.md)
and the "Known limitations" section of the delivery summary. In short: Supabase tables must
be provisioned with the service-role key before the Supabase backend activates (local
backend works now); auth is deferred with temporary permissive RLS; reordering uses explicit
controls rather than drag-and-drop.
