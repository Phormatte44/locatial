import { TopToolbar } from './TopToolbar'
import { SceneRail } from './SceneRail'
import { PrimitiveLibrary } from './PrimitiveLibrary'
import { DirectorMapStage } from './DirectorMapStage'
import { BeatTimeline } from './BeatTimeline'
import { Inspector } from './Inspector'
import { AiDirector } from './AiDirector'
import { JsonExportDrawer } from './JsonExportDrawer'
import { PreviewMode } from './PreviewMode'
import { DirectorProvider, useDirector } from './directorStore'
import { ErrorBoundary } from '../components/ErrorBoundary'

function DirectorLayout() {
  const d = useDirector()
  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-root text-chalk">
      <TopToolbar />
      <div className="flex min-h-0 flex-1">
        <div className="flex w-56 shrink-0 flex-col border-r border-gray-rule bg-surface1">
          <SceneRail />
          <PrimitiveLibrary />
        </div>
        <div className="relative flex min-w-0 flex-1 flex-col">
          {d.mode === 'author' ? (
            <ErrorBoundary label="Map stage">
              <DirectorMapStage />
            </ErrorBoundary>
          ) : (
            <div className="flex flex-1 items-center justify-center bg-[#0a0a0b] text-sm text-gray-mid">
              Preview open — close preview to edit map
            </div>
          )}
          <AiDirector />
        </div>
        <Inspector />
      </div>
      <BeatTimeline />
      <PreviewMode />
      <JsonExportDrawer />
    </div>
  )
}

export function DirectorShell() {
  return (
    <DirectorProvider>
      <DirectorLayout />
    </DirectorProvider>
  )
}
