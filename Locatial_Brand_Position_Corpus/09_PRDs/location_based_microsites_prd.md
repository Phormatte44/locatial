# Locatial PRD — Location-Based Microsites and the Living Place Graph

**Document status:** Draft v1  
**Audience:** Founder, product, design, Claude, Codex, Cursor, engineering agents  
**Recommended repo path:** `Locatial_Brand_Position_Corpus/PRDs/location_based_microsites_prd.md`  
**Primary product surface:** Locatial place microsites  
**Core thesis:** A place is not a pin. A place is a living, followable, socially active, data-rich object in a growing spatial network.

---

## 1. Executive summary

Locatial should create a new object model for the physical world: the **location-based microsite**.

A location-based microsite is a canonical, addressable page for a real-world place. It is anchored to geography, but it is not limited to a coordinate, address, business listing, or map marker. It is a living place object that can hold identity, history, media, live activity, events, posts, followers, owner updates, citizen contributions, creator stories, recommendations, confidence scores, and relationships to other places.

The long-term goal is to continuously encode **location-based intelligence** that grows over time and has a live pulse in the moment.

A Google Maps pin says: **something is here.**  
A Locatial microsite says: **this place has identity, meaning, memory, activity, followers, relationships, and future relevance.**

This PRD defines the information architecture, object model, widgets, social mechanics, recommendation signals, and build requirements for Locatial microsites. The system must support the full range of place types: a bar, park, mountain top, park bench, graffiti wall, bridge, trailhead, venue, beach, market stall, neighborhood, temporary event site, or any other physical location that can be meaningfully identified, described, revisited, followed, saved, or connected.

The product should work like a modular website system. Not every microsite needs every module, but every microsite should share a common grammar so that Locatial develops global continuity. A bar can prioritize events, crowd pulse, and posts. A park can prioritize amenities, seasonality, trails, and family suitability. A mountain summit can prioritize route, weather, elevation, safety, and view conditions. A bench can prioritize exact position, view direction, memory, nearby walk, and photos. A graffiti wall can prioritize visual change, artists, media timeline, and neighborhood context.

At scale, these microsites become the atomic units of the **Locatial network**. Citizens follow places, bookmark places, organize them into folders, share folders with friends, contribute intelligence, receive owner updates, and build a personal Locatial graph. Creators create narrative threads across cohesive locations. Owners communicate with followers. The system learns a user’s relationship with place by analyzing follows, saves, visits, folders, time, season, distance, intent, social signals, and behavior.

The product ambition is not to build a better map pin. It is to build a new social, editorial, and intelligence layer for the physical world.

---

## 2. Problem statement

The internet has strong object models for people, companies, products, videos, songs, documents, and posts. Place objects remain underdeveloped. Most digital place systems treat the physical world as a collection of searchable pins or business listings. This is useful for navigation, but it fails to capture the richer human relationship with place.

Current systems underrepresent:

- informal places with no official business listing
- tiny places such as benches, walls, corners, viewpoints, doorways, and memorials
- non-commercial places such as parks, trails, beaches, bridges, and public spaces
- temporal behavior: what changes by hour, day, season, weather, and event
- historical layers: what used to be here, what happened here, how the site changed
- creator context: why a place matters inside a story, route, guide, or scene
- citizen memory: places saved for later, loved, revisited, shared, or emotionally attached to
- owner communication: updates to people who follow the place itself
- social distribution based on following places rather than only people
- relationship intelligence: a person’s spatial graph and how it evolves over time

Locatial should solve this by treating each meaningful place as a persistent, modular, socially active microsite.

---

## 3. Product goals

### 3.1 Primary goals

1. Define a universal microsite architecture for all place types.
2. Create a consistent information architecture across location-based pages.
3. Distinguish Locatial microsites from map pins, listings, reviews, and generic place pages.
4. Support rich widgets: photos, history, posts, events, voting, showreels, news, pulse, bookmarks, owner updates, collections, and community intelligence.
5. Let citizens follow and bookmark places.
6. Let citizens organize places into private, shared, collaborative, and public folders.
7. Let owners communicate with followers of a place.
8. Let creators build narrative threads from cohesive sets of places.
9. Build a personal Locatial graph for each citizen based on explicit and implicit place relationships.
10. Create a signal framework for measuring relationship weight to place by day, distance, time, season, behavior, and social context.

### 3.2 Strategic goals

1. Democratize distribution by allowing users to follow places, not just people.
2. Make every place capable of accumulating intelligence over time.
3. Make location-based publishing native, not bolted onto maps.
4. Build a proprietary spatial graph that becomes more valuable with every follow, save, folder, post, event, photo, vote, correction, and story.
5. Build a foundation for recommendations based on relationship with place, not generic popularity.

---

## 4. Non-goals for v1

The first implementation does not need to solve every advanced capability. The architecture must support them, but v1 can be narrower.

Out of scope for the first build unless explicitly added:

- full AR implementation
- full ticketing monetization
- paid owner CRM
- advanced moderation operations
- automatic canonical truth resolution across all external data sources
- live occupancy from sensors
- complex multiplayer route editing
- full venue claiming and legal verification flows
- complete global place coverage

The v1 product should still be designed with these futures in mind.

---

## 5. Core definitions

### 5.1 Place object

A **place object** is any physical location that can be meaningfully identified, described, revisited, referenced, followed, saved, contributed to, or connected to other places.

It can be large or tiny, permanent or temporary, formal or informal, commercial or non-commercial.

Examples:

- bar
- restaurant
- café
- park
- playground
- trailhead
- mountain summit
- beach
- bench
- mural
- graffiti wall
- venue
- market stall
- viewpoint
- bridge
- building
- corner
- memorial
- neighborhood
- street segment
- temporary installation
- event site

### 5.2 Location-based microsite

A **location-based microsite** is the visible product surface for a place object. It is a modular page that presents the place’s identity, media, pulse, history, posts, events, social actions, related places, and structured details.

### 5.3 Place graph

The **place graph** is the network of relationships between places, citizens, creators, owners, folders, stories, events, media, and signals.

### 5.4 Citizen

A **citizen** is a Locatial user who builds a relationship with places by following, saving, organizing, contributing, sharing, voting, visiting, or publishing.

### 5.5 Creator

A **creator** is a user who creates narrative threads, guides, stories, routes, or editorial content based on places.

### 5.6 Owner

An **owner** is an authorized manager of a place microsite, such as a venue, business, park authority, community group, tourism board, or property representative. Owners can communicate with followers, post updates, publish events, and verify operational facts.

### 5.7 Pulse

**Pulse** is a place’s current aliveness and relevance. It is derived from time, events, recent activity, social signals, posts, media, weather, seasonality, and user context.

---

## 6. Critical distinction from Google Maps

Google Maps is primarily a navigation and business-listing system. It answers questions such as:

- Where is this place?
- How do I get there?
- Is it open?
- What are the reviews?
- What is the phone number?
- What category is it?

Locatial is a spatial identity and intelligence system. It answers questions such as:

- What is this place?
- Why does it matter?
- What is happening here now?
- What happened here before?
- Who follows it?
- Who contributes to it?
- What stories mention it?
- What media documents it?
- What is it like at different times?
- What other places does it connect to?
- What kind of relationship do I have with it?
- Why might this place matter to me today?

A pin is a marker. A microsite is an object.

A pin points to location. A microsite gives the location identity.

A pin is mostly navigational. A microsite is spatial, social, editorial, historical, commercial, and personal.

A pin is searched. A microsite is followed.

A pin belongs to a map. A microsite belongs to a place network.

---

## 7. Universal place object model

Every microsite should be powered by a consistent underlying data model.

```txt
Place Object
  Identity
  Spatial Anchor
  Geometry
  Type and Scale
  Status
  Ownership
  Content
  Media
  History
  Events
  Posts
  Pulse
  Community
  Collections
  Relationships
  Signals
  Actions
  Trust and Provenance
```

### 7.1 Required minimum fields

Every place object must have:

- `placeId`
- `canonicalName`
- `placeType`
- `spatialType`: point, line, polygon, footprint, route, area, object, surface
- `lat`
- `lng`
- `geometryConfidence`
- `status`: active, inactive, historical, temporary, disputed, unknown
- `createdAt`
- `updatedAt`
- `sourceSummary`

### 7.2 Recommended fields

- aliases
- short description
- long description
- parent place
- child places
- address
- boundary or footprint
- altitude/elevation where relevant
- entrance points
- view direction where relevant
- opening hours where relevant
- contact details where relevant
- owner claim status
- tags
- attributes
- historical periods
- media count
- follower count
- save count
- pulse score
- confidence score

### 7.3 Scale model

Place scale must be explicit so the same architecture can support large and tiny objects.

Suggested scale levels:

```txt
Region
City
Neighborhood
District
Street
Block
Parcel
Building
Venue
Room
Surface
Object
Point
Route
Viewpoint
Temporary Site
```

Examples:

- Brooklyn = district/borough
- Williamsburg = neighborhood
- Brooklyn Steel = venue
- a specific mural wall = surface
- a bench in Dolores Park = object/point
- Half Dome summit = viewpoint/summit
- a trail = route/line
- a festival footprint = temporary site/polygon

---

## 8. Global microsite information architecture

Every microsite should share a consistent high-level menu. Some sections can be hidden, reordered, renamed, or deprioritized based on place type, but the global grammar should remain stable.

Recommended global menu:

```txt
Overview
Pulse
Stories
Media
History
Events
Posts
Community
Collections
Nearby
Details
```

### 8.1 Overview

Purpose: establish the place identity quickly.

Contains:

- hero image or hero reel
- place name
- place type
- location summary
- short editorial description
- map preview
- current status
- top tags
- follow button
- bookmark button
- share button
- primary action: navigate, reserve, buy ticket, contribute, claim, save, or visit

### 8.2 Pulse

Purpose: show current aliveness and contextual relevance.

Contains:

- live pulse score
- open/closed/status
- busy/quiet signal
- today’s activity
- owner alerts
- recent photos
- recent posts
- recent creator mentions
- current event
- weather or environmental context
- “best now” or “not now” indicator
- freshness signals

### 8.3 Stories

Purpose: connect the place to narrative content and creator threads.

Contains:

- featured stories
- guides containing this place
- routes containing this place
- creator mentions
- related chapters
- narrative threads
- editorial essays
- story timeline
- “appears in” references

### 8.4 Media

Purpose: document atmosphere, evidence, beauty, change, and memory.

Contains:

- photo gallery
- hero image
- video reel
- showreel
- audio clips
- citizen uploads
- creator uploads
- owner uploads
- historical photos
- seasonal media
- before/after slider
- media timeline
- source attribution

### 8.5 History

Purpose: preserve temporal identity and site memory.

Contains:

- place timeline
- occupancy history
- previous uses
- historical events
- former names
- archival photos
- historical map overlays
- community memories
- citations
- confidence indicators

Important requirement: physical site history must be separated from current occupant history.

Example:

```txt
Site: 100 Example Street
1920–1955: cinema
1956–1988: warehouse
1989–2015: music venue
2016–present: cocktail bar
```

### 8.6 Events

Purpose: show future and recurring activity.

Contains:

- upcoming events
- recurring events
- featured event
- ticket link
- RSVP
- add to calendar
- event host
- past events
- event media
- reminders
- similar events

### 8.7 Posts

Purpose: allow the place to communicate with followers.

Contains:

- owner posts
- creator posts
- citizen posts, if enabled
- announcements
- closures
- offers
- seasonal updates
- pinned posts
- follower-only posts
- comment/reaction controls

This section is strategically important. Following a place should create a communication channel between the place and its followers.

### 8.8 Community

Purpose: collect local intelligence and social participation.

Contains:

- followers
- contributors
- local experts
- Q&A
- comments
- tips
- polls
- votes
- corrections
- “is this still true?” prompts
- attribute verification
- reputation badges

The design should bias toward useful contribution rather than noisy comment threads.

### 8.9 Collections

Purpose: connect the place to user and creator organization systems.

Contains:

- save to folder
- folders containing this place
- shared folders
- collaborative folders
- creator collections
- public guides
- private bookmarks
- friend-shared lists

### 8.10 Nearby

Purpose: show relational geography.

Contains:

- nearby places
- similar places
- parent/child places
- often paired with
- next stop
- before/after this
- routes from here
- transit nearby
- walkable clusters
- creator-recommended nearby

Nearby should be intelligent, not generic. For a bench, nearby may mean coffee, restroom, playground, or walk loop. For a bar, it may mean late-night food, second bar, transit, or safer pickup point.

### 8.11 Details

Purpose: hold facts, source, provenance, and operational truth.

Contains:

- address
- coordinates
- geometry
- opening hours
- contact
- website
- amenities
- accessibility
- rules
- ownership status
- claim status
- data sources
- edit history
- correction history
- confidence score
- moderation status
- safety notes

---

## 9. Widget library

The system should be built from reusable widgets. Widgets can be turned on/off by place type, owner status, content availability, and product tier.

### 9.1 Identity widgets

- Place Header
- Place Name
- Place Type Badge
- Location Summary
- Alias List
- Parent Place Breadcrumb
- Claim Status
- Verification Badge
- Contributor Credit
- Canonical Place ID
- Spatial Address
- Short Description
- Long Description

### 9.2 Map and spatial widgets

- Mini Map
- Full Map
- Boundary Map
- Footprint Map
- Entrance Map
- Route Map
- Trail Map
- Floor/Level Indicator
- View Direction Widget
- Nearby Cluster Map
- Distance From Me
- Transit Nearby
- Parking Nearby
- Spatial Context Card
- Parent/Child Location Tree
- Inside This Place
- This Place Contains

### 9.3 Pulse widgets

- Live Pulse Card
- Open Now / Closed / Unknown
- Busy Now
- Trending Now
- Quiet Now
- Best Time Today
- Best Season
- Weather Context
- Crowd Mood
- Recent Activity
- Recent Check-ins
- Recent Uploads
- Live Event Now
- Recently Updated
- New Since You Followed
- Owner Alert
- Temporary Closure
- Safety Warning
- Time-Sensitive Recommendation

### 9.4 Media widgets

- Photo Gallery
- Hero Image
- Showreel
- Video Reel
- Audio Clip
- Soundscape
- Historical Photo
- Then/Now Slider
- Seasonal Gallery
- Creator Gallery
- Citizen Uploads
- Owner Media
- Tagged Media
- Viewpoint Gallery
- Dish Gallery
- Event Media
- Media Timeline
- Source Attribution Panel

### 9.5 History widgets

- Place Timeline
- Occupancy Timeline
- Historical Event Card
- Former Names
- Former Uses
- Archival Photo
- Historical Map Overlay
- Memory Card
- Oral History Clip
- What Used To Be Here
- This Happened Here
- Era Summary
- Source Citation
- Historical Confidence Indicator

### 9.6 Event widgets

- Upcoming Events
- Event Calendar
- Featured Event
- Ticket Widget
- RSVP Widget
- Add to Calendar
- Recurring Events
- Past Events
- Event Photos
- Event Host
- Event Route
- Nearby Before/After
- Similar Events
- Follower Event Alert

### 9.7 Post and communication widgets

- Owner Update
- Announcement Feed
- Pinned Post
- Creator Post
- Citizen Post
- Follower Message
- Offer / Promotion
- Closure Notice
- New Menu / New Route / New Installation
- Seasonal Update
- Comment Thread
- Reaction Bar
- Share Post
- Report Post
- Save Post

### 9.8 Social widgets

- Follow Button
- Bookmark Button
- Save to Folder
- Share Place
- Share Folder
- Send to Friend
- Invite Collaborator
- People Following
- Friends Who Saved
- Friends Who Visited
- Creator Mentions
- Related Guides
- Comment
- React
- Vote
- Poll
- Q&A
- Tip Submission
- Correction Submission
- Still True Prompt
- Reputation Badge
- Contributor Rank
- Local Expert Marker

### 9.9 Voting and consensus widgets

- Attribute Vote
- Yes/No Verification
- Confidence Meter
- Dog Friendly Verification
- Kid Friendly Verification
- Still Open Verification
- Entrance Usable Verification
- Mural Still Here Verification
- Quiet/Safe/Accessible Verification
- Poll Card
- Consensus Summary
- Contradiction Alert
- Source Comparison
- Confidence Threshold Status

### 9.10 Recommendation widgets

- Why This Place
- Best For
- Good At This Time
- Similar Places
- Often Paired With
- Good Next Stop
- Recommended Route
- Personal Match Score
- Seasonal Match
- Friend Match
- Creator Match
- Distance-Weighted Match
- Intent Match
- Because You Follow
- Because You Saved
- Because You Visited
- Because You Like Places Like This

### 9.11 Collection widgets

- Save to Folder
- Folder Picker
- Personal Bookmark
- Shared Folder
- Collaborative Folder
- Public Collection
- Creator Guide
- Export Route
- Share Collection
- Add Note to Saved Place
- Sort by Distance
- Sort by Mood
- Sort by Day/Time
- Map My Folder
- Folder Pulse
- Folder Updates

### 9.12 Commerce and action widgets

- Reserve
- Buy Ticket
- Order
- Book Tour
- Call
- Website
- Menu
- Donate
- Support
- Claim This Place
- Contact Owner
- Navigate
- Ride Hail
- Transit Route
- Save Offline
- Download Guide

### 9.13 Trust and provenance widgets

- Data Source
- Last Verified
- Confidence Score
- Contributor History
- Edit History
- Claimed By
- Moderation Status
- Report Issue
- Duplicate Place Warning
- Merge Suggestion
- Sensitive Place Warning
- Privacy Restriction
- Safety Notice
- Rights and Attribution
- Official Source Badge
- Community Verified Badge

---

## 10. Place type configurations

### 10.1 Bar microsite

Primary sections:

- Overview
- Pulse
- Events
- Posts
- Media
- Community
- Nearby
- Details

Priority widgets:

- busy now
- best time tonight
- owner updates
- event calendar
- drink/menu media
- crowd mood
- nearby late food
- next bar
- transit/ride pickup
- creator mentions

### 10.2 Park microsite

Primary sections:

- Overview
- Pulse
- Media
- Community
- Nearby
- Details

Priority widgets:

- boundary map
- entrances
- amenities
- playgrounds
- dog rules
- weather
- seasonal conditions
- family suitability
- restrooms
- shade
- picnic areas
- safety updates

### 10.3 Mountain summit microsite

Primary sections:

- Overview
- Pulse
- Routes
- Media
- History
- Community
- Nearby
- Details

Priority widgets:

- elevation
- trail access
- weather exposure
- route map
- difficulty
- summit view
- seasonal risk
- safety notes
- trip reports
- sunrise/sunset
- nearby trailhead

### 10.4 Park bench microsite

Primary sections:

- Overview
- Media
- Stories
- Nearby
- Details

Priority widgets:

- exact position
- view direction
- photo from bench
- best time to sit
- nearby coffee
- nearby playground
- nearby restroom
- memory card
- quiet score
- route/walk loop

### 10.5 Graffiti wall microsite

Primary sections:

- Overview
- Media
- History
- Posts
- Community
- Nearby
- Details

Priority widgets:

- wall segment geometry
- artist attribution
- image timeline
- before/after
- last seen
- still here verification
- cultural context
- nearby murals
- neighborhood story

---

## 11. Citizen experience requirements

Citizens must be able to:

1. Follow a place.
2. Unfollow a place.
3. Bookmark a place.
4. Save a place into one or more folders.
5. Create private folders.
6. Create shared folders.
7. Invite friends to collaborative folders.
8. Share a public folder.
9. Add notes to saved places.
10. Receive updates from followed places.
11. Control notification preferences by place.
12. Contribute photos, tips, corrections, and votes.
13. See why a place is recommended.
14. See their relationship to a place where appropriate.
15. Hide or mute places.

The citizen profile should gradually become a representation of their relationship with the physical world.

This is not just a taste graph. It is a place graph.

---

## 12. Owner experience requirements

Owners or authorized managers must be able to:

1. Claim a place.
2. Verify basic facts.
3. Update operational details.
4. Post announcements.
5. Publish events.
6. Upload official media.
7. Send updates to followers.
8. Pin important posts.
9. Respond to structured questions where enabled.
10. Flag incorrect data.
11. View follower analytics at a privacy-safe level.

Important principle: owner data must not automatically overwrite community truth. It should be stored as a sourced claim and weighted appropriately.

---

## 13. Creator experience requirements

Creators must be able to:

1. Reference places in stories.
2. Create narrative threads across multiple places.
3. Build guides and routes.
4. Create collections.
5. Add editorial context to a place.
6. Upload media.
7. Publish place-based chapters.
8. Create thematic place sets.
9. See which place objects their content strengthens.
10. Add new places where no object exists yet.

Each story mention should create an edge between the creator, the story, the place, and the surrounding place set.

---

## 14. Social model

Locatial should make every meaningful element socially active.

Social actions can apply to:

- places
- photos
- videos
- posts
- events
- stories
- routes
- folders
- guide chapters
- historical moments
- tips
- corrections
- votes
- attributes

Allowed social actions:

- follow
- save
- react
- comment
- vote
- share
- quote
- remix
- add to folder
- send to friend
- add to route
- add to story
- verify
- dispute
- report
- subscribe
- mention
- tag
- compare
- recommend

The design should avoid generic noisy social feeds. It should bias toward useful place intelligence, meaningful recommendations, and local credibility.

---

## 15. Bookmark and folder system

Bookmarks are the foundation of personal spatial memory.

Folders can be:

- private
- shared
- collaborative
- public
- creator-published
- temporary
- trip-based
- city-based
- theme-based
- intent-based

Example folders:

- Want to go
- Date night
- Kid-friendly
- Dog-friendly
- Near work
- Near home
- Weekend ideas
- Rainy day
- Summer
- Best views
- Quiet places
- Cheap eats
- Bars to try
- Places I love
- Places I have been
- Places to show visitors
- Places from articles
- Places from friends

Each folder should have:

- list view
- map view
- share settings
- collaborator settings
- notes
- sort controls
- optional route generation
- update feed
- pulse summary

---

## 16. Personal Locatial graph

The personal Locatial graph is built from explicit and implicit signals.

### 16.1 Explicit signals

- follow
- bookmark
- folder add
- folder title
- share
- note
- vote
- photo upload
- story creation
- RSVP
- review
- correction
- claim
- hide
- mute

### 16.2 Implicit signals

- page views
- repeat views
- dwell time
- map interactions
- route planning
- media engagement
- places opened together
- time of day viewed
- season viewed
- distance from user
- physical visits, only with permission
- places ignored
- places revisited

### 16.3 Relationship types

The system should not reduce everything to likes.

A citizen may have different relationships with places:

- loves
- wants to visit
- relies on
- remembers
- follows for events
- follows for safety
- follows professionally
- follows because of family
- follows because of nightlife
- follows because they used to live nearby
- follows for future travel

---

## 17. Relationship weighting model

Locatial must develop algorithms to quantify the strength and type of relationship between a person and a place.

Initial conceptual model:

```txt
Relationship Weight =
  explicit affinity
+ behavioral affinity
+ proximity relevance
+ temporal relevance
+ social relevance
+ seasonal relevance
+ creator relevance
+ memory relevance
+ intent relevance
+ freshness relevance
```

### 17.1 Explicit affinity

Strongest early signals:

- follow
- bookmark
- add to named folder
- share with friend
- write note
- upload media
- create story
- RSVP
- review
- claim

### 17.2 Behavioral affinity

Signals:

- repeat page views
- long dwell time
- media views
- opening history
- viewing events
- routing to the place
- returning after update
- opening related places

### 17.3 Proximity relevance

Distance should be weighted differently by place type and intent.

A coffee shop is highly distance-sensitive. A mountain summit may be less distance-sensitive but more season/weather-sensitive. A famous venue may matter from far away. A childhood place may matter regardless of distance.

### 17.4 Temporal relevance

A place changes value by:

- hour
- day
- weekday/weekend
- season
- holiday
- event schedule
- sunset/sunrise
- school calendar
- commute pattern
- weather
- opening hours

### 17.5 Seasonal relevance

Examples:

- beach in summer
- ski trail in winter
- park in spring
- foliage viewpoint in autumn
- patio bar in warm weather
- indoor museum in rain
- mountain route in safe conditions
- Christmas market in December

### 17.6 Social relevance

Signals:

- friends follow
- friends saved
- friends visited
- trusted creator mentioned
- local expert recommended
- folder shared by friend
- community activity rising

### 17.7 Creator relevance

Signals:

- creator mentions place
- creator includes in guide
- creator has authority in category
- user follows creator
- user saves from creator often
- place appears in multiple coherent creator narratives

### 17.8 Memory relevance

Signals:

- user visited before
- user uploaded photo
- user wrote note
- user added to Places I Love
- user shared with family
- user returns annually
- user lived nearby
- user marked the place meaningful

### 17.9 Intent relevance

The same place should score differently depending on intent:

- date night
- toddler-friendly
- after-work drinks
- quiet reading
- dog walk
- live music
- cheap food
- scenic walk
- rainy day
- solo exploration
- family weekend
- history walk
- tourist visit
- local routine

### 17.10 Freshness relevance

Signals:

- new owner post
- new event
- new media
- new creator mention
- recent friend save
- recent update
- recent closure
- seasonal change
- high-quality contribution

---

## 18. Place pulse score

Every place should eventually have a pulse score.

Initial conceptual model:

```txt
Place Pulse =
  current activity
+ recent updates
+ follower engagement
+ event proximity
+ creator mentions
+ citizen contributions
+ owner posts
+ media uploads
+ temporal fit
+ weather fit
+ seasonal fit
+ nearby movement
+ social graph activity
```

The pulse score should answer:

> Is this place alive right now, and why?

Pulse should be explainable. Do not show a black-box score without a reason.

Example explanations:

- “Active tonight because two events are scheduled and follower saves are up.”
- “Good now because sunset is in 40 minutes and this is a saved viewpoint.”
- “Recently changed because new photos confirm the mural has been repainted.”
- “Relevant this weekend because three places in your family folder are nearby.”

---

## 19. Data and provenance requirements

Every contribution should be stored as a sourced claim, not immediately treated as canonical truth.

Claim fields:

- `claimId`
- `placeId`
- `claimType`
- `claimValue`
- `sourceType`: owner, citizen, creator, official, external API, observed, imported
- `sourceId`
- `createdAt`
- `validFrom`
- `validTo`
- `confidence`
- `evidence`
- `status`: pending, accepted, disputed, deprecated, rejected

Source weighting should consider:

- authority
- independence
- recency
- specificity
- consistency
- contributor reputation
- evidence quality

The system must preserve disagreement where useful.

Example:

- owner says “family friendly”
- citizens say “only before 6pm”
- creator says “great for dates, bad for groups”

Locatial should not flatten this into one simplistic value.

---

## 20. Privacy and safety requirements

The product will deal with personal places, location behavior, social graphs, and memory. Privacy must be designed in from the start.

Requirements:

1. Users must control whether folders are private, shared, collaborative, or public.
2. Physical visit inference must require explicit permission.
3. Sensitive places may need restricted visibility.
4. Private notes should never become public by default.
5. Follower lists may need privacy controls.
6. Owner analytics must be aggregate and privacy-safe.
7. Children/family-related use cases must be handled carefully.
8. Users must be able to mute, hide, or remove place relationships.
9. Users must be able to delete personal place data where legally required.

---

## 21. MVP scope recommendation

### 21.1 MVP product surface

Build the first microsite template with:

- Overview
- Pulse
- Media
- Stories
- Posts
- Collections
- Nearby
- Details

### 21.2 MVP place types

Start with 3–5 archetypes:

1. Bar / venue
2. Park / public space
3. Viewpoint / bench
4. Graffiti wall / mural
5. Neighborhood / area

This is enough to prove that the universal object model can handle both conventional and unconventional places.

### 21.3 MVP citizen actions

- follow place
- bookmark place
- save to folder
- share place
- share folder
- upload photo
- submit tip
- vote on simple attribute

### 21.4 MVP owner actions

- claim placeholder
- post update
- publish event
- upload official image

### 21.5 MVP creator actions

- create story
- reference place
- build collection
- publish narrative thread

### 21.6 MVP scoring

Start with simple explainable scoring:

- follow = strong affinity
- bookmark = strong affinity
- folder add = strong affinity plus intent
- recent view = weak affinity
- repeat view = medium affinity
- owner post = freshness
- new event = pulse
- friend share = social relevance
- time/day match = temporal relevance

Do not overbuild the algorithm in v1. Instrument everything so the algorithm can mature.

---

## 22. Technical requirements

### 22.1 Suggested stack alignment

Use Locatial’s existing preferred stack:

- React
- Tailwind
- shadcn/ui
- MapLibre GL JS
- Supabase
- Vercel
- GitHub

### 22.2 Frontend requirements

- responsive microsite layout
- reusable widget components
- mobile-first interaction model
- map component
- hero/media component
- follow/bookmark/share controls
- tab/section navigation
- widget registry
- place-type configuration
- empty states for missing modules
- explanation UI for recommendations and pulse

### 22.3 Backend/data requirements

Core tables or equivalent:

- `places`
- `place_geometries`
- `place_claims`
- `place_media`
- `place_posts`
- `place_events`
- `place_follows`
- `place_bookmarks`
- `folders`
- `folder_places`
- `stories`
- `story_places`
- `place_relationships`
- `place_signals`
- `place_attributes`
- `place_attribute_votes`
- `place_history_periods`
- `owners`
- `creator_profiles`

### 22.4 API requirements

Minimum endpoints:

```txt
GET /places/:placeId
GET /places/:placeId/pulse
GET /places/:placeId/media
GET /places/:placeId/posts
GET /places/:placeId/events
GET /places/:placeId/stories
GET /places/:placeId/nearby
POST /places/:placeId/follow
DELETE /places/:placeId/follow
POST /places/:placeId/bookmark
POST /folders
POST /folders/:folderId/places
POST /places/:placeId/media
POST /places/:placeId/tips
POST /places/:placeId/votes
```

### 22.5 Widget registry concept

Each place type should map to an ordered set of widgets.

Example:

```ts
const placeTypeWidgets = {
  bar: [
    'hero',
    'actions',
    'pulse',
    'events',
    'posts',
    'media',
    'stories',
    'nearby',
    'details'
  ],
  bench: [
    'hero',
    'actions',
    'viewDirection',
    'media',
    'stories',
    'nearby',
    'details'
  ],
  graffiti_wall: [
    'hero',
    'actions',
    'mediaTimeline',
    'history',
    'communityVerification',
    'nearby',
    'details'
  ]
}
```

---

## 23. UX principles

1. Lead with place identity, not controls.
2. Make follow/bookmark/share always easy.
3. Show why a place matters now.
4. Do not flatten all places into business listings.
5. Preserve scale differences without breaking the global grammar.
6. Make social features useful, not noisy.
7. Make recommendations explainable.
8. Treat history, memory, and current activity as separate layers.
9. Make every contribution improve place intelligence.
10. Keep the first interface simple, but build the object model for depth.

---

## 24. Acceptance criteria

The PRD is successful if a builder can create a first-pass Locatial microsite system that:

1. Represents multiple place types using one underlying object model.
2. Clearly distinguishes a microsite from a map pin.
3. Shows a consistent global IA across different places.
4. Supports modular widgets that can be enabled by place type.
5. Allows citizens to follow, bookmark, save to folders, and share places.
6. Allows basic owner posts and follower updates.
7. Allows creator stories to reference places.
8. Supports media, pulse, history, posts, events, nearby, and details sections.
9. Captures signals that can later power relationship weighting.
10. Preserves source/provenance for contributed facts.
11. Produces a coherent, premium, Locatial-specific product experience.

---

## 25. Claude/Codex execution instructions

When using this PRD with Claude, Codex, or Cursor:

1. Do not build a generic Google Maps clone.
2. Do not reduce places to business listings.
3. Implement a modular microsite architecture.
4. Create a reusable place object schema first.
5. Create a widget registry rather than hardcoding one page.
6. Start with representative sample data for multiple place types.
7. Make the UI prove that a bar, park, bench, summit, and graffiti wall can all be represented by the same system.
8. Include follow, bookmark, save-to-folder, and share interactions even if persistence is mocked in the first prototype.
9. Include pulse as an explainable card, not just a number.
10. Include empty states so incomplete microsites still feel intentional.
11. Keep the first UI visually clean, dark, editorial, and premium.
12. Use shadcn/ui and Tailwind conventions where possible.
13. Keep code readable and structured for future Supabase integration.
14. If uncertain, preserve the data model and simplify the UI, not the other way around.

---

## 26. Build prompt for Claude/Codex

Use the following task prompt when asking an implementation agent to build from this PRD:

```txt
Build a first-pass Locatial location-based microsite prototype from `Locatial_Brand_Position_Corpus/PRDs/location_based_microsites_prd.md`.

The goal is to prove that a place is not a Google Maps pin, but a living, followable, modular place object.

Use React, Tailwind, and shadcn/ui conventions. Create a responsive prototype with sample data for at least five place types: bar, park, mountain summit/viewpoint, park bench, and graffiti wall.

Implement:
- universal place object schema
- place type widget registry
- microsite page layout
- global menu: Overview, Pulse, Stories, Media, History, Events, Posts, Community, Collections, Nearby, Details
- follow button
- bookmark button
- save-to-folder interaction
- share interaction
- pulse card with explainable reasons
- media gallery
- posts module
- events module
- history module
- nearby module
- details/provenance module
- empty states for modules with no content

Do not build a generic map listing. The page should feel like a living place object that can accumulate identity, memory, media, social signals, and current activity over time.

Prioritize clarity, modularity, and future extensibility over perfect visual detail. Use mocked data if needed, but structure it as if it will later come from Supabase.
```

---

## 27. Open questions

1. Should Locatial use the term “citizen” publicly, or only internally?
2. What is the minimum viable claiming process for owners?
3. Should follower counts be public by default?
4. Should place follower messaging be open, moderated, or owner-only?
5. How should sensitive or private places be protected?
6. What is the first city or neighborhood to use for sample data?
7. Should folders be called folders, collections, or placebooks?
8. Should pulse be shown as a score, phrase, animation, or status card?
9. Should a place page have comments by default, or structured contributions only?
10. What is the right public URL/address format for a place microsite?

---

## 28. Final product principle

Locatial is not a better pin.

Locatial is a new object model for place.

The microsite is the page.  
The place object is the intelligence.  
The follow is the relationship.  
The folder is the personal graph.  
The story is the narrative edge.  
The pulse is the moment.  
The network is the product.
