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

    if (!user || !user.id || user.roles !== 'student') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const studentResult = await payload.find({
      collection: 'users',
      where: { id: { equals: user.id }, roles: { equals: 'student' } },
      limit: 1,
    })

    const student = studentResult.docs[0]
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

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

    const existingEnrolled = Array.isArray(student.enrolledCourses)
      ? student.enrolledCourses.map((courseRef: number | { id: number }) =>
          typeof courseRef === 'number' ? courseRef : courseRef.id,
        )
      : []

    const enrolledCourses = existingEnrolled.includes(course.id)
      ? existingEnrolled
      : [...existingEnrolled, course.id]

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        enrolledCourses,
        currentCourse: course.id,
        currentModule: firstModule.id,
        currentLesson: firstLesson.id,
      },
    })

    return NextResponse.json(
      {
        redirectPath: `/academy/courses/${course.slug}/learn`,
        courseId: course.id,
        moduleId: firstModule.id,
        lessonId: firstLesson.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error starting course:', error)
    return NextResponse.json({ error: 'Failed to start course' }, { status: 500 })
  }
}
