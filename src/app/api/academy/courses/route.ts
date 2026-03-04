import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

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
