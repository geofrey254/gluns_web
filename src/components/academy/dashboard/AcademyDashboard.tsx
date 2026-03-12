/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthGate } from '@/components/delegationportal/hooks/useAuthGate'
import DashboardHeader from './DashboardHeader'
import StatsRow from './StatsRow'
import CurrentCourseCard from './CurrentCourseCard'
import CourseCard from './CourseCard'
import EmptyCoursesState from './EmptyCoursesState'
import Loading from '@/app/(frontend)/loading'

// types
import { Enrollment } from '@/app/types/course'
import { User } from '@/app/types/types'

interface Student {
  user: User
  enrollments: Enrollment[]
}

interface AcademyDashboardProps {
  student?: Student
}

export default function AcademyDashboard({ student: initialStudent }: AcademyDashboardProps) {
  const router = useRouter()
  const { logout: authLogout } = useAuthGate()

  const [student, setStudent] = useState<Student | null>(initialStudent || null)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(!initialStudent)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/academy/student-dashboard', {
        credentials: 'include',
      })

      if (res.status === 401) {
        setError('unauthenticated')
        return
      }

      const data = await res.json()

      setStudent({
        user: data.user,
        enrollments: data.enrollments,
      })

      setCourses(data.courses)
    } catch (err) {
      console.error(err)
      setError('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await authLogout()
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  const handleStartCourse = (courseSlug: string) => {
    router.push(`/academy/courses/${courseSlug}/learn`)
  }

  useEffect(() => {
    if (error === 'unauthenticated') {
      router.push('/academy/auth/login')
    }
  }, [error, router])

  if (loading) {
    return <Loading />
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
          fullName={student?.user?.fullName || 'Student'}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />

        {/* Main */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <StatsRow
            enrolledCount={student?.enrollments?.length || 0}
            completedLessons={0}
            achievements={0}
          />

          {/* Current course */}
          {student?.enrollments && student.enrollments.length > 0 && (
            <CurrentCourseCard
              course={student.enrollments[0].course}
              currentLesson={student.enrollments[0].currentLesson}
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
