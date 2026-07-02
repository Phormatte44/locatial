import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { DirectorShell } from '../director/DirectorShell'

// MapLibre needs WebGL; stub map stage so we can verify Director shell mounts.
vi.mock('../director/DirectorMapStage', () => ({
  DirectorMapStage: () => <div data-testid="map-stage-stub">Map stage</div>,
}))

describe('DirectorShell', () => {
  it('renders toolbar and timeline without crashing', () => {
    render(
      <MemoryRouter>
        <DirectorShell />
      </MemoryRouter>,
    )
    expect(screen.getByText('Director')).toBeInTheDocument()
    expect(screen.getByText('Beat Timeline')).toBeInTheDocument()
    expect(screen.getByText('Scene 07')).toBeInTheDocument()
  })
})
