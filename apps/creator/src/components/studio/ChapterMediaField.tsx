// ChapterMediaField — one image per chapter. Uploads via mediaRepository then stores URL.
import { useRef, useState } from 'react'
import { Button } from '../ui/primitives'

export function ChapterMediaField({
  imageUrl,
  onUpload,
}: {
  imageUrl: string | null
  onUpload: (file: File) => Promise<void>
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handle = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setErr(null)
    try {
      await onUpload(file)
    } catch (e) {
      setErr(String((e as Error)?.message ?? e))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div data-testid="chapter-media">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="mb-2 aspect-[4/3] w-full rounded-lg object-cover" />
      ) : (
        <div className="mb-2 flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dashed border-gray-rule text-xs text-gray-hi">
          No image
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
      <Button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? 'Uploading…' : imageUrl ? 'Replace image' : 'Upload image'}
      </Button>
      {err && <div className="mt-1 text-xs text-red-400">{err}</div>}
    </div>
  )
}
