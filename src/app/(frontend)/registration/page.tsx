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
        {/* <section className="relative">
          <div className="max-w-7xl 2xl:max-w-full mx-auto px-10 md:px-12 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              <RegistrationForm />
              <ContactInfo />
            </div>
          </div>
        </section> */}

        {/* page still under development statement */}
        <section className="relative">
          <div className="max-w-7xl 2xl:max-w-full mx-auto px-10 md:px-12 lg:px-12">
            <div className="grid lg:grid-cols-1 gap-16 lg:gap-24">
              <div className="text-center py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Registration Page Under Development
                </h2>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                  We are currently working on this page. Please check back later for updates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
