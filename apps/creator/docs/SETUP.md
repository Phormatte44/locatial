# Setup — Supabase, local dev, deployment

## 1. Local development (no Supabase needed)
```bash
npm install
cp .env.example .env.local   # then BLANK the VITE_SUPABASE_* values to use local mode
npm run dev                  # http://localhost:5310
```
With `VITE_SUPABASE_URL` empty the app uses a localStorage-backed repository — full
Studio + Reader flow works immediately. Use **Create demo story (20 chapters)** on the
landing page to populate data.

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest run (42 tests)
npm run build       # production build → dist/
```

## 2. Provisioning Supabase (real persistence)
The browser only ever uses the **anon** key. The steps below need the **service-role**
key (Settings → API in the Supabase dashboard) and are run from a trusted place — the SQL
editor or `psql`. The service-role key must never appear in any `VITE_*` variable.

1. **Run the schema migration** — paste `supabase/migrations/0001_init.sql` into the
   Supabase SQL editor and run it. (Or with the CLI: `supabase db push`.)
2. **Enable prototype RLS** — run `supabase/migrations/0002_rls_prototype.sql`. This opens
   anon read/write so the auth-deferred Studio works. NOT production-safe.
3. **Create the storage bucket** — run `supabase/storage.sql` (creates the public
   `chapter-images` bucket + prototype object policies).
4. **(Optional) Seed demo data** — run `supabase/seed.sql` for the London demo story.
5. **Point the app at Supabase** — in `.env.local`:
   ```
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key>
   VITE_SUPABASE_IMAGE_BUCKET=chapter-images
   ```
   Restart `npm run dev`. The landing page badge will switch from **Local storage** to
   **Supabase**.

> This project's Supabase URL + anon key are pre-filled in `.env.example`. The service-role
> key was **not** provided to the build, so migrations/seeding/bucket creation must be run
> by someone who has it. Until then the app runs in local mode.

## 3. Securing for production (when auth is added)
1. Add Supabase Auth (email magic link / OAuth) — product code reads no auth today, so this
   is additive.
2. Run `supabase/migrations/0003_secure_rls.sql.example` (rename to `.sql`): adds
   `owner_id`, restricts writes to the authenticated owner, exposes only **published**
   stories publicly.
3. Gate publishing server-side (Edge Function / RPC with validation) so the
   "agents create drafts but never publish" rule (publishService D5) is enforced beyond the
   client.

## 4. Deployment (Vercel)
```bash
npm run build
npx vercel --prod
```
`vercel.json` sets the build command, output dir, and SPA rewrite. Add the two `VITE_*`
env vars in the Vercel project settings (Production + Preview). Do **not** add the
service-role key.
