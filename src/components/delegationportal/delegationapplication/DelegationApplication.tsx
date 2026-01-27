/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Globe, FileText, UserPlus, Briefcase, Pencil, Trash2 } from 'lucide-react'
import { Sidebar } from './Sidebar'
import DelegateForm from './DelegateForm'
import FacultyForm from './FacultyForm'
import DelegationHeader from './DelegationHeader'
import DelegationSteps from './components/DelegationSteps'
import DelegationFormStep from './components/DelegationFormStep'
import CountryAssignmentsForm from './CountryAssignmentsForm'
import { Delegate, FacultyAdvisor, Delegation } from '@/app/types/types'
import PaymentForm from '../payment/PaymentForm'
import { Button } from '@/components/ui/button'
import Loading from '@/app/(frontend)/loading'

// hooks
import { useAuthGate } from '../hooks/useAuthGate'
import { useFacultyAdvisors } from '../hooks/useFacultyAdvisors'
import { apiFetch } from '@/app/utils/apiFetch'
import { usePaymentAndDelegate } from '../hooks/usePaymentAndDelegate'

const EMPTY_DELEGATION: Delegation = {
  delegationName: '',
  countryOfOrigin: '',
  numberOfDelegates: 1,
  numberOfFacultyAdvisors: 0,
  previousExperience: '',
  hmunExperience: '',
  preferredRegions: '',
  prefersDoubleDelegations: 'no',
  crisisCommitteeRequests: '',
  committeeInterests: 'novice',
  status: 'pending',
  country: '',
  school: '',
  delegates: [],
  facultyAdvisors: [],
}

export default function DelegationPortal() {
  const router = useRouter()

  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('application')

  const [editingAdvisor, setEditingAdvisor] = useState<FacultyAdvisor | null>(null)
  const [showFacultyForm, setShowFacultyForm] = useState(false)

  const [delegation, setDelegation] = useState<Delegation | null>(null)

  const [formData, setFormData] = useState<Delegation>(EMPTY_DELEGATION)
  const maxAdvisors = formData.numberOfFacultyAdvisors

  const [editingDelegate, setEditingDelegate] = useState<Delegate | null>(null)
  const [showDelegateForm, setShowDelegateForm] = useState(false)

  // check payment status

  // hooks
  const { user, checkingAuth, logout: authLogout } = useAuthGate()

  const steps = [
    { title: 'Basic Info', icon: Users },
    { title: 'Experience', icon: FileText },
    { title: 'Preferences', icon: Globe },
  ]

  useEffect(() => {
    if (!checkingAuth && !user) {
      router.replace('/authentication')
    }
  }, [checkingAuth, user, router])

  useEffect(() => {
    if (!user) return

    const fetchDelegation = async () => {
      try {
        const res = await apiFetch('/api/delegation')

        const data = await res.json()

        if (data.delegation) {
          setDelegation(data.delegation)
          setFormData(data.delegation)
        } else {
          setDelegation(null)
          setFormData(EMPTY_DELEGATION)
        }
      } catch (error) {
        console.error('Failed to fetch delegation', error)
      } finally {
        setFetching(false)
      }
    }

    fetchDelegation()
  }, [user])

  // --------------------------
  // FETCH FACULTY ADVISORS
  // --------------------------

  const {
    facultyAdvisors,
    setFacultyAdvisors,
    fetching: fetchingAdvisors,
  } = useFacultyAdvisors(user, delegation)

  const advisorCount = facultyAdvisors.length
  const canAddAdvisor = advisorCount < maxAdvisors
  const loading = fetching || fetchingAdvisors

  // --------------------------
  // FETCH PAYMENT & DELEGATES
  // --------------------------

  const { paymentStatus, delegates, setDelegates, setPaymentStatus } = usePaymentAndDelegate(
    user,
    delegation,
  )
  // --------------------------
  // HANDLERS
  // --------------------------
  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await authLogout()
      router.replace('/authentication')
    } finally {
      setLoggingOut(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (
      !formData.delegationName ||
      !formData.countryOfOrigin ||
      !formData.previousExperience ||
      !formData.hmunExperience
    ) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const method = delegation?.id ? 'PATCH' : 'POST'
      const url = delegation?.id ? `/api/delegation/${delegation.id}` : '/api/delegation'

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to save delegation')
      }

      const data = await res.json()
      setDelegation(data)
      setFormData(data)
      alert('Delegation saved successfully')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (advisorId: string) => {
    try {
      await apiFetch(`/api/faculty-advisors/${advisorId}`, { method: 'DELETE' })
      setFacultyAdvisors((prev) => prev.filter((a) => a.id?.toString() !== advisorId))
    } catch (err) {
      console.error('Failed to delete faculty advisor', err)
    }
  }

  const handleDeleteDelegate = async (delegateId: string) => {
    try {
      await apiFetch(`/api/teacher/delegates/${delegateId}`, { method: 'DELETE' })
      setDelegates((prev) => prev.filter((d) => d.id?.toString() !== delegateId))
    } catch (err) {
      console.error('Failed to delete delegate', err)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  if (checkingAuth || loading) {
    return <Loading />
  }

  if (!user) {
    return null
  }

  // --------------------------
  // LOADING GATE
  // --------------------------
  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#104179] mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your delegation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
        status={formData.status}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-5xl 2xl:max-w-full mx-auto">
          {/* Header */}
          <DelegationHeader
            activeSection={activeSection}
            formData={formData}
            loggingOut={loggingOut}
            onLogout={handleLogout}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          {/* Application Section */}
          {activeSection === 'application' && (
            <>
              {/* Progress Steps */}
              <DelegationSteps steps={steps} currentStep={currentStep} />
              {/* Form Content */}
              <DelegationFormStep
                currentStep={currentStep}
                formData={formData}
                handleChange={handleChange}
                handleSave={handleSave}
                saving={saving}
                stepsLength={steps.length}
                nextStep={nextStep}
                prevStep={prevStep}
              />

              {/* Help Text */}
              <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Need help?</span> All fields marked with{' '}
                  <span className="text-red-500">*</span> are required. You can save your progress
                  at any time and return later to complete your application.
                </p>
              </div>
            </>
          )}

          {/* Delegates Section */}
          {activeSection === 'delegates' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Add Delegates</h3>
                <p className="text-gray-600 mb-6">
                  Register your delegation members here once your application is approved and
                  payment is complete.
                </p>

                {!delegation?.id ? (
                  <p className="text-gray-600">
                    Please complete your delegation application first.
                  </p>
                ) : paymentStatus !== 'paid' ? (
                  <PaymentForm
                    numberOfDelegates={formData.numberOfDelegates}
                    teacherId={user.id}
                    delegationId={delegation.id}
                    onPaymentSuccess={async () => {
                      const res = await apiFetch(`/api/payments?delegationId=${delegation.id}`)
                      const data = await res.json()
                      setPaymentStatus(data.paymentStatus)
                    }}
                  />
                ) : (
                  <>
                    {/* Add Delegate Button */}
                    {!showDelegateForm && delegates.length < formData.numberOfDelegates && (
                      <Button
                        onClick={() => {
                          setEditingDelegate({} as Delegate)
                          setShowDelegateForm(true)
                        }}
                        className="mb-4"
                      >
                        Add Delegate
                      </Button>
                    )}

                    {/* Delegate Form */}
                    {showDelegateForm && (
                      <DelegateForm
                        open={showDelegateForm}
                        delegate={editingDelegate}
                        onClose={() => {
                          setEditingDelegate(null)
                          setShowDelegateForm(false)
                        }}
                        onSaved={(updatedDelegate) => {
                          setDelegates((prev) => {
                            const exists = prev.find((d) => d.id === updatedDelegate.id)
                            if (exists) {
                              return prev.map((d) =>
                                d.id === updatedDelegate.id ? updatedDelegate : d,
                              )
                            }
                            return [...prev, updatedDelegate]
                          })
                          setEditingDelegate(null)
                          setShowDelegateForm(false)
                        }}
                      />
                    )}

                    {/* Registered Delegates List */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Registered Delegates</h3>
                      {delegates.length > 0 ? (
                        <ul className="divide-y">
                          {delegates.map((delegate) => (
                            <li
                              key={delegate.id}
                              className="py-2 flex justify-between items-center"
                            >
                              <div>
                                {delegate.firstName} {delegate.lastName} -{' '}
                                <span className="text-gray-500">{delegate.email}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingDelegate(delegate)
                                    setShowDelegateForm(true)
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteDelegate(delegate.id!.toString())}
                                >
                                  Delete
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">No delegates registered yet.</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Advisors Section */}
          {activeSection === 'advisors' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Faculty Advisors</h3>
                {/* list of faculty advisors  */}
                {facultyAdvisors.length > 0 ? (
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      You have added the following faculty advisors:
                    </p>
                    <ul className="divide-y">
                      {facultyAdvisors.map((advisor) => (
                        <li
                          key={advisor.id}
                          className="flex items-center justify-between px-4 py-3 text-sm"
                        >
                          {/* Left side: info in one line */}
                          <div className="flex items-center gap-6 min-w-0">
                            <span className="font-medium text-lg text-gray-900 whitespace-nowrap">
                              {advisor.firstName} {advisor.lastName}
                            </span>

                            <span className="text-gray-600 text-lg truncate max-w-[220px]">
                              {advisor.email}
                            </span>

                            <span className="text-gray-600 text-lg whitespace-nowrap">
                              {advisor.phoneNumber}
                            </span>
                          </div>

                          {/* Right side: actions */}
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setEditingAdvisor(advisor)
                                setShowFacultyForm(true)
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              aria-label="Edit advisor"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(advisor.id!.toString())}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              aria-label="Delete advisor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-600 mb-6">You have not added any faculty advisors yet.</p>
                )}
                {showFacultyForm && (
                  <FacultyForm
                    advisor={editingAdvisor}
                    onClose={() => {
                      setEditingAdvisor(null)
                      setShowFacultyForm(false)
                    }}
                    open={showFacultyForm}
                    onSaved={(updatedAdvisor) => {
                      setFacultyAdvisors((prev) => {
                        const exists = prev.find((a) => a.id === updatedAdvisor.id)

                        if (exists) {
                          // EDIT
                          return prev.map((a) => (a.id === updatedAdvisor.id ? updatedAdvisor : a))
                        }

                        // CREATE
                        return [...prev, updatedAdvisor]
                      })

                      setEditingAdvisor(null)
                      setShowFacultyForm(false)
                    }}
                  />
                )}

                {!showFacultyForm && canAddAdvisor && (
                  <button
                    onClick={() => {
                      setEditingAdvisor(null)
                      setShowFacultyForm(true)
                    }}
                    className="mt-4 px-4 py-2 bg-[#104179] text-white rounded-lg"
                  >
                    Add Faculty Advisor
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Assignments Section */}
          {activeSection === 'assignments' && (
            <CountryAssignmentsForm delegationId={Number(delegation?.id)} />
          )}
        </div>
      </div>
    </div>
  )
}
