import { createBrowserRouter, Navigate, useParams } from 'react-router-dom'
import { StoryListRoute } from './StoryListRoute'
import { StoryEditor } from '../components/studio/StoryEditor'
import { PreviewWorkspace } from '../components/studio/PreviewWorkspace'
import { ReaderRoute } from './ReaderRoute'
import { ExploreRoute } from './ExploreRoute'
import { ExperienceRoute } from './ExperienceRoute'
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
  // Public citizen surfaces — no login. Home is the browse experience.
  { path: '/', element: <ExploreRoute /> },
  { path: '/story/:slug', element: <ReaderRoute /> },
  { path: '/experience/access-failure', element: <ExperienceRoute /> },
  { path: '/explore', element: <Navigate to="/" replace /> },
  // Creator Studio (create/edit) requires sign-in, under /studio.
  { path: '/studio', element: <RequireAuth><StoryListRoute /></RequireAuth> },
  { path: '/studio/:storyId', element: <RequireAuth><StudioRoute /></RequireAuth> },
  { path: '/studio/:storyId/preview', element: <RequireAuth><PreviewRoute /></RequireAuth> },
])
