# LOCATIAL Creator Studio — Master Product Requirements Document
## The Place-First Authoring System for Spatial Stories, Guides, Collections, and Living Place Knowledge

**Status:** Canonical source of truth  
**Version:** 1.0  
**Date:** June 2026  
**Owner:** Michael McCann — Founder / Product & Design  
**Audience:** Product, design, engineering, spatial systems, data platform, editorial operations, and build agents

---

## 1. Executive Summary

LOCATIAL Creator Studio is the write-side operating system for a place-first media platform. It is where creators gather material, shape an idea, organize a work, attach places, media, datasets, and camera intent, preview the reader experience, and publish into the Locatial place graph.

It is not a generic CMS, a blogging tool with a map, a GIS editor, or an events form. It is a spatial composition environment.

The central product thesis is:

> Creators should work with meaning—what the work is, what it says, where it happens, and how it should unfold—while the system captures structure, identity, geometry, time, provenance, and publishing state.

The canonical product model is:

```text
Library → Projects → Published
```

The canonical desktop editor is:

```text
Structure → Active Content → Material Tray
```

The map is always available, but not always dominant. It expands when creators locate, sequence, inspect, or preview; it recedes during focused writing.


---

## 2. Vision and Principles

LOCATIAL re-indexes knowledge through geography. Most publishing tools treat place as metadata attached to content. LOCATIAL makes place the durable spine to which stories, guides, events, media, datasets, people, claims, and historical identity attach.

Principles:

1. **Place is structural, not decorative.** Every meaningful stop resolves to a reusable Place Node or an explicit unresolved candidate.
2. **One editor, multiple work types.** Stories, Guides, and Collections share one authoring system with type-specific labels and defaults.
3. **Progressive disclosure.** Advanced features appear only when relevant.
4. **Non-linear creation.** A creator may begin with a photo, place, note, dataset, signal, outline, or blank project.
5. **Material before structure; structure before polish.**
6. **The map is a lens, not the whole editor.**
7. **Drafts are safe.** Nothing publishes accidentally.
8. **The database protects integrity.**
9. **Reuse beats duplication.**
10. **Published work remains alive, versioned, and recoverable.**


---

## 3. Goals and Non-Goals

### Goals

- Start a new spatial work in under one minute.
- Support Story, Guide, and Collection as first-class work types.
- Provide a persistent Library for captures, media, places, links, and datasets.
- Turn gathered material into an ordered structure.
- Make chapters, stops, and items independently placeable.
- Support structured blocks for text, media, maps, charts, and data.
- Provide live private Preview.
- Support draft, publish, unpublish, update, and archive.
- Preserve provenance, attribution, confidence, and revision history.
- Support agent-generated drafts under human publishing control.
- Work across desktop and mobile with task-appropriate layouts.

### Non-Goals

The first complete Studio is not a professional GIS suite, a desktop-publishing package, a general design tool, a full video editor, a real-time multiplayer whiteboard, a public reader, or an autonomous publishing bot.


---

## 4. Users and Core Jobs

### Editorial Creator
Creates place-anchored stories with text, media, chapters, and narrative order.

### Guide Curator
Builds ranked, grouped, or sequenced sets of places.

### Data Journalist
Combines editorial narrative with reusable spatial datasets and charts.

### Channel Operator
Manages drafts, publishing identity, status, and a body of work.

### Mobile Field Creator
Captures photos, video, voice, notes, and nearby places in the world.

### Agent Author
Produces schema-shaped drafts with provenance but cannot publish.

Primary JTBD:

> When I have an idea that depends on specific places, I want to gather material, organize it into a spatial work, and publish it as an experience that moves through real geography.


---

## 5. Top-Level Product Model

### Library
Reusable source material not yet committed to final structure:

- captures;
- notes;
- images;
- video;
- voice;
- links;
- saved places;
- datasets;
- documents;
- reusable map layers.

### Projects
Works in progress:

- Stories;
- Guides;
- Collections;
- their children;
- project material;
- drafts;
- spatial structure;
- private previews.

### Published
Live or previously live works:

- current public version;
- update state;
- revision history;
- archive state;
- visibility;
- performance data later.

This model separates:

```text
What I have
What I am making
What I have released
```


---

## 6. Work Types and Lifecycle

### Story
A sequenced narrative made of Chapters.

### Guide
A curated sequence or set of Stops.

### Collection
A grouped set of Items that may not require narrative order.

Future types may include Series, Dossier, Event Package, Audio Tour, Itinerary, Field Note, and Photo Essay.

Lifecycle:

```text
Idea → Gathering → Draft → Review → Published → Updated / Unpublished → Archived
```

Published content must be recoverable, versioned, and capable of being superseded without losing history.


---

## 7. Information Architecture

Global desktop navigation:

```text
Library | Projects | Published
```

Global actions:

- search;
- create;
- account/channel;
- notifications later;
- settings.

The Projects dashboard is the default desktop home. Each project card shows work type, title, cover, status, child count, last edited, channel, geographic scope, and warnings.

Mobile prioritizes Capture, recent projects, continue editing, upload progress, and nearby saved material.


---

## 8. Project Creation and Shape

The Create action offers:

- Story;
- Guide;
- Collection;
- Capture;
- Import Dataset.

Minimum creation fields:

- type;
- working title or untitled placeholder;
- owner;
- default channel;
- draft status.

Optional:

- summary;
- cover;
- geography;
- audience;
- purpose;
- source material.

### Shape

Shape defines:

- what is being made;
- who it is for;
- why it exists;
- intended geographic and time scope;
- included and excluded material;
- intended channel;
- desired length;
- success definition.

Shape is not final writing, exact order, layout, or publishing. It may be skipped or inferred provisionally from gathered material.


---

## 9. Canonical Editor Architecture

Desktop uses three working zones:

```text
Left: Structure
Center: Active Content
Right: Material
```

### Left — Structure
For Stories: Chapters.  
For Guides: Stops.  
For Collections: Items.

Actions:

- add;
- rename;
- reorder;
- group;
- duplicate;
- delete;
- navigate;
- show completion;
- show attached place;
- show warnings.

### Center — Active Content Editor
Default Story chapter blocks:

1. Image
2. Headline
3. Text

Supported blocks:

- paragraph;
- heading;
- image;
- video;
- gallery;
- quote;
- pull quote;
- place card;
- map;
- route;
- chart;
- dataset view;
- embed;
- callout;
- caption.

### Right — Material Tray

Two levels:

- **Context Material:** relevant to the selected child.
- **Global Library:** reusable creator material.

Material moves progressively:

```text
Library → Context → Active Editor
```


---

## 10. Gathering and Mobile Capture

Capture types:

- note;
- voice;
- photo;
- video;
- link;
- place;
- dataset;
- document;
- screenshot.

Capture metadata should attempt to record:

- time;
- creator;
- device;
- coordinates;
- nearby place candidates;
- project association;
- source;
- upload state.

For geotagged media:

1. extract coordinates;
2. find nearby canonical places;
3. suggest likely matches;
4. require confirmation or correction;
5. preserve original coordinates as evidence.

Mobile Capture must support camera, gallery, quick note, voice, current location, nearby place suggestion, add to project, and save to Library.

Simple video editing is limited to in point, out point, and cover frame.


---

## 11. Structure and Arrangement

Creators may add a child:

- blank;
- from Library material;
- from a place;
- from imported outline;
- from agent suggestion.

Support drag-and-drop and keyboard reordering, grouping, duplication, automatic numbering, and undo.

Optional groups include:

- morning / afternoon / evening;
- beginning / middle / end;
- boroughs;
- themes;
- eras;
- route phases.

Unassigned placeholders may contain only a title, place, or note. This supports planning before writing.


---

## 12. Place Model and Placement

Every placed child references a reusable canonical Place Node.

A Place Node is distinct from raw coordinates, a prose mention, an external business listing, a dataset feature, or a map markup.

Place selection flow:

1. Search by name or address.
2. Show canonical candidates.
3. Display geometry, hierarchy, aliases, and current identity.
4. Confirm the correct node.
5. If none exists, create a place candidate.
6. Record evidence and source.
7. Resolve through place governance.

Minimum new-candidate fields:

- name or descriptive label;
- coordinate or geometry;
- place type;
- geographic context;
- source/evidence.

The canonical model must separate:

```text
Physical site / geometry
from
Establishment occupying it
```

It must also support time-bound Place Eras.


---

## 13. Map Interaction and Camera Intent

The map is available in:

- Place Picker;
- Structure view;
- Preview;
- Dataset editor;
- Project overview;
- Place Inspector.

Display modes:

- compact context;
- split view;
- expanded spatial view;
- full preview.

Actions:

- search;
- select;
- inspect;
- frame;
- draw markup;
- view route;
- toggle layers;
- preview journey.

Advanced creators may define renderer-neutral camera intent:

- altitude or zoom;
- pitch;
- bearing;
- active target;
- framing;
- transition intent.


---

## 14. Spatial Markup

Markup expresses meaning over the map without modifying the basemap.

Tools:

- point;
- line;
- route;
- polygon;
- rough polygon;
- circle;
- text;
- arrow;
- measurement;
- highlight area.

Styling:

- stroke;
- fill;
- opacity;
- width;
- dash;
- symbol;
- label;
- z-order;
- scale visibility.

Markup is stored as structured project-owned geometry and may attach to a project, child, block, or place.

Future natural-language actions must produce inspectable operations, not opaque output.


---

## 15. Dataset System

Datasets are reusable spatial resources and must not be conflated with canonical places.

Supported inputs:

- GeoJSON;
- CSV with coordinates;
- KML;
- TopoJSON;
- Shapefile via conversion;
- remote feeds later.

Each dataset records:

- title;
- owner;
- source;
- source URL;
- attribution;
- license;
- format;
- bounding box;
- geometry types;
- feature count;
- fields;
- privacy;
- processing state.

Import flow:

1. upload/connect;
2. validate;
3. inspect geometry;
4. detect fields;
5. preview samples;
6. require attribution and license;
7. save to Library;
8. attach to project or child;
9. configure display.

Display controls include filters, feature selection, symbols, stroke/fill, opacity, labels, thresholds, categorical styling, ramps, legends, scale visibility, and layer order.

Creators may attach a full dataset, filtered subset, selected features, or a saved query while preserving the source dataset.


---

## 16. Content and Media Blocks

### Text
Rich text, headings, links, lists, inline place mentions, citations, and future footnotes.

### Images
Upload or Library selection, crop intent, focal point, caption, alt text, credit, place association, and hero designation.

### Video
Upload, trim, poster frame, caption, credit, and place association.

### Charts
Created from attached datasets, CSV, or manual values. Source and transformation metadata must be retained.

### Map Blocks
May include viewport, place, datasets, markup, route, annotations, and camera state.


---

## 17. Preview

Preview is a first-class mode.

Goals:

- inspect compiled reading flow;
- test order;
- inspect spatial movement;
- verify media;
- check mobile presentation;
- validate attribution;
- expose missing content.

Modes:

- reader desktop;
- reader mobile;
- chapter-by-chapter;
- map-first;
- text-first;
- full journey.

Preview must surface warnings for missing places, unresolved candidates, broken media, missing alt text, missing attribution, empty required children, invalid routes, and inaccessible contrast.

Preview never publishes.


---

## 18. Publishing

Pre-publish requirements:

- title;
- type;
- owner;
- channel;
- valid slug;
- required children or valid short-form body;
- mandatory placements resolved;
- required attribution;
- media available;
- no blocking errors.

Actions:

- save draft;
- publish now;
- update published version;
- unpublish;
- archive;
- schedule later.

Every publication records:

- author;
- channel;
- byline;
- publication timestamp;
- revision;
- visibility;
- canonical URL.

By default, child visibility follows the parent.

Agents cannot publish.


---

## 19. Dashboard, Resume, and Round-Trip Fidelity

Opening a project must reconstruct:

- top-level metadata;
- child order;
- groups;
- blocks;
- places;
- media;
- datasets;
- camera intent;
- styling;
- preview configuration.

Round-trip fidelity is non-negotiable.

Search spans titles, body, places, channels, captures, datasets, tags, and status.

Archived work remains recoverable. Permanent deletion requires explicit elevated confirmation.


---

## 20. Place Inspector, Claims, and Confidence

The Place Inspector shows:

- canonical identity;
- physical geometry;
- current establishment;
- historical eras;
- hierarchy;
- aliases;
- external source matches;
- existing Locatial works;
- attached media;
- unresolved claims;
- confidence.

Creator actions:

- use this place;
- select historical era;
- propose correction;
- add evidence;
- create candidate;
- view related works;
- add to Library.

Creator contributions should be stored as sourced claims rather than instantly overwriting canonical truth.

Each claim records contributor, source, evidence, timestamp, target property, value, confidence, authority, independence, recency, specificity, and moderation state.

Objective facts and subjective attributes must remain distinct.


---

## 21. Agentic Authoring

Agents may:

- propose Shape;
- cluster Library material;
- suggest structure;
- draft text;
- identify candidate places;
- propose datasets;
- generate chapter summaries;
- flag missing evidence;
- create complete drafts.

Agents may not:

- publish;
- silently create canonical places;
- remove attribution;
- overwrite human work without confirmation;
- resolve disputed facts as truth;
- delete published work.

Agent output must conform to structured project, child, block, placement, claim, media, and dataset schemas. The interface must distinguish human-authored, agent-generated, agent-edited, unresolved, and externally sourced content.


---

## 22. Collaboration

The first build prioritizes an excellent single-creator loop.

The architecture must later support:

- owner;
- editor;
- contributor;
- reviewer;
- viewer;
- comments;
- assignments;
- approval;
- presence;
- version comparison;
- change requests.

Do not build real-time multiplayer before core authoring is stable.


---

## 23. Core Data Model

Core authored entities:

```text
workspace
channel
project
content_item
content_block
project_member
revision
publication
```

Spatial entities:

```text
physical_site
place
place_era
establishment
placement
place_claim
place_source
place_alias
place_hierarchy
```

Asset entities:

```text
capture
media_asset
media_variant
dataset
content_dataset
map_markup
```

Relationship entities:

```text
content_relation
place_relation
route
route_stop
collection_item
```

Existing unified `content` table implementations may be supported through service adapters. The POC schema must not constrain the product domain model.


---

## 24. Functional Requirements

### P0 — Core

- Create Story, Guide, or Collection.
- Save private draft immediately.
- List and filter Projects.
- Resume with full fidelity.
- Add, edit, reorder, duplicate, group, and remove children.
- Edit text and media blocks.
- Search and attach canonical places.
- Create unresolved place candidates with evidence.
- Upload and reuse images.
- Autosave with visible state.
- Preview compiled experience.
- Publish, update, unpublish, archive, and restore.
- Mobile quick Capture to Library.
- Human-only publish permission.

### P1 — Spatial Expression

- Expanded/compact map modes.
- Per-child camera intent.
- Route generation from ordered stops.
- Spatial markup.
- Place Inspector.
- Historical era selection.
- Reusable place media.
- Mobile location suggestion.

### P1 — Datasets

- Import supported formats.
- Validate and inspect.
- Require attribution.
- Save to Library.
- Attach to project or child.
- Style, filter, and select features.
- Preview scale-based reveal.

### P2 — Intelligence and Teams

- Agent draft ingestion.
- Clustering and Shape suggestions.
- Feed-to-draft.
- Evidence warnings.
- Roles, review, comments, assignments, scheduling, and revision comparison.


---

## 25. Non-Functional Requirements

### Performance
- Dashboard useful within 2 seconds on standard broadband.
- Editor target 60 fps in ordinary use.
- Autosave never blocks typing.
- Upload progress and resumability.
- Dataset parsing asynchronous.
- Map loading must not block writing.

### Reliability
- Local recovery buffer.
- Retryable and idempotent writes.
- Unsaved-state warning.
- Refresh recovery.

### Security
- Authenticated access.
- Row-level security.
- Private drafts.
- Role enforcement.
- Signed or protected uploads where needed.
- No service secrets in client code.

### Accessibility
- Keyboard navigation.
- Screen-reader labels.
- visible focus.
- contrast compliance.
- alt-text workflow.
- reduced motion.
- keyboard equivalents for drag operations.

### Responsive Strategy
Desktop is for deep authoring. Mobile is optimized for Capture, review, light editing, reorder, place confirmation, and publish checks. Do not compress the three-column desktop editor into a narrow phone layout.


---

## 26. Technical Architecture

Target frontend:

- React;
- TypeScript;
- Tailwind;
- Obra shadcn-based components;
- MapLibre GL JS;
- deck.gl where required;
- Vercel.

Backend:

- Supabase Postgres;
- PostGIS;
- Supabase Auth;
- Supabase Storage;
- privileged server routes or Edge Functions;
- background media and dataset processing.

Suggested frontend modules:

```text
src/
  app/
  dashboard/
  library/
  projects/
  editor/
    structure/
    blocks/
    material-tray/
    shape/
    preview/
  places/
    search/
    picker/
    inspector/
  maps/
    map-stage/
    markup/
    camera/
  datasets/
    import/
    library/
    styling/
  media/
    upload/
    trim/
  publishing/
  agents/
  data/
  ui/
```

Required backend services:

- project;
- content;
- place resolver;
- claims;
- media;
- dataset;
- publishing;
- revisions;
- agent ingestion.


---

## 27. Autosave, Versioning, and Validation

Autosave should debounce ordinary text edits, persist structural changes immediately, show saving/saved/error states, retain local recovery, and prevent duplicate child creation.

Create revisions at:

- first publish;
- each republish;
- manual snapshot;
- major agent rewrite;
- restore point.

Published output should render from a stable snapshot or version reference.

Blocking validation:

- missing owner;
- invalid type;
- missing publish title;
- missing required placement;
- missing mandatory attribution;
- invalid dataset;
- broken required media;
- unauthorized publish.

Non-blocking warnings:

- no cover;
- missing optional alt text in draft;
- uneven chapter lengths;
- route discontinuity;
- duplicate nearby place candidate;
- low-confidence claim;
- camera framing not previewed.


---

## 28. Metrics

Creation:

- time to first project;
- time to first child;
- time to first preview;
- time to publish;
- completion rate;
- abandonment stage.

Quality:

- published children with resolved places;
- duplicate place rate;
- missing attribution rate;
- publish-block errors;
- post-publish correction rate;
- autosave recovery rate.

Library:

- capture-to-project conversion;
- asset reuse;
- dataset reuse.

Experience:

- understanding of Library / Projects / Published;
- success attaching a correct place;
- success reordering without instruction;
- Preview usage;
- satisfaction with map prominence.


---

## 29. Acceptance Criteria

### New Project
Creating a work opens a private project with the correct type and an editable title.

### Add Child
Adding a chapter, stop, or item inserts it into Structure, opens it, applies default blocks, and autosaves.

### Attach Place
Search returns canonical candidates with enough context to choose correctly. Confirmation creates a Placement reference rather than copying place fields.

### Use Library Material
Inserting a Library asset references the existing asset and retains source metadata.

### Reorder
New order persists and Preview updates.

### Preview
Preview renders the latest draft using production composition rules without changing publication state.

### Publish
An authorized human can publish only after blocking validation passes, creating a stable version and canonical URL.

### Resume
All structure, blocks, places, assets, datasets, styling, and order restore accurately.

### Agent Draft
Valid agent output creates a private attributed draft and cannot publish.


---

## 30. Test Matrix

| Area | Tests |
|---|---|
| Dashboard | Create, filter, resume, archive, restore |
| Editor | Add blocks, reorder, undo, autosave |
| Structure | 30+ children, grouping, keyboard reorder |
| Places | Existing place, alias, era, new candidate |
| Media | Large image, mobile upload, interrupted upload |
| Video | Trim and upload |
| Library | Reuse assets across projects |
| Datasets | GeoJSON, CSV, invalid file, missing attribution |
| Preview | Desktop/mobile and validation warnings |
| Publishing | Draft, publish, update, unpublish |
| Permissions | Owner/editor/contributor boundaries |
| Offline | Temporary disconnect during writing |
| Agent | Valid draft, malformed draft, publish attempt |
| Accessibility | Keyboard-only workflows |
| Mobile | Capture, quick edit, place confirmation |


---

## 31. Risks and Mitigations

### Complexity
Use progressive disclosure, templates, defaults, and advanced modes.

### Map Dominates Writing
Keep map compact during composition and expand only for spatial tasks.

### Duplicate Places
Use canonical search, aliases, proximity matching, candidate workflow, and Place Inspector.

### Library Becomes a Dump
Use strong search, recent/nearby groupings, suggestions, processing states, and archive.

### Data Model Leaks Into UI
Use human terminology, conditional forms, and service abstraction.

### Agent Content Damages Trust
Draft-only agents, provenance, evidence checks, and human publish gate.

### POC Architecture Constrains Product
Treat current tables as implementation history and preserve a future-proof domain model.


---

## 32. Open Decisions

1. Must every Story chapter have a primary place?
2. Must every Collection item be spatial?
3. How prominent should Shape be for first-time creators?
4. Should the map open automatically when a child lacks a place?
5. When does a raw Capture become a reusable Media Asset?
6. What is the exact distinction between Update and Republish?
7. Which dataset controls belong in the first release?
8. Can creators directly mint place candidates?
9. How should historical eras be explained to ordinary creators?
10. Should Preview use the exact production renderer?
11. How should project-level material differ from Context Material?
12. What policy governs agent-generated factual claims?


---

## 33. Roadmap

### Phase 1 — Core Authoring Loop
Authentication, Projects dashboard, work creation, three-column editor, child ordering, text/image blocks, Place Picker, autosave, Preview, publishing, Vercel.

### Phase 2 — Library and Mobile Capture
Persistent Library, mobile photo/video/note capture, location suggestion, media processing, Context Material.

### Phase 3 — Spatial Expression
Expanded map, routes, camera intent, markup, Place Inspector, historical eras.

### Phase 4 — Dataset Authoring
Import, validation, attribution, styling, filtering, feature selection, reuse.

### Phase 5 — Intelligence and Agents
Clustering, Shape suggestions, structured draft ingestion, place suggestions, evidence warnings, feed-to-draft.

### Phase 6 — Editorial Teams
Roles, review, comments, assignments, revision comparison, scheduling.


---

## 34. Definition of Success

Creator Studio succeeds when:

- creators can begin with messy material rather than a perfect outline;
- the system helps convert that material into a coherent spatial work;
- place remains structurally correct without slowing creation;
- the editor feels simpler than the architecture beneath it;
- the map appears exactly when useful;
- Preview makes the final experience understandable before publication;
- Library assets, datasets, and Place Nodes gain value through reuse;
- publishing creates durable, queryable, addressable works;
- agents accelerate creation without gaining editorial authority.

---

## 35. Canonical Product Statement

LOCATIAL Creator Studio is the place-first authoring environment for spatial media.

The creator gathers material in Library.

They shape an idea into a Project.

They arrange chapters, stops, or items into meaningful structure.

They compose with text, media, places, routes, and datasets.

They preview the work as a spatial experience.

They publish through a channel into the Locatial graph.

The creator works with meaning.

The system captures structure.

---

## Appendix — Canonical Terminology

| Term | Definition |
|---|---|
| Library | Reusable source material |
| Project | Editable work in progress |
| Story | Sequenced narrative |
| Guide | Curated sequence or set of places |
| Collection | Grouped set of places or works |
| Chapter | Child of a Story |
| Stop | Child of a Guide |
| Item | Child of a Collection |
| Place Node | Canonical reusable place identity |
| Placement | Relationship between content and place |
| Capture | Raw creator input |
| Media Asset | Processed reusable media |
| Context Material | Material associated with the active child |
| Shape | Project intent and definition |
| Preview | Private rendering of the reader experience |
| Dataset | Reusable spatial data |
| Markup | Creator-authored map geometry |
| Channel | Publishing identity |
| Claim | Sourced assertion |
| Revision | Historical editable state |
| Publication | Public project version |

This Master PRD consolidates and supersedes the uploaded Studio PRDs, HTML specifications, and GitHub-ready documentation.
