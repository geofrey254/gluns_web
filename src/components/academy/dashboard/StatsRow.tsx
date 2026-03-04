'use client'

import React from 'react'
import { RiBookOpenLine, RiFireLine, RiTrophyLine } from 'react-icons/ri'

interface StatsRowProps {
  enrolledCount: number
  streak: number
  achievements: number
}

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  iconBg: string
  iconColor: string
  valueSuffix?: string
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, valueSuffix }: StatCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-blue-100 shadow-sm shadow-blue-50 p-5 flex items-center gap-4">
      <div
        className={[
          'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm',
          iconBg,
        ].join(' ')}
      >
        <Icon className={['w-6 h-6', iconColor].join(' ')} />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-900 leading-none">
          {value}
          {valueSuffix && (
            <span className="text-sm font-bold text-slate-400 ml-1">{valueSuffix}</span>
          )}
        </p>
      </div>
    </div>
  )
}

export default function StatsRow({ enrolledCount, streak, achievements }: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard
        label="Courses"
        value={enrolledCount}
        icon={RiBookOpenLine}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />
      <StatCard
        label="Day Streak"
        value={streak}
        valueSuffix={streak === 1 ? 'day' : 'days'}
        icon={RiFireLine}
        iconBg="bg-orange-50"
        iconColor="text-orange-500"
      />
      <StatCard
        label="Achievements"
        value={achievements}
        icon={RiTrophyLine}
        iconBg="bg-yellow-50"
        iconColor="text-yellow-500"
      />
    </div>
  )
}
