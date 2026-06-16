# Changelog

## 2026-06-15 — Initial GitHub harness

Created GitHub-ready Locatial harness structure.

## 2026-06-15 — Absorbed PRD2 durable decisions

Adopted:
- Profile can own multiple Channels.
- Channels can publish multiple Projects.
- Projects should eventually publish under a Channel identity.
- Located Stops may include camera framing: zoom, pitch, bearing.
- Datasets require source URL and attribution at upload.
- Agent drafts are internal/admin seeding tooling only, not creator-facing product.

Constrained:
- Do not let PRD2 pull the product back into a form-first CMS.
- Do not expose agent drafting to creators yet.
- Do not let schema-first implementation override the Library → Projects → Published mental model.

## 2026-06-15 — First prototype UI stack locked

Adopted:
- First visual prototype should use React, Tailwind CSS, shadcn/ui, and Obra shadcn_ui kit Pro edition 1.13.2.
- Prototype should run in neutral dark mode.
- Prototype should not use previous Locatial visual references.
- Prototype is for interaction validation, not final visual design.
