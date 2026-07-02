import { TopToolbar } from './TopToolbar'
import { SceneRail } from './SceneRail'
import { PrimitiveLibrary } from './PrimitiveLibrary'
import { DirectorMapStage } from './DirectorMapStage'
import { BeatTimeline } from './BeatTimeline'
import { Inspector } from './Inspector'
import { AiDirector } from './AiDirector'
import { JsonExportDrawer } from './JsonExportDrawer'
import { PreviewMode } from './PreviewMode'
import { DirectorProvider } from './directorStore'

export function DirectorShell() {
  return (
    <DirectorProvider>
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-root text-chalk">
        <TopToolbar />
        <div className="flex min-h-0 flex-1">
          <div className="flex w-56 shrink-0 flex-col border-r border-gray-rule bg-surface1">
            <SceneRail />
            <PrimitiveLibrary />
          </div>
          <div className="relative flex min-w-0 flex-1 flex-col">
            <DirectorMapStage />
            <AiDirector />
          </div>
          <Inspector />
        </div>
        <BeatTimeline />
        <PreviewMode />
        <JsonExportDrawer />
      </div>
    </DirectorProvider>
  )
}
