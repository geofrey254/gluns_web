/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAcademyGate } from '../hooks/useAuthAcademy'

import DashboardHeader from './DashboardHeader'
import StatsRow from './StatsRow'
import CurrentCourseCard from './CurrentCourseCard'
import CourseCard from './CourseCard'
import EmptyCoursesState from './EmptyCoursesState'

interface Student {
  id: string
  fullName: string
  username: string
  enrolledCourses?: any[]
  currentCourse?: any
  currentModule?: any
}

interface AcademyDashboardProps {
  student?: Student
}

export default function AcademyDashboard({ student: initialStudent }: AcademyDashboardProps) {
  const router = useRouter()
  const { logout: authLogout } = useAcademyGate()

  const [student, setStudent] = useState<Student | null>(initialStudent || null)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(!initialStudent)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  console.log('AcademyDashboard rendered with student:', student)

  useEffect(() => {
    if (!initialStudent) {
      fetchStudentData()
    } else {
      fetchCourses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchStudentData = async () => {
    try {
      const response = await fetch('/api/academy/student-profile')
      if (!response.ok) throw new Error('Failed to fetch student data')
      const data = await response.json()
      setStudent(data.student)
      fetchCourses()
    } catch (err) {
      console.error('Error fetching student data:', err)
      setError('Failed to load student data')
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/academy/courses', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses)
      }
    } catch (err) {
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await authLogout()
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  const handleStartCourse = (courseId: string) => {
    router.push(`/academy/courses/${courseId}`)
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading…</p>
        </div>
      </div>
    )
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-red-100 shadow-lg p-10 w-full max-w-sm text-center">
          <p className="text-red-500 font-black mb-5 text-sm">{error}</p>
          <button
            onClick={() => router.push('/academy')}
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');`}</style>

      <div className="min-h-screen bg-blue-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
        {/* Decorative blobs */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-40 pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-80 h-80 bg-sky-100 rounded-full translate-y-1/3 -translate-x-1/4 opacity-40 pointer-events-none -z-10" />

        {/* Header */}
        <DashboardHeader
          fullName={student?.fullName || 'Student'}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />

        {/* Main */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <StatsRow
            enrolledCount={student?.enrolledCourses?.length || 0}
            streak={0}
            achievements={0}
          />

          {/* Current course */}
          {student?.currentCourse && (
            <CurrentCourseCard
              course={student.currentCourse}
              currentModule={student.currentModule}
              onContinue={handleStartCourse}
            />
          )}

          {/* Available courses */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
              Available Courses
            </h2>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} onClick={handleStartCourse} />
                ))}
              </div>
            ) : (
              <EmptyCoursesState />
            )}
          </div>
        </main>
      </div>
    </>
  )
}
