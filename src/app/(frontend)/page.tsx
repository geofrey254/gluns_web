import React from 'react'
import Hero from '@/components/homepage/Hero'
import About from '@/components/homepage/About'
import Why from '@/components/homepage/Why'
import Committee from '@/components/homepage/Committee'
import Events from '@/components/homepage/Events'

export default function page() {
  return (
    <>
      <Hero />
      <About />
      <Why/>
      <Committee/>
      <Events/>
    </>
  )
}
