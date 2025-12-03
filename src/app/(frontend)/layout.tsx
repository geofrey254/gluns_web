import React from 'react'
import './styles.css'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import { Barlow_Condensed } from 'next/font/google'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow',
})

export const metadata = {
  title: 'GLUNS — Global Leaders United Nations Symposium',
  description:
    'GLUNS is a premier Model United Nations symposium empowering high school students with leadership, diplomacy, and global policy skills through immersive debates, workshops, and collaborative simulations.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={`${barlow.className} font-sans bg-white text-black`}>
        <main>
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}
