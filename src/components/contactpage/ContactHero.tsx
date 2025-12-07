import React from 'react'

export default function ContactHero() {
  return (
    <section className="py-12 md:py-16 px-8 md:px-12 bg-[#104179] dark:border-t dark:border-white relative z-30 shadow-2xl overflow-hidden flex flex-col items-start justify-center gap-4 md:gap-2">
      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2">
        <div className="w-2 h-2 bg-[#85c226] rounded-full animate-pulse"></div>
        <span className="text-white text-xs font-semibold tracking-wider uppercase">
          Contact Us
        </span>
      </div>
      <h2 className="text-white text-7xl md:text-8xl">
        We’d love to <span className="text-[#85c226]">hear</span> from you!
      </h2>
      <p className='text-white text-base md:text-2xl md:w-[60%]'>Whether you’re a student, educator, partner organization, or sponsor, our team is here to answer your questions and support your GLUNS experience.</p>
    </section>
  )
}
