import { Module } from '@/payload-types'
import { RiCheckboxCircleLine } from 'react-icons/ri'

export function ModuleItem({ index, module }: { index: number; module: Module }) {
  return (
    <li className="flex items-start gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-200 bg-white hover:bg-blue-50/40 transition-all group">
      <span className="shrink-0 w-8 h-8 rounded-xl bg-[#104179] text-white text-xs font-black flex items-center justify-center shadow-sm shadow-blue-200 group-hover:scale-110 transition-transform">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-slate-900 leading-snug">{module.title}</p>
        {module.description && (
          <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
            {module.description}
          </p>
        )}
      </div>
      <RiCheckboxCircleLine className="w-4 h-4 text-slate-200 group-hover:text-blue-400 shrink-0 mt-0.5 transition-colors" />
    </li>
  )
}
