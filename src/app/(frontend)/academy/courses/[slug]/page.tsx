export const dynamic = 'force-dynamic'

import React from 'react'
import config from '@/payload.config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'

// components
import { Badge } from '@/components/academy/course/Badge'
import { DetailRow } from '@/components/academy/course/DetailRow'
import { ModuleItem } from '@/components/academy/course/ModuleItem'
import { Breadcrumbs } from '@/components/academy/course/BreadCrumbs'
import { StartCourseButton } from '@/components/academy/course/StartCourseButton'

import {
  RiGraduationCapLine,
  RiStackLine,
  RiCalendarLine,
  RiTimeLine,
  RiGroupLine,
  RiPlayCircleLine,
} from 'react-icons/ri'
import type { Course, Module } from '@/payload-types'

type CourseWithExpandedRelations = Course & {
  thumbnail?: {
    url?: string | null
    alt?: string | null
  }
  modules?: (number | Module)[] | null
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'courses',
    where: {
      slug: { equals: slug },
      isPublished: { equals: true },
    },
    depth: 2,
  })

  const course = docs[0] as CourseWithExpandedRelations | undefined
  if (!course) notFound()

  const publishedDateFormatted = new Date(course.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const modules = (course.modules || []).filter((m): m is Module => typeof m !== 'number')

  const difficultyLabel = course.difficultyLevel
    ? `${course.difficultyLevel.charAt(0).toUpperCase()}${course.difficultyLevel.slice(1)}`
    : 'All Levels'

  const thumbnailUrl =
    typeof course.thumbnail === 'object' && course.thumbnail?.url ? course.thumbnail.url : '/bg.jpg'

  const thumbnailAlt =
    typeof course.thumbnail === 'object' && course.thumbnail?.alt
      ? course.thumbnail.alt
      : `${course.title} cover image`

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');`}</style>

      <div className="min-h-screen bg-blue-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
        {/* Decorative blobs */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-40 pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-80 h-80 bg-sky-100 rounded-full translate-y-1/3 -translate-x-1/4 opacity-40 pointer-events-none -z-10" />

        {/* Breadcrumb */}
        <Breadcrumbs title={course.title} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Main column ── */}
            <section className="lg:col-span-2 flex flex-col gap-6">
              {/* Thumbnail card */}
              <div className="bg-white rounded-3xl border border-blue-100 shadow-sm shadow-blue-50 overflow-hidden">
                <div className="relative w-full aspect-video">
                  <Image
                    src={thumbnailUrl}
                    alt={thumbnailAlt}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                  {/* Play hint */}
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#104179] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-2xl shadow-sm">
                      <RiPlayCircleLine className="w-4 h-4" />
                      {modules.length} {modules.length === 1 ? 'Module' : 'Modules'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course info card */}
              <div className="bg-white rounded-3xl border border-blue-100 shadow-sm shadow-blue-50 p-6 sm:p-8">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <Badge icon={RiGraduationCapLine}>{difficultyLabel}</Badge>
                  <Badge icon={RiStackLine}>
                    {modules.length} {modules.length === 1 ? 'Module' : 'Modules'}
                  </Badge>
                  <Badge icon={RiCalendarLine}>Added {publishedDateFormatted}</Badge>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                  {course.title}
                </h1>

                {/* Description */}
                <p className="text-slate-500 font-semibold leading-relaxed text-sm sm:text-base">
                  {course.description ||
                    'Build practical knowledge through guided modules and structured lessons designed for progressive learning.'}
                </p>
              </div>

              {/* Modules card */}
              {modules.length > 0 && (
                <div className="bg-white rounded-3xl border border-blue-100 shadow-sm shadow-blue-50 p-6 sm:p-8">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                    Course Modules
                  </h2>
                  <ul className="space-y-2.5">
                    {modules.map((module, index) => (
                      <ModuleItem key={module.id} index={index} module={module} />
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* ── Sidebar ── */}
            <aside className="h-fit lg:sticky lg:top-8 flex flex-col gap-4">
              {/* Details card */}
              <div className="bg-white rounded-3xl border border-blue-100 shadow-sm shadow-blue-50 p-6">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                  Course Details
                </h2>
                <div className="space-y-2.5 mb-6">
                  <DetailRow
                    icon={RiTimeLine}
                    label="Duration"
                    value={course.estimatedDuration || 'Self-paced'}
                  />
                  <DetailRow
                    icon={RiGroupLine}
                    label="Age Group"
                    value={
                      course.ageGroupsAllowed?.length
                        ? course.ageGroupsAllowed.join(', ')
                        : 'All ages'
                    }
                  />
                  <DetailRow icon={RiStackLine} label="Modules" value={String(modules.length)} />
                </div>

                <StartCourseButton courseSlug={course.slug} />

                <p className="text-xs text-slate-400 font-semibold text-center mt-3">
                  Continue from your academy dashboard after starting.
                </p>
              </div>

              {/* Back to courses */}
              <Link
                href="/academy"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-300 hover:text-[#104179] text-slate-500 px-5 py-3 font-black text-xs uppercase tracking-widest transition-all"
              >
                Back to Courses
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
