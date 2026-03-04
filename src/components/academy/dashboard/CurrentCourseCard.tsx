'use client'

import React from 'react'
import { RiPlayCircleLine, RiArrowRightLine, RiTimeLine } from 'react-icons/ri'

interface CurrentCourseCardProps {
  course: {
    id: string
    title?: string
  }
  currentModule?: {
    title?: string
  } | null
  onContinue: (courseId: string) => void
}

export default function CurrentCourseCard({
  course,
  currentModule,
  onContinue,
}: CurrentCourseCardProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
        Continue Learning
      </h2>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 sm:p-8 shadow-lg shadow-blue-200 relative overflow-hidden">
        {/* Decorative ring */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-10 -right-2 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <RiPlayCircleLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight mb-1">
                {course.title || 'Current Course'}
              </h3>
              <div className="flex items-center gap-1.5 text-blue-100">
                <RiTimeLine className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">
                  {currentModule ? `Module: ${currentModule.title}` : 'Start your next lesson'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onContinue(course.id)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-blue-700 font-black text-sm hover:bg-blue-50 active:scale-[0.97] transition-all shadow-md flex-shrink-0"
          >
            Continue
            <RiArrowRightLine className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
