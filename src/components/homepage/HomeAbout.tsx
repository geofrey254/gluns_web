import React from 'react'
import Link from 'next/link'

export default function HomeAbout() {
  return (
    <section className="bg-white min-h-[60vh] md:min-h-[40vh] lg:min-h-[50vh] 2xl:min-h-[60vh] rounded-t-3xl -mt-7 z-20 overflow-hidden border-t border-white">
      <div className="max-w-full lg:max-w-5xl mx-auto flex flex-col gap-6 md:gap-8 2xl:gap-12 px-6 md:px-8 2xl:px-16 py-12 md:py-16 2xl:py-20">
        <h3 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-bold text-[#104179] text-left">
          WE PREPARE STUDENTS FOR THE WORLD STAGE{' '}
        </h3>
        <p className="text-lg md:text-xl 2xl:text-2xl text-left text-[#104179]">
          GLUNS is a student-led organization that curates rigorous Model UN conferences and
          solution-focused competitions for students who want to engage with the world{"'"}s hardest
          problems. We bring together students, academics, and policy practitioners to make Model UN
          the most impactful extracurricular in a student{"'"}s career.
        </p>

        <div className="mt-6 pb-6">
          <Link
            href="/about"
            className="border-2 border-[#104179] text-[#104179] px-6 py-4 text-lg md:text-xl 2xl:text-2xl font-semibold hover:bg-[#0d3160] transition-all duration-300"
          >
            MEET THE SECRETARIAT
          </Link>
        </div>
      </div>
    </section>
  )
}
