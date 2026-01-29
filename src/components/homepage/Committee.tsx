import React from 'react'
import { GrLinkNext } from 'react-icons/gr'
import Link from 'next/link'
import Image from 'next/image'
import { FaUsers } from 'react-icons/fa6'
import { fetchCommittee } from '@/data/committeeFetch'
import { HiArrowRight } from 'react-icons/hi2'

export default async function Committee() {
  const { committee } = await fetchCommittee()

  return (
    <section className="relative bg-[#ffffff] min-h-screen md:min-h-[60vh] lg:min-h-screen 2xl:min-h-auto rounded-t-3xl -mt-7 z-30 px-6 md:px-12 2xl:px-16 py-20 overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col justify-center items-center text-center mb-16">
        <h3 className="text-[#104179] text-xs tracking-widest border border-[#104179] rounded-xl px-4 py-1">
          Committees
        </h3>
        <h2 className="text-4xl md:text-5xl text-[#104179] mt-2 font-semibold">
          Explore Our Specialized Committees
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg 2xl:text-2xl leading-relaxed">
          GLUNS provides diverse committees that challenge students to debate, negotiate, and solve
          real-world issues from a global perspective.
        </p>
      </div>

      {/* Committees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {committee.slice(0, 3).map((committee, index) => (
          <div
            key={committee.id}
            className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image Container with Overlay */}
            <div className="relative w-full h-56 overflow-hidden">
              {typeof committee.photo === 'object' && committee.photo ? (
                <Image
                  src={committee.photo?.url || '/images/committee-placeholder.jpg'}
                  alt={committee.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-300">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}

              {/* Icon Badge */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-[#104179] text-xl" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col gap-4">
              <h3 className="text-2xl md:text-3xl font-bold text-[#104179] leading-tight">
                {committee.name}
              </h3>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3">
                {committee.description}
              </p>

              {/* CTA Link */}
              <Link
                href={`/committees/${committee.slug}`}
                className="inline-flex items-center gap-2 text-[#104179] font-semibold mt-2 group-hover:gap-4 transition-all duration-300"
              >
                <span>Learn More</span>
                <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-8">
        <Link
          href="/committees"
          className="flex items-center justify-center gap-4 border border-[#104179] text-[#104179] text-xl 2xl:text-2xl rounded-xl px-4 py-2 hover:scale-105 transition-transform delay-200"
        >
          Explore Committees
          <GrLinkNext className="-rotate-45" />
        </Link>
      </div>

      {/* Bottom Glow / Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#104179]/10 to-transparent pointer-events-none"></div>
    </section>
  )
}
