import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const headersList = await headers()

    const { user } = await payload.auth({
      headers: headersList,
    })

    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    // Get enrollments for this student
    const enrollmentsResult = await payload.find({
      collection: 'enrollments',
      where: {
        student: {
          equals: user.id,
        },
      },
      depth: 2, // populate course, lesson, modules
      limit: 50,
    })

    // Extract courses from enrollments
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courses = enrollmentsResult.docs.map((e: any) => e.course)

    return NextResponse.json(
      {
        user,
        enrollments: enrollmentsResult.docs,
        courses,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Student dashboard error:', error)

    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 })
  }
}
