'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import RegisterForm from '@/components/eventspage/register/RegisterForm'
import RegisterHero from '@/components/eventspage/register/RegisterHero'
import ContactInfo from '@/components/contactpage/ContactInfo'

export default function SchoolRegistration() {
  const searchParams = useSearchParams()
  const eventFromUrl = searchParams.get('event') || ''

  return (
    <>
      <RegisterHero />
      <div className="py-10 md:py-12 -mt-6 md:-mt-7 bg-white rounded-t-4xl relative z-30 overflow-hidden">
        <section className="relative">
          <div className="max-w-7xl 2xl:max-w-full mx-auto px-10 md:px-12 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              <RegisterForm event={eventFromUrl} />
              <ContactInfo />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
