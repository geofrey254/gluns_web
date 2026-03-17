import React from 'react'

export default function Video() {
  return (
    <section className="relative rounded-t-3xl -mt-7 z-30 overflow-hidden border-t border-white/20">
      <div className="relative w-full h-screen min-h-[560px] max-h-[900px]">
        {/* Video Background */}
        <video
          preload="none"
          autoPlay
          playsInline
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/gluns.mp4" type="video/mp4" />
        </video>

        {/* Layered Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#104179]/95 via-[#104179]/30 to-black/50 z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/30 z-10" />

        {/* Top-left event badge */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span
            className="text-white/80 uppercase tracking-[0.25em] text-xs font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Event Recap
          </span>
        </div>

        {/* Top-right date tag */}
        <div className="absolute top-8 right-8 z-20">
          <div className="border border-white/25 rounded-full px-4 py-1.5 backdrop-blur-sm bg-white/5">
            <span
              className="text-white/70 text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Feb 2026
            </span>
          </div>
        </div>

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
