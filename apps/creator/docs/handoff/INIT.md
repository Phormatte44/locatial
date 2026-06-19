# START HERE — new agent / new chat

You are taking over the **LOCATIAL** build from a previous agent. Read these three files
in order, then you're ready:

1. **`CURRENT_STATE_HANDOFF.md`** — what exists, where, and how to run it. (Read first.)
2. **`CHANGELOG.md`** — how the project got to this state.
3. **`OPEN_QUESTIONS.md`** — decisions waiting on Michael (the user).

Then skim the original spec docs in `../implementation/` (REPOSITORY_UNDERSTANDING,
SOURCE_OF_TRUTH_MAP, DECISIONS_AND_CONFLICTS, PROTOTYPE_BUILD_PLAN) and `../../README.md`.

## 30-second orientation
- **What it is:** a spatial storytelling product. Creators build Stories (Sections →
  Chapters, each with image/headline/body/tags/map-location) in a **Studio**; citizens
  browse and read published Stories on a mobile **Reader** (map on top, swipe through chapters).
- **Repo:** `/Users/michaelmccann/Claude/may/locatial` (React + TS + Vite + Tailwind +
  MapLibre + Supabase). ⚠️ Not yet a git repo — see Rollback section in the handoff.
- **Live:** https://locatial.vercel.app  · **Studio:** https://locatial.vercel.app/studio
- **Backend:** Supabase project `locatial-prototypes` (ref `snowiacdagibrxwhkzoi`), free tier
  (auto-pauses). Vercel project `locatial`.
- **Status:** end-to-end working — auth (email + Google), citizen browse, create/edit,
  publish, reader with map sync. 42 tests pass. **Visual design is intentionally plain.**

## First commands
```bash
cd /Users/michaelmccann/Claude/may/locatial
npm install
npm run dev        # http://localhost:5310  (uses localStorage unless .env.local has Supabase)
npm test           # 42 tests
npm run build
```

## The likely next task
**Visual design pass** — apply the documented LOCATIAL design system (Signal Pink `#FF2D7A`,
Manrope, Night dark theme, motion curves) to the currently-neutral UI, without breaking the
product logic. Confirm scope with Michael first (see OPEN_QUESTIONS).

## Critical gotcha for this environment
The Chrome-extension browser automation **could not render the Supabase or Google Cloud
dashboards** last session (pages stayed blank / never finished loading). Anything needing
those dashboards (DB config, auth providers, Google consent screen) had to be **handed to
Michael as click-by-click steps**. Expect the same; don't burn time fighting it. CLI tools
(`vercel`, `npm`) and `javascript_tool` against the live app work fine. You can read live
Supabase auth state without the dashboard via:
`GET https://snowiacdagibrxwhkzoi.supabase.co/auth/v1/settings` (header `apikey: <anon key>`).
