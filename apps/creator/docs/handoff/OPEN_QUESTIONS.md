# OPEN QUESTIONS — need Michael's decision

The next agent should resolve these with Michael before/while proceeding. Ordered roughly by
urgency.

## A. Immediate (small, unblock friend-testing)
1. **Publish the Google consent screen?** It's in "Testing", so only Michael/test users can
   use Google sign-in. Publishing (console.cloud.google.com/auth/audience → LOCATIAL →
   *Publish app*) opens it to everyone — no Google review needed for name/email scopes.
   → *Michael action (3 clicks); agent can only guide, not click the dashboard.*
2. **Custom email sender (e.g. Resend)?** Supabase's built-in mailer is rate-limited (~few/hr)
   and spam-prone. Needed before a real friend-test round. OK to set up? (Needs a Resend
   account + SMTP creds from Michael.)

## B. Project hygiene
3. **Initialize git + push to `Phormatte44/locatial`?** The repo is currently NOT under
   version control — the only rollback points are Vercel deployment URLs. Recommend
   `git init`, commit, and push so there's real history + the work lands in the named repo.
   Confirm the remote/branch and that pushing is wanted.
4. **Adopt the Supabase CLI migration flow?** SQL is currently applied by hand in the
   dashboard. Worth wiring `supabase/migrations` properly? (Needs the service-role / DB
   connection, which the agent has not had.)

## C. Product / design direction (the likely next work)
5. **Visual design pass — how far?** Apply the documented design system (Signal Pink, Manrope,
   Night, motion) lightly, or a fuller bespoke redesign? Any reference screens / the
   `cartographer` aesthetic skill to follow? Mobile-first priority confirmed?
6. **Consumer features timing** — when do "save / follow / lists" (the consumer side beyond
   browsing) come in? Affects whether to expand the `profiles`/account model now.
7. **Apple sign-in / iOS app** — timeline? (Apple login becomes required if an iOS app ships
   with Google login; needs Apple Developer Program, $99/yr.)

## D. Platform / scale
8. **Custom domain** for the app (instead of `locatial.vercel.app`)? Affects auth redirect
   URLs + Google consent config.
9. **Multi-city / Channel model** — the original docs describe a Channel/Operator platform.
   When do we evolve Story/Section/Chapter toward that, vs. keep the current simpler model?
10. **Demo data** — keep the "A London Evening" demo story public, or remove before real
    launch? (It's ownerless, shows on the public home.)

## E. Resolved this session (recorded so they aren't re-litigated)
- Account model = **one account, multiple roles** (not separate consumer/creator signups). ✓
- Auth = **email magic link + Google**, passwordless. ✓
- Same-email identities **auto-link** (Supabase default) — no duplicate accounts. ✓
- Reader is **public**; Studio is **gated**; home is the **public browse**. ✓
- Pre-existing test data was **preserved** in `legacy_backup`, not deleted. ✓
