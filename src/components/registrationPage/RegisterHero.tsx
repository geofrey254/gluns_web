import React from 'react'

export default function RegisterHero() {
  return (
    <section className="relative h-[400px] w-full overflow-hidden">
      {/* Overlay with Pattern */}
      <div className="absolute inset-0 bg-[#104179]"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-4">
        <div className="max-w-4xl w-full text-center space-y-6">
          <div className="inline-block">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-normal md:tracking-tight mb-4">
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
