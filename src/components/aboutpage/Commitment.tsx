import React from 'react'
import Image from 'next/image'

export default function Commitment() {
  return (
    <section className="relative bg-[#ffffff] w-full md:min-h-[60vh] rounded-t-3xl -mt-7 z-30 px-8 md:px-16 2xl:px-18 py-12 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 md:gap-0">
        <div className="col-span-12 md:col-span-4 mb-2 md:mb-0">
          <h2 className="text-5xl md:text-7xl text-[rgb(16,65,121)]">Our Commitment</h2>
        </div>
        <div className="col-span-12 md:col-span-8 flex flex-col md:justify-end md:items-end gap-8 text-[#104179] mb-12 md:mb-0">
         <p className='text-xl 2xl:text-2xl font-light md:font-normal'>GLUNS is committed to creating a safe, inclusive, and intellectually stimulating environment where every student{"'"}s voice matters. We provide high-quality programming delivered by experienced facilitators, mentors, and international relations professionals.</p>
        </div>
      </div>

      {/* Creative Image Layout */}
      <div className="md:mt-16  mb-8 grid grid-cols-12 gap-4 md:gap-6">
        {/* Large featured image */}
        <div className="col-span-12 md:col-span-7 h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg">
          <Image width={400} height={200} 
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80" 
            alt="Students collaborating in Model UN" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Two stacked smaller images */}
        <div className="col-span-12 md:col-span-5 flex flex-col gap-4 md:gap-6">
          <div className="h-32 md:h-44 rounded-2xl overflow-hidden shadow-lg">
            <Image width={400} height={200} 
              src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80" 
              alt="Diverse group discussion" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="h-32 md:h-44 rounded-2xl overflow-hidden shadow-lg">
            <Image width={400} height={200} 
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80" 
              alt="Professional mentorship session" 
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Bottom row with three images */}
        <div className="col-span-12 md:col-span-4 h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg">
          <Image width={400} height={200} 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" 
            alt="Team collaboration" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="col-span-12 md:col-span-5 h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg">
          <Image width={400} height={200} 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" 
            alt="Students working together" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="col-span-12 md:col-span-3 h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg">
          <Image width={400} height={200}  
            src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80" 
            alt="Focused learning environment" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  )
}