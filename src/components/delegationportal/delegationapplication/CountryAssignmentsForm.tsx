'use client'

import React, { useEffect, useState } from 'react'
import { Globe, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Loading from '@/app/(frontend)/loading'
import AssignmentFormModal from './AssignmentForm'
import { apiFetch } from '@/app/utils/apiFetch'
import { CommitteeAssignment } from '@/app/types/types'
import Link from 'next/link'

interface Props {
  delegationId: number
}

export default function CountryAssignmentsForm({ delegationId }: Props) {
  const [assignments, setAssignments] = useState<CommitteeAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAssignment, setEditingAssignment] = useState<CommitteeAssignment | null>(null)

  const fetchAssignments = async () => {
    setLoading(true)
    try {
      const res = await apiFetch(`/api/comm/committee-assignments?delegationId=${delegationId}`)
      if (!res.ok) throw new Error('Failed to fetch assignments')
      const data = await res.json()
      setAssignments(data.assignments)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delegationId])
  console.log('Assignments:', assignments)

  const handleSaved = (updated: CommitteeAssignment) => {
    setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    setEditingAssignment(null)
  }

  if (loading) return <Loading />

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      {/* Header */}
      <div className="text-center py-8">
        <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Country Assignments</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Click <strong>Edit</strong> to upload or replace a position paper. Ad-Hoc Committees do
          not require papers. Double delegations should submit one paper for both delegates.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto border rounded-lg">
          <table className="min-w-full border-collapse border border-gray-400">
            <thead className="bg-[#104179] sticky top-0 z-10">
              <tr className="text-left text-sm font-semibold text-white">
                <th className="px-4 py-3 border border-gray-300">Committee</th>

                <th className="px-4 py-3 border border-gray-300">Delegate 1</th>
                <th className="px-4 py-3 border border-gray-300">Delegate 2</th>
                <th className="px-4 py-3 border border-gray-300">Double Delegation?</th>
                <th className="px-4 py-3 border border-gray-300">Country</th>
                <th className="px-4 py-3 border border-gray-300">Position Paper</th>
                <th className="px-4 py-3 border border-gray-300">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {assignments.length ? (
                assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700 border border-gray-300">
                      {a.committee.title}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 border border-gray-300">
                      {a.delegates[0]
                        ? `${a.delegates[0].firstName} ${a.delegates[0].lastName}`
                        : ''}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900 border border-gray-300">
                      {a.delegates[1]
                        ? `${a.delegates[1].firstName} ${a.delegates[1].lastName}`
                        : ''}
                    </td>

                    {a.seatType === 'single' ? (
                      <td className="px-4 py-3 text-gray-700 border border-gray-300">No</td>
                    ) : (
                      <td className="px-4 py-3 text-gray-700 border border-gray-300">Yes</td>
                    )}

                    <td className="px-4 py-3 text-gray-700 border border-gray-300">
                      {a.country.name}
                    </td>

                    {a.positionPaper?.url ? (
                      <Link
                        href={a.positionPaper.url}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        View
                      </Link>
                    ) : (
                      <span className="text-gray-500 flex justify-center items-center p-3">
                        Not Uploaded
                      </span>
                    )}

                    <td className="px-4 py-3 border border-gray-300">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAssignment(a)}
                        className="inline-flex items-center gap-1"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-600">
                    No committee assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {editingAssignment && (
        <AssignmentFormModal
          assignment={editingAssignment}
          onClose={() => setEditingAssignment(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
