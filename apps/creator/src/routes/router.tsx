import { createBrowserRouter, Navigate, useParams } from 'react-router-dom'
import { StoryListRoute } from './StoryListRoute'
import { StoryEditor } from '../components/studio/StoryEditor'
import { PreviewWorkspace } from '../components/studio/PreviewWorkspace'
import { ReaderRoute } from './ReaderRoute'
import { ExploreRoute } from './ExploreRoute'
import { ExperienceRoute } from './ExperienceRoute'
import { DirectorRoute } from './DirectorRoute'
import { NotFoundPage, RouteErrorPage } from './ErrorPages'
import { RequireAuth } from '../components/auth/RequireAuth'

function StudioRoute() {
  const { storyId } = useParams<{ storyId: string }>()
  return <StoryEditor storyId={storyId!} />
}

function PreviewRoute() {
  const { storyId } = useParams<{ storyId: string }>()
  return <PreviewWorkspace storyId={storyId!} />
}

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      { path: '/', element: <ExploreRoute /> },
      { path: '/story/:slug', element: <ReaderRoute /> },
      { path: '/experience/access-failure', element: <ExperienceRoute /> },
      { path: '/scene', element: <ExperienceRoute /> },
      { path: '/director', element: <DirectorRoute /> },
      { path: '/explore', element: <Navigate to="/" replace /> },
      { path: '/studio', element: <RequireAuth><StoryListRoute /></RequireAuth> },
      { path: '/studio/:storyId', element: <RequireAuth><StudioRoute /></RequireAuth> },
      { path: '/studio/:storyId/preview', element: <RequireAuth><PreviewRoute /></RequireAuth> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
