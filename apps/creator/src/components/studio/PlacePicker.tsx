// PlacePicker — search a place (Nominatim) or rely on map-click. Shows current coords.
import { useEffect, useRef, useState } from 'react'
import { searchPlaces, type PlaceResult } from '../../services/placeSearchService'
import { Button, Input } from '../ui/primitives'

type Props = {
  longitude: number | null
  latitude: number | null
  placeName: string | null
  onPick: (result: { lng: number; lat: number; label: string; placeId: string }) => void
}

export function PlacePicker({ longitude, latitude, placeName, onPick }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Debounced search.
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const t = setTimeout(async () => {
      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac
      setLoading(true)
      setErr(null)
      try {
        setResults(await searchPlaces(query, ac.signal))
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setErr(String((e as Error)?.message ?? e))
      } finally {
        setLoading(false)
      }
    }, 500)
    return () => clearTimeout(t)
  }, [query])

  const hasLocation = typeof longitude === 'number' && typeof latitude === 'number'

  return (
    <div data-testid="place-picker">
      <div className="flex gap-2">
        <Input
          value={query}
          placeholder="Search a place…"
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search place"
        />
      </div>
      {loading && <div className="mt-1 text-xs text-gray-mid">Searching…</div>}
      {err && <div className="mt-1 text-xs text-red-400">{err}</div>}
      {results.length > 0 && (
        <ul className="mt-2 max-h-44 overflow-y-auto rounded-lg border border-gray-rule bg-surface1">
          {results.map((r) => (
            <li key={r.placeId}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-xs text-gray-lo hover:bg-surface2"
                onClick={() => {
                  onPick({ lng: r.lng, lat: r.lat, label: r.label, placeId: r.placeId })
                  setQuery('')
                  setResults([])
                }}
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 rounded-lg bg-surface1 px-3 py-2 text-xs">
        {hasLocation ? (
          <>
            <div className="font-bold text-chalk">{placeName || 'Custom point'}</div>
            <div className="text-gray-mid">
              {longitude!.toFixed(5)}, {latitude!.toFixed(5)} <span className="text-gray-hi">(lng, lat)</span>
            </div>
          </>
        ) : (
          <span className="text-gray-hi">No location set — search above or click the map.</span>
        )}
      </div>
    </div>
  )
}
