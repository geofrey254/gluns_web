export const dynamic = 'force-dynamic'

import React from 'react'
import RegisterHero from '@/components/registrationPage/RegisterHero'
import RegistrationForm from '@/components/registrationPage/Registration'
import ContactInfo from '@/components/contactpage/ContactInfo'

export default function page() {
  return (
    <div>
      <RegisterHero />
      {/* Main Content */}
      <div className="py-10 md:py-12 -mt-6 md:-mt-7 bg-white rounded-t-4xl relative z-30 overflow-hidden">
        <section className="relative">
          <div className="max-w-7xl 2xl:max-w-full mx-auto px-10 md:px-12 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              <RegistrationForm />
              <ContactInfo />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
