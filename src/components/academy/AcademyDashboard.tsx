'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BookOpen, LogOut, Award, TrendingUp, Clock, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAcademyGate } from './hooks/useAuthAcademy'

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
  onLogout?: () => void
}

export default function AcademyDashboard({ student: initialStudent }: AcademyDashboardProps) {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(initialStudent || null)
  const [courses, setCourses] = useState<any[]>([])
  const [loggingOut, setLoggingOut] = useState(false)
  const [loading, setLoading] = useState(!initialStudent)
  const [error, setError] = useState('')

  // hooks
  const { logout: authLogout } = useAcademyGate()

  useEffect(() => {
    if (!initialStudent) {
      fetchStudentData()
    } else {
      fetchCourses()
    }
  }, [])

  const fetchStudentData = async () => {
    try {
      const response = await fetch('/api/academy/student-profile')
      if (!response.ok) {
        throw new Error('Failed to fetch student data')
      }
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
      const response = await fetch('/api/academy/courses')
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
      await authLogout() // from useAcademyGate / zustand store
      router.refresh() // forces AcademyAuthGate to re-check auth
    } finally {
      setLoggingOut(false)
    }
  }

  const handleStartCourse = (courseId: string) => {
    router.push(`/academy/courses/${courseId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/academy')}>Go Back</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {student?.fullName}!
              </h1>
              <p className="text-slate-600 mt-1">Continue your learning journey</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Enrolled Courses</p>
                <p className="text-3xl font-bold text-slate-900">
                  {student?.enrolledCourses?.length || 0}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Learning Streak</p>
                <p className="text-3xl font-bold text-slate-900">0 days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Achievements</p>
                <p className="text-3xl font-bold text-slate-900">0</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Current Course */}
        {student?.currentCourse && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Continue Learning</h2>
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {student.currentCourse.title || 'Current Course'}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {student.currentModule
                      ? `Module: ${student.currentModule.title}`
                      : 'Start your next lesson'}
                  </p>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Resume learning</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleStartCourse(student.currentCourse.id as string)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Available Courses */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Courses</h2>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer"
                  onClick={() => handleStartCourse(course.id)}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {course.modules?.length || 0} modules
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No courses available yet. Check back soon!</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
