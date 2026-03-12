import { C } from 'vitest/dist/chunks/environment.d.cL3nLXbE.js'

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

export interface Lesson {
  id: number
  title: string
  module: {
    id: number
    title: string
  }
  objective?: string
  orderIndex?: number
  duration?: string
  sections?: []
  passingScore?: number
  isPreviewable?: boolean
  requiredToComplete?: boolean
  isPublished?: boolean
}

export interface Enrollment {
  id: number
  studentId: string
  course: Course
  currentLesson?: Lesson
}
