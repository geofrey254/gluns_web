import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoLocationSharp } from 'react-icons/io5'
import { fetchEvents } from '@/data/eventFetch'
import { HiArrowRight } from 'react-icons/hi2'

export default async function EventsList() {
  const { events } = await fetchEvents()
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  if (events.length === 0) {
    return (
      <section className="relative bg-[#0d0d0d] min-h-screen md:min-h-[60vh] lg:min-h-screen rounded-t-3xl -mt-7 z-30 px-6 md:px-12 2xl:px-18 py-12 overflow-hidden">
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-8">
          {/* Icon/Illustration */}
          <div className="relative mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-linear-to-br from-[#104179]/10 to-[#85c226]/10 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 text-[#85c226]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#85c226] rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#104179] rounded-full animate-pulse delay-300"></div>
          </div>

          {/* Text Content */}
          <h3 className="text-2xl md:text-3xl font-bold text-[#104179] mb-3">
            No Events Scheduled Yet
          </h3>
          <p className="text-[#104179]/70 text-center text-base md:text-lg mb-8 px-4">
            We{"'"}re currently planning exciting new Model UN events. Check back soon for updates
            on upcoming conferences and workshops!
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/contact"
              className="border-2 border-[#104179] text-[#104179] px-6 py-3 rounded-xl font-semibold hover:bg-[#104179] hover:text-white transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-[#0d0d0d] min-h-screen md:min-h-[60vh] lg:min-h-screen z-30 px-6 md:px-12 2xl:px-18 py-6 overflow-hidden">
      {/* Events Grid */}
      <div className="">
        {events.map((event, index) => (
          <div key={index} className="border-b border-[#85c226] py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6">
              <div className="flex flex-col md:flex-col justify-between items-start gap-4">
                <Link href={`/events/${event.slug}`} className="flex items-center gap-2">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-semibold text-white uppercase lg:w-2xl">
                    {event.title}
                  </h3>
                </Link>
                <span>
                  <span className="text-white/65 text-lg md:text-xl 2xl:text-3xl ml-1">
                    {event.location}
                  </span>
                </span>
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <span className="text-white/65 text-lg md:text-3xl">
                  {new Date(event.date).toLocaleDateString(undefined, dateOptions)}
                </span>

                {/* vertical divider */}
                <div className="hidden md:block w-1 h-8 bg-[#85c226]"></div>

                {event.cost && (
                  <div>
                    <p className="text-4xl font-bold text-[#85c226]">
                      {event.currency === 'USD'
                        ? '$'
                        : event.currency === 'KES'
                          ? 'KSh '
                          : event.currency === 'EUR'
                            ? '€'
                            : ''}
                      {/* separate values in comma */}
                      {event.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
