'use client'
export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import { Mail, ArrowUpRight, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SecretariatMember } from '@/app/types/types'

interface TeamBlockProps {
  block: {
    team_profiles: Array<{
      id: number
      slug: string
      full_name: string
      email: string
      role: string
      bio: string
      photo: {
        url: string
        alt: string
      }
    }>
  }
}

export default function SecList({ block }: TeamBlockProps) {
  const [selectedMember, setSelectedMember] = useState<SecretariatMember | null>(null)
  const seclist = Array.isArray(block?.team_profiles) ? block.team_profiles : []

  if (!seclist) {
    const placeholderRoles = [
      'Secretary-General',
      'Deputy Secretary-General',
      'Director of Operations',
      'Chief of Staff',
      'Director of Communications',
      'Head of Delegate Affairs',
    ]

    return (
      <section className="relative bg-white pt-2 pb-12 px-6 md:px-8 2xl:px-16 overflow-hidden">
        {/* Background Pattern — same as populated state */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#104179] rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#104179] rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#104179] rounded-full" />
        </div>

        <div className="mx-auto relative z-10">
          {/* Ghost Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderRoles.map((role, index) => (
              <div
                key={index}
                className={`relative ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <div className="relative h-full min-h-[400px] overflow-hidden bg-[#104179]/5 border-2 border-dashed border-[#104179]/20">
                  {/* Subtle gradient wash */}
                  <div className="absolute inset-0 bg-linear-to-br from-[#104179]/5 via-transparent to-[#85c226]/5" />

                  {/* Silhouette figure */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <svg
                      viewBox="0 0 100 140"
                      className="w-32 h-44 fill-[#104179]"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="50" cy="35" r="22" />
                      <path d="M10 140 Q10 85 50 85 Q90 85 90 140Z" />
                    </svg>
                  </div>

                  {/* Content overlay — mirrors real card layout */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    {/* Top corner accent */}
                    <div className="flex justify-end">
                      <div className="w-16 h-16 flex items-center justify-center transform rotate-45 bg-[#104179]/15">
                        <ArrowUpRight className="w-6 h-6 text-[#104179]/25 transform -rotate-45" />
                      </div>
                    </div>

                    {/* Bottom content skeleton */}
                    <div>
                      <div className="mb-4">
                        <div className="w-12 h-1 bg-[#104179]/20 mb-4" />
                        {/* Name bar placeholder */}
                        <div className="h-7 w-40 bg-[#104179]/12 rounded mb-3" />
                        {/* Role label */}
                        <p className="text-[#104179]/35 font-medium uppercase tracking-widest text-xs">
                          {role}
                        </p>
                      </div>
                      <div className="h-4 w-24 bg-[#104179]/10 rounded" />
                    </div>
                  </div>

                  {/* Number badge */}
                  <div className="absolute top-8 left-8">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#104179]/12 text-[#104179]/25 font-black text-xl">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Centred announcement card, floating above the ghost grid */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm border border-[#104179]/20 shadow-2xl px-10 py-10 max-w-lg w-full text-center pointer-events-auto">
              {/* Icon block */}
              <div className="w-16 h-16 mx-auto mb-6 bg-[#104179] flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              {/* Label pill */}
              <span className="inline-block text-[#104179] text-xs tracking-widest border border-[#104179] px-4 py-1 mb-5 uppercase">
                Secretariat
              </span>

              <h2 className="text-[#104179] text-3xl md:text-4xl font-black mb-3 leading-tight">
                Meet the Team — <span className="text-[#85c226]">Coming Soon</span>
              </h2>

              <p className="text-[#104179]/55 text-sm md:text-base leading-relaxed mb-8">
                Our Secretariat is being assembled. Check back shortly to meet the team leading this
                year&apos;s conference.
              </p>

              {/* Decorative divider */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1 h-px bg-[#104179]/15" />
                <div className="w-2 h-2 bg-[#85c226]" />
                <div className="flex-1 h-px bg-[#104179]/15" />
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#104179] text-white px-7 py-3 font-semibold text-sm tracking-wide hover:bg-[#104179]/85 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="relative bg-white pt-2 pb-12 px-6 md:px-8 2xl:px-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full"
          style={{ backgroundColor: '#104179' }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full"
          style={{ backgroundColor: '#104179' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full"
          style={{ backgroundColor: '#104179' }}
        ></div>
      </div>

      <div className="mx-auto relative z-10">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seclist.map((sec, index) => (
            <div
              key={index}
              onClick={() => setSelectedMember(sec)}
              className={`relative cursor-pointer group ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              } }`}
            >
              <div className="relative h-full min-h-[400px] overflow-hidden">
                {/* Image Container */}
                <div className="absolute inset-0">
                  {sec.photo.url && (
                    <Image
                      width={1024}
                      height={1024}
                      src={sec.photo.url}
                      alt={sec.photo?.alt || sec.full_name || 'Profile photo'}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* Top Corner Accent */}
                  <div className="flex justify-end">
                    <div
                      className="w-16 h-16 flex items-center justify-center transform rotate-45 opacity-90"
                      style={{ backgroundColor: '#104179' }}
                    >
                      <ArrowUpRight className="w-6 h-6 text-white transform -rotate-45" />
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="text-white">
                    <div className="mb-4">
                      <div className="w-12 h-1 bg-[#85c226] mb-4"></div>
                      <h3 className="text-3xl font-bold mb-2 leading-tight uppercase">
                        {sec.full_name}
                      </h3>
                      <p className="text-lg font-medium opacity-90 mb-4">{sec.role}</p>
                    </div>

                    {/* Hover Actions */}
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        href={`mailto:${sec.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Contact</span>
                      </Link>
                      <span className="text-sm font-semibold">View Profile →</span>
                    </div>
                  </div>
                </div>

                {/* Number Badge */}
                <div className="absolute top-8 left-8">
                  <div className="w-12 h-12 bg-[#104179] flex items-center justify-center text-white font-black text-xl">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-[#0d0d0d] bg-opacity-80 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 cursor-pointer flex items-center justify-center bg-white hover:bg-gray-100 transition-colors"
              style={{ color: '#104179' }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header with Image */}
            <div className="relative h-80">
              <div className="absolute inset-0 bg-[#104179]"></div>

              {selectedMember.photo && (
                <Image
                  width={400}
                  height={200}
                  src={selectedMember.photo.url}
                  alt={selectedMember.photo?.alt || selectedMember.full_name || 'Profile photo'}
                  className="w-44 h-44 md:w-72 md:h-72 object-cover object-top absolute left-4 top-4 md:right-28 md:bottom-8 rounded-3xl border border-white"
                />
              )}

              <div className="absolute -bottom-8 md:bottom-0 -left-6 md:left-80 p-12 text-white">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold md:mb-3 uppercase">
                  {selectedMember.full_name}
                </h3>
                <p className="text-2xl font-medium">{selectedMember.role}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div
                className="flex items-center gap-4 mb-8 pb-8 border-b-2"
                style={{ borderColor: '#104179' }}
              >
                <Link
                  href={`mailto:${selectedMember.email}`}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                  style={{ color: '#104179' }}
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">{selectedMember.email}</span>
                </Link>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {selectedMember.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
