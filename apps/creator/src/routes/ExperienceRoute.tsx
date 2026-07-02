// Public spatial scene experience — shared SpatialScenePlayer, no Studio chrome.
import { Link } from 'react-router-dom'
import { ACCESS_FAILURE_STORY, getAccessFailureScene } from '../spatial'
import { SpatialScenePlayer } from '../spatial/player/SpatialScenePlayer'

export function ExperienceRoute() {
  const scene = getAccessFailureScene()

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-night">
      <header className="relative z-40 flex shrink-0 items-center justify-between border-b border-gray-rule bg-night px-4 py-2.5">
        <Link to="/" className="text-xs font-bold text-gray-mid hover:text-signal">
          ← Locatial
        </Link>
        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-signal-pink">Scene 07</div>
          <div className="text-xs font-extrabold text-chalk">Access Failure</div>
        </div>
        <div className="w-16" />
      </header>

      <main className="mx-auto min-h-0 w-full max-w-lg flex-1">
        <SpatialScenePlayer story={ACCESS_FAILURE_STORY} scene={scene} showChrome={false} className="h-full" />
      </main>
    </div>
  )
}
