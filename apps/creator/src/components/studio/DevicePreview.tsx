// DevicePreview — renders the REAL StoryReader inside a representative viewport frame.
import type { StoryBundle } from '../../domain/types'
import { StoryReader } from '../reader/StoryReader'

export type Device = 'desktop' | 'tablet' | 'mobile'

const SIZES: Record<Device, { w: number; h: number; label: string }> = {
  desktop: { w: 1024, h: 680, label: 'Desktop' },
  tablet: { w: 768, h: 1024, label: 'Tablet' },
  mobile: { w: 390, h: 780, label: 'Mobile' },
}

export function DevicePreview({ device, bundle }: { device: Device; bundle: StoryBundle }) {
  const size = SIZES[device]
  return (
    <div className="flex flex-col items-center" data-testid={`device-preview-${device}`}>
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-mid">
        {size.label} · {size.w}×{size.h}
      </div>
      <div
        className="overflow-hidden rounded-2xl border-2 border-gray-rule bg-night shadow-2xl"
        style={{ width: size.w, height: size.h, maxWidth: '92vw' }}
      >
        {/* key forces a fresh map instance per device so sizing is correct */}
        <StoryReader key={device} bundle={bundle} />
      </div>
    </div>
  )
}
