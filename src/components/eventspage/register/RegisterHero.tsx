import React from 'react'

export default function RegisterHero() {
  return (
    <section className="py-12 md:py-16 px-8 md:px-12 bg-[#104179] dark:border-t dark:border-white relative z-30 shadow-2xl overflow-hidden flex flex-col items-start justify-center gap-4 md:gap-2">
      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2">
        <div className="w-2 h-2 bg-[#85c226] rounded-full animate-pulse"></div>
        <span className="text-white text-xs font-semibold tracking-wider uppercase">
          School Registration
        </span>
      </div>
      <h2 className="text-white text-7xl md:text-8xl">
        Register Your <span className="text-[#85c226]">School</span> for GLUNS!
      </h2>
      <p className="text-white text-base md:text-2xl md:w-[60%]">
        Fill out the form below to register your school for our upcoming event. We look forward to
        welcoming you!
      </p>
    </section>
  )
}
