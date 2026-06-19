# Source of Truth and Authority

## Authority hierarchy

When documents conflict, use this order:

1. Explicit recent user decisions recorded in the changelog
2. Approved PRDs
3. Core data and graph architecture
4. Brand positioning
5. Editorial and visual guidelines
6. Prototype-specific implementation notes
7. Exploratory notes

## Canonical documents

- Positioning: `01_Brand_Positioning/01_POSITIONING_PLATFORM.md`
- Verbal identity: `02_Verbal_Identity/01_VERBAL_IDENTITY.md`
- Place editorial style: `02_Verbal_Identity/02_PLACE_EDITORIAL_STYLE.md`
- Photography: `03_Visual_Photographic_Identity/01_PHOTOGRAPHY_DIRECTION.md`
- NYC guide: `04_NYC_Bars_Guide/01_GUIDE_PRODUCT_MODEL.md`
- Place data: `05_Editorial_Data_Model/01_PLACE_EDITORIAL_DATA_MODEL.md`
- Graph: `06_Locatial_Graph/01_GRAPH_THESIS.md`
- Nightlife layers: `07_Nightlife_Intelligence/01_SPATIAL_CHARACTER_LAYERS.md`
- Evidence: `08_Data_Acquisition_Evidence/01_ACQUISITION_AND_CONFIDENCE.md`
- Build scope: `09_PRDs/01_NIGHTLIFE_INTELLIGENCE_MICRO_PRD.md`

## Change rule

Do not create a new competing source-of-truth document.

Update the canonical document and record the change.

## Facts versus decisions

External facts should be sourced.

Product and brand decisions should be traceable to a user decision, an approved PRD or a changelog entry.

## Uncertainty

Where the corpus does not contain a decision:

- state the assumption;
- use the least irreversible interpretation;
- add the issue to `OPEN_QUESTIONS.md`;
- do not silently establish permanent architecture.
