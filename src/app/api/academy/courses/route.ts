import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const studentId = cookieStore.get('academy_student_id')?.value

    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = await getPayload()

    // Fetch all courses
    const coursesResult = await payload.find({
      collection: 'courses',
      limit: 100,
    })

    return NextResponse.json(
      {
        courses: coursesResult.docs.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          modules: course.modules,
        })),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
