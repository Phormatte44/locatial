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
