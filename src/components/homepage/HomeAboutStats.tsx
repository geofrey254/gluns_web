import React from 'react'

export default function HomeAboutStats() {
  const stats = [
    { value: '1+', label: 'Years Building Leaders' },
    { value: '500+', label: 'Delegates Engaged' },
    { value: '20+', label: 'Committees & Tracks' },
    { value: '5+', label: 'Partner Institutions' },
  ]

  return (
    <section className="relative bg-[#0d1a0d] min-h-[70vh] md:min-h-[55vh] lg:min-h-[60vh] rounded-t-3xl -mt-7 z-20 overflow-hidden border-t border-white">
      <div className="max-w-full lg:max-w-5xl mx-auto flex flex-col gap-6 md:gap-8 2xl:gap-12 px-6 md:px-8 2xl:px-16 py-12 md:py-16 2xl:py-20">
        <h3 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-bold text-[#85c226] text-left lg:text-center">
          OVER A YEAR SHAPING THE NEXT GENERATION OF GLOBAL LEADERS.
        </h3>
        <p className="text-lg md:text-xl 2xl:text-2xl text-left lg:text-center text-white/65">
          From committee simulations to competition judging, we bring together students, academics,
          and policy practitioners to make Model UN the most impactful extracurricular in a student
          {"'"}s career.
        </p>

        <div className="h-px w-full bg-white/20" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 2xl:gap-6 pb-8 md:pb-0 text-center">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="text-4xl md:text-5xl 2xl:text-6xl font-bold text-[#85c226]">
                {item.value}
              </p>
              <p className="mt-1 text-sm md:text-base 2xl:text-lg text-white/65 leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
