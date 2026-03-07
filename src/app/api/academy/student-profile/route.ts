import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import config from '@payload-config'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const studentId = cookieStore.get('academy_student_id')?.value

    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    const students = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: studentId,
        },
        role: {
          equals: 'student',
        },
      },
    })

    if (!students.docs || students.docs.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const student = students.docs[0]

    return NextResponse.json(
      {
        student: {
          id: student.id,
          fullName: student.fullName,
          username: student.username,
          ageGroup: student.ageGroup,
          enrolledCourses: student.enrolledCourses,
          currentCourse: student.currentCourse,
          currentModule: student.currentModule,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching student profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
