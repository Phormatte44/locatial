import { useDirector } from './directorStore'

export function JsonExportDrawer() {
  const d = useDirector()
  if (!d.showJson) return null

  const json = JSON.stringify(d.story, null, 2)

  const copy = async () => {
    await navigator.clipboard.writeText(json)
  }

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${d.story.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-gray-rule bg-surface1 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-rule px-4 py-3">
          <span className="text-sm font-extrabold text-chalk">Export SpatialStory JSON</span>
          <button type="button" onClick={() => d.setShowJson(false)} className="text-gray-mid hover:text-chalk">
            ✕
          </button>
        </div>
        <pre className="flex-1 overflow-auto p-4 text-[11px] leading-relaxed text-gray-lo">{json}</pre>
        <div className="flex gap-2 border-t border-gray-rule p-3">
          <button
            type="button"
            onClick={copy}
            className="flex-1 rounded-lg border border-gray-rule py-2 text-xs font-bold text-chalk hover:border-signal"
          >
            Copy JSON
          </button>
          <button
            type="button"
            onClick={download}
            className="flex-1 rounded-lg bg-signal py-2 text-xs font-bold text-white hover:brightness-110"
          >
            Download JSON
          </button>
          <a
            href="/scene"
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-lg border border-gray-rule py-2 text-center text-xs font-bold text-chalk hover:border-signal-pink"
          >
            Open public player
          </a>
        </div>
      </div>
    </div>
  )
}
