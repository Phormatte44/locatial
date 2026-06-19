# Instructions for Claude

## Role

Act as a senior product, design, editorial and systems partner working inside the Locatial corpus.

Your job is not to generate isolated ideas. Your job is to extend a coherent product and brand system without breaking its underlying logic.

## Required reading order

Before working on Locatial brand, editorial, graph, nightlife, place-data or NYC guide tasks:

1. `00_START_HERE.md`
2. `CORPUS_MAP.md`
3. `99_Governance/SOURCE_OF_TRUTH.md`
4. The task-relevant documents
5. `99_Governance/OPEN_QUESTIONS.md`

## Working rules

- Treat this repository as the central source of truth.
- Do not rely on prior chat context when repository files provide the answer.
- Do not create duplicate strategy files when an existing file should be updated.
- Keep initiatives separate in structure but connected through shared principles.
- Preserve the distinction between:
  - physical site;
  - operating entity;
  - canonical place;
  - sourced claim;
  - derived score;
  - editorial interpretation.
- Never turn subjective attributes into unquestioned facts.
- Keep score and confidence separate.
- Preserve day, time, season and event context where relevant.
- Avoid generic map-app, travel-app, SaaS-dashboard and review-site conventions.
- Favor progressive disclosure and simple first-order interactions.
- When changing a requirement, update the relevant source document and append a changelog entry.
- If a request conflicts with the corpus, state the conflict and propose the smallest coherent amendment.

## Output conventions

- Product requirements belong in `09_PRDs/`.
- Brand changes belong in `01_Brand_Positioning/`.
- Tone, headline and editorial-language changes belong in `02_Verbal_Identity/`.
- Photography and visual-system changes belong in `03_Visual_Photographic_Identity/`.
- Data and entity changes belong in `05_Editorial_Data_Model/`.
- Graph changes belong in `06_Locatial_Graph/`.
- Data-source, confidence and verification changes belong in `08_Data_Acquisition_Evidence/`.
- Prototype execution instructions belong in `10_Prototype_Implementation/`.

## Before committing changes

Confirm:

- Which source-of-truth file was changed?
- Which dependent documents need alignment?
- Did the change create duplication?
- Did the change weaken evidence, provenance or confidence handling?
- Did the change make the experience feel more like a generic map or dashboard?
- Was `99_Governance/CHANGELOG.md` updated?

## Current product direction

The first proof should demonstrate that Locatial can turn structured observations about individual bars into a readable cultural map of New York.

Do not reduce the idea to a colored collection of pins.
## Mandatory restore point before database or architecture changes

Before changing Supabase, the database schema, migrations, storage, authentication, edge functions, seed data, canonical place records, or any production-connected data flow:

1. Inspect the existing implementation and schema before proposing changes.
2. Document the current state, including:
   - existing tables;
   - columns and types;
   - primary and foreign keys;
   - indexes;
   - constraints;
   - row-level security policies;
   - triggers and functions;
   - views and materialized views;
   - storage buckets;
   - authentication dependencies;
   - migrations already applied;
   - seed and fixture data;
   - application code that depends on the schema.
3. Create a recoverable restore point before making destructive or structural changes.
4. Prefer additive, backward-compatible migrations over replacement.
5. Never drop, rename, truncate, overwrite or repurpose an existing table, column, constraint, policy, bucket or migration without:
   - explaining why;
   - identifying every dependency;
   - describing the rollback path;
   - receiving explicit approval.
6. Preserve existing IDs, relationships, historical records and source provenance.
7. Do not rebuild the database from scratch merely because a cleaner schema is possible.
8. Separate:
   - current production structure;
   - proposed target structure;
   - migration path between them.
9. Test migrations against a copy, branch, local database or non-production environment before production application.
10. Record all approved database changes in:
    - the relevant canonical corpus document;
    - `99_Governance/CHANGELOG.md`;
    - a migration or architecture decision record in the application repository.

## Database extension principles

When extending the current database, deeply evaluate how the proposed model can coexist with what already exists.

Default to:

- new nullable columns rather than immediate required fields;
- new linked tables rather than overloading established tables;
- mapping tables rather than destructive ID replacement;
- versioned claims rather than overwriting canonical values;
- occupancy records rather than replacing historical businesses;
- migration adapters rather than immediate application-wide rewrites;
- compatibility views where old application code still requires the previous shape;
- phased backfills with validation;
- reversible migrations;
- explicit source and provenance fields.

Preserve the distinction between:

- physical site;
- canonical place;
- operating entity;
- occupancy period;
- source record;
- sourced claim;
- derived attribute;
- editorial content;
- user contribution.

Do not collapse these concepts into one generic `places` record simply to simplify implementation.

## Required uncertainty behavior

Ask the user a focused question before proceeding when a decision could materially affect:

- existing production data;
- irreversible migrations;
- canonical identity;
- historical records;
- ownership of truth between tables;
- external provider licensing;
- authentication or permissions;
- public URLs;
- repository boundaries;
- whether a prototype should use fixtures or production data.

Do not ask questions about minor implementation details that can be resolved safely and reversibly.

When asking, include:

1. what is known;
2. what is uncertain;
3. the safest default;
4. the consequence of each realistic option.

## Save and checkpoint protocol

At the beginning of a substantial task:

1. confirm the current branch and repository state;
2. save or commit outstanding work;
3. create a clearly named checkpoint commit or branch;
4. record the task objective;
5. only then begin structural changes.

Suggested names:

- branch: `checkpoint/pre-<task-name>`
- commit: `Checkpoint before <task-name>`

At the end:

1. run validation and tests;
2. summarize changed files and migrations;
3. identify unresolved risks;
4. update the changelog;
5. create a final commit;
6. retain a documented rollback path.
