import React from 'react'
import Image from 'next/image'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
      <div className="relative flex flex-col items-center gap-8">
        {/* Logo container with animated ring */}
        <div className="relative">
          {/* Spinning ring */}
          <div className="absolute inset-0 w-52 h-52 rounded-full border-4 border-transparent border-t-[#104179] animate-spin" />

          {/* Secondary spinning ring */}
          <div
            className="absolute inset-0 w-52 h-52 rounded-full border-4 border-transparent border-b-[#104179] opacity-30 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          />

          {/* Logo placeholder - replace with your actual logo */}
          <div className="w-52 h-52 rounded-full bg-white shadow-lg flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-[#104179] flex items-center justify-center">
              <Image
                src="/logos/4.png"
                alt="GLUNS Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Loading text with animated dots */}
        <div className="flex items-center gap-2">
          <span className="text-[#104179] text-lg font-medium">Loading</span>
          <div className="flex gap-1">
            <div
              className="w-2 h-2 bg-[#104179] rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 bg-[#104179] rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-2 h-2 bg-[#104179] rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#104179] rounded-full animate-pulse"
            style={{
              animation:
                'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite, progress 2s ease-in-out infinite',
              width: '40%',
            }}
          />
        </div>
      </div>
    </div>
  )
}
