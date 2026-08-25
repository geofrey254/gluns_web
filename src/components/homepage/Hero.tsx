import React from 'react'
import Link from 'next/link'
import { IoIosArrowForward } from 'react-icons/io'

export default function Hero() {
  return (
    <section className="relative bg-[#051220] md:min-h-[40vh] lg:min-h-[60vh] 2xl:min-h-[60vh] flex px-6 md:px-8 2xl:px-16 items-center z-20 overflow-hidden">
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-[url(/images/glunshero.jpg)] bg-cover bg-top" />

      <div className="absolute inset-0 bg-linear-to-tr from-[#051220]/50 via-[#051220]/65 to-[#051220]/45" />

      <div className="relative z-10 w-full py-20 justify-center items-center flex flex-col gap-4 md:gap-0 2xl:gap-0">
        <h1 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-bold text-white text-center z-10">
          SIMULATE. DEBATE. <br />
          <span className="font-semmibold text-[#85C226] text-center z-10">CHANGE THE WORLD.</span>
        </h1>

        <p className="mt-4 text-lg md:text-xl 2xl:text-3xl text-white text-center md:w-1/2 z-10">
          GLUNS curates rigorous Model UN conferences and solution-focused competitions for students
          who want to engage with the world{"'"}s hardest problems.
        </p>

        {/* cta buttons */}
        <div className="flex items-center gap-8">
          <Link
            href="/events"
            className="mt-8 inline-block relative overflow-hidden border border-[#ffffff] text-[#ffffff] px-6 md:px-8 py-3 font-semibold transition-colors duration-300 before:absolute before:inset-0 before:bg-[#ffffff] before:translate-y-full before:transition-transform before:duration-300 hover:before:translate-y-0 hover:text-[#104179]"
          >
            <span className="relative z-10 text-lg md:text-xl 2xl:text-2xl">VIEW EVENTS</span>
          </Link>

          <Link
            href="/register"
            className="mt-8 inline-block relative overflow-hidden bg-[#85c226] text-[#104179] px-6 md:px-8 py-3 font-semibold transition-colors duration-300"
          >
            <span className="relative z-10 text-lg md:text-xl 2xl:text-2xl">REGISTER NOW</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
