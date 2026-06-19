# CHANGELOG

Reverse-chronological. Dates are when the work happened.

## 2026-06-19 (later) — GitHub + monorepo consolidation
- `git init` + first commit of the standalone app, then discovered `Phormatte44/locatial` is
  a real **monorepo** (PRDs, brand corpus, `harness/`, `apps/`, `packages/`, `prototypes/`).
- Placed the app under **`apps/creator/`** (per that folder's README), additive commit on top
  of `v2` — nothing of Michael's overwritten. Pushed to `main`.
- **Consolidated to one source of truth:** moved the Vercel link + `.env.local` into
  `apps/creator`, re-deployed from there (live URL unchanged), then **removed the standalone
  `~/Claude/may/locatial` duplicate** and renamed the monorepo clone to `~/Claude/may/locatial`.
  Updated the workspace dev launch path to `apps/creator`.
- Push auth via macOS keychain (token not stored in the repo). Repo still **public** — pending
  Michael flipping it to Private.

## 2026-06-19
### Citizen experience restructure (current)
- Made the **public browse page the home (`/`)**; moved Creator Studio to **`/studio`**
  (gated). `/explore` now redirects to `/`. Reason: a citizen visiting the site was landing
  on the creator sign-in wall with no front door to published stories.
- Added a **"Creator Studio →"** link on the citizen home; updated reader/studio nav links;
  post-login now redirects to `/studio`.
- Verified live: `/` public browse (no login), `/studio` requires sign-in.
- Deploy: `locatial-gg1zs3ldt-…` → `locatial.vercel.app`.

### Google sign-in
- Added "Continue with Google" (gated by `VITE_GOOGLE_ENABLED`), `profiles` table with
  auto-fill trigger (name/avatar from provider), single-account model.
- Applied `supabase/profiles_setup.sql` to live DB.
- Michael created a Google Cloud **LOCATIAL** project + OAuth Web client (redirect =
  Supabase callback); enabled the **Google provider in Supabase** with client id/secret.
- Verified `external.google: true` via the auth settings endpoint; confirmed the Google
  button live; Michael tested Google sign-in successfully.
- Note: consent screen still in **Testing** (publish pending). Same-email auto-linking
  confirmed as Supabase default (no toggle needed).
- Deploys: `locatial-e11joyzno-…` (button on).

### Consumer browse page
- Added public **`/explore`** listing published stories + `listPublishedStories()` on the
  repository; "Browse stories" buttons on reader and studio.
- Deploy: `locatial-c0dz1jy3n-…`.

### Authentication (email magic link)
- Added Supabase Auth (passwordless email link), `AuthProvider`/`useAuth`, `SignIn`,
  `RequireAuth`. Studio gated; Reader public.
- Applied `supabase/auth_setup.sql`: `owner_id` + owner-scoped RLS + public-read-of-published
  + authenticated storage writes. Configured Site URL + redirect URLs in Supabase.
- Verified live: Studio shows sign-in, Reader public; Michael signed in via email and created
  a story ("bromely the bre").
- Deploy: `locatial-g3oyb8owm-…`.

### First deploy + live Supabase
- Resumed the paused Supabase project; applied `supabase/setup_all.sql` (schema + prototype
  RLS + `chapter-images` bucket + demo seed). Preserved pre-existing incompatible test tables
  by moving them to a `legacy_backup` schema (not deleted).
- Pointed the app at live Supabase; deployed to Vercel (project `locatial`). Verified the app
  reads/writes the real DB; reader loads by slug; map follows chapters.
- Deploy: `locatial-ocqm0mdfz-…` → first `locatial.vercel.app`.

## 2026-06-18
### Initial build (greenfield)
- Built the whole app at `~/Claude/may/locatial`: Story/Section/Chapter domain model, pure
  ordering/validation/camera utils, repository layer (Supabase + localStorage), Creator Studio
  (editor, structure, sections, chapter fields, map placement, image upload, reorder, preview
  desktop/tablet/mobile, publish), public Reader (map + swipe carousel + camera sync), and
  42 tests. Wrote the implementation docs in `docs/implementation/`.
- Verified end-to-end in the browser on localStorage backend before any Supabase wiring.
