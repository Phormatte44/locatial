// Image upload. Supabase Storage when configured; data-URL fallback for local dev so the
// image actually persists in the localStorage bundle and renders in preview/reader.
import { getSupabase, IMAGE_BUCKET } from '../lib/supabase'

export interface MediaRepository {
  /** Upload an image for a chapter; returns a URL usable as <img src>. */
  uploadChapterImage(storyId: string, chapterId: string, file: File): Promise<string>
}

class SupabaseMediaRepository implements MediaRepository {
  async uploadChapterImage(storyId: string, chapterId: string, file: File): Promise<string> {
    const db = getSupabase()
    if (!db) throw new Error('Supabase not configured')
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${storyId}/${chapterId}-${Date.now()}.${ext}`
    const { error } = await db.storage.from(IMAGE_BUCKET).upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
    })
    if (error) throw new Error(`Image upload failed: ${error.message}`)
    const { data } = db.storage.from(IMAGE_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }
}

class LocalMediaRepository implements MediaRepository {
  async uploadChapterImage(_storyId: string, _chapterId: string, file: File): Promise<string> {
    return await fileToDataUrl(file)
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('read failed'))
    reader.readAsDataURL(file)
  })
}

let instance: MediaRepository | null = null
export function getMediaRepository(): MediaRepository {
  if (instance) return instance
  instance = getSupabase() ? new SupabaseMediaRepository() : new LocalMediaRepository()
  return instance
}
