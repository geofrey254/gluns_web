import { useEffect, useState } from 'react'
import { useAcademyStore } from '@/app/store/academyStore'

export function useAcademyGate() {
  const { user, logout, setUser } = useAcademyStore()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    let mounted = true

    const hydrate = async () => {
      try {
        const res = await fetch('/api/academy/me', { cache: 'no-store' })

        if (!res.ok) {
          if (mounted) setUser(null)
          return
        }

        const data = await res.json()
        if (mounted) setUser(data.user)
      } finally {
        if (mounted) setCheckingAuth(false)
      }
    }

    hydrate()

    return () => {
      mounted = false
    }
  }, [setUser])

  return {
    user,
    checkingAuth,
    logout,
  }
}
