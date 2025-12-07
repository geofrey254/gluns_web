import React from 'react'
import AboutHero from '@/components/aboutpage/AboutHero'
import Mission from '@/components/aboutpage/Mission'
import Functions from '@/components/aboutpage/Functions'
import Commitment from '@/components/aboutpage/Commitment'
import CTA from '@/components/homepage/CTA'

export default function page() {
  return (
    <>
    <AboutHero/>
    <Mission/>
    <Functions/>
    <Commitment/>
    <CTA/>
    </>
  )
}
