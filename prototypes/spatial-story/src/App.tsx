import { useCallback, useEffect, useRef, useState } from 'react'
import type { Map as MLMap } from 'maplibre-gl'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion'
import { MapStage } from './components/MapStage'
import { MapOverlay } from './components/MapOverlay'
import { StoryPanel } from './components/StoryPanel'
import { Intro } from './components/Intro'
import { Odometer } from './components/Odometer'
import { haptic } from './lib/motion'
import { SCENES, type Beat } from './data/scenes'

export default function App() {
  const [map, setMap] = useState<MLMap | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [index, setIndex] = useState(0)
  const [beat, setBeat] = useState<Beat>(0)
  const [hintVisible, setHintVisible] = useState(true)
  const [readProgress, setReadProgress] = useState(0)
  const [flashKey, setFlashKey] = useState(0)

  const scene = SCENES[index]
  const bearingBaseRef = useRef(0)

  // the story panel reports live swipe-drag progress here (-1..1); the map
  // reads it back to physically respond — recede, dim, and yaw slightly —
  // so the two halves feel like one instrument, not a map plus a carousel.
  const dragProgress = useMotionValue(0)
  const mapScale = useTransform(dragProgress, [-1, 0, 1], [0.965, 1, 0.965])
  const mapY = useTransform(dragProgress, [-1, 0, 1], [8, 0, 8])
  const mapBrightness = useTransform(dragProgress, [-1, 0, 1], [0.8, 1, 0.8])
  const mapFilter = useMotionTemplate`brightness(${mapBrightness})`

  // map.setBearing() cancels any in-progress flyTo (it's jumpTo under the
  // hood) — guard the nudge so a lingering spring-back can't freeze the
  // next scene's camera mid-flight.
  const flyingRef = useRef(false)
  useMotionValueEvent(dragProgress, 'change', (v) => {
    if (!map || flyingRef.current) return
    map.setBearing(bearingBaseRef.current + v * 3.5)
  })

  const navigate = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(SCENES.length - 1, next))
    setIndex((cur) => {
      if (clamped !== cur) {
        setBeat(0)
        setFlashKey((k) => k + 1)
        haptic(10)
      }
      return clamped
    })
  }, [])

  const advanceBeat = useCallback((b: Beat) => {
    setBeat((cur) => (b > cur ? b : cur))
  }, [])

  // the camera is a cinematographer: one authored move per scene
  useEffect(() => {
    if (!map) return
    const cam = scene.camera
    bearingBaseRef.current = cam.bearing ?? 0
    if (!cam.duration) {
      map.jumpTo({ center: cam.center, zoom: cam.zoom, bearing: cam.bearing ?? 0, pitch: cam.pitch ?? 0 })
      return
    }
    flyingRef.current = true
    const onSettle = () => {
      flyingRef.current = false
    }
    map.once('moveend', onSettle)
    map.flyTo({
      center: cam.center,
      zoom: cam.zoom,
      bearing: cam.bearing ?? 0,
      pitch: cam.pitch ?? 0,
      duration: cam.duration,
      essential: true,
    })
    return () => {
      map.off('moveend', onSettle)
    }
  }, [map, index]) // eslint-disable-line react-hooks/exhaustive-deps

  // keyboard fallback for desktop review
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (showIntro) return
      if (e.key === 'ArrowRight') navigate(index + 1)
      if (e.key === 'ArrowLeft') navigate(index - 1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [index, navigate, showIntro])

  return (
    <div className="flex h-full items-center justify-center">
      <div className="shell">
        {/* ─── top: the real map canvas ─── */}
        <motion.div className="relative" style={{ flex: '0 0 52%', scale: mapScale, y: mapY, filter: mapFilter }}>
          <MapStage onMap={setMap} onReady={() => setMapReady(true)} />
          <MapOverlay map={map} scene={scene} beat={beat} />
          <div className="map-vignette pointer-events-none absolute inset-0" style={{ zIndex: 6 }} />

          {/* cut-to-black flash on every scene commit — a camera cut, not a slide */}
          {flashKey > 0 && (
            <div key={flashKey} className="shutter-flash pointer-events-none absolute inset-0" style={{ zIndex: 12 }} />
          )}

          {/* scene clock */}
          <div className="absolute left-4 top-3.5 flex items-center gap-2.5" style={{ zIndex: 7 }}>
            <Odometer
              value={scene.clock}
              className="font-mono-ed text-[10px] tracking-[0.25em]"
              style={{ color: 'var(--chalk)' }}
            />
            <div className="h-[3px] w-[3px] rounded-full" style={{ background: 'var(--flood)' }} />
            <div className="font-mono-ed text-[8.5px] tracking-[0.2em] uppercase" style={{ color: 'var(--fog)' }}>
              Harrow Bay
            </div>
          </div>

          {/* scene insight — the map sentence */}
          <div className="absolute bottom-3 left-4 right-4" style={{ zIndex: 7 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 1.1, duration: 0.9 } }}
                exit={{ opacity: 0, y: -4, transition: { duration: 0.4 } }}
              >
                <div className="mb-1 h-px w-7" style={{ background: 'var(--flood)' }} />
                <div className="font-display text-[15.5px] italic leading-snug" style={{ color: 'var(--chalk)', textShadow: '0 1px 10px rgba(3,5,8,0.9)' }}>
                  {scene.mapSentence}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* reading progress: hairline seam between map and story */}
        <div className="relative h-px w-full shrink-0" style={{ background: 'var(--hair)', zIndex: 8 }}>
          <div
            className="absolute left-0 top-0 h-full transition-[width] duration-300 ease-out"
            style={{ width: `${readProgress * 100}%`, background: 'var(--flood)', boxShadow: '0 0 8px rgba(56,207,232,0.7)' }}
          />
        </div>

        {/* ─── bottom: the story panel ─── */}
        <StoryPanel
          index={index}
          beat={beat}
          onNavigate={navigate}
          onBeat={advanceBeat}
          hintVisible={hintVisible}
          onFirstGesture={() => setHintVisible(false)}
          onReadProgress={setReadProgress}
          dragProgress={dragProgress}
        />

        <AnimatePresence>
          {showIntro && <Intro key="intro" mapReady={mapReady} onEnter={() => setShowIntro(false)} />}
        </AnimatePresence>
      </div>
    </div>
  )
}
