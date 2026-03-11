'use client'

import React from 'react'
import Login from './auth/Login'
import Image from 'next/image'

export default function AcademyLandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-[#104179]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-screen">
        {/* Left Side - Hero Image Panel */}
        <div className="hidden md:flex flex-col justify-stretch relative overflow-hidden min-h-screen">
          {/* Portrait image with angular clip shape */}
          <div className="relative flex-1 flex items-center justify-center px-8 py-12">
            <div className="relative w-full max-w-[600px]">
              {/* Clipped image container — angular polygon shape */}
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: '3/4',
                  clipPath: 'polygon(0 0, 85% 0, 100% 8%, 100% 100%, 15% 100%, 0 92%)',
                }}
              >
                <Image
                  src="/images/academy.jpg"
                  alt="GLUNS Academy"
                  fill
                  className="object-cover object-center"
                  sizes="340px"
                />
                {/* Gradient overlay darkening bottom for text legibility */}
                <div className="absolute inset-0 bg-linear-to-b from-[#04243f] via-[#104179]/40 to-transparent" />
              </div>

              {/* Corner accent — top-right */}
              <div
                className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                style={{
                  clipPath: 'polygon(50% 7%, 100% 0, 100% 100%, 0 20%)',
                }}
              />

              {/* Corner accent — bottom-left */}
              <div
                className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none"
                style={{
                  clipPath: 'polygon(0 0, 15% 100%, 0 100%)',
                }}
              />

              {/* Text overlay inside image — bottom */}
              <div
                className="absolute top-0 left-0 right-0 px-6 pb-6 pt-10"
                style={{ clipPath: 'polygon(0 0, 85% 0, 100% 8%, 100% 100%, 15% 100%, 0 92%)' }}
              >
                {/* Eyebrow label */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="block w-5 h-px bg-[#4a9ede]" />
                  <span className="text-[#4a9ede] uppercase tracking-[0.2em] font-semibold">
                    GLUNS Academy
                  </span>
                </div>
                <h1 className="text-white font-bold leading-7 mb-5 text-5xl">
                  Where Leaders
                  <br />
                  Are Forged
                </h1>
                <p className="text-slate-300 font-light leading-snug text-xl">
                  Model United Nations excellence,
                  <br />
                  from committee to podium.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Options */}
        <div className="flex flex-col justify-center items-center p-8 md:p-12">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-0">
              <div className="flex items-center gap-2.5 mb-3.5">
                <span className="block w-7 h-0.5 bg-[#104179] rounded shrink-0" />
                <span className="text-slate-400 text-sm tracking-widest uppercase font-medium">
                  Sign In
                </span>
              </div>
              <h2 className="text-[3rem] font-bold text-slate-900 leading-9 mb-2 tracking-tight">
                Welcome back,
                <br />
                <span className="text-[#104179]">Delegate</span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed font-light">
                Access your committees, resolutions, and performance dashboard.
              </p>
            </div>

            <div className="mb-8">
              <Login />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
