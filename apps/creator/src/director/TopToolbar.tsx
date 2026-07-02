import { Link } from 'react-router-dom'
import { useDirector } from './directorStore'

export function TopToolbar() {
  const d = useDirector()

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-gray-rule bg-root px-4 py-2">
      <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-mid hover:text-signal">
        Locatial
      </Link>
      <span className="text-gray-rule">/</span>
      <span className="text-xs font-extrabold text-chalk">Director</span>
      <span className="hidden text-xs text-gray-mid sm:inline">· {d.story.title}</span>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-gray-rule text-[11px] font-bold">
          <button
            type="button"
            onClick={() => d.setMode('author')}
            className={`px-3 py-1.5 ${d.mode === 'author' ? 'bg-surface2 text-chalk' : 'text-gray-mid hover:text-chalk'}`}
          >
            Author
          </button>
          <button
            type="button"
            onClick={() => d.setMode('preview')}
            className={`px-3 py-1.5 ${d.mode === 'preview' ? 'bg-surface2 text-chalk' : 'text-gray-mid hover:text-chalk'}`}
          >
            Preview
          </button>
        </div>

        <button
          type="button"
          onClick={() => d.setShowAi(true)}
          className="hidden rounded-lg border border-gray-rule px-3 py-1.5 text-[11px] font-bold text-gray-mid hover:border-signal hover:text-chalk sm:block"
        >
          AI Director
        </button>

        <button
          type="button"
          onClick={() => d.setShowJson(true)}
          className="rounded-lg bg-signal px-3 py-1.5 text-[11px] font-bold text-white hover:brightness-110"
        >
          Export JSON
        </button>
      </div>
    </header>
  )
}
