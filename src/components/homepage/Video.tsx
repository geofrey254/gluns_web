import React from 'react'

export default function Video() {
  return (
    <section className="relative rounded-t-3xl -mt-7 z-30 overflow-hidden border-t border-white/20">
      <div className="relative w-full h-[60vh] md:h-screen min-h-[560px]">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <iframe
            className="absolute top-1/2 left-1/2 
               w-[177.77vh] h-[56.25vw] 
               min-w-full min-h-full 
               -translate-x-1/2 -translate-y-1/2 
               pointer-events-none"
            src="https://www.youtube.com/embed/NQiB7AKgbOA?autoplay=1&mute=1&controls=0&loop=1&playlist=NQiB7AKgbOA&playsinline=1&modestbranding=1&rel=0"
            title="GLUNS Recap"
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
        </div>
        {/* Layered Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#104179]/95 via-[#104179]/30 to-black/50 z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/30 z-10" />
      
      
        {/* Center Text Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <p
            className="text-white/60 uppercase tracking-[0.4em] text-xs mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            The Recap
          </p>

          <h2
            className="text-white font-semibold leading-none tracking-tight"
            style={{
              fontSize: 'clamp(3rem, 9vw, 7rem)',
              textShadow: '0 4px 40px rgba(0,0,0,0.4)',
            }}
          >
            GLUNS
          </h2>

          {/* Thin divider line */}
          <div className="flex items-center gap-4 my-5 w-full max-w-xs">
            <div className="flex-1 h-px bg-white/30" />
            <span
              className="text-white/50 text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              2026
            </span>
            <div className="flex-1 h-px bg-white/30" />
          </div>

          <p
            className="text-white/70 uppercase tracking-[0.3em] text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            February Conference
          </p>
        </div>
      </div>
    </section>
  )
}
