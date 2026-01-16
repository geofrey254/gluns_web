import React from 'react'
import ContactHero from '@/components/contactpage/ContactHero'
import ContactForm from '@/components/contactpage/ContactForm'
import ContactInfo from '@/components/contactpage/ContactInfo'
import ContactCTA from '@/components/contactpage/ContactCTA'

export default function page() {
  return (
    <>
      <ContactHero />

      {/* Main Content */}
      <div className="py-10 md:py-12 -mt-6 md:-mt-7 bg-white rounded-t-4xl relative z-30 overflow-hidden">
        <section className="relative">
          <div className="max-w-7xl 2xl:max-w-full mx-auto px-10 md:px-12 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </section>
      </div>

      <ContactCTA />
    </>
  )
}
