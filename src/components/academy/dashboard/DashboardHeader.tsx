'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { RiLogoutBoxLine } from 'react-icons/ri'
import Image from 'next/image'

interface DashboardHeaderProps {
  fullName: string
  onLogout: () => void
  loggingOut: boolean
}

export default function DashboardHeader({ fullName, onLogout, loggingOut }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-blue-100 shadow-sm shadow-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand + greeting */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-[#104179] flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
              <Image
                src="/logos/4.png"
                alt="Gluns Logo"
                width={56}
                height={56}
                className="w-14 h-14"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                Hey, {fullName}!
              </h1>
              <p className="text-xs text-slate-500 font-semibold">
                Ready to learn something new today?
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2.5 cursor-pointer rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-widest hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RiLogoutBoxLine className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{loggingOut ? 'Logging out…' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
