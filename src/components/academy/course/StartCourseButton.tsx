'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RiLoader4Line, RiPlayCircleLine } from 'react-icons/ri'

export function StartCourseButton({ courseSlug }: { courseSlug: string }) {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async () => {
    if (isStarting) return

    setIsStarting(true)
    setError('')

    try {
      const response = await fetch('/api/academy/start-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to start course')
      }

      router.push(data.redirectPath || `/academy/courses/${courseSlug}/learn`)
      router.refresh()
    } catch (startError) {
      const message = startError instanceof Error ? startError.message : 'Unable to start course'
      setError(message)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleStart}
        disabled={isStarting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#104179] hover:bg-[#0d3a66] disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] text-white px-5 py-3.5 font-black text-sm transition-all shadow-lg shadow-blue-200"
      >
        {isStarting ? (
          <RiLoader4Line className="w-5 h-5 animate-spin" />
        ) : (
          <RiPlayCircleLine className="w-5 h-5" />
        )}
        {isStarting ? 'Starting…' : 'Start Course'}
      </button>

      {error && <p className="text-xs text-red-500 font-semibold text-center mt-2">{error}</p>}
    </div>
  )
}
