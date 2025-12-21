'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/store/authStore'

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

export default function DelegationPortal() {
  const router = useRouter()
  const { user, logout, setUser } = useAuthStore()

  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const [delegation, setDelegation] = useState<Delegation | null>(null)
  const [formData, setFormData] = useState<Delegation>(EMPTY_DELEGATION)

  /**
   * Hard auth guard
   */
  useEffect(() => {
    if (!fetching && !user) {
      router.replace('/signup')
    }
  }, [user, fetching, router])

  /**
   * Fetch delegation for authenticated user
   */
  useEffect(() => {
    if (!user) {
      setFetching(false)
      return
    }

    const fetchDelegation = async () => {
      try {
        const res = await fetch('/api/delegation')

        if (res.status === 401) {
          setUser(null)
          return
        }

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
  }, [user, setUser])

  /**
   * Logout
   */
  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      setDelegation(null)
      setFormData(EMPTY_DELEGATION)
      router.replace('/signup')
    } finally {
      setLoggingOut(false)
    }
  }

  /**
   * Form handlers
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const method = delegation?.id ? 'PATCH' : 'POST'
      const url = delegation?.id ? `/api/delegation/${delegation.id}` : '/api/delegation'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.status === 401) {
        setUser(null)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save delegation')
      }

      setDelegation(data)
      setFormData(data)
      alert('Delegation saved successfully')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  /**
   * Render
   */
  if (fetching) {
    return <p>Loading your delegation...</p>
  }

  if (!user) {
    return null
  }

  return (
    <section className="h-[80vh] md:min-h-[140vh] bg-linear-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Delegation Portal</h2>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Delegation Name
            <input
              name="delegationName"
              value={formData.delegationName}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </label>

          <label>
            Country of Origin
            <input
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </label>

          <label>
            Number of Delegates
            <input
              type="number"
              name="numberOfDelegates"
              value={formData.numberOfDelegates}
              onChange={handleChange}
              min={1}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </label>

          <label>
            Number of Faculty Advisors
            <input
              type="number"
              name="numberOfFacultyAdvisors"
              value={formData.numberOfFacultyAdvisors}
              onChange={handleChange}
              min={0}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </label>

          <label>
            Previous Experience
            <textarea
              name="previousExperience"
              value={formData.previousExperience}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </label>

          <label>
            HMUN Experience
            <input
              name="hmunExperience"
              value={formData.hmunExperience}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </label>

          <label>
            Preferred Regions
            <input
              name="preferredRegions"
              value={formData.preferredRegions}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </label>

          <label>
            Prefers Double Delegations
            <select
              name="prefersDoubleDelegations"
              value={formData.prefersDoubleDelegations}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>

          <label>
            Crisis Committee Requests
            <textarea
              name="crisisCommitteeRequests"
              value={formData.crisisCommitteeRequests}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </label>

          <label>
            Committee Interests
            <select
              name="committeeInterests"
              value={formData.committeeInterests}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="advanced">Advanced Committees</option>
              <option value="press">Press Corps</option>
              <option value="novice">Novice Committees</option>
              <option value="spanish">Bilingual Spanish</option>
            </select>
          </label>

          <label>
            Status
            <input
              name="status"
              value={formData.status}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mt-2"
          >
            {saving ? 'Saving...' : 'Save Delegation'}
          </button>
        </form>
      </div>
    </section>
  )
}
