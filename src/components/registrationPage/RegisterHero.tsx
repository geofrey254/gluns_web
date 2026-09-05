import React from 'react'

export default function RegisterHero() {
  return (
    <section className="relative bg-[#0d0d0d] min-h-auto flex px-6 md:px-8 2xl:px-16 pt-28 pb-12 lg:pt-32 lg:pb-18 justify-center items-center z-20 overflow-hidden">
      {/* Overlay with Pattern */}

      {/* Content */}
      <div className="flex flex-col items-center justify-center">
        <div className="w-full lg:text-center space-y-6">
          <div className="inline-block">
            <h1 className="text-5xl md:text-7xl uppercase font-bold text-white tracking-normal md:tracking-tight mb-4">
              Register for GLUNS Events and Programs
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Join us for an unforgettable experience at the Global Leaders United Nations
              Symposium. Register now to secure your spot and be part of a transformative journey in
              global leadership and diplomacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
