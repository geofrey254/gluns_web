'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 0.8 },
    },
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
  }

  return (
    <motion.section
      id="about-hero"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="py-20 md:py-16 px-8 md:px-12 bg-[#104179] dark:border-t dark:border-white relative z-30 shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-12 md:gap-8"
    >
      <div className="w-full h-full flex flex-col md:flex-row justify-center items-center">
        {/* left */}
        <motion.div
          variants={fadeUp}
          className="w-full flex flex-col order-2 mx-auto justify-center items-start md:order-2 md:w-[60%]"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-4">
            <div className="w-2 h-2 bg-[#85c226] rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-semibold tracking-wider uppercase">
              About GLUNS
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Empowering Future Global Leaders
            </h1>

            <p className="text-white leading-relaxed text-xl md:text-2xl">
              The Global Leaders United Nations Symposium (GLUNS) is a transformative leadership and
              diplomacy platform designed for high school students who are ready to engage with the
              world{"'"}s most pressing issues. Through carefully curated simulations, debates,
              workshops, and cultural exchanges, GLUNS empowers young people to become confident
              communicators, ethical leaders, and globally conscious citizens.
            </p>
          </div>
        </motion.div>

        {/* right */}
        <motion.div
          variants={fadeUp}
          className="flex mb-12 md:mb-0 order-1 md:order-2 relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:scale-105 transition-transform duration-500"
        >
          <Image src="/logos/4.png" width={500} height={500} alt="GLUNS Logo" className="w-72" />
        </motion.div>
      </div>

      <div className="absolute top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 -right-20 w-60 h-60 bg-white/1 rounded-full blur-3xl pointer-events-none"></div>
    </motion.section>
  )
}
