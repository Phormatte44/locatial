import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'

export function RouteErrorPage() {
  const error = useRouteError()
  let title = 'Something went wrong'
  let detail = 'Try refreshing the page.'

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? 'Page not found' : `Error ${error.status}`
    detail = error.statusText || detail
  } else if (error instanceof Error) {
    detail = error.message
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-night px-6 text-center text-chalk">
      <div className="text-xl font-extrabold">{title}</div>
      <p className="max-w-md text-sm text-gray-mid">{detail}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/" className="rounded-lg border border-gray-rule px-4 py-2 text-sm font-bold hover:border-signal">
          Home
        </Link>
        <Link to="/scene" className="rounded-lg bg-signal px-4 py-2 text-sm font-bold text-white">
          Spatial Scene
        </Link>
        <Link to="/director" className="rounded-lg border border-signal-pink px-4 py-2 text-sm font-bold text-signal-pink">
          Director
        </Link>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-night px-6 text-center text-chalk">
      <div className="text-xl font-extrabold">Page not found</div>
      <p className="max-w-md text-sm text-gray-mid">
        This route is not in the current deployment yet. If you just pushed new code, redeploy on Vercel from{' '}
        <code className="text-signal">main</code> (Root Directory: <code className="text-signal">apps/creator</code>
        ).
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/" className="rounded-lg border border-gray-rule px-4 py-2 text-sm font-bold hover:border-signal">
          Home
        </Link>
        <Link to="/studio" className="rounded-lg bg-signal px-4 py-2 text-sm font-bold text-white">
          Creator Studio
        </Link>
      </div>
    </div>
  )
}
