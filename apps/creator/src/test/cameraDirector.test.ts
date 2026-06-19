import { describe, expect, it } from 'vitest'
import { directCamera, haversineMeters } from '../domain/cameraDirector'

const here = { longitude: -0.1278, latitude: 51.5074 }

describe('cameraDirector', () => {
  it('measures distance roughly', () => {
    // ~1.11 km per 0.01° latitude
    const d = haversineMeters([0, 0], [0, 0.01])
    expect(d).toBeGreaterThan(1000)
    expect(d).toBeLessThan(1200)
  })

  it('returns null without a target location', () => {
    expect(directCamera({ to: { longitude: null, latitude: null, camera: null } })).toBeNull()
  })

  it('jumps instantly under reduced motion', () => {
    const m = directCamera({ to: { ...here, camera: null }, reducedMotion: true })
    expect(m?.mode).toBe('jump-to')
    expect(m?.duration).toBe(0)
  })

  it('uses a restrained ease for nearby places', () => {
    const to = { longitude: here.longitude + 0.002, latitude: here.latitude, camera: null }
    const m = directCamera({ to, from: here })
    expect(m?.mode).toBe('ease-to')
    expect(m?.zoom).toBe(16)
  })

  it('uses a broad flyTo for distant places', () => {
    const to = { longitude: here.longitude + 0.2, latitude: here.latitude + 0.2, camera: null }
    const m = directCamera({ to, from: here })
    expect(m?.mode).toBe('fly-to')
    expect(m!.zoom).toBeLessThan(15)
  })

  it('honours explicit camera intent', () => {
    const m = directCamera({ to: { ...here, camera: { zoom: 18, pitch: 30, bearing: 90 } }, from: here })
    expect(m?.zoom).toBe(18)
    expect(m?.pitch).toBe(30)
    expect(m?.bearing).toBe(90)
  })
})
