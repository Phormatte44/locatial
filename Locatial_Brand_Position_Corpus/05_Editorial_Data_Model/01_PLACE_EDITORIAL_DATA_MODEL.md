# Place and Editorial Data Model

## Entity separation

The model must distinguish:

### PhysicalSite

The persistent physical geometry or unit.

### OperatingEntity

The business, institution or organization occupying the site during a defined period.

### CanonicalPlace

The user-facing place identity that connects current and historical context.

### SourceRecord

An external provider or contributor record.

### Claim

A sourced statement about a place.

### DerivedAttribute

A computed conclusion based on claims.

### EditorialEntry

An authored interpretation intended for publication.

## Place identity fields

- `locatial_place_id`
- `physical_site_id`
- `operating_entity_id`
- name
- alternate names
- former names
- address
- coordinates
- entrance coordinates
- neighborhood
- borough
- category
- operating status
- external IDs
- occupancy start and end dates

## Operational facts

- hours;
- reservations;
- walk-ins;
- happy hour;
- price ranges;
- kitchen hours;
- age restrictions;
- accessibility;
- screens;
- sports shown;
- live music;
- cover charge;
- outdoor seating;
- payment policy.

## Experiential attributes

- after work;
- date night;
- budget;
- sports;
- late night;
- conversational;
- animated;
- loud;
- polished;
- casual;
- solo-friendly;
- group-friendly;
- neighborhood-oriented;
- student-heavy;
- visitor-heavy.

Every attribute must include:

- score;
- confidence;
- applicable day and time;
- evidence count;
- independent source count;
- last verified;
- underlying claim references.

## Claim record

Each claim contains:

- claim ID;
- place ID;
- property or attribute;
- value;
- source type;
- source ID;
- observed or supplied date;
- time context;
- evidence;
- confidence;
- verification status;
- rights and usage restrictions.

## Score versus confidence

- **Score:** how strongly the characteristic applies.
- **Confidence:** how reliable the system believes that conclusion is.

These must never be collapsed into one number.
