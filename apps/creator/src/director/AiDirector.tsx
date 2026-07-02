import { useState } from 'react'
import { useDirector } from './directorStore'

export function AiDirector() {
  const d = useDirector()
  const [prompt, setPrompt] = useState('Show that the bridge is open but unreachable.')

  if (!d.showAi) return null

  return (
    <div className="absolute right-3 top-14 z-40 w-80 rounded-xl border border-gray-rule bg-night/95 p-4 shadow-2xl backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-extrabold text-chalk">AI Director</span>
        <button type="button" onClick={() => d.setShowAi(false)} className="text-gray-mid hover:text-chalk">
          ✕
        </button>
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="mb-3 w-full rounded-lg border border-gray-rule bg-surface1 px-2 py-1.5 text-xs text-chalk"
      />
      <div className="mb-3 rounded-lg bg-surface1 p-2 text-[11px] text-gray-lo">
        <div className="font-bold text-chalk">Proposed: Access Failure</div>
        <ul className="mt-1 list-inside list-disc">
          <li>Bridge, Route, Blocked Road, Flood Glow</li>
          <li>Traffic Flow, Alternate Route, Final Label</li>
          <li>4 beats: Setup → Route → Failure → Consequence</li>
        </ul>
      </div>
      <button
        type="button"
        onClick={() => {
          d.applyAiDirectorDraft()
          d.setShowAi(false)
        }}
        className="w-full rounded-lg bg-signal-pink py-2 text-xs font-bold text-white hover:brightness-110"
      >
        Apply to Stage
      </button>
    </div>
  )
}
