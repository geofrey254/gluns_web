import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  try {
    const { courseSlug } = await req.json()

    if (!courseSlug || typeof courseSlug !== 'string') {
      return NextResponse.json({ error: 'courseSlug is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const { user } = await payload.auth({ headers: req.headers })

    if (!user?.roles?.includes('student')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // ------------------------------------------------
    // Find course
    // ------------------------------------------------

    const coursesResult = await payload.find({
      collection: 'courses',
      where: {
        slug: { equals: courseSlug },
        isPublished: { equals: true },
      },
      limit: 1,
    })

    const course = coursesResult.docs[0]

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // ------------------------------------------------
    // Check if student already enrolled
    // ------------------------------------------------

    const existingEnrollmentResult = await payload.find({
      collection: 'enrollments',
      where: {
        and: [{ student: { equals: user.id } }, { course: { equals: course.id } }],
      },
      limit: 1,
    })

    const existingEnrollment = existingEnrollmentResult.docs[0]

    // ------------------------------------------------
    // If already enrolled → resume course
    // ------------------------------------------------

    if (existingEnrollment) {
      return NextResponse.json(
        {
          redirectPath: `/academy/courses/${course.slug}/learn`,
          courseId: course.id,
          lessonId: existingEnrollment.currentLesson,
        },
        { status: 200 },
      )
    }

    // ------------------------------------------------
    // Find first module
    // ------------------------------------------------

    const modulesResult = await payload.find({
      collection: 'modules',
      where: {
        and: [{ course: { equals: course.id } }, { isPublished: { equals: true } }],
      },
      sort: 'orderIndex',
      limit: 1,
    })

    const firstModule = modulesResult.docs[0]

    if (!firstModule) {
      return NextResponse.json(
        { error: 'No published modules found for this course' },
        { status: 400 },
      )
    }

    // ------------------------------------------------
    // Find first lesson
    // ------------------------------------------------

    const lessonsResult = await payload.find({
      collection: 'lessons',
      where: {
        and: [{ module: { equals: firstModule.id } }, { isPublished: { equals: true } }],
      },
      sort: 'orderIndex',
      limit: 1,
    })

    const firstLesson = lessonsResult.docs[0]

    if (!firstLesson) {
      return NextResponse.json(
        { error: 'No published lessons found for this course' },
        { status: 400 },
      )
    }

    // ------------------------------------------------
    // Create enrollment
    // ------------------------------------------------

    const enrollment = await payload.create({
      collection: 'enrollments',
      data: {
        student: user.id,
        course: course.id,
        currentLesson: firstLesson.id,
      },
    })

    return NextResponse.json(
      {
        redirectPath: `/academy/courses/${course.slug}/learn`,
        courseId: course.id,
        moduleId: firstModule.id,
        lessonId: firstLesson.id,
        enrollmentId: enrollment.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error starting course:', error)

    return NextResponse.json({ error: 'Failed to start course' }, { status: 500 })
  }
}
