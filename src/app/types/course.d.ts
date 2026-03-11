export interface Course {
  id: number
  title?: string
  slug: string
  description?: string
  modules?: []
  thumbnail: {
    url: string
    alt: string
  }
}
