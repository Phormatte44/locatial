// Shared MapLibre GL initialization (docs/ARCHITECTURE.md + DESIGN-SYSTEM.md defaults).
import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'

export const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'

export function useMaplibre(opts?: {
  center?: [number, number]
  zoom?: number
  interactive?: boolean
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: opts?.center ?? [-0.1278, 51.5074],
      zoom: opts?.zoom ?? 12,
      pitch: 45,
      bearing: -10,
      interactive: opts?.interactive ?? true,
      attributionControl: false,
    })
    mapRef.current = map
    map.on('load', () => setReady(true))
    return () => {
      map.remove()
      mapRef.current = null
      setReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { containerRef, mapRef, ready }
}

export function makePinElement(label: string): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'loc-pin'
  const lbl = document.createElement('span')
  lbl.className = 'loc-pin-label'
  lbl.textContent = label
  const pillar = document.createElement('div')
  pillar.className = 'loc-pin-pillar'
  el.appendChild(lbl)
  el.appendChild(pillar)
  return el
}

export function stylePin(el: HTMLElement, active: boolean, dimmed = false) {
  const label = el.querySelector('.loc-pin-label') as HTMLElement | null
  const pillar = el.querySelector('.loc-pin-pillar') as HTMLElement | null
  if (!label || !pillar) return
  el.style.opacity = dimmed ? '0.35' : '1'
  el.style.zIndex = active ? '10' : '1'
  if (active) {
    label.style.cssText =
      'color:#FF2D7A;font-size:11px;font-weight:800;white-space:nowrap;margin-bottom:5px;text-shadow:0 0 12px rgba(255,45,122,0.6);'
    pillar.style.cssText =
      'width:10px;height:60px;border-radius:5px;background:linear-gradient(135deg,#ff6aab 0%,#FF2D7A 40%,#cc1a5e 100%);box-shadow:0 0 18px rgba(255,45,122,0.7),0 2px 8px rgba(0,0,0,0.4);'
  } else {
    label.style.cssText =
      'color:#888;font-size:10px;font-weight:700;white-space:nowrap;margin-bottom:4px;'
    pillar.style.cssText =
      'width:7px;height:26px;border-radius:3.5px;background:linear-gradient(135deg,#555 0%,#1a1a1a 50%,#0a0a0a 100%);box-shadow:0 2px 6px rgba(0,0,0,0.4);'
  }
}

export { maplibregl }
