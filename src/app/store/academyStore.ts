import { create } from 'zustand'
import { logoutAction } from '../api/logout/logout'

interface User {
  id: string
  email: string
  fullName: string
  username: string
  enrolledCourses?: any[]
  currentCourse?: any
  currentModule?: any
}

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useAcademyStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  checkAuth: async () => {
    try {
      const res = await fetch(`/api/academy/me`, {
        credentials: 'include',
      })

      if (!res.ok) {
        set({ user: null, loading: false })
        return
      }

      const data = await res.json()
      set({ user: data.user, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },

  logout: async () => {
    try {
      const res = await fetch('/api/academy/student-logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Logout failed')

      set({ user: null })
    } catch (err) {
      console.error('Logout error:', err)
      set({ user: null })
    }
  },
}))
