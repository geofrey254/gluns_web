'use client'
import React, { useRef } from 'react'

const institutions = [
  'Alliance High School',
  'Moi Girls School Nairobi',
  'Light Academy',
  'Kenya High School',
  'Bishop Gatimu Ngandu Girls',
  'Pioneer Schools',
  'Damacrest Group of Schools',
  'Loreto Convent Valley Road',
]

const MARQUEE_STYLES = `
  .marquee-viewport {
    overflow: hidden;
    width: 100%;
    -webkit-mask-image: linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%);
  }
  .marquee-track {
    display: flex;
    width: max-content;
    gap: 1rem;
    animation: gluns-marquee 28s linear infinite;
    will-change: transform;
  }
  .marquee-track-reverse {
    animation-direction: reverse;
    animation-duration: 34s;
  }
  .marquee-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.92);
    border-radius: 9999px;
    padding: 0.85rem 1.2rem;
    font-size: clamp(0.9rem, 1.2vw, 1.1rem);
    letter-spacing: 0.02em;
  }
  .marquee-viewport:hover .marquee-track {
    animation-play-state: paused;
  }
  @keyframes gluns-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .marquee-track { animation: none; }
  }
  @media (max-width: 640px) {
    .marquee-track { gap: 0.75rem; animation-duration: 24s; }
    .marquee-item { padding: 0.72rem 1rem; font-size: 0.85rem; }
  }
`

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="marquee-viewport" aria-hidden="true">
      <div className={`marquee-track ${reverse ? 'marquee-track-reverse' : ''}`}>
        {[...institutions, ...institutions].map((institution, index) => (
          <div key={`${institution}-${index}`} className="marquee-item">
            <span>{institution}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SchoolMarquee() {
  return (
    <section className="relative overflow-hidden bg-[#0d0d0d] border-y border-white/10">
      {/* Screen-reader-only, non-animated list so the content is always accessible */}
      <ul className="sr-only">
        {institutions.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>

      <div className="mx-auto max-w-7xl px-0 pt-8 md:pt-10 2xl:pt-14 pb-16 md:pb-14 2xl:pb-16">
        <div className="space-y-4 md:space-y-5">
          <MarqueeRow />
          <MarqueeRow reverse />
        </div>
      </div>
      <style>{MARQUEE_STYLES}</style>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Alternative: manual, scroll-snap carousel                          */
/*  No CSS animation/keyframes at all, so there's nothing a bundler    */
/*  can "drop." Uses native scroll-snap + arrow buttons. Fully         */
/*  keyboard and screen-reader accessible, works everywhere.           */
/* ------------------------------------------------------------------ */

export function SchoolCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('[data-card]') as HTMLElement | null
    const distance = card ? card.offsetWidth + 16 : 240
    track.scrollBy({ left: distance * direction, behavior: 'smooth' })
  }

  return (
    <section className="relative bg-[#0d0d0d] border-y border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-8 2xl:px-16 py-10 md:py-12 2xl:py-14">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs md:text-sm 2xl:text-base uppercase tracking-[0.35em] text-white/45">
              Institutions
            </p>
            <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-white">
              Schools in our community
            </h2>
          </div>

          <div className="flex gap-2 self-start md:self-auto">
            <button
              type="button"
              aria-label="Previous school"
              onClick={() => scrollByCard(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/16 text-white/80 transition hover:border-white/40 hover:text-white"
            >
              &#8249;
            </button>
            <button
              type="button"
              aria-label="Next school"
              onClick={() => scrollByCard(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/16 text-white/80 transition hover:border-white/40 hover:text-white"
            >
              &#8250;
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {institutions.map((institution) => (
            <div
              key={institution}
              data-card
              className="snap-start shrink-0 flex items-center justify-center rounded-2xl border border-white/16 bg-white/[0.04] px-6 py-8 text-center text-white/92"
              style={{ minWidth: '220px' }}
            >
              <span className="text-base md:text-lg font-medium">{institution}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .no-scrollbar {
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default SchoolMarquee
