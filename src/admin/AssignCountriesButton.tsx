'use client'

import React, { useState } from 'react'
import { Button } from '@payloadcms/ui'

export default function AssignCountriesButton() {
  const [loading, setLoading] = useState(false)

  async function handleAssign() {
    if (!confirm('Assign countries randomly to all unassigned delegates?')) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/assign-countries', {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Something went wrong')
        return
      }

      alert(`Assigned ${data.assigned} delegate(s)`)
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('An error occurred while assigning countries.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-end p-4 border-b border-gray-200">
      <Button
        size="small"
        onClick={handleAssign}
        disabled={loading}
        className="bg-[#85cc26] text-white hover:bg-[#104179] border border-white font-sem py-2 px-6 text-lg transition-colors duration-200 flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Assigning...
          </>
        ) : (
          'Assign Countries Randomly'
        )}
      </Button>

      <style jsx>{`
        .loader {
          display: inline-block;
        }
      `}</style>
    </div>
  )
}
