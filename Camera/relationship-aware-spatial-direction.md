# Locatial Camera: Relationship-Aware Spatial Direction

## Core thesis

Locatial should not direct the camera by asking only: **where is this place?**

It should direct the camera by asking:

> **What relationship makes this place meaningful right now?**

Centering a selected location is only valuable when exact position is the user's main need. In editorial, guide, history, crime, travel, culture, and event contexts, the more important question is relational.

The camera should help the viewer understand:

- what happened before or after
- how much time passed
- how far apart things are
- what was intended versus what happened
- what is similar or different
- what is known versus uncertain
- what a place is near, inside, between, replacing, or part of

## Product law

> **Every camera move must explain a relationship.**

If the only reason for a camera move is "this pin was selected," the camera probably should not move.

## Core model

```txt
Story
  -> Chapter
      -> Scene
          -> Spatial Roles
          -> Spatial Relationships
          -> Directed Frames
```

A scene is a narrative beat, not necessarily a single place.

Examples:

- Plane crash: takeoff airport, intended landing airport, crash site.
- Murder: meeting place, crime scene, body disposal site, arrest site, courthouse.
- Music guide: genre clusters, venue size, neighborhood corridors, transit anchors.
- Family day out: current position, ferry, tram, museum, toilets, food fallback.

---

# 1. Relationship types

## Time relationship

Question:

> When did these places matter relative to each other?

Examples:

- 10 days later
- 2 hours apart
- same night
- after closing time
- before sunrise
- over 30 years

Camera behavior:

- frame the sequence
- show time gaps as labels
- animate in chronological order
- keep previous locations visible but faded
- distinguish short-time events from long-time consequences

Example:

```txt
Meet at 9:10pm
Murder at 11:05pm
Body found 6:40am next day
Arrest 10 days later
Sentenced 14 months later
```

The camera should not treat these as equal pins. It should distinguish same-night sequence, next-day discovery, and later consequence.

## Distance relationship

Question:

> How far apart are these places, and does that distance matter?

Examples:

- 200 yards away
- 12-minute walk
- 90-minute drive
- across town
- across country
- off the intended route
- inside the same block

Camera behavior:

- show walk time or drive time
- show whether locations belong in one frame
- widen if distance is the point
- split into chapters if distance makes one frame weak
- show detour or isolation when relevant

Example:

A murder story where a body is found 40 miles from the crime scene. The distance is not trivia; it is story meaning.

## Causal relationship

Question:

> How did one place lead to another?

Examples:

- takeoff led to crash
- argument led to chase
- venue closure led to a new scene elsewhere
- flood upstream affected town downstream
- development displaced old businesses

Camera behavior:

- show cause and consequence together
- draw directional relationships
- reveal outcome after origin
- frame before/after or upstream/downstream

Example:

For a plane crash, the crash site only makes full sense in relation to the takeoff point, intended destination, and intended path.

## Similarity relationship

Question:

> What else is like this place?

Examples:

- same genre
- same price
- same crowd
- same capacity
- same architectural type
- same historical role
- same family-friendly value

Camera behavior:

- stable cluster view
- similar places glow
- active place emphasized
- category rings or labels
- minimal camera movement

## Contrast relationship

Question:

> What is this place unlike, against, replacing, or being replaced by?

Examples:

- old vs new
- cheap vs expensive
- local vs tourist
- historic vs redeveloped
- intended route vs actual route
- official boundary vs lived neighborhood

Camera behavior:

- split frame
- toggle layers
- show both poles together
- use before/after reveal
- emphasize boundary, edge, or displacement

## Uncertainty relationship

Question:

> What is known, unknown, alleged, inferred, or disputed?

Examples:

- last known location
- unknown route
- alleged meeting point
- estimated crash area
- disputed boundary

Camera behavior:

- solid line for known movement
- dotted line for inferred movement
- shaded area for approximate zone
- labels for alleged, reported, estimated, unknown

This is essential for trust. Locatial must not draw certainty where the evidence is uncertain.

---

# 2. AI Spatial Director

Locatial needs an AI Spatial Director that performs these steps:

```txt
1. Detect places
2. Detect spatial roles
3. Detect relationships between places
4. Score which relationship matters most
5. Choose the best frame
6. Choose the transition grammar
7. Choose visual overlays
8. Show uncertainty and warnings
```

The output should not be just a camera target. It should be a **Spatial Direction Plan**.

## Spatial Direction Plan

```ts
type SpatialDirection = {
  detectedStoryType: string;

  dominantRelationship:
    | "time"
    | "distance"
    | "causality"
    | "similarity"
    | "contrast"
    | "proximity"
    | "containment"
    | "uncertainty";

  relationshipSummary: string;

  frameStrategy:
    | "timeline-frame"
    | "distance-frame"
    | "causality-frame"
    | "pattern-frame"
    | "contrast-frame"
    | "anchor-frame"
    | "chapter-frame";

  transitionStrategy:
    | "hold-and-highlight"
    | "trace-sequence"
    | "wide-to-detail"
    | "reveal-consequence"
    | "toggle-contrast"
    | "split-into-chapters";

  overlays: Array<
    | "time-labels"
    | "distance-labels"
    | "route-line"
    | "dotted-unknown-link"
    | "similarity-glow"
    | "contrast-boundary"
    | "capacity-rings"
    | "walk-time-radius"
  >;

  warning?: string;
  reason: string;
};
```

Example:

```ts
{
  detectedStoryType: "crime timeline",
  dominantRelationship: "time",
  relationshipSummary: "The core events happened within 2 hours, while the arrest happened 10 days later.",
  frameStrategy: "timeline-frame",
  transitionStrategy: "trace-sequence",
  overlays: ["time-labels", "distance-labels", "dotted-unknown-link"],
  reason: "Time order is the clearest way to understand this story, with distance used as supporting context."
}
```

---

# 3. Camera frame taxonomy

A camera frame is not a viewport. It is an explanation.

Each frame should answer one relationship question.

## Anchor Frame

Question:

> What is this place near, inside, or connected to?

Best for:

- single place
- venue
- restaurant
- local recommendation
- practical decision

## Chapter Frame

Question:

> How does this scene relate to sibling scenes in the chapter?

Best for:

- top lists
- short guides
- neighborhood clusters
- story sections

Behavior:

```txt
Chapter enter -> frame all scenes
Scene change -> update highlight only
```

## Timeline Frame

Question:

> What happened where, and in what order?

Best for:

- crime
- biography
- event sequence
- protest
- travelogue
- historical story

## Distance Frame

Question:

> How far apart are these places, and does that distance matter?

Best for:

- logistics
- disposal distance
- detours
- isolation
- walkability
- reachability

## Causality Frame

Question:

> How did one location lead to another?

Best for:

- crashes
- disasters
- investigations
- development/displacement
- environmental stories

## Pattern Frame

Question:

> What pattern or cluster does this place belong to?

Best for:

- music venues
- bars
- restaurants
- galleries
- neighborhoods
- rankings

## Contrast Frame

Question:

> What is this place being compared against?

Best for:

- old/new
- cheap/expensive
- local/tourist
- intended/actual
- official/lived
- before/after

## Uncertainty Frame

Question:

> What is known and what is unknown?

Best for:

- crime
- breaking news
- history
- disputed boundaries
- estimated locations

---

# 4. Movement grammar

Yes: this camera work must also describe **how to move in general**.

The relationship model decides **why** the camera moves.

The movement grammar decides **how** the camera moves.

## Movement law

> **Movement is meaning over time.**

A movement should show one of the following:

- a change in scale
- a change in relationship
- a change in time
- a change in certainty
- a shift from overview to detail
- a shift from cause to consequence
- a shift from pattern to active example
- a shift from known to unknown

## Core movement types

### Hold

Camera does not move. The active object changes.

Use when:

- user moves between sibling scenes
- chapter context matters more than exact pin location
- active place belongs to a group/pattern
- camera movement would destroy context

Meaning:

> These places belong together. Pay attention to the active one without losing the whole.

### Soft pan

Camera moves only enough to keep the active target visible in the safe viewport.

Use when:

- bottom sheet covers the pin
- active target is near edge
- map needs slight composition correction

Meaning:

> Maintain context, but keep the active element readable.

### Fit frame

Camera fits all targets that define the relationship.

Use when:

- entering chapter
- showing timeline group
- showing origin + destination + event site
- showing source + consequence

Meaning:

> This relationship is the frame.

### Trace

Camera or visual line follows an ordered relationship.

Use when:

- route is known
- time sequence matters
- journey matters
- event path is part of story

Meaning:

> One place leads to another.

### Descent

Camera moves from wide context down into local detail.

Use when:

- crash site
- arrival
- landmark
- exact local context matters after establishing wider frame

Meaning:

> Now that you understand the wider relationship, inspect the specific place.

### Reveal

Camera introduces a previously unseen target or consequence.

Use when:

- crash site appears after intended route
- body disposal site after crime scene
- court after arrest
- new development after old venue

Meaning:

> This is the consequence or turning point.

### Contrast toggle

Camera holds or splits while layers switch.

Use when:

- old vs new
- intended vs actual
- official vs lived
- cheap vs expensive
- before vs after

Meaning:

> Understand the difference between two spatial realities.

### Split

Camera breaks one overloaded frame into multiple frames/chapters.

Use when:

- places are too far apart
- time jumps too much
- one outlier ruins the frame
- story contains multiple relationship types

Meaning:

> This cannot be understood in one frame.

## Movement intensity

```txt
Level 0: Static        -> highlight only
Level 1: Corrective    -> soft pan / safe viewport correction
Level 2: Compositional -> fit frame to relationship
Level 3: Narrative     -> trace, reveal, descent
Level 4: Cinematic     -> multi-stage sequence with timing, easing, pitch, bearing, layered reveals
```

MVP should mostly use Levels 0-2.

## MapLibre execution mapping

```txt
Hold              -> no camera call, update GeoJSON style
Soft pan          -> map.easeTo with small center adjustment
Fit frame         -> map.fitBounds
Trace             -> line reveal + optional easeTo sequence
Descent           -> map.easeTo with zoom/pitch/bearing change
Reveal            -> fitBounds or easeTo plus layer opacity transition
Contrast toggle   -> layer visibility/opacity changes
Split             -> new chapter/frame
```

## Final movement rule

The camera should not feel like a GPS animation.

It should feel like an editor saying:

> Look at this relationship first. Now look at what changed.

---

# 5. Stress tests

## Plane crash

Input:

```txt
Takeoff airport
Intended landing airport
Crash site
```

Expected:

- detected story type: incident
- dominant relationship: causality / intended vs actual
- frame: causality frame
- first shot: takeoff + intended destination
- second shot: intended route
- third shot: reveal crash site
- no simple center-on-crash default

## Murder sequence

Input:

```txt
Meeting place
Crime scene
Body disposal site
Arrest site
Court
```

Expected:

- detected story type: crime timeline
- dominant relationship: time
- secondary relationships: distance, consequence, uncertainty
- frame: timeline frame
- overlays: time labels, distance labels, dotted unknown links

## Music venues by genre and size

Input:

```txt
10 venues with genre, capacity, neighborhood, transit access
```

Expected:

- detected story type: culture guide
- dominant relationship: similarity / pattern
- frame: pattern frame
- overlays: genre, capacity rings, cluster view

## Family day out

Input:

```txt
Current location
Ferry terminal
Cable car
Museum
Lunch
Bathroom/fallback
```

Expected:

- detected story type: practical plan
- dominant relationships: time, distance, convenience
- frame: journey/practical frame
- overlays: travel time, fallback, safe sequence

## Global pass criteria

For every test:

1. Every camera move has a reason.
2. Every frame explains a relationship.
3. Active target changes do not automatically recenter.
4. Uncertainty is preserved.
5. The system can suggest splitting when needed.
