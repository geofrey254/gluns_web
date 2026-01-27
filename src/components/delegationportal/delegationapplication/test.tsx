/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  LogOut,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Globe,
  UserPlus,
  Briefcase,
  Menu,
  Pencil,
  Trash2,
  Save,
} from 'lucide-react'

import { Sidebar } from './Sidebar'
import DelegateForm from './DelegateForm'
import FacultyForm from './FacultyForm'
import PaymentForm from '../payment/PaymentForm'
import { Button } from '@/components/ui/button'
import Loading from '@/app/(frontend)/loading'

import { useAuthGate } from '../hooks/useAuthGate'
import { useFacultyAdvisors } from '../hooks/useFacultyAdvisors'
import { usePaymentAndDelegate } from '../hooks/usePaymentAndDelegate'
import { apiFetch } from '@/app/utils/apiFetch'

import { Delegate, FacultyAdvisor } from '@/app/types/types'

type Delegation = {
  id?: string
  delegationName: string
  countryOfOrigin: string
  numberOfDelegates: number
  numberOfFacultyAdvisors: number
  previousExperience: string
  hmunExperience: string
  preferredRegions?: string
  prefersDoubleDelegations: 'yes' | 'no'
  crisisCommitteeRequests?: string
  committeeInterests: string
  status: string
}

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
}

// --------------------
// Header Component
// --------------------
function DelegationHeader({
  activeSection,
  formData,
  loggingOut,
  onLogout,
  onOpenSidebar,
}: {
  activeSection: string
  formData: Delegation
  loggingOut: boolean
  onLogout: () => void
  onOpenSidebar: () => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {activeSection === 'application' && 'Delegation Portal'}
              {activeSection === 'delegates' && 'Add Delegates'}
              {activeSection === 'advisors' && 'Faculty Advisors'}
              {activeSection === 'assignments' && 'Country Assignments'}
            </h1>
            <p className="text-gray-600">
              {activeSection === 'application' && 'Complete your delegation application'}
              {activeSection === 'delegates' && 'Register your delegation members'}
              {activeSection === 'advisors' && 'Add faculty advisor information'}
              {activeSection === 'assignments' && 'View your country assignments'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            {formData.status === 'pending' ? (
              <Clock className="w-4 h-4 text-yellow-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
            <span className="text-sm font-medium capitalize">{formData.status}</span>
          </div>
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// --------------------
// Steps Component
// --------------------
function DelegationSteps({
  steps,
  currentStep,
}: {
  steps: { title: string; icon: React.ComponentType<any> }[]
  currentStep: number
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === index
          const isCompleted = currentStep > index
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isActive
                      ? 'bg-[#104179] text-white shadow-lg scale-110'
                      : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium text-center ${
                    isActive ? 'text-[#104179]' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 mb-8">
                  <div
                    className={`h-full rounded transition-colors ${
                      currentStep > index ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

// --------------------
// Form Steps Component
// --------------------
function DelegationFormStep({
  currentStep,
  formData,
  handleChange,
  nextStep,
  prevStep,
  handleSave,
  saving,
  stepsLength,
}: {
  currentStep: number
  formData: Delegation
  handleChange: (e: React.ChangeEvent<any>) => void
  nextStep: () => void
  prevStep: () => void
  handleSave: () => void
  saving: boolean
  stepsLength: number
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      {currentStep === 0 && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delegation Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Delegation Name <span className="text-red-500">*</span>
              </label>
              <input
                name="delegationName"
                value={formData.delegationName}
                onChange={handleChange}
                placeholder="Enter your delegation name"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Country of Origin */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country of Origin <span className="text-red-500">*</span>
              </label>
              <input
                name="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={handleChange}
                placeholder="Enter your country"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Number of Delegates */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Delegates <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="numberOfDelegates"
                value={formData.numberOfDelegates}
                onChange={handleChange}
                min={1}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Number of Faculty Advisors */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Faculty Advisors <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="numberOfFacultyAdvisors"
                value={formData.numberOfFacultyAdvisors}
                onChange={handleChange}
                min={0}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>
          </div>
        </div>
      )}

      {/* TODO: Steps 1 & 2: Experience & Preferences */}
      {/* You can similarly modularize them as DelegationExperienceStep, DelegationPreferencesStep */}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
        <div className="flex gap-3 flex-1">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Previous
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {currentStep < stepsLength - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#104179] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#104179] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Delegation'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// --------------------
// Main DelegationPortal
// --------------------
export default function DelegationPortal() {
  const router = useRouter()
  const { user, checkingAuth, logout: authLogout } = useAuthGate()

  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('application')

  const [delegation, setDelegation] = useState<Delegation | null>(null)
  const [formData, setFormData] = useState<Delegation>(EMPTY_DELEGATION)

  // --------------------------
  // Fetch Delegation
  // --------------------------
  useEffect(() => {
    if (!user) return
    const fetchDelegation = async () => {
      try {
        const res = await apiFetch('/api/delegation')
        const data = await res.json()
        if (data.delegation) {
          setDelegation(data.delegation)
          setFormData(data.delegation)
        }
      } catch (err) {
        console.error('Failed to fetch delegation', err)
      } finally {
        setFetching(false)
      }
    }
    fetchDelegation()
  }, [user])

  // --------------------------
  // Logout Handler
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

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSave = async () => {
    if (!formData.delegationName || !formData.countryOfOrigin) {
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

  if (checkingAuth || fetching || !user) return <Loading />

  const steps = [
    { title: 'Basic Info', icon: Users },
    { title: 'Experience', icon: FileText },
    { title: 'Preferences', icon: Globe },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex">
      <Sidebar
        status={formData.status}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-5xl 2xl:max-w-full mx-auto">
          <DelegationHeader
            activeSection={activeSection}
            formData={formData}
            loggingOut={loggingOut}
            onLogout={handleLogout}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          {activeSection === 'application' && (
            <>
              <DelegationSteps steps={steps} currentStep={currentStep} />
              <DelegationFormStep
                currentStep={currentStep}
                formData={formData}
                handleChange={handleChange}
                nextStep={() => setCurrentStep((s) => s + 1)}
                prevStep={() => setCurrentStep((s) => s - 1)}
                handleSave={handleSave}
                saving={saving}
                stepsLength={steps.length}
              />
            </>
          )}

          {/* TODO: DelegatesSection, AdvisorsSection, AssignmentsSection */}
        </div>
      </div>
    </div>
  )
}
