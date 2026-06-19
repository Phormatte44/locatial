# SESSION HANDOVER — 2026-06-19 (read this FIRST)

Most current state. Supersedes older notes in `CURRENT_STATE_HANDOFF.md` /
`CHANGELOG.md` / `OPEN_QUESTIONS.md` where they disagree. After this, skim those + the
specs in `../implementation/`.

---

## TL;DR — where we are
A working LOCATIAL prototype is **live and on GitHub**, and we've just started **migrating
Michael's real locatial.io (Webflow) content into the app's Supabase DB**.

- **Live app:** https://locatial.vercel.app  (citizen browse = `/`, reader = `/story/:slug`,
  Studio = `/studio`, login required for Studio).
- **Repo:** `Phormatte44/locatial` (a monorepo). The app is at **`apps/creator/`**.
- **Canonical local path:** `/Users/michaelmccann/Claude/may/locatial/apps/creator`
  (repo root = `/Users/michaelmccann/Claude/may/locatial`). On git; `git push` works
  (token in macOS keychain). Deploy: `cd apps/creator && vercel deploy --prod`.
- **Backend:** Supabase project `locatial-prototypes` (ref `snowiacdagibrxwhkzoi`), free tier
  (AUTO-PAUSES ~weekly → resume in dashboard if app looks empty).

## ⛳ MIGRATION DONE (2026-06-19) — what's next
The locatial.io → Supabase migration is **complete**: all 14 Webflow collections imported →
**16 published stories / 301 chapters** live (verified via anon API + visible at `/`). Done with
`apps/creator/supabase/imports/rest_import.py` (service_role + REST). The pilot SQL
(`best-music-venues-nyc.sql`) and `all-guides.sql` remain as artifacts.

**Immediate follow-ups:**
- 🔐 **Michael should ROTATE the `service_role` key** (he pasted it in chat; used once, never
  stored) — Supabase → Settings → API Keys → Legacy → roll service_role. App uses anon, so
  unaffected.
- **Quality polish (optional):** big pin-collections (Banksy Maps, Twenty Largest Countries,
  MM PhotoGeornal, A History…, Deadly Fates) have NO body text (the CMS had none) — they're
  photo-map pins. Several stories have granular address-derived sections; re-run with
  `rest_import.py --flat-sections` (or per-collection) to flatten if desired.
- Then the original backlog: **visual design pass**, publish Google consent screen, repo→private,
  custom SMTP.

---

## The Webflow → Supabase migration (the active workstream)
**Why it's clean:** locatial.io is a Webflow CMS site. Its **`Locations`** collection
(284 items) already has, per item: `picture`, `location` (name), `address`, `card----title`
(headline), `card----body` (body), `longitude`, `latitude`, `zoom`/`pitch`/`bearing`
(→ our chapter `camera`), and a **`collection`** text field that groups items into
guides/collections. So: each Location → a **Chapter**; each distinct `collection` value →
a **Story**. ~Near 1:1 mapping; coordinates + camera already present (no geocoding needed).

**Webflow access (Data API v2):**
- Site "LOCATIAL" id = `64ea1f05f055c6958cd93dd0`
- Collections: `Locations` = `66019a8c5f7df86379232825` (the main one);
  `Wonders of the Worlds` = `66019a8c5f7df86379232826` (same shape).
- **Token:** Michael supplied a Webflow API token this session (read-only). It is NOT stored
  in the repo (don't commit tokens). **Ask Michael to re-paste it** to do the full export.
- Calls used: `GET /v2/sites`, `GET /v2/sites/{id}/collections`,
  `GET /v2/collections/{id}`, `GET /v2/collections/{id}/items?limit=100&offset=N`
  (header `Authorization: Bearer <token>`). Run via Bash with `dangerouslyDisableSandbox`.

**Full inventory (the 14 `collection` groups in Locations, count each):**
A History of Technology & Innovation 44 · Deadly Fates 44 · Music Festivals around the Globe
38 · MM PhotoGeornal 32 · Banksy Maps 29 · Twenty Largest Countries 21 · Cocaine Chronicles
18 · News Room 11 · Radar 10 · LoCals 9 · 7 Wonders 8 · the Dronalist 7 · Drones 7 ·
Best Music Venues in NYC 6. (281/284 have coords; 251/284 have images.)

**Field mapping (Locations → chapters):** name←`location`, headline←`card----title`,
body←`card----body`, image_url←`picture.url`, place_name←`address`, longitude←`longitude`,
latitude←`latitude`, camera←{zoom,pitch,bearing}, tags←(set as you like). Skip "cover/intro"
cards (no `card----title`, e.g. the "A PlayceList Guide / About..." item).

**How the pilot SQL was produced:** a Python generator reads the fetched Webflow items
(`/tmp/loc_{0,100,200}.json` during the session — re-fetch fresh), filters one `collection`,
escapes strings (double single-quotes), and emits a `do $$` block. Reuse the same approach to
generate ONE big script for all place-based collections (one Story per `collection`).

**That generator is now committed:** `apps/creator/supabase/imports/generate_import.py`
(parameterized, output byte-for-byte matches the pilot). It fetches the full `Locations`
collection itself given `WEBFLOW_TOKEN`, or reads pre-fetched JSON via `--from-json`. Flags:
`--only "<collection>"` (repeatable), `--exclude`, `--status published|draft`,
`--flat-sections`. Defaults: all collections except the editorial set (MM PhotoGeornal,
News Room, Cocaine Chronicles, Radar), sections derived from the address (segment after the
last comma → borough/country), one Chapter per Location, status published, each block
re-runnable (`delete … where slug=…` first). Run e.g.:
`WEBFLOW_TOKEN=xxxx python3 supabase/imports/generate_import.py > supabase/imports/all-guides.sql`

**Decisions still needed for full migration (ask Michael):**
- Which of the 14 to migrate (all? skip editorial ones like MM PhotoGeornal / News Room /
  Cocaine Chronicles that may not be true place-guides?).
- Images: reference Webflow CDN URLs (current pilot approach, simplest) vs copy into Supabase
  storage (durability).
- Sections: derive from address/borough (pilot does Manhattan/Brooklyn) or keep flat.
- All published, or import as drafts for review?
- Writing to DB: needs SQL-editor (postgres) or the **service-role key** (still NOT provided).
  Pilot uses SQL editor (Michael runs). For 284 rows that's fine as one generated script.

---

## Everything that's DONE & live
- **App** (React+TS+Vite+Tailwind+MapLibre+Supabase): Story/Section/Chapter model; Creator
  Studio (editor, sections, reorder, map placement, image upload, preview desktop/tablet/
  mobile, publish); public Reader (map + swipe + camera sync); public citizen browse (`/`).
  42 tests pass; `tsc` + build clean.
- **Auth:** email magic link **and** Google — both working live. One account (citizen +
  creator), creator = a role not a second signup. Same-email identities auto-link (Supabase
  default). Studio gated; reading public.
- **DB (Supabase):** tables `stories`/`sections`/`chapters`/`profiles` (+ `legacy_backup`
  schema holding old pre-existing test tables, preserved). Owner-scoped RLS + public-read-of-
  published. Storage bucket `chapter-images`. Demo story "A London Evening" (published) +
  Michael's draft "bromely the bre".
- **Deploy:** Vercel project `locatial`; env vars set incl. `VITE_GOOGLE_ENABLED=true`.
- **GitHub:** all committed/pushed to `main` (latest commit adds the pilot import script).

## PENDING — Michael's actions / decisions
1. **Run the pilot SQL** (above) and confirm.
2. **Make the GitHub repo private** — it's currently PUBLIC. (Agent must NOT change repo
   visibility — that's a permissions action; Michael does it: repo Settings → General →
   Danger Zone → Change visibility.) No secrets are in the repo (only the public anon key).
3. **Publish the Google OAuth consent screen** (it's in "Testing") so friends can use Google:
   console.cloud.google.com/auth/audience → project **LOCATIAL** (#`497404808359`) →
   Publish app. (Agent can't drive the GCP console here — see gotcha.)
4. Decide full-migration scope (above).
5. Later: custom SMTP (Resend) for email sign-in at scale; Apple sign-in; **visual design
   pass** (UI is intentionally plain).

## Credentials / access map (values NOT in repo — Michael holds them)
- Supabase anon key: in `apps/creator/.env.example` (public, fine). Service-role key: NOT
  available. URL/ref: `snowiacdagibrxwhkzoi`.
- Vercel: CLI authed as `michaelomccann-4376`, team `team_LQx9ixYgTu8dCJUavZbmJVr7`, project
  `locatial`. Deploy needs network → `dangerouslyDisableSandbox`.
- GitHub: push works via macOS keychain (token NOT in repo).
- Google OAuth: client id `497404808359-4o70ac3idrho6akluatk606no3tasl51.apps.googleusercontent.com`
  (public); secret lives in Supabase only.
- Webflow API token: provided this session, NOT stored — re-request from Michael.

## How to run / verify / deploy
```bash
cd /Users/michaelmccann/Claude/may/locatial/apps/creator
npm install && npm run dev      # http://localhost:5310 (auth bypassed if Supabase env blank)
npm test                        # 42 tests
vercel deploy --prod            # live (needs network)
git push origin main            # from repo root; keychain auth
```
**Verify DB state without the dashboard** (anon, read-only) — e.g. check published stories:
```
curl -s 'https://snowiacdagibrxwhkzoi.supabase.co/rest/v1/stories?select=title,slug,status' \
  -H "apikey: <anon key from .env.example>"
```
Auth providers state: `…/auth/v1/settings` (same `apikey` header) → `external.google`.

## ⚠️ Environment gotcha (cost me time — expect it)
The Chrome-extension automation **cannot render the Supabase or Google Cloud dashboards**
(pages stay blank / never finish loading; screenshots time out). So all dashboard work
(running SQL, toggling auth providers, publishing the consent screen, changing repo
visibility) had to be **handed to Michael as click steps**. `javascript_tool` against
already-loaded pages and against the live app works; CLI (`vercel`, `git`, `curl`) works.
Don't burn time fighting the dashboards — hand them to Michael.

## Rollback / checkpoints
Git history on `Phormatte44/locatial` `main` (commits: `v2` → app under apps/creator →
handoff docs → consolidation → pilot import). Vercel keeps immutable deploy URLs
(`vercel ls locatial`). No manual DB snapshot; old test data preserved in `legacy_backup`
schema. The pilot SQL's `delete … where slug='best-music-venues-in-nyc'` makes it safely
re-runnable.
