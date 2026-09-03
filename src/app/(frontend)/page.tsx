import React from 'react'
import Hero from '@/components/homepage/Hero'
import HomeAboutStats from '@/components/homepage/HomeAboutStats'
import HomeAbout from '@/components/homepage/HomeAbout'
import SchoolMarquee from '@/components/homepage/SchoolMarquee'
import Committee from '@/components/homepage/Committee'
import Events from '@/components/homepage/Events'
import CTA from '@/components/homepage/CTA'
import Video from '@/components/homepage/Video'

export default function page() {
  return (
    <>
      <Hero />
      <HomeAboutStats />
      <SchoolMarquee />
      <HomeAbout />
      <Video />
      <Events />
      <Committee />
      <CTA />
    </>
  )
}
