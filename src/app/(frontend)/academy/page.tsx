import AcademyAuthGate from '@/components/academy/auth/AuthGate'

export const metadata = {
  title: 'GLUNS Academy',
  description: 'Access your learning materials and courses',
}

export default function AcademyPage() {
  return <AcademyAuthGate />
}
