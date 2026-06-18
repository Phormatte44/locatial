# Locatial Place Platform
## Product Requirements Document

**Document type:** Product Requirements Document  
**Status:** Draft for product and technical alignment  
**Time horizon:** Zero-to-three-years, designed for long-term scale  
**Primary domain:** Place identity, place graph, place pages, event aggregation, provenance, recommendations, participation, and spatial addressing  
**Owner:** Locatial  
**Last updated:** 17 June 2026  

---

# 1. Executive Summary

Locatial requires a durable, proprietary system for representing real-world places as living digital objects.

The platform must support more than map pins, business listings, or event cards. It must create a long-lived identity layer that allows a physical site, an establishment, a venue, a story, an event, a recommendation, a photograph, a historical period, and a user relationship to connect without becoming conflated.

The central product requirement is:

> Every meaningful location can receive a durable Locatial identity, accumulate trusted facts and attributed perspectives, preserve its history, connect to people and activity, and render as one coherent destination.

The system must work from the first place ever created in Locatial, while remaining structurally valid when the platform contains millions of places, hundreds of millions of relationships, multiple event and place providers, place representatives, creator content, user media, historical records, and a recommendation engine.

This PRD therefore defines the three-year target architecture from the beginning. Early releases may implement only a subset of capabilities, but they must use the same underlying identity, provenance, temporal, and relationship models.

The system must ensure that:

- Physical geometry is distinct from the businesses or establishments that occupy it.
- Every place receives a Locatial-owned immutable identifier.
- External provider IDs remain references, never canonical identity.
- Every place has an auditable genesis.
- External records, creator mentions, official claims, events, and media resolve to canonical Locatial objects.
- Historical occupancy, renaming, movement, closure, reopening, merging, and splitting are preserved.
- Search resolves to a cohesive place object rather than a list of disconnected provider results.
- Place pages and microsites are composed from modular data and graph relationships.
- Subjective qualities such as “cosy,” “friendly,” or “romantic” remain attributed claims until confidence and consensus thresholds are met.
- Locations can be followed, can publish controlled updates to followers, and can receive user-contributed media.
- User interactions with locations contribute to a taste and recommendation graph.
- A future human-readable spatial addressing and URL system can be added without changing canonical identity.
- Locatial owns the durable identity layer, reconciliation decisions, graph, provenance, first-party contributions, and derived intelligence, while respecting third-party licensing and source rights.

---

# 2. Document Purpose

This document defines the product, data, interaction, service, and operational requirements for Locatial’s Place Platform.

It is the source of truth for:

- Place identity
- Physical site identity
- Establishment and organisation identity
- Place genesis
- External data ingestion
- Place reconciliation
- Source claims and provenance
- Historical occupancy
- Place relationships
- Place search
- Place pages
- Place microsites
- Event aggregation
- Story and recommendation attachment
- Place following
- Place-to-follower communication
- User-contributed place media
- Place claiming and verification
- Organisation and branch hierarchy
- Recommendation and taste graph readiness
- Spatial URLs and future addressing
- Data ownership
- Moderation
- APIs
- Scalability
- Measurement
- Testing
- Rollout

This document is not a lightweight MVP specification. It defines the durable system that early product slices must grow into.

---

# 3. Problem Statement

Existing place systems generally suffer from one or more of the following limitations:

1. They treat a provider record as the place itself.
2. They collapse a building, a business, and an event venue into one object.
3. They overwrite current information instead of preserving historical state.
4. They return lists of search results rather than a composed place record.
5. They mix objective facts, official claims, user opinions, and inferred attributes without clear provenance.
6. They cannot reliably reconcile creator references, event feeds, business data, and community contributions.
7. They attach content to coordinates or names that may change.
8. They create brittle dependencies on one mapping, ticketing, or business-data provider.
9. They lack a durable graph for recommendations and relationships.
10. They are not designed to let each place become its own persistent destination or microsite.

Locatial must solve these problems at the data-model and identity level before attempting to scale discovery, stories, events, recommendations, or commerce.

---

# 4. Product Vision

Locatial will become a place-first publishing and discovery platform in which every meaningful place can accumulate:

- Identity
- Geometry
- History
- Facts
- Activity
- Media
- Recommendations
- Stories
- Relationships
- Followers
- Official updates
- Community contributions
- Events
- Commercial actions
- Human-readable addresses
- Machine-readable APIs

The place itself is the primary object.

Stories, events, recommendations, photographs, visits, guides, and organisations are connected lenses onto that place.

A user may enter through:

- Search
- A map
- An event
- A creator story
- A recommendation
- A shared image
- A guide
- A place update
- A URL
- A QR code

Every route should eventually resolve to the same coherent place experience.

---

# 5. Product Thesis

Locatial is not building a directory of locations.

Locatial is building a durable spatial identity and relationship system.

The core thesis is:

> A place is a living, temporal, attributed object that can be referenced by many sources without losing its identity.

A place page should answer:

- What is this place?
- Where is it?
- What occupies it now?
- What occupied it before?
- What is happening there?
- Why do people value it?
- Who has written about it?
- What do people consistently experience there?
- What official information is current?
- What media belongs to it?
- Which other places relate to it?
- How can a user act on it?
- How has it changed over time?

---

# 6. Product Principles

## 6.1 Locatial owns canonical identity

Every canonical object must use a Locatial-owned immutable identifier.

External IDs may be attached as evidence and integration references but must not define the canonical identity.

## 6.2 Physical site and operating entity are distinct

A physical building or parcel may host many businesses over time.

A business may move between sites.

Those objects must never be permanently collapsed.

## 6.3 History is preserved

Renames, moves, closures, openings, occupancy changes, and data corrections must be represented as history rather than overwritten.

## 6.4 Every place has genesis

Every place must retain an auditable record of how, when, by whom, and from which evidence it entered Locatial.

## 6.5 Every input is a claim before it is truth

Creator tags, user descriptions, provider fields, official submissions, and algorithmic inferences must be stored as sourced claims before being promoted to canonical facts or commonly perceived attributes.

## 6.6 Facts and opinions are not interchangeable

“Address,” “official website,” and “operating status” are factual claims.

“Cosy,” “friendly,” “overrated,” and “romantic” are experiential claims.

The system must treat them differently.

## 6.7 Search resolves to entities

A successful search should resolve to the canonical place and render a composed place page, not expose the user to disconnected provider records.

## 6.8 Place pages are composed

The page is generated from canonical data and graph relationships. It is not manually copied into a separate CMS record.

## 6.9 Provider independence is mandatory

No external provider may become structurally indispensable.

## 6.10 Uncertainty is explicit

The system must support provisional, disputed, stale, and uncertain states.

## 6.11 Merges must not break references

Duplicate identities are expected. Merging must preserve old IDs as permanent redirects.

## 6.12 User contribution must create durable value

Contributions should improve the graph, not merely create disposable reviews.

## 6.13 Commercial relationships must not redefine truth

Payment, sponsorship, or ticket availability may affect modules and actions but must not alter canonical identity, historical records, or independent editorial ranking.

## 6.14 The architecture must support future addressing

Canonical identity must remain separate from display names, slugs, URLs, and future spatial aliases.

---

# 7. Goals

## 7.1 Primary goals

- Create a durable canonical identity model for real-world places.
- Prevent future rewiring when businesses move, locations change, providers conflict, or historical occupancy becomes important.
- Allow multiple creators, providers, users, organisations, and event systems to reference one canonical place.
- Generate coherent place pages from distributed data.
- Build a proprietary place graph and provenance system.
- Enable future personalisation and recommendation.
- Support place following and controlled place communication.
- Support place-level user media.
- Support place microsites and future human-readable spatial addressing.
- Support global scale.

## 7.2 Secondary goals

- Create a transparent review system for ambiguous matches.
- Make the creator experience lightweight.
- Allow place representatives to verify official information without controlling independent content.
- Enable rich event presentation without becoming dependent on a ticketing provider.
- Establish the basis for future enterprise APIs and location intelligence.

## 7.3 Non-goals for the earliest release

The earliest release does not need to:

- Fully automate global reconciliation.
- Launch a public place-claiming programme.
- Build a graph database from day one.
- Provide direct ticket checkout.
- Launch place-to-follower messaging.
- Finalise the public spatial URL syntax.
- Generate mature personalised recommendations.
- Support every possible geographic ontology.
- Replace external map or business data providers.

However, early implementation must not block those future capabilities.

---

# 8. Success Definition

The system succeeds when:

1. A creator references Brooklyn Steel in a story.
2. Ticketmaster imports an event occurring at Brooklyn Steel.
3. A second creator recommends Brooklyn Steel.
4. A user uploads a photograph from Brooklyn Steel.
5. An official venue representative confirms current contact details.
6. A historical story references an earlier business at the same physical site.
7. All of these records remain independent and retain provenance.
8. The current venue references one canonical Locatial place/entity.
9. The physical site remains separately identifiable.
10. The event, stories, recommendation, image, facts, and history compose into one place page.
11. Search for “Brooklyn Steel” opens that page.
12. A future rename, closure, replacement, or relocation does not break the historic record.
13. The system can explain why every material fact or attribute is present.

---

# 9. Users and Stakeholders

## 9.1 Visitors and readers

Needs:

- Search for a specific place.
- Discover places by geography, category, story, event, or recommendation.
- Understand what a place is and why it matters.
- See what is happening there.
- Save and follow places.
- Upload media.
- Receive relevant updates.
- Discover similar places.

## 9.2 Creators

Needs:

- Reference places in natural writing.
- Select an existing place or introduce a new one.
- Recommend places.
- Add structured descriptors without completing long forms.
- Connect stories, guides, chapters, routes, media, and events to places.
- Preserve attribution.
- Receive contribution credit.
- Avoid responsibility for provider reconciliation.

## 9.3 Place representatives

Needs:

- Claim an establishment or organisation.
- Verify official details.
- Publish controlled updates.
- Add events.
- Manage branch information.
- Correct operational facts.
- Communicate with followers under platform rules.
- View analytics.

## 9.4 Event organisers

Needs:

- Attach events to canonical venues.
- Connect event providers.
- Correct venue mismatches.
- Supply artwork and official links.
- Preserve recurring event identity.

## 9.5 Users contributing media

Needs:

- Upload a photograph or video to a place.
- Indicate when and why it was taken.
- Attach it to an event, visit, story, or general place record.
- Retain attribution.
- Remove content.
- Understand moderation and rights.

## 9.6 Locatial editors and moderators

Needs:

- Review match candidates.
- Merge and split identities.
- Resolve conflicting claims.
- Verify official sources.
- Moderate media and descriptions.
- Audit identity history.
- Correct provider mappings.
- Manage disputes.

## 9.7 External providers

Examples:

- Ticketmaster
- SeatGeek
- Eventbrite
- DICE
- OpenStreetMap
- Wikidata
- Foursquare
- Google Places where licensed
- Municipal open-data systems
- Venue-owned feeds
- Tourism boards
- Archives

## 9.8 Enterprise and API users

Future needs:

- Query place identity.
- Resolve external records.
- Retrieve canonical pages.
- Access relationship data.
- Publish events and updates.
- Consume verified location intelligence.
- Use spatial links.

---

# 10. Core Domain Model

The system must distinguish between spatial reality, operating identity, user-facing destination, content, claims, and relationships.

## 10.1 Site

A Site represents persistent physical geometry.

Examples:

- Building
- Parcel
- Venue complex
- Park
- Square
- Station
- Trail
- Beach
- Monument
- Campus
- Market footprint

Core fields:

- `site_id`
- `site_type`
- `canonical_geometry`
- `centroid`
- `geometry_version`
- `address_id`
- `parent_site_id`
- `created_at`
- `status`
- `provenance_summary`

A Site may exist without a current Establishment.

A Site may contain other Sites.

A Site may change geometry over time.

## 10.2 Establishment

An Establishment represents an operating, named, or socially recognised destination.

Examples:

- Brooklyn Steel
- A wine shop
- A restaurant
- A theatre
- A gallery
- A butcher
- A park organisation
- A temporary pop-up

Core fields:

- `establishment_id`
- `canonical_name`
- `establishment_type`
- `operating_status`
- `organisation_id`
- `valid_from`
- `valid_to`
- `created_at`
- `verification_status`

An Establishment may occupy one or more Sites over time.

## 10.3 Place

A Place is the primary user-facing Locatial destination object.

A Place may represent:

- A current Establishment
- A physical Site
- A natural feature
- A public realm
- A meaningful named location
- A contained venue
- A region
- A temporary destination

The system must not assume that every Place maps one-to-one to an Establishment.

Core fields:

- `place_id`
- `place_kind`
- `canonical_name`
- `primary_site_id`
- `primary_establishment_id`
- `current_status`
- `canonical_slug`
- `created_at`
- `genesis_id`
- `verification_status`
- `visibility_status`

The final implementation may model Place as a projection over Site and Establishment, but the public contract must remain stable.

## 10.4 Occupancy

An Occupancy records that an Establishment occupied or operated at a Site during a period.

Core fields:

- `occupancy_id`
- `site_id`
- `establishment_id`
- `relationship_type`
- `valid_from`
- `valid_to`
- `is_current`
- `source_claim_ids`
- `confidence`
- `status`

Examples of relationship types:

- `primary_occupant`
- `tenant`
- `operator`
- `temporary_occupant`
- `event_occupant`
- `shared_occupant`
- `historic_occupant`

## 10.5 Organisation

An Organisation represents a legal or operating organisation.

Examples:

- Parent company
- Brand owner
- Venue operator
- Franchisee
- Nonprofit
- Government body
- Event promoter

Core fields:

- `organisation_id`
- `canonical_name`
- `organisation_type`
- `parent_organisation_id`
- `official_domains`
- `verification_status`

## 10.6 Brand

A Brand represents a public identity that may operate across multiple establishments.

Examples:

- Starbucks
- Soho House
- Live Nation
- A local restaurant group

Core fields:

- `brand_id`
- `organisation_id`
- `canonical_name`
- `aliases`
- `brand_scope`

## 10.7 Event

An Event is a temporal activity occurring at one or more Places or Sites.

Core fields:

- `event_id`
- `canonical_title`
- `start_at`
- `end_at`
- `timezone`
- `event_status`
- `venue_place_id`
- `organiser_id`
- `event_series_id`
- `category`
- `source_records`
- `ticket_actions`
- `media`

## 10.8 Content object

Content objects include:

- Story
- Guide
- Collection
- Chapter
- Story stop
- Recommendation
- Note
- Official update
- User post

Each content object may connect to a Place through a typed relationship.

## 10.9 Media object

Media includes:

- Image
- Video
- Audio
- Document
- Artwork
- Map layer

Core fields:

- `media_id`
- `owner_id`
- `source_type`
- `rights_status`
- `captured_at`
- `uploaded_at`
- `location_claim`
- `moderation_status`

## 10.10 Claim

A Claim is a sourced statement about an object.

Examples:

- “Brooklyn Steel is a music venue.”
- “This venue is cosy.”
- “The phone number is X.”
- “The place was closed in 2024.”
- “This is wheelchair accessible.”

Core fields:

- `claim_id`
- `subject_type`
- `subject_id`
- `predicate`
- `value`
- `value_type`
- `claim_class`
- `source_id`
- `source_actor_id`
- `observed_at`
- `valid_from`
- `valid_to`
- `created_at`
- `confidence`
- `independence_group`
- `status`

Claim classes:

- `objective_fact`
- `official_assertion`
- `experiential_observation`
- `editorial_opinion`
- `historical_assertion`
- `algorithmic_inference`
- `provider_field`

## 10.11 Relationship

Relationships connect objects in the graph.

Core fields:

- `relationship_id`
- `subject_type`
- `subject_id`
- `predicate`
- `object_type`
- `object_id`
- `valid_from`
- `valid_to`
- `source_claim_ids`
- `confidence`
- `visibility`
- `status`

---

# 11. Identity Architecture

## 11.1 Identifier requirements

Every canonical object must receive:

- A Locatial-owned immutable ID.
- A type namespace.
- A creation timestamp.
- A durable redirect capability.
- A separate editable slug.
- A record of genesis.

Recommended ID form:

- UUIDv7
- ULID
- Equivalent sortable opaque identifier

Example:

`loc_place_01JX8R5M2T7H...`

The ID must not encode:

- Name
- Address
- Coordinates
- Provider
- Category
- Country
- Current ownership

## 11.2 Identifier namespaces

Required namespaces include:

- `site`
- `place`
- `establishment`
- `organisation`
- `brand`
- `event`
- `story`
- `guide`
- `recommendation`
- `media`
- `claim`
- `relationship`
- `occupancy`
- `region`

## 11.3 Slugs

Slugs are presentation identifiers.

Examples:

- `brooklyn-steel`
- `starbucks-broadway-oakland`

Slugs:

- May change
- May be localised
- May have aliases
- Must redirect after change
- Must never replace canonical IDs

## 11.4 External references

External references must be stored separately.

Fields:

- `external_ref_id`
- `canonical_object_type`
- `canonical_object_id`
- `provider`
- `provider_object_type`
- `provider_object_id`
- `provider_url`
- `raw_name`
- `first_seen_at`
- `last_seen_at`
- `last_verified_at`
- `raw_payload_location`
- `status`

## 11.5 Merge behaviour

When two canonical IDs are determined to represent the same object:

- One ID becomes canonical.
- The other becomes `merged`.
- The old ID permanently resolves to the canonical ID.
- All references are migrated or resolved through indirection.
- The merge decision is logged.
- The original genesis records remain preserved.
- A reversible administrative audit record is retained.

## 11.6 Split behaviour

When one object is discovered to represent multiple real-world entities:

- New canonical IDs are created.
- Relationships and claims are redistributed.
- The original ID becomes a historical umbrella, deprecated identity, or redirect according to case.
- Manual review is mandatory.
- Published content must remain resolvable.

## 11.7 Retirement

Objects must support:

- Active
- Temporarily closed
- Permanently closed
- Moved
- Renamed
- Replaced
- Merged
- Retired
- Deleted for policy reasons

Closed and retired objects must remain addressable for historical content.

---

# 12. Place Genesis

Every accepted Place, Site, or Establishment must have a genesis record.

## 12.1 Genesis sources

A place may originate from:

- Creator selection
- Creator creation
- Provider import
- Venue representative
- Event import
- Locatial editor
- Bulk data import
- User media upload
- Story parsing
- API partner
- Historical archive

## 12.2 Genesis flow

1. Receive incoming place claim.
2. Normalise available fields.
3. Search canonical registry.
4. Generate match candidates.
5. Check external references.
6. Calculate match confidence.
7. Reuse an existing ID when confidence threshold is met.
8. Request confirmation when ambiguous.
9. Create a new canonical ID when no acceptable match exists.
10. Store genesis provenance.
11. Assign initial status.
12. Attach external references.
13. Queue for future enrichment when necessary.

## 12.3 Genesis status

- `provisional`: introduced by limited evidence.
- `confirmed`: intentionally selected or corroborated.
- `verified`: confirmed by authoritative or official evidence.
- `disputed`: conflicting identity evidence.
- `merged`: duplicate identity.
- `retired`: no longer active but historically retained.

## 12.4 Genesis record

Required fields:

- `genesis_id`
- `canonical_object_id`
- `created_at`
- `created_by_type`
- `created_by_id`
- `genesis_source_type`
- `source_provider`
- `source_provider_id`
- `raw_name`
- `raw_address`
- `raw_coordinates`
- `candidate_ids_checked`
- `match_decision`
- `match_confidence`
- `initial_status`
- `initial_claim_ids`

---

# 13. Place Resolution and Reconciliation

## 13.1 Resolution objective

The resolver determines whether an incoming place claim refers to:

- An existing canonical object
- A new object
- An ambiguous object requiring review
- A contained object
- A moved or renamed object
- A historical object
- A temporary object

## 13.2 Match signals

Required signals include:

- Exact external ID
- Normalised name
- Alias match
- Address match
- Postal code
- Coordinate proximity
- Geometry overlap
- Place category
- Website domain
- Phone number
- Organisation relationship
- Parent site
- City and region
- Temporal validity
- Official identifiers
- Event venue references
- Historical occupancy

## 13.3 Matching hierarchy

1. Exact external reference match
2. Exact official domain or verified branch identifier
3. Exact address plus strong name match
4. Strong coordinate plus compatible type and name
5. Historical or parent-child contextual match
6. Probabilistic candidate review
7. New-object creation

## 13.4 Confidence scoring

Illustrative weighted signals:

- Existing provider reference: auto-match
- Exact verified website domain: 35
- Address match: 30
- Coordinates within threshold: 20
- Name similarity: 20
- Type compatibility: 10
- Same parent or organisation: 10
- Temporal compatibility: 10
- Same city/postcode: 5

Scores must remain explainable.

## 13.5 Decision states

- `auto_match`
- `suggest_match`
- `manual_review`
- `create_new`
- `reject`
- `defer`

Illustrative thresholds:

- 90+: automatic match
- 70–89: suggested match
- 50–69: manual review
- Below 50: likely new object

Thresholds must be tuned through validation data.

## 13.6 Mandatory ambiguity cases

Manual review must be triggered when:

- Multiple businesses share one address.
- A venue is inside a larger venue.
- A brand has nearby branches.
- A business has moved.
- A name is highly generic.
- Coordinates are within the same building.
- Historical dates conflict.
- A provider uses a complex name while the creator names a room.
- A temporary venue overlaps a permanent venue.
- External sources strongly disagree.

## 13.7 Reconciliation lab

Locatial must build an internal Place Reconciliation Lab showing:

- Incoming record
- Candidate canonical records
- Map comparison
- Field comparison
- Match score
- Evidence sources
- Temporal compatibility
- Suggested decision
- Reviewer action
- Audit history

---

# 14. Data Acquisition and Elicitation Strategy

## 14.1 Core principle

Every contribution is first stored as a sourced claim.

No creator tag, provider field, user answer, or official submission should silently overwrite canonical truth.

## 14.2 Mandatory human inputs when identifying a place

At minimum, a creator or user must provide or confirm:

1. Which place they mean
2. Name
3. Map position or address
4. Place category
5. Relationship to the place
6. Time or period of observation
7. Source basis

Relationship options:

- I visited
- I work here
- I own or manage it
- I researched it
- I attended an event
- I am importing official data
- I am referencing historical material

## 14.3 Recommended creator prompts

Progressive prompts should include:

- What kind of place is this?
- Why would someone go here?
- What does it feel like?
- Who is it best for?
- When is the best time to visit?
- What makes it distinct?
- What should someone know before going?
- When did you last experience it?
- Is this a current or historical description?

## 14.4 Controlled vocabulary

Structured attributes should use controlled families.

### Place function

- Wine shop
- Music venue
- Restaurant
- Bar
- Park
- Gallery
- Cinema
- Butcher
- Market
- Bookshop
- Café
- Museum
- Venue
- Public space

### Atmosphere

- Cosy
- Lively
- Quiet
- Intimate
- Formal
- Casual
- Loud
- Relaxed
- Energetic
- Romantic
- Experimental

### Audience

- Families
- Couples
- Solo visitors
- Locals
- Tourists
- Music fans
- Children
- Professionals
- Students

### Occasion

- Date night
- Quick visit
- Celebration
- Work
- Late night
- Weekend afternoon
- Group gathering
- Special occasion

### Character

- Independent
- Historic
- Experimental
- Neighbourhood institution
- Design-led
- Underground
- Premium
- Community-led
- Chain
- Hidden

Free text must remain available in addition to structured attributes.

## 14.5 API input requirements

Where available, provider adapters should ingest:

- Provider object ID
- Name
- Aliases
- Coordinates
- Geometry
- Address
- Category
- Parent venue or site
- Official website
- Phone
- Opening hours
- Operational status
- Accessibility
- Images
- Event activity
- Last updated time
- Source URL
- Provider confidence
- Licence and display restrictions

## 14.6 Objective versus subjective claims

Objective claims include:

- Category
- Address
- Phone number
- Opening hours
- Operating status
- Accessibility
- Capacity
- Event dates
- Official website

Subjective claims include:

- Cosy
- Friendly
- Loud
- Romantic
- Overrated
- Hidden gem
- Good for dates
- Family-friendly
- Heavy-metal atmosphere

Subjective claims must retain attribution and context.

## 14.7 Confidence model

Confidence must consider:

- Source authority
- Source independence
- Recency
- Specificity
- First-hand observation
- Corroboration
- Contradiction
- Temporal relevance
- Source history
- Official status
- Provider reliability

## 14.8 Independence

Multiple copied records must not count as independent evidence.

The system must group claims likely derived from the same upstream source.

## 14.9 Suggested consensus states

- `unverified`
- `single_observation`
- `emerging_signal`
- `corroborated`
- `high_confidence`
- `commonly_perceived`
- `disputed`
- `outdated`

## 14.10 Illustrative promotion rules

For an objective category such as “wine shop”:

- One verified official source may be sufficient.
- Two independent reliable providers may be sufficient.
- Three independent human confirmations with no contradiction may be sufficient.
- Conflicting official and current evidence requires review.

For a subjective attribute such as “cosy”:

- One person: attributed personal opinion.
- Two to three independent observations: emerging signal.
- Five or more independent observations with strong agreement: corroborated.
- Ten or more observations across multiple dates and contributor types: commonly perceived.
- Strong contextual contradiction: preserve multiple contextual attributes.

These thresholds are starting points, not universal laws.

## 14.11 Contextual attributes

Attributes may depend on:

- Daypart
- Day of week
- Event state
- Season
- Audience
- Room
- Area within venue
- Crowd size
- Historical period

Example:

- Cosy on weekday afternoons
- Loud during concerts
- Family-friendly before 7pm
- Heavy-metal venue on programmed nights

## 14.12 Canonical promotion

A claim may be promoted to a canonical field only when:

- The field is eligible to be canonical.
- Source quality meets threshold.
- Evidence is current.
- Contradictions are resolved or represented.
- Licensing permits use.
- Promotion is auditable.

---

# 15. Provenance and Source-of-Truth Rules

## 15.1 Field-level provenance

Every material displayed field must be traceable to:

- Source
- Claim
- Timestamp
- Validity period
- Confidence
- Licence
- Review status

## 15.2 Source classes

- Official
- Government or authoritative registry
- Trusted provider
- Creator first-hand
- User first-hand
- Historical archive
- Editorial research
- Algorithmic inference
- Unverified submission

## 15.3 Source precedence

No universal precedence applies to all fields.

Examples:

- Official domain may outrank provider website field.
- Government address may outrank user-submitted address.
- Current on-site observation may outrank stale provider hours.
- Creator opinion must not be overwritten by official marketing language.
- Historic archive may outrank current provider data for past periods.

## 15.4 Conflict handling

The system must support:

- Selecting a canonical value
- Displaying a disputed state
- Displaying multiple contextual values
- Requesting verification
- Preserving all source claims
- Reverting a canonical promotion

## 15.5 Freshness

Every canonical field must have:

- Last verified time
- Freshness policy
- Expiration or review threshold
- Source refresh path

---

# 16. External Provider Architecture

## 16.1 Provider-neutral adapters

Each source must implement a normalised adapter.

```text
External Provider
→ Provider Adapter
→ Normalised Claim Package
→ Resolver
→ Canonical Registry
```

## 16.2 Required provider adapters

Initial and future adapters may include:

- Ticketmaster
- SeatGeek
- Eventbrite
- DICE
- Direct venue feeds
- OpenStreetMap
- Wikidata
- Foursquare
- Google Places where licensed
- Municipal open data
- Tourism boards
- Historical archives

## 16.3 Provider package

Each adapter must output:

- Provider metadata
- Raw object ID
- Object type
- Normalised name
- Aliases
- Coordinates
- Geometry
- Address
- Category
- Parent relationships
- Contact fields
- Operational fields
- Media
- Event references
- Update timestamp
- Licence rules
- Raw payload pointer

## 16.4 Raw payload retention

Raw provider payloads should be retained where licensing permits for:

- Audit
- Reprocessing
- Adapter upgrades
- Matching review
- Dispute resolution

## 16.5 Provider failure

The system must support:

- Provider outage
- Provider removal
- Credential expiration
- Rate limiting
- Schema change
- Data revocation
- Licence change
- Provider deprecation

The canonical graph must remain intact when a provider becomes unavailable.

---

# 17. Place Graph

## 17.1 Explicit relationships

Required relationship predicates include:

- `located_at`
- `occupies`
- `formerly_occupied`
- `inside`
- `contains`
- `part_of`
- `near`
- `adjacent_to`
- `renamed_from`
- `replaces`
- `moved_from`
- `operated_by`
- `owned_by`
- `brand_of`
- `featured_in`
- `mentioned_in`
- `recommended_by`
- `photographed_at`
- `event_occurs_at`
- `followed_by`
- `visited_by`
- `saved_by`
- `similar_to`
- `often_visited_with`
- `connected_by_route`
- `belongs_to_region`
- `associated_with`

## 17.2 Relationship properties

Every relationship may include:

- Direction
- Strength
- Confidence
- Validity period
- Source claims
- Visibility
- Moderation state
- Derivation method

## 17.3 Explicit versus inferred edges

Explicit edges come from:

- Creator attachment
- Official data
- User action
- Provider relationship
- Editorial review

Inferred edges come from:

- Co-visitation
- Shared audience
- Similar attributes
- Shared creators
- Geographic proximity
- Sequential activity
- Embeddings
- Collaborative filtering

Inferred edges must remain distinguishable.

---

# 18. Content-to-Place Attachment

## 18.1 Relationship types

Content may connect to a Place as:

- Primary subject
- Featured location
- Story stop
- Recommendation
- Historical subject
- Passing mention
- Route waypoint
- Photo location
- Event venue
- Contextual reference
- Nearby recommendation

## 18.2 Structured mention behaviour

When a creator references a place:

1. Detect or prompt for place attachment.
2. Search the Locatial registry.
3. Present likely matches.
4. Allow creation when no match exists.
5. Store canonical `place_id`.
6. Store relationship type.
7. Store statement date or period.
8. Preserve visible natural-language text.

## 18.3 Relationship strength

The system must distinguish:

- Deep story subject
- Strong recommendation
- Featured stop
- Supporting reference
- Passing mention

This affects ranking on place pages.

## 18.4 Correction

If a creator attached the wrong place:

- The relationship may be reassigned.
- The original audit record remains.
- Place-page indexes update.
- Published URLs remain stable.

---

# 19. Canonical Place Page

## 19.1 Objective

The canonical place page must feel like one complete record, not a search-results page.

## 19.2 Core modules

### Identity hero

- Canonical name
- Current status
- Hero media
- Category
- Neighbourhood
- Short description
- Follow/save actions

### Essential information

- Address
- Map
- Website
- Phone
- Email where appropriate
- Opening hours
- Accessibility
- Arrival information
- Official status

### Why it matters

- Editorial synthesis
- Commonly perceived attributes
- Distinctive qualities
- Attributed creator insights

### Stories

- Primary stories
- Historical stories
- Guides
- Collections
- Passing references where useful

### Recommendations

- Creator recommendations
- Community observations
- Contextual recommendations
- Attribution

### Events

- Upcoming events
- Event categories
- Official links
- Ticket actions
- Sold-out, postponed, cancelled states

### Media

- Official media
- Creator media
- User media
- Historical media
- Event media

### History

- Timeline
- Former names
- Past occupants
- Major events
- Changes in use
- Historical stories

### Relationships

- Nearby places
- Similar places
- Often visited together
- Parent complex
- Contained venues
- Related neighbourhoods

### Official updates

- Venue announcements
- Closures
- Schedule changes
- New openings
- Event announcements

## 19.3 Module composition rules

Modules must be:

- Conditional
- Ranked
- Source-aware
- Place-type-aware
- User-aware
- Time-aware
- Performance-conscious

## 19.4 Empty states

A sparse page must still feel intentional.

Possible fallback:

- Identity
- Map
- Category
- Source information
- Invite contribution
- Nearby context

## 19.5 Source attribution

The page must distinguish:

- Official information
- Creator commentary
- Community observation
- Provider event data
- Inferred recommendations

## 19.6 Claimed versus unclaimed

Claimed status may enable:

- Verified official module
- Official updates
- Contact confirmation
- Branch management

Claiming must not suppress:

- Independent stories
- Historical records
- User media
- Creator opinions

---

# 20. Place Microsites

## 20.1 Purpose

Each place should eventually have a public, persistent microsite generated from the canonical Place Platform.

## 20.2 Requirements

- Permanent canonical URL
- Search-engine indexability
- Structured metadata
- Social preview
- Mobile-first rendering
- Accessibility
- Fast performance
- Localised names
- Place-specific modules
- Claim status
- Historical context
- Deep links
- Share links
- QR support
- Canonical redirects

## 20.3 Data architecture

Microsites must not maintain a separate copy of place data.

They must render from:

- Canonical place API
- Page composition engine
- Cached page payload
- Media service
- Relationship graph

## 20.4 Customisation

Place representatives may eventually customise:

- Official hero image
- Official summary
- Contact details
- Official updates
- Branding within limits

They may not:

- Remove independent stories
- Alter canonical history without evidence
- Manipulate community attributes
- Hide disputes
- Override platform labelling

---

# 21. Spatial Addressing and URL System

## 21.1 Objective

Allow a place to become directly addressable in human and machine terms.

The long-term product promise is:

> A place can be addressed as easily as a website.

## 21.2 Layers

The addressing system must support:

- Immutable canonical object ID
- Canonical public URL
- Human-readable slug
- Verified organisation alias
- Branch alias
- Historical alias
- App deep link
- QR representation
- API URI

## 21.3 Potential patterns

Examples only:

- `locatial.com/p/brooklyn-steel`
- `locatial.com/@brooklyn-steel`
- `locatial.com/starbucks/oakland-broadway`
- `locatial.com/loc/01JX...`

The final syntax remains unresolved.

## 21.4 Requirements

- Alias collision handling
- Reserved names
- Localised aliases
- Redirects after rename
- Historical resolution
- Branch identity
- Verified control
- Abuse prevention
- Transfer rules
- Organisation hierarchy support
- Canonical metadata
- Machine resolution

## 21.5 Non-dependence

The URL system must sit above canonical IDs.

Changing syntax must not require changing identity.

---

# 22. Search and Entity Discovery

## 22.1 Search modes

- Exact place search
- Fuzzy name search
- Alias search
- Category search
- Map search
- Proximity search
- Natural-language search
- Historical search
- Event search
- Creator-based search
- Region search
- Attribute search

## 22.2 Resolution-first behaviour

For a strong entity match:

```text
Query
→ Resolve canonical Place
→ Open place page
```

For an ambiguous query:

```text
Query
→ Candidate entities
→ Disambiguation
→ Open place page
```

## 22.3 Ranking signals

- Name match
- Alias match
- Geographic context
- User location
- User taste
- Popularity
- Editorial importance
- Active status
- Current events
- Recent engagement
- Historical relevance
- Search intent
- Verification status

## 22.4 Search index

The search index must include:

- Current names
- Historical names
- Aliases
- Brands
- Addresses
- Categories
- Descriptors
- Regions
- Events
- Stories
- Organisations

---

# 23. Following and Place Subscriptions

## 23.1 Followable objects

Users may follow:

- Place
- Establishment
- Physical site
- Neighbourhood
- Region
- Event series
- Creator

These must remain distinct.

## 23.2 Follow actions

- Follow
- Unfollow
- Mute
- Notification preferences
- Digest frequency
- Event alerts
- Story alerts
- Official update alerts
- Closure/opening alerts

## 23.3 Data model

Required fields:

- `follow_id`
- `user_id`
- `object_type`
- `object_id`
- `created_at`
- `notification_preferences`
- `status`

## 23.4 Privacy

Follow visibility must be user-controlled.

---

# 24. Place-to-Follower Communication

## 24.1 Principle

Places should not gain unrestricted access to user inboxes.

They should publish through a controlled follower channel.

## 24.2 Supported update types

- Event announcement
- Closure
- Reopening
- Schedule change
- New release
- Official story
- Special programme
- General update

## 24.3 Controls

- Verified sender
- Rate limits
- User preferences
- Mute
- Report
- Moderation
- Anti-spam
- Content labelling
- Archive

## 24.4 Permissions

Only authorised place representatives may publish official updates.

---

# 25. User-Contributed Place Media

## 25.1 Supported media

- Single image
- Gallery
- Video
- Audio
- Caption
- Map annotation

## 25.2 Attachment contexts

Media may attach to:

- Place generally
- Specific event
- Visit
- Story
- Recommendation
- Historical moment
- Temporary installation

## 25.3 Required metadata

- Canonical place
- Uploader
- Upload time
- Capture time if available
- Context
- Caption
- Rights declaration
- Location confidence
- Moderation state

## 25.4 Location support

Where available, the system may use:

- EXIF coordinates
- User location
- Capture time
- Nearby places
- Event schedule

It should suggest, not silently assign.

## 25.5 Moderation

Requirements:

- Reporting
- Takedown
- Copyright complaint
- Privacy complaint
- Face and child safety
- Inappropriate content detection
- Duplicate detection
- Place-owner dispute workflow

---

# 26. Events and Temporal Activity

## 26.1 Event identity

Events must have Locatial-owned canonical IDs.

Provider event IDs remain external references.

## 26.2 Event resolution

Duplicate events may be detected using:

- Venue place ID
- Start time
- Performer
- Title similarity
- Organiser
- Provider cross-reference
- Event series

## 26.3 Event page fields

- Title
- Summary
- Start and end
- Timezone
- Venue
- Performer
- Organiser
- Category
- Artwork
- Official URL
- Ticket actions
- Status
- Age restrictions
- Accessibility
- Source attribution

## 26.4 Place attachment

Every event venue must resolve to a canonical Place or provisional venue Place.

## 26.5 Event history

Expired events should remain available when referenced by stories, media, or historical records.

## 26.6 Ticketing

Ticket actions may include:

- Official ticket page
- Affiliate link
- Multiple authorised vendors
- Sold-out state
- Waitlist
- Free registration

Ticketing must remain separate from event identity.

---

# 27. Recommendation and Taste Graph

## 27.1 Objective

Use user-place relationships and place-place relationships to recommend other places a user may value.

## 27.2 Input signals

- Follows
- Saves
- Visits
- Explicit likes
- Explicit dislikes
- Recommendations
- Story reading
- Guide completion
- Event interest
- Media uploads
- Search
- Dwell time
- Creator affinity
- Category affinity
- Attribute affinity
- Geographic pattern
- Co-visitation
- Temporal behaviour

## 27.3 Recommendation methods

- Content-based similarity
- Collaborative filtering
- Graph traversal
- Place embeddings
- Creator affinity
- Contextual recommendation
- Geographic diversity
- Sequence modelling

## 27.4 Cold start

Use:

- Explicit onboarding interests
- Followed creators
- Selected neighbourhoods
- Initial saves
- Current location
- Popular but diverse place sets

## 27.5 Explainability

Recommendations should support explanations such as:

- Similar to three places you follow
- Recommended by a creator you trust
- Often visited with a place you saved
- Shares the intimate, independent atmosphere you prefer

## 27.6 Safeguards

- Avoid pure popularity ranking
- Avoid repetitive chain recommendations
- Preserve diversity
- Allow negative feedback
- Protect sensitive inference
- Separate organic and sponsored recommendations

---

# 28. Personal Place Profile

The system should maintain a user-controlled relationship history.

Possible categories:

- Followed
- Saved
- Visited
- Recommended
- Photographed
- Written about
- Hidden
- Disliked
- Created
- Verified
- Attended

The profile may power:

- Personal map
- Place journal
- Recommendations
- Memory
- Creator identity
- Contribution history

---

# 29. Place Claiming and Verification

## 29.1 Claim eligibility

Claimable objects include:

- Establishment
- Organisation
- Brand
- Branch
- Venue

Physical sites are not owned through the claim workflow.

## 29.2 Verification methods

- Official domain
- Email domain
- Phone verification
- Business documents
- Provider relationship
- Manual review
- Organisation administrator approval

## 29.3 Roles

- Owner
- Manager
- Marketing
- Event manager
- Agency
- Franchisee
- Organisation administrator

## 29.4 Claim powers

Claimants may:

- Verify official details
- Manage official contact fields
- Publish updates
- Connect events
- Add official media
- Manage branches
- View analytics

Claimants may not:

- Delete creator stories
- Remove independent recommendations
- Rewrite history without evidence
- Suppress user media outside policy
- Change canonical identity unilaterally

---

# 30. Organisation, Brand, and Branch Hierarchy

The model must support:

```text
Organisation
→ Brand
→ Operating entity
→ Branch establishment
→ Place
→ Physical site
```

Requirements:

- Parent-child hierarchy
- Franchise support
- Branch identifiers
- Bulk management
- Inherited defaults
- Branch overrides
- Regional ownership
- Historical branch changes
- Verified aliases
- Branch URL addressing

Example:

- Starbucks Corporation
- Starbucks brand
- Regional operating organisation
- Oakland Broadway branch
- Branch Place
- Physical Site

---

# 31. Historical and Temporal Model

## 31.1 Temporal requirements

The system must preserve:

- Opening
- Closure
- Reopening
- Relocation
- Rename
- Occupancy change
- Geometry change
- Address change
- Ownership change
- Category change
- Contact change
- Historical event
- Cultural significance

## 31.2 Valid-time fields

Time-dependent records should support:

- `valid_from`
- `valid_to`
- `observed_at`
- `recorded_at`
- `superseded_at`

## 31.3 Historical queries

The system should support:

- What was here before?
- What occupied this building in 2010?
- What was this venue previously called?
- Which events occurred here?
- When did the business move?
- What stories described it in a given period?

## 31.4 Current projection

The current place page is a projection over valid current facts and relationships.

Historical views use the same underlying temporal records.

---

# 32. Data Ownership and Proprietary Value

## 32.1 Locatial-owned assets

Locatial may own:

- Canonical IDs
- Internal place registry
- Reconciliation decisions
- Relationship graph
- Creator-authored content under platform terms
- First-party behavioural data
- User-contributed data under platform terms
- Derived confidence scores
- Derived attributes
- Embeddings
- Recommendation models
- Provenance graph
- Historical occupancy model
- Place-page composition
- Verification history
- Public spatial aliases

## 32.2 Third-party data

Locatial may not automatically own:

- Provider event data
- Provider images
- Third-party descriptions
- Licensed coordinates
- External contact data
- Ticket inventory
- External reviews

## 32.3 Required rights metadata

Every externally sourced field or media object must include:

- Licence
- Display right
- Cache right
- Transform right
- Redistribution right
- Expiry
- Attribution requirement
- Deletion requirement

## 32.4 Provider exit

When a provider relationship ends:

- Canonical IDs remain.
- Locatial-owned relationships remain.
- Restricted fields are removed or replaced.
- Provenance records remain where legally permitted.
- Pages degrade gracefully.

---

# 33. Data Architecture

## 33.1 Initial implementation

Recommended:

- PostgreSQL
- PostGIS
- Object storage
- Search index
- Relational graph tables
- Event queue
- Audit log

## 33.2 Future projection

At scale, the architecture may add:

- Dedicated graph projection
- Vector store
- Stream processing
- Data warehouse
- Feature store
- Recommendation service
- Large-scale search cluster

The canonical source of truth should remain controlled and auditable.

## 33.3 Core tables

- `sites`
- `site_geometries`
- `places`
- `establishments`
- `occupancies`
- `organisations`
- `brands`
- `place_aliases`
- `external_refs`
- `claims`
- `relationships`
- `events`
- `event_sources`
- `content_place_links`
- `recommendations`
- `media`
- `media_place_links`
- `follows`
- `official_updates`
- `claim_requests`
- `verification_records`
- `merge_redirects`
- `genesis_records`
- `moderation_actions`
- `audit_events`

---

# 34. Technical Architecture

## 34.1 Logical services

- Place Registry
- Genesis Service
- Identity Resolver
- Geometry Service
- Provider Gateway
- Claim and Provenance Service
- Place Graph Service
- Search Service
- Place Page Composer
- Event Service
- Media Service
- Recommendation Service
- Follow Service
- Notification Service
- Claim and Verification Service
- Moderation Service
- History Service

These may initially exist in one modular application.

## 34.2 Service contract principle

Internal contracts should be provider-neutral and object-centric.

## 34.3 Event-driven updates

Significant actions should emit events:

- Place created
- Place merged
- Place split
- Claim added
- Claim promoted
- Event attached
- Story attached
- Media uploaded
- Place followed
- Official update published
- Establishment closed
- Occupancy changed

---

# 35. API Requirements

## 35.1 Core APIs

- `POST /place-claims`
- `POST /places/resolve`
- `GET /places/search`
- `GET /places/{placeId}`
- `GET /places/{placeId}/page`
- `GET /places/{placeId}/relationships`
- `POST /places/{placeId}/external-refs`
- `POST /places/{placeId}/claims`
- `POST /places/{placeId}/content-links`
- `POST /places/{placeId}/media`
- `POST /places/{placeId}/follow`
- `POST /events/resolve`
- `POST /places/merge`
- `POST /places/split`
- `GET /places/{placeId}/history`

## 35.2 API versioning

- Stable versioned contracts
- Backward compatibility policy
- Deprecation windows
- Canonical redirects
- Idempotent writes where possible
- Audit identifiers

## 35.3 Public API future

A future public API may expose:

- Place lookup
- Place resolution
- Place page payload
- Event lookup
- Spatial links
- Relationship queries

Licensing and rate limits must be defined separately.

---

# 36. Place Page Composition Engine

## 36.1 Objective

Return one structured place payload assembled from canonical data, claims, relationships, content, media, and activity.

## 36.2 Inputs

- Place
- Current Establishment
- Site
- Claims
- Stories
- Recommendations
- Events
- Media
- History
- Follows
- Official updates
- User context
- Region context

## 36.3 Composition decisions

- Module eligibility
- Module ranking
- Source selection
- Media selection
- Summary generation
- Current versus historical separation
- User personalisation
- Empty states
- Rights filtering
- Safety filtering
- Cache policy

## 36.4 Output

A single page payload containing:

- Identity
- Facts
- Modules
- Attribution
- Actions
- Related objects
- Personal state
- Freshness indicators

---

# 37. Ranking and Relevance

Ranking should consider:

- Relationship strength
- Editorial depth
- Recency
- Source trust
- Originality
- User affinity
- Geographic relevance
- Temporal relevance
- Quality
- Completeness
- Diversity
- Verification
- Freshness

Passing mentions must rank below deep stories.

Expired events must not rank above upcoming events unless the user is in history mode.

Paid content must be labelled and separated from organic ranking.

---

# 38. Trust, Safety, and Moderation

## 38.1 Risks

- Fake places
- Duplicate places
- Malicious edits
- False closures
- Impersonation
- Spam
- Inappropriate media
- Copyright infringement
- Defamation
- Review manipulation
- Unsafe events
- Misleading official claims
- Privacy violations
- Disputed ownership

## 38.2 Controls

- Verification
- Rate limits
- Audit logs
- User reports
- Trusted contributor levels
- Automated content checks
- Manual review
- Revert capability
- Claim dispute process
- Media takedown
- Place lock
- Escalation

---

# 39. Privacy and User Controls

Requirements:

- Consent for location history
- Control over follow visibility
- Control over visit history
- Media deletion
- Data export
- Account deletion
- Recommendation controls
- Sensitive inference restrictions
- Notification controls
- Place messaging controls
- Profile visibility
- Child safety
- Face privacy

---

# 40. Permissions and Roles

Required roles:

- Anonymous visitor
- Registered user
- Creator
- Trusted creator
- Place representative
- Organisation administrator
- Event organiser
- Moderator
- Locatial editor
- System administrator
- API partner

Permissions must be object-level and action-specific.

---

# 41. Quality, Confidence, and Verification

## 41.1 Place completeness

A place completeness score may include:

- Identity
- Geometry
- Address
- Category
- Current status
- Official contact
- Media
- Provenance
- Relationships
- History

## 41.2 Confidence dimensions

Separate confidence scores should exist for:

- Identity
- Geometry
- Address
- Category
- Operational status
- Contact details
- Attribute consensus
- Historical claim

## 41.3 Verification states

- Unverified
- Provider-confirmed
- Community-confirmed
- Creator-confirmed
- Officially verified
- Disputed
- Stale

---

# 42. Freshness and Lifecycle Management

Requirements:

- Field-level refresh schedules
- Stale data flags
- Provider polling
- Webhook ingestion
- User verification prompts
- Closure detection
- Reopening detection
- Link checking
- Event expiry
- Official refresh
- Historical archiving

Freshness must depend on field type.

Opening hours expire faster than historical occupancy.

---

# 43. Analytics and Measurement

## 43.1 Identity metrics

- Place genesis count
- Auto-match rate
- Suggested-match acceptance rate
- Duplicate rate
- Merge rate
- Split rate
- Unresolved rate
- False-match rate

## 43.2 Place page metrics

- Search-to-place success
- Page completeness
- Module engagement
- Story engagement
- Event engagement
- Follow rate
- Save rate
- Media contribution rate
- Return visits

## 43.3 Graph metrics

- Relationships per place
- Content links per place
- Event links per place
- Independent sources per place
- Attribute confidence growth
- Recommendation clickthrough
- Recommendation diversity

## 43.4 Operational metrics

- Provider latency
- Refresh failure
- Moderation backlog
- Dispute resolution time
- Claim verification time
- Page composition latency

---

# 44. Monetisation Boundaries

Potential monetisation:

- Ticket referrals
- Reservations
- Paid creator guides
- Premium place tools
- Sponsored event collections
- Subscriptions
- Enterprise API
- Location intelligence

Rules:

- Paid relationships do not alter canonical identity.
- Sponsorship is labelled.
- Official claims do not suppress editorial content.
- Commercial actions remain contextual.
- Recommendation ranking distinguishes sponsored from organic.
- Creator trust is protected.

---

# 45. Scalability and Performance

## 45.1 Three-year planning assumptions

The platform should be designed for:

- Millions of canonical places
- Millions of sites and establishments
- Hundreds of millions of relationships
- Large-scale event ingestion
- Multi-region deployment
- Multi-language search
- High-volume place-page reads
- Media-heavy experiences
- Recommendation generation
- Frequent provider refreshes

## 45.2 Performance targets

Illustrative targets:

- Exact place lookup: p95 under 200 ms
- Search response: p95 under 500 ms
- Place page payload from cache: p95 under 400 ms
- Uncached composed place page: p95 under 1.5 seconds
- Match candidate generation: under 2 seconds for interactive flow
- Event ingestion: asynchronous and resumable

## 45.3 Reliability

- Idempotent provider ingestion
- Retry queues
- Dead-letter queues
- Backfills
- Audit logs
- Data repair tools
- Provider isolation
- Cached graceful degradation

---

# 46. Internationalisation and Localisation

Requirements:

- Multilingual names
- Alternate scripts
- Transliteration
- Local address formats
- Time zones
- Local phone formats
- Country-specific categories
- Region hierarchy differences
- Disputed territories
- Local laws
- Cultural aliases
- Unit and currency localisation

---

# 47. Accessibility

Requirements:

- Semantic place pages
- Screen-reader support
- Keyboard navigation
- High contrast
- Reduced motion
- Alt text
- Accessible maps
- Text alternatives for spatial content
- Captioned media
- Accessible event information
- Accessible follower controls

---

# 48. Migration and Change Strategy

The system must permit change without breaking identity.

Requirements:

- Schema migrations
- API versioning
- Backfills
- Provider replacement
- Ontology evolution
- New relationship types
- New place types
- URL redirects
- Deprecated fields
- Rebuilt search indexes
- Graph reprojection
- Historical preservation

Core rule:

> Implementation may change; canonical identity, public references, and historical provenance must remain durable.

---

# 49. Three-Year Rollout

## Phase 1: Foundation

Capabilities:

- Canonical IDs
- Sites, Establishments, Places
- Genesis
- External references
- Basic claims
- Creator place attachment
- Ticketmaster provider adapter
- Place matching
- Merge redirects
- Basic place page
- Events
- Provenance
- Manual reconciliation lab

## Phase 2: Growth

Capabilities:

- More provider adapters
- Historical occupancy
- Place claiming
- Official updates
- Richer page composition
- User media
- Follows
- Branch hierarchy
- Improved confidence model
- Event deduplication
- Search expansion
- Microsites

## Phase 3: Scale

Capabilities:

- Mature place graph
- Personalised recommendations
- Place-to-follower messaging
- Spatial addressing
- Enterprise APIs
- Globalisation
- Advanced historical queries
- Multi-source consensus
- Place embeddings
- Location intelligence
- Organisation-scale management

Every phase must retain the same core identity model.

---

# 50. Functional Requirements

## Identity

**FR-001** The system shall generate an immutable Locatial ID for every accepted canonical object.

**FR-002** The system shall keep canonical IDs separate from names, slugs, coordinates, and provider IDs.

**FR-003** The system shall retain merged IDs as permanent redirects.

**FR-004** The system shall support splitting an incorrectly combined identity.

**FR-005** The system shall preserve retired places for historical resolution.

## Site and occupancy

**FR-010** The system shall model physical Sites separately from Establishments.

**FR-011** The system shall support multiple Establishments occupying one Site over time.

**FR-012** The system shall support one Establishment occupying multiple Sites over time.

**FR-013** The system shall store dated Occupancy relationships.

**FR-014** The system shall support contained and parent-child Sites.

## Genesis

**FR-020** Every canonical Place shall have a genesis record.

**FR-021** Genesis shall record source, actor, time, evidence, match decision, and confidence.

**FR-022** Provider-only creation shall support provisional status.

**FR-023** Creator confirmation shall be able to promote a provisional Place to confirmed.

## Reconciliation

**FR-030** The system shall compare external claims against the canonical registry before creating a new Place.

**FR-031** The resolver shall use name, address, coordinates, type, provider IDs, organisation, and temporal signals.

**FR-032** The resolver shall produce explainable match scores.

**FR-033** Ambiguous matches shall enter manual review.

**FR-034** The system shall preserve all source records after reconciliation.

## Claims and confidence

**FR-040** Every contribution shall be stored as a sourced claim.

**FR-041** The system shall distinguish objective facts from subjective attributes.

**FR-042** Claims shall record observation time and validity period where known.

**FR-043** The system shall calculate confidence using authority, independence, recency, specificity, corroboration, and contradiction.

**FR-044** Subjective attributes shall retain attribution.

**FR-045** The system shall support contextual attributes by time, audience, room, event, or season.

**FR-046** The system shall support disputed and outdated states.

## Content

**FR-050** Creators shall be able to attach canonical Places to stories, guides, chapters, and recommendations.

**FR-051** Content-to-place relationships shall be typed.

**FR-052** The system shall rank deep content relationships above passing mentions.

**FR-053** Reassigning a place link shall not break published content.

## Events

**FR-060** Events shall have Locatial-owned IDs.

**FR-061** External event IDs shall be stored as references.

**FR-062** Event venues shall resolve to canonical or provisional Places.

**FR-063** The system shall deduplicate events across providers.

**FR-064** Event history shall remain accessible after expiration.

## Place pages

**FR-070** Search for a strong place match shall resolve to a canonical place page.

**FR-071** The page shall compose facts, stories, recommendations, events, media, history, and relationships.

**FR-072** Page modules shall be conditional and ranked.

**FR-073** The page shall label official, creator, community, and provider content appropriately.

**FR-074** Sparse places shall render intentional empty states.

## Microsites and URLs

**FR-080** Every public Place shall support a canonical public URL.

**FR-081** URLs shall resolve through canonical IDs.

**FR-082** Slug changes shall create redirects.

**FR-083** The system shall support future verified aliases and branch addresses.

**FR-084** Microsites shall render from the canonical Place Platform.

## Following

**FR-090** Users shall be able to follow a Place.

**FR-091** Follow preferences shall support notifications and mute.

**FR-092** Place representatives shall be able to publish controlled official updates after verification.

**FR-093** Users shall control follower-message preferences.

## Media

**FR-100** Users shall be able to attach media to a canonical Place.

**FR-101** Media shall support event, visit, story, and historical context.

**FR-102** Media shall retain rights and provenance metadata.

**FR-103** Media shall pass moderation before public display where required.

## Recommendations

**FR-110** The system shall record explicit user-place relationships.

**FR-111** The recommendation system shall distinguish explicit and inferred signals.

**FR-112** Recommendations shall support explainability.

**FR-113** Sponsored recommendations shall be separated from organic recommendations.

## Claims and verification

**FR-120** Organisations shall be able to claim eligible establishments.

**FR-121** Claimants shall verify identity through approved methods.

**FR-122** Claimants shall not control independent editorial content.

**FR-123** The system shall support multiple organisation and branch roles.

## History

**FR-130** The system shall preserve former names, occupancy periods, moves, closures, and replacements.

**FR-131** Historical queries shall use validity periods.

**FR-132** Current-state pages shall project current facts without deleting historical facts.

## Provider independence

**FR-140** Provider adapters shall map into a provider-neutral schema.

**FR-141** Removal of a provider shall not delete canonical identity.

**FR-142** Provider field rights shall be tracked.

---

# 51. Non-Functional Requirements

**NFR-001** Canonical IDs must never be reused.

**NFR-002** Identity changes must be fully auditable.

**NFR-003** The system must support millions of Places.

**NFR-004** Place lookup and page retrieval must meet defined latency targets.

**NFR-005** Provider ingestion must be retryable and idempotent.

**NFR-006** Sensitive user-location data must be protected.

**NFR-007** Public pages must meet accessibility standards.

**NFR-008** The architecture must support provider replacement.

**NFR-009** Historical records must be durable.

**NFR-010** Rights and provenance must be field- or object-level.

**NFR-011** Search must support localisation and aliases.

**NFR-012** The system must support transparent confidence and dispute states.

**NFR-013** Data migrations must preserve canonical identity.

**NFR-014** Service boundaries must be modular even when deployed monolithically.

---

# 52. Data Requirements

Every canonical Place should support:

- Canonical ID
- Kind
- Name
- Aliases
- Current status
- Primary Site
- Current Establishment
- Category
- Coordinates
- Geometry
- Address
- Region hierarchy
- Genesis
- External references
- Claims
- Confidence
- Verification
- Relationships
- Media
- Content references
- Events
- History
- Follows
- Official updates
- Page composition metadata
- Rights metadata
- Freshness metadata

---

# 53. Edge Cases

The system must explicitly handle:

- No address
- Shared address
- Multi-tenant building
- Venue inside venue
- Multiple entrances
- Temporary venue
- Mobile venue
- Renamed venue
- Moved business
- Closed business
- Reopened business
- New business at old site
- Seasonal place
- Duplicate provider records
- Provider coordinate error
- Conflicting categories
- Disputed boundary
- Brand and branch collision
- Event without confirmed venue
- Place with no current occupant
- Historical place no longer physically present
- User tags wrong place
- Expired source imagery
- Organisation claims wrong branch
- Two languages with different names
- Natural feature spanning regions
- Pop-up within permanent venue

---

# 54. Test Strategy

## 54.1 Unit tests

- ID generation
- Slug generation
- Address normalisation
- Name similarity
- Distance calculations
- Confidence calculations
- Claim promotion
- Redirect resolution

## 54.2 Integration tests

- Provider adapter to resolver
- Creator place attachment
- Event to place
- Place page composition
- Claim verification
- Media attachment
- Follow and notification

## 54.3 Resolver tests

Curated dataset must include:

- Brooklyn Steel
- Bowery Ballroom
- Music Hall of Williamsburg
- Madison Square Garden
- Radio City Music Hall
- Elsewhere
- Public Records
- The Bell House
- Complex venues
- Renamed venues
- Closed venues
- Moved businesses
- Same-name branches

## 54.4 Historical tests

- Business replacement
- Move
- Rename
- Closure
- Reopening
- Past occupancy
- Historical story attachment

## 54.5 Scale tests

- Millions of objects
- High event volume
- Dense relationship graph
- High search concurrency
- Provider retry storms
- Cache invalidation

## 54.6 Moderation tests

- Fake place
- Spam claim
- Wrong media
- Copyright complaint
- Impersonation
- Disputed closure

## 54.7 Migration tests

- Merge
- Split
- Schema change
- Provider removal
- Slug change
- URL redirect
- Relationship backfill

---

# 55. Validation Plan

## 55.1 Identity lab

Build a 50-place test set with known truth.

Measure:

- Auto-match accuracy
- Suggested-match accuracy
- False merge rate
- Duplicate creation rate
- Manual review burden

## 55.2 Creator workflow test

Ask creators to:

- Reference existing places
- Introduce new places
- Add category
- Add descriptors
- Provide context
- Correct a match

Measure:

- Completion
- Confusion
- Time
- Data quality
- Match correction

## 55.3 Place-page comprehension test

Test whether users understand:

- What the place is
- What is official
- What is opinion
- What is happening now
- What is historical
- Why stories and events appear together

## 55.4 Confidence test

Present attributes with different evidence levels.

Validate wording such as:

- “One creator describes…”
- “Often described as…”
- “Commonly perceived as…”

## 55.5 Historical test

Validate the difference between:

- Site
- Former establishment
- Current establishment
- Event
- Story

---

# 56. Acceptance Criteria

The Place Platform is acceptable when:

1. Every canonical object receives an immutable Locatial ID.
2. Physical Site and Establishment are distinct.
3. Occupancy is temporal.
4. Every Place has genesis.
5. External provider IDs remain references.
6. Creator and provider records can independently resolve to one Place.
7. Ambiguous cases are reviewable.
8. Duplicates can merge without breaking references.
9. Historical records survive closure, movement, and replacement.
10. Claims retain provenance.
11. Objective and subjective claims are treated differently.
12. Confidence is calculated from independent evidence.
13. Search opens one coherent place page.
14. The page composes stories, events, recommendations, media, facts, and history.
15. Place microsites render from the same source of truth.
16. Public URLs can change without changing identity.
17. Users can follow Places.
18. Place representatives can publish controlled updates.
19. Users can attach media to Places.
20. Recommendation-ready user-place and place-place relationships are captured.
21. Provider removal does not collapse the canonical record.
22. Data rights are tracked.
23. The system scales without replacing the core identity model.

Core scenario:

> Multiple creators, external feeds, official business data, live events, and user media can independently reference the same real-world destination and resolve into one coherent place experience without losing provenance, attribution, temporal truth, or canonical identity.

---

# 57. Risks

## 57.1 Over-modeling

Risk: The domain model becomes too complex to implement.

Mitigation: Use the full architecture but expose only required objects in early workflows.

## 57.2 Under-modeling

Risk: Day-one shortcuts collapse Site, Place, and Establishment.

Mitigation: Preserve object separation from the beginning.

## 57.3 False merges

Risk: Distinct places are combined.

Mitigation: Conservative thresholds and manual review.

## 57.4 Duplicate growth

Risk: Too many provisional Places.

Mitigation: Search-before-create and reconciliation queues.

## 57.5 Provider dependency

Risk: A provider changes terms or disappears.

Mitigation: Adapter architecture and Locatial-owned identity.

## 57.6 Data licensing

Risk: Locatial stores or republishes restricted data.

Mitigation: Rights metadata and provider-specific policy enforcement.

## 57.7 Contributor friction

Risk: Required data collection becomes burdensome.

Mitigation: Progressive elicitation and lightweight confirmation.

## 57.8 Low-quality attributes

Risk: Tags become noisy and meaningless.

Mitigation: Controlled vocabulary, source claims, independence, and consensus.

## 57.9 Place-owner conflict

Risk: Businesses attempt to suppress independent content.

Mitigation: Separate official and editorial authority.

## 57.10 Recommendation bias

Risk: Popular chains dominate.

Mitigation: Diversity, creator trust, negative signals, and organic ranking controls.

---

# 58. Assumptions

- Locatial will use PostgreSQL and PostGIS initially.
- Locatial will ingest multiple external providers over time.
- Creators will attach structured Place references to content.
- Place pages will be generated from canonical objects and relationships.
- Locatial will maintain first-party user and creator relationships.
- The spatial URL syntax is not yet final.
- Place claiming will arrive after core identity.
- A graph database is not mandatory at launch.
- Event discovery is valuable even without direct ticket sales.
- Provider imagery and data require explicit rights tracking.

---

# 59. Unresolved Decisions

- Final distinction between Place as stored object versus user-facing projection.
- Reference provider for initial place search.
- Final spatial URL syntax.
- Exact confidence thresholds.
- Graph database timing.
- Provider licence strategy.
- Public API timing.
- Claim verification vendors.
- Place messaging limits.
- Recommendation privacy controls.
- Historical archive partnerships.
- Branch alias ownership.
- Whether a natural feature and its visitor destination share one Place.
- How temporary Places inherit from permanent Sites.
- When creator contribution creates public provenance credit.

---

# 60. Recommended Immediate Build Sequence

1. Define canonical schemas for Site, Establishment, Place, Occupancy, Claim, External Reference, Genesis, and Relationship.
2. Implement Locatial IDs.
3. Implement Ticketmaster venue ingestion.
4. Implement creator place selection.
5. Implement search-before-create.
6. Implement match scoring.
7. Implement manual reconciliation lab.
8. Implement merge redirects.
9. Attach events and stories to canonical Places.
10. Render a basic composed place page.
11. Add claim provenance and confidence.
12. Test 50 venues.
13. Add user descriptors.
14. Add historical occupancy examples.
15. Add follows and media only after identity is stable.

---

# 61. Final Product Definition

Locatial’s Place Platform is a canonical, temporal, attributed, and relationship-rich representation of the physical world.

It separates:

- The physical Site
- The Establishment
- The user-facing Place
- The Event
- The Story
- The Recommendation
- The Media
- The Source Claim
- The Organisation
- The User relationship

It allows all of them to connect without becoming conflated.

The product is successful when a place can be discovered once and understood as a complete, evolving object:

- What it is
- Where it is
- What is there now
- What was there before
- What happens there
- What people say about it
- Who has written about it
- What users have shared
- Who follows it
- What relates to it
- How to address it
- How it has changed

The enduring architectural principle is:

> Locatial does not treat a provider record, a map pin, a business listing, or a creator mention as the place. Locatial creates the durable identity that allows all of them to refer to the same place over time.
