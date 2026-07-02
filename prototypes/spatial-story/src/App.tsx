import { useCallback, useEffect, useState } from 'react'
import type { Map as MLMap } from 'maplibre-gl'
import { AnimatePresence, motion } from 'framer-motion'
import { MapStage } from './components/MapStage'
import { MapOverlay } from './components/MapOverlay'
import { StoryPanel } from './components/StoryPanel'
import { SCENES, type Beat } from './data/scenes'

export default function App() {
  const [map, setMap] = useState<MLMap | null>(null)
  const [index, setIndex] = useState(0)
  const [beat, setBeat] = useState<Beat>(0)
  const [hintVisible, setHintVisible] = useState(true)
  const [readProgress, setReadProgress] = useState(0)

  const scene = SCENES[index]

  const navigate = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(SCENES.length - 1, next))
      setIndex((cur) => {
        if (clamped !== cur) setBeat(0)
        return clamped
      })
    },
    [],
  )

  const advanceBeat = useCallback((b: Beat) => {
    setBeat((cur) => (b > cur ? b : cur))
  }, [])

  // the camera is a cinematographer: one authored move per scene
  useEffect(() => {
    if (!map) return
    const cam = scene.camera
    if (!cam.duration) {
      map.jumpTo({ center: cam.center, zoom: cam.zoom, bearing: cam.bearing ?? 0, pitch: cam.pitch ?? 0 })
      return
    }
    map.flyTo({
      center: cam.center,
      zoom: cam.zoom,
      bearing: cam.bearing ?? 0,
      pitch: cam.pitch ?? 0,
      duration: cam.duration,
      essential: true,
    })
  }, [map, index]) // eslint-disable-line react-hooks/exhaustive-deps

  // keyboard fallback for desktop review
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate(index + 1)
      if (e.key === 'ArrowLeft') navigate(index - 1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [index, navigate])

  return (
    <div className="flex h-full items-center justify-center">
      <div className="shell">
        {/* ─── top: the real map canvas ─── */}
        <div className="relative" style={{ flex: '0 0 52%' }}>
          <MapStage onMap={setMap} />
          <MapOverlay map={map} scene={scene} beat={beat} />
          <div className="map-vignette pointer-events-none absolute inset-0" style={{ zIndex: 6 }} />

          {/* scene clock */}
          <div className="absolute left-4 top-3.5 flex items-center gap-2.5" style={{ zIndex: 7 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.clock}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.5 }}
                className="font-mono-ed text-[10px] tracking-[0.25em]"
                style={{ color: 'var(--chalk)' }}
              >
                {scene.clock}
              </motion.div>
            </AnimatePresence>
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
        </div>

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
        />
      </div>
    </div>
  )
}
