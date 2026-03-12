import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Fetch all enrollments
    const enrollmentsResult = await payload.find({
      collection: 'enrollments',
      limit: 100,
      depth: 2,
    })

    return NextResponse.json(
      {
        enrollments: enrollmentsResult.docs.map((enrollment) => ({
          id: enrollment.id,
          studentId: enrollment.student,
          courseId: enrollment.course,
          currentLessonId: enrollment.currentLesson || null,
        })),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}
