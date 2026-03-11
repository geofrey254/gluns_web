export const dynamic = 'force-dynamic'

import config from '@/payload.config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/academy/course/BreadCrumbs'
import { RiArrowLeftLine, RiBookOpenLine, RiTimeLine } from 'react-icons/ri'
import type { Lesson, Module } from '@/payload-types'

type LessonWithModule = Lesson & {
  module?: number | Module
}

export default async function CourseLearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const courseResult = await payload.find({
    collection: 'courses',
    where: {
      slug: { equals: slug },
      isPublished: { equals: true },
    },
    limit: 1,
  })

  const course = courseResult.docs[0]
  if (!course) {
    notFound()
  }

  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  let activeLesson: LessonWithModule | undefined
  let activeModule: Module | undefined

  if (user?.id) {
    const studentResult = await payload.find({
      collection: 'enrollments',
      where: { student: { equals: user.id } },
      limit: 1,
      depth: 2,
    })

    const student = studentResult.docs[0]
    const currentCourseId =
      typeof student?.course === 'number' ? student.course : student?.course?.id

    if (currentCourseId === course.id && student?.currentLesson) {
      if (typeof student.currentLesson === 'number') {
        const lessonResult = await payload.find({
          collection: 'lessons',
          where: { id: { equals: student.currentLesson } },
          limit: 1,
          depth: 1,
        })
        activeLesson = lessonResult.docs[0] as LessonWithModule | undefined
      } else {
        activeLesson = student.currentLesson as LessonWithModule
      }
    }
  }

  if (!activeLesson) {
    const moduleResult = await payload.find({
      collection: 'modules',
      where: {
        and: [{ course: { equals: course.id } }, { isPublished: { equals: true } }],
      },
      sort: 'orderIndex',
      limit: 1,
    })

    const firstModule = moduleResult.docs[0]
    if (!firstModule) {
      notFound()
    }

    const lessonResult = await payload.find({
      collection: 'lessons',
      where: {
        and: [{ module: { equals: firstModule.id } }, { isPublished: { equals: true } }],
      },
      sort: 'orderIndex',
      limit: 1,
      depth: 1,
    })

    activeLesson = lessonResult.docs[0] as LessonWithModule | undefined
  }

  if (!activeLesson) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Breadcrumbs title={course.title} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-8 text-center">
            <h1 className="text-2xl font-black text-slate-900 mb-2">No lesson available yet</h1>
            <p className="text-slate-500 font-semibold mb-6">
              This course has no published lessons right now.
            </p>
            <Link
              href={`/academy/courses/${slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-300 hover:text-[#104179] text-slate-500 px-5 py-3 font-black text-xs uppercase tracking-widest transition-all"
            >
              <RiArrowLeftLine className="w-4 h-4" />
              Back to Course
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (activeLesson.module && typeof activeLesson.module !== 'number') {
    activeModule = activeLesson.module
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Breadcrumbs title={`${course.title} • Learn`} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="mb-4">
          <Link
            href={`/academy/courses/${slug}`}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#104179] transition-colors"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            Back to Course
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm shadow-blue-50 p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {activeModule?.title && (
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-50 border border-blue-100 text-[#104179] px-3 py-1.5 text-xs font-black uppercase tracking-widest">
                <RiBookOpenLine className="w-3.5 h-3.5" />
                {activeModule.title}
              </span>
            )}
            {activeLesson.duration && (
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-50 border border-blue-100 text-[#104179] px-3 py-1.5 text-xs font-black uppercase tracking-widest">
                <RiTimeLine className="w-3.5 h-3.5" />
                {activeLesson.duration}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
            {activeLesson.title}
          </h1>

          <p className="text-slate-500 font-semibold leading-relaxed text-sm sm:text-base">
            {activeLesson.objective ||
              'Follow this lesson to build practical skills and progress through your course.'}
          </p>

          <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
              Lesson Content
            </p>
            <p className="text-sm text-slate-500 font-semibold">
              Lesson sections and interactive blocks are ready to be displayed here as your academy
              reader experience expands.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
