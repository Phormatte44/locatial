// Public spatial scene experience — shared SpatialScenePlayer, no Studio chrome.
import { Link } from 'react-router-dom'
import { ACCESS_FAILURE_STORY, getAccessFailureScene } from '../spatial'
import { SpatialScenePlayer } from '../spatial/player/SpatialScenePlayer'

export function ExperienceRoute() {
  const scene = getAccessFailureScene()

  return (
    <div className="relative mx-auto h-screen max-w-lg bg-night">
      <Link
        to="/"
        className="absolute left-1/2 top-2 z-30 -translate-x-1/2 rounded-full border border-gray-rule bg-night/90 px-3 py-1 text-[11px] font-bold text-chalk shadow-lg backdrop-blur hover:border-signal"
      >
        ☰ Locatial
      </Link>
      <SpatialScenePlayer story={ACCESS_FAILURE_STORY} scene={scene} />
    </div>
  )
}
