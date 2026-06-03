export type GuideMedia =
  | number
  | {
      id: number | string
      url?: string | null
      filename?: string | null
      mimeType?: string | null
      filesize?: number | null
      alt?: string | null
    }

export type GuideRecord = {
  id: number | string
  title: string
  slug: string
  description?: string | null
  coverImage?: GuideMedia | null
  guideFile: GuideMedia
  passwordHash?: string | null
  published?: boolean | null
  createdAt: string
  updatedAt?: string
}
