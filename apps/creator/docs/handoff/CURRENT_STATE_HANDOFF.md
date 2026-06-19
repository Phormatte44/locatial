# CURRENT STATE — Handoff

_Snapshot: 2026-06-19._

> **UPDATE 2026-06-19 (consolidation):** The app now lives in the **`Phormatte44/locatial`
> monorepo** under **`apps/creator/`**. Canonical local path:
> **`/Users/michaelmccann/Claude/may/locatial/apps/creator`** (repo root = the monorepo at
> `/Users/michaelmccann/Claude/may/locatial`). It **is now under git + on GitHub** — the
> "not a git repo" / "no git history" notes further down are SUPERSEDED. Vercel deploys from
> `apps/creator` (`cd apps/creator && vercel deploy --prod`). The old standalone
> `~/Claude/may/locatial` duplicate was removed (single source of truth). Repo is still
> **PUBLIC → Michael to flip to Private** (Settings → Danger Zone). Run `npm install` inside
> `apps/creator` before `npm run dev`.

---

## Last completed
Restructured routing so the **public citizen experience is the home page** and the Creator
Studio moved to `/studio` (gated). Verified live: `/` = public browse of published stories
(no login), `/studio` = sign-in required. This followed the full build of: Story/Section/
Chapter model, Creator Studio, Reader, Supabase persistence, email + Google auth, and the
`/explore` browse page. Everything is deployed and working at https://locatial.vercel.app.

---

## Current repository state
- **Path:** `/Users/michaelmccann/Claude/may/locatial`
- **Stack:** React 18 · TypeScript · Vite · Tailwind v3 · MapLibre GL v5 ·
  `@supabase/supabase-js` · react-router-dom · Vitest. Map tiles OpenFreeMap (no key);
  geocoding Nominatim (no key).
- **Not a git repo yet** (no `.git`). See "Rollback / checkpoints".
- **Runs locally:** `npm install && npm run dev` → http://localhost:5310. With `.env.local`
  Supabase vars blank it uses a localStorage backend and **bypasses auth** (dev convenience).
- **Routes (live):**
  | URL | Surface | Auth |
  |---|---|---|
  | `/` | Citizen browse (published stories) | public |
  | `/story/:slug` | Reader (map + swipe carousel) | public |
  | `/explore` | redirects → `/` | public |
  | `/studio` | Creator story list | required |
  | `/studio/:storyId` | Story editor | required |
  | `/studio/:storyId/preview` | Desktop/Tablet/Mobile preview | required |
- **Key source layout:**
  - `src/domain/` — pure logic: `types`, `ordering`, `validation`, `cameraDirector`.
  - `src/repositories/` — `StoryRepository` (interface), `SupabaseStoryRepository`,
    `LocalStoryRepository`, `mapping`, `mediaRepository`, `index` (factory: Supabase if env set,
    else localStorage).
  - `src/services/` — `placeSearchService` (Nominatim), `publishService`, `seedDemoStory`.
  - `src/lib/` — `supabase` (client), `auth` (AuthProvider/useAuth: email magic link + Google).
  - `src/components/studio/` — StoryEditor, StoryStructure, SectionList, ChapterList,
    ChapterEditor, ChapterMediaField, ChapterTagsField, PlacePicker, StoryMap,
    PreviewWorkspace, DevicePreview, PublishPanel.
  - `src/components/reader/` — StoryReader, ReaderMap, ChapterCarousel, ChapterSlide,
    SectionIndicator, ReaderProgress.
  - `src/components/auth/` — SignIn (email + Google buttons), RequireAuth (gate).
  - `src/components/ui/primitives.tsx` — neutral shadcn-shaped Button/Input/etc.
  - `src/routes/` — ExploreRoute (home), ReaderRoute, StoryListRoute, router.
  - `src/test/` — 7 test files, 42 tests.
- **Deploy:** Vercel project `locatial` (team `team_LQx9ixYgTu8dCJUavZbmJVr7`, account
  `michaelomccann-4376`). `vercel deploy --prod --yes` from the repo. Live alias:
  **https://locatial.vercel.app**. `vercel.json` + `.vercel/` present.
- **Vercel env vars set (prod/preview/dev):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
  `VITE_SUPABASE_IMAGE_BUCKET=chapter-images`, `VITE_GOOGLE_ENABLED=true`.

---

## Current database state (Supabase)
- **Project:** `locatial-prototypes`, ref **`snowiacdagibrxwhkzoi`**, URL
  `https://snowiacdagibrxwhkzoi.supabase.co`. **Free tier → auto-pauses (~1 wk idle); resume
  in dashboard if the app shows no data.** Anon key is in `.env.example` / `.env.local`.
  **Service-role key was never available to the agent** (so migrations/seed/bucket were run
  by Michael through the SQL editor).
- **Tables (`public`):** `stories`, `sections`, `chapters`, `profiles`. Plus a
  **`legacy_backup`** schema holding pre-existing incompatible test tables (5 old test
  stories) that were *preserved, not deleted*.
  - `stories(id, title, slug unique, status draft|published, published_at, owner_id→auth.users
    [default auth.uid()], created_at, updated_at)`
  - `sections(id, story_id→stories cascade, name, position, …)`
  - `chapters(id, story_id cascade, section_id→sections set null, position, name, headline,
    body, tags text[], image_url, place_name, longitude, latitude, place_id, camera jsonb, …)`
  - `profiles(id→auth.users, display_name, avatar_url, handle unique, is_creator, …)` — a row
    is auto-created on signup from provider metadata (Google → name + avatar).
- **RLS:** public can SELECT only **published** stories + their sections/chapters; signed-in
  users have full control of **their own** stories (owner-scoped); profiles public-read /
  self-write; storage `chapter-images` bucket public-read / authenticated-write.
- **Auth providers:** **email** (magic link) ON; **Google** ON (client id + secret configured).
  Auth URL config: Site URL `https://locatial.vercel.app`; redirect allow-list
  `https://locatial.vercel.app/**` and `http://localhost:5310/**`.
- **Storage:** public bucket `chapter-images`.
- **Data present:** demo story **"A London Evening"** (slug `a-london-evening`, published, 2
  sections, 20 located chapters, no owner → public demo). Plus Michael's real draft
  **"bromely the bre"** (3 chapters) under `michael.o.mccann@gmail.com`.

### Google OAuth
- Google Cloud project **LOCATIAL** (project number `497404808359`) in Michael's account.
- Client ID `497404808359-4o70ac3idrho6akluatk606no3tasl51.apps.googleusercontent.com`;
  secret stored **in Supabase** (and in Michael's records — not duplicated here for safety).
- Redirect URI registered: `https://snowiacdagibrxwhkzoi.supabase.co/auth/v1/callback`.
- ⚠️ **Consent screen is in "Testing"** → only Michael/test users can use Google until he
  clicks **Publish app** (console.cloud.google.com/auth/audience → LOCATIAL → Publish).

---

## Decisions made (key ones; full list in ../implementation/DECISIONS_AND_CONFLICTS.md)
- **Model:** Story → Section → Chapter (new vocabulary; maps onto the docs' Channel→Place).
- **Ordering:** `chapters.position` = global reading order (decoupled from sections);
  `sections.position` orders the outline. IDs never recreated on move. Pure utils in
  `domain/ordering.ts`.
- **One account, multiple roles:** single login for citizen + creator; "creator" is a flag,
  never a second signup. Reading is public; creating requires login.
- **Auth:** email magic link + Google (passwordless, highest conversion). Apple later.
  Same-verified-email identities auto-link (Supabase default) → no duplicate accounts.
- **Repository pattern:** components never call Supabase directly; everything via
  `StoryRepository`. localStorage fallback when env unset (also powers tests).
- **Publishing:** validated; assigns unique slug + `published_at`; `actor:'agent'` is
  forbidden from publishing.
- **Visual design deliberately deferred** — neutral, semantic components so the look can be
  swapped without touching logic.

---

## Files changed / created
Entire `locatial/` app was built this session (greenfield). High-traffic files a successor
will touch most: `src/routes/router.tsx`, `src/lib/auth.tsx`, `src/components/auth/*`,
`src/routes/{ExploreRoute,ReaderRoute,StoryListRoute}.tsx`, `src/components/studio/*`,
`src/components/reader/*`, and `src/index.css` + `tailwind.config.js` (design tokens — the
main surface for the visual pass). SQL lives in `supabase/`.

---

## Migrations applied (to the live DB, via Supabase SQL editor)
Applied in this order (the **combined one-paste scripts are authoritative**, not the numbered
0001–0003 stubs):
1. `supabase/setup_all.sql` — schema (stories/sections/chapters) + prototype RLS + storage
   bucket + demo seed.
2. (manual) moved pre-existing incompatible tables to schema `legacy_backup`.
3. `supabase/auth_setup.sql` — `owner_id` + owner-scoped RLS + public-read-of-published +
   authenticated storage writes.
4. `supabase/profiles_setup.sql` — `profiles` table + auto-fill trigger + RLS.
- Also in repo but superseded by the above: `supabase/migrations/0001_init.sql`,
  `0002_rls_prototype.sql`, `0003_secure_rls.sql.example`, `seed.sql`, `storage.sql`.
- ⚠️ No formal migration runner is wired; SQL is applied by hand in the dashboard. A successor
  may want to adopt the Supabase CLI migration flow.

---

## Tests completed
`npm test` → **42 passing** across 7 files: ordering (incl. "move Chapter 17 → position 7"),
validation, DB row↔domain mapping, camera director, repository (create story, 20 chapters,
sections, reorder+persist, move between sections, slug uniqueness), publish rules (agent
forbidden, validation gates, slug disambiguation), Reader carousel (touch/keyboard/buttons,
order preserved), and an end-to-end happy path. `npm run build` and `tsc --noEmit` both clean.

---

## Known issues / watch-outs
1. **Supabase free tier auto-pauses** — app shows no data until resumed in the dashboard.
2. **Google consent screen in "Testing"** — friends can't use Google sign-in until Michael
   Publishes it. (Email sign-in + public reading work regardless.)
3. **Email magic-link uses Supabase's built-in mailer** — rate-limited (~few/hr), may hit
   spam. Add a custom SMTP (e.g. Resend) before a larger friend-test round.
4. **Dashboard automation blocked** — Supabase & Google Cloud consoles wouldn't render for the
   Chrome extension this session; hand dashboard steps to Michael.
5. **No git / version control** — see Rollback below.
6. **Visual design is placeholder-plain** (intentional).
7. Minor: rapid *synchronous* carousel clicks collapse to one step (stale closure); MapLibre
   bundle triggers a chunk-size warning (not an error); map shows ~1s blank on first paint
   while tiles load.

---

## Next task
**Visual design pass** — apply the documented LOCATIAL design system (Signal Pink `#FF2D7A`,
Manrope 700/800, Night `#0a0a0b`, documented motion curves, pin styling) across Studio +
Reader + the new citizen home, working through `tailwind.config.js`, `src/index.css`, and the
neutral `components/ui/primitives.tsx`. Keep product logic untouched. **Confirm scope with
Michael first** (see OPEN_QUESTIONS). After that: publish Google consent screen, add custom
email sender, then Apple sign-in / consumer save-follow features.

---

## Rollback / checkpoint reference
- **No git history exists.** Strongly recommend `git init` + first commit + push to
  `Phormatte44/locatial` early next session (see OPEN_QUESTIONS).
- **Deploy checkpoints = immutable Vercel production URLs** (newest last):
  1. `locatial-ocqm0mdfz-michaelomccann-4376s-projects.vercel.app` — initial (reader+studio+Supabase)
  2. `locatial-g3oyb8owm-…` — email auth
  3. `locatial-c0dz1jy3n-…` — browse/explore page
  4. `locatial-e11joyzno-…` — Google button enabled
  5. `locatial-gg1zs3ldt-…` — **citizen-home restructure (current `locatial.vercel.app`)**
  - Roll back via `vercel rollback <url>` or by promoting a previous deployment in the Vercel
    dashboard. (Run `vercel ls locatial` for the full list.)
- **Database:** no manual snapshot taken. Pre-existing test data is preserved in the
  `legacy_backup` schema. Free-tier backup retention is limited — consider exporting before
  any destructive migration.
