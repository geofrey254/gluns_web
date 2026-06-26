interface Event {
  id: string
  title: string
  slug: string
  subtitle?: string
  banner?: string
  description: string
  location: string
  date: string
  cost?: number
  currency?: string
}

export type { Event }
