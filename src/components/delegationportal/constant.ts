import { FileText, Globe, Users } from 'lucide-react'

export const EMPTY_DELEGATION = {
  name: '',
  country: '',
  numberOfDelegates: 0,
  numberOfAdvisors: 0,
  committeePreferences: [],
  specialRequests: '',
}

export type Delegation = {
  id?: string
  name: string
  country: string
  numberOfDelegates: number
  numberOfAdvisors: number
  committeePreferences: string[]
  specialRequests: string
}

export const STEPS = [
  { title: 'Basic Info', icon: Users },
  { title: 'Experience', icon: FileText },
  { title: 'Preferences', icon: Globe },
]
