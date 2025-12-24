export interface Delegate {
  id?: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  paymentStatus: 'paid' | 'unpaid'
}

export interface FacultyAdvisor {
  id?: number
  teacher?: string
  delegation?: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export interface Delegation {
  id?: number
  country: string
  school: string
  delegates: Delegate[]
  facultyAdvisors: FacultyAdvisor[]
}
