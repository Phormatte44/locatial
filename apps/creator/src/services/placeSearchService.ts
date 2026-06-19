// placeSearchService — geocoding via Nominatim (OpenStreetMap, no key). See D6.
// Coordinates returned in [lng, lat] order to match the rest of the codebase.

export type PlaceResult = {
  label: string
  lng: number
  lat: number
  /** Canonical id: "<osm_type>/<osm_id>", e.g. "node/1234". */
  placeId: string
}

const ENDPOINT = 'https://nominatim.openstreetmap.org'

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<PlaceResult[]> {
  const q = query.trim()
  if (!q) return []
  const url = `${ENDPOINT}/search?format=jsonv2&limit=8&q=${encodeURIComponent(q)}`
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Place search failed (${res.status})`)
  const data = (await res.json()) as Array<{
    display_name: string
    lat: string
    lon: string
    osm_type?: string
    osm_id?: number
  }>
  return data.map((d) => ({
    label: d.display_name,
    lng: parseFloat(d.lon),
    lat: parseFloat(d.lat),
    placeId: d.osm_type && d.osm_id ? `${d.osm_type}/${d.osm_id}` : `${d.lat},${d.lon}`,
  }))
}

/** Reverse geocode a clicked point into a human-readable name. */
export async function reverseGeocode(lng: number, lat: number, signal?: AbortSignal): Promise<PlaceResult | null> {
  const url = `${ENDPOINT}/reverse?format=jsonv2&lon=${lng}&lat=${lat}`
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) return null
  const d = (await res.json()) as {
    display_name?: string
    osm_type?: string
    osm_id?: number
  }
  if (!d.display_name) return null
  return {
    label: d.display_name,
    lng,
    lat,
    placeId: d.osm_type && d.osm_id ? `${d.osm_type}/${d.osm_id}` : `${lat},${lng}`,
  }
}
