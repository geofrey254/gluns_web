import Link from 'next/link'
import { RiHome4Line, RiArrowRightSLine } from 'react-icons/ri'

export function Breadcrumbs({ title }: { title: string }) {
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Academy', href: '/academy' },
    { label: 'Courses', href: '/academy' },
  ]
  return (
    <nav className="bg-white border-b border-blue-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center flex-wrap gap-1 text-xs font-black uppercase tracking-widest">
          <li className="flex items-center gap-1">
            <RiHome4Line className="w-3.5 h-3.5 text-slate-400" />
          </li>
          {crumbs.map((crumb) => (
            <li key={crumb.href + crumb.label} className="flex items-center gap-1">
              <RiArrowRightSLine className="w-3.5 h-3.5 text-slate-300" />
              <Link
                href={crumb.href}
                className="text-slate-400 hover:text-[#104179] transition-colors"
              >
                {crumb.label}
              </Link>
            </li>
          ))}
          <li className="flex items-center gap-1">
            <RiArrowRightSLine className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[#104179] truncate max-w-40 sm:max-w-xs">{title}</span>
          </li>
        </ol>
      </div>
    </nav>
  )
}
