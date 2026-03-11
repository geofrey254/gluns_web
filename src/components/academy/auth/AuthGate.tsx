'use client'

import AcademyDashboard from '../dashboard/AcademyDashboard'
import AcademyLandingPage from '../AcademyLandingPage'
import { useAuthGate } from '@/components/delegationportal/hooks/useAuthGate'

function KidsLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-8 px-4">
      {/* Chunky UN-style text */}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xl text-[#104179] tracking-wide">Verifying your delegate pass...</p>
      </div>

      {/* Pulsing progress blocks */}
      <div className="flex gap-3 items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`rounded border border-black animate-bounce ${
              i % 2 === 0 ? 'w-12 h-12 bg-[#85c226]' : 'w-8 h-16 bg-[#104179]'
            }`}
            style={{ animationDelay: `${i * 110}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function AcademyAuthGate() {
  const { user, checkingAuth } = useAuthGate()

  if (checkingAuth) {
    return <KidsLoader />
  }

  if (!user) {
    return <AcademyLandingPage />
  }

  return <AcademyDashboard />
}
