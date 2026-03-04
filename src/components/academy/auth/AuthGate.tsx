'use client'

import AcademyDashboard from '../dashboard/AcademyDashboard'
import AcademyLandingPage from '../AcademyLandingPage'
import { useAcademyGate } from '../hooks/useAuthAcademy'

export default function AcademyAuthGate() {
  const { user, checkingAuth } = useAcademyGate()

  if (checkingAuth) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return <AcademyLandingPage />
  }

  return <AcademyDashboard student={user} />
}
