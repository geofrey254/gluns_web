'use client'

import React from 'react'
import { RiArrowRightLine, RiStackLine } from 'react-icons/ri'

interface CourseCardProps {
  course: {
    id: string
    title?: string
    slug: string
    description?: string
    modules?: unknown[]
  }
  onClick: (courseSlug: string) => void
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  const moduleCount = course.modules?.length || 0

  return (
    <button
      onClick={() => onClick(course.slug)}
      className="group w-full text-left bg-white rounded-3xl border-2 border-slate-100 hover:border-[#104179] shadow-sm hover:shadow-md cursor-pointer hover:shadow-[#104179] transition-all duration-200 overflow-hidden active:scale-[0.98] p-6 flex flex-col gap-3"
    >
      {/* Top accent bar */}
      <div className="w-8 h-1 rounded-full bg-blue-200 group-hover:bg-[#104179] group-hover:w-12 transition-all duration-300" />

      <div className="flex-1">
        <h3 className="text-base font-black text-slate-900 group-hover:text-[#104179] transition-colors leading-snug mb-2">
          {course.title || 'Untitled Course'}
        </h3>
        {course.description && (
          <p className="text-sm text-slate-500 font-semibold line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-slate-400">
          <RiStackLine className="w-3.5 h-3.5" />
          <span className="text-xs font-black uppercase tracking-widest">
            {moduleCount} {moduleCount === 1 ? 'module' : 'modules'}
          </span>
        </div>
        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-[#104179] flex items-center justify-center transition-all duration-200">
          <RiArrowRightLine className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    </button>
  )
}
