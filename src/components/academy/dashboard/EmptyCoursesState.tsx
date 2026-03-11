'use client'

import React from 'react'
import { RiBookOpenLine } from 'react-icons/ri'

export default function EmptyCoursesState() {
  return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
        <RiBookOpenLine className="w-8 h-8 text-slate-300" />
      </div>
      <div>
        <p className="font-black text-slate-400 text-sm">No courses yet</p>
        <p className="text-xs text-slate-300 font-semibold mt-1">
          Check back soon — new courses are on the way!
        </p>
      </div>
    </div>
  )
}
