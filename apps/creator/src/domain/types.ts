// Domain types for the Creator Studio + Reader vertical slice.
// Story → Section → Chapter. See docs/implementation/DECISIONS_AND_CONFLICTS.md D1.

export type StoryStatus = 'draft' | 'published'

/** Optional per-chapter camera intent. When absent, cameraDirector derives motion. */
export type CameraIntent = {
  zoom?: number
  pitch?: number
  bearing?: number
}

export type Chapter = {
  id: string
  storyId: string
  sectionId: string | null
  /** Global reading order within the story, 1..N. The carousel order. */
  position: number
  name: string
  headline: string
  body: string
  tags: string[]
  imageUrl: string | null
  placeName: string | null
  longitude: number | null
  latitude: number | null
  /** Canonical external (OSM) identifier, optional. */
  placeId: string | null
  camera: CameraIntent | null
  createdAt: string
  updatedAt: string
}

export type Section = {
  id: string
  storyId: string
  name: string
  /** Order of the section in the outline / reader indicator. */
  position: number
  createdAt: string
  updatedAt: string
}

export type Story = {
  id: string
  title: string
  slug: string | null
  status: StoryStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

/** A story with its full structure, as the editor and reader consume it. */
export type StoryBundle = {
  story: Story
  sections: Section[]
  chapters: Chapter[]
}

/** Fields a creator can edit on a chapter (everything except identity/ordering). */
export type ChapterDraft = Partial<
  Pick<
    Chapter,
    | 'name'
    | 'headline'
    | 'body'
    | 'tags'
    | 'imageUrl'
    | 'placeName'
    | 'longitude'
    | 'latitude'
    | 'placeId'
    | 'camera'
    | 'sectionId'
  >
>

export type Actor = 'human' | 'agent'
