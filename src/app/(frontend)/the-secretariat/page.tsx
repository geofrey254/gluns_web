export const dynamic = 'force-dynamic'

import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import SecHero from '@/components/secretariatpage/SecHero'
import SecList from '@/components/secretariatpage/SecList'

export const metadata = {
  title: 'The Secretariat | GLUNS Leadership – Model United Nations Kenya, Africa & Global',
  description:
    'Meet the GLUNS Secretariat, the leadership team behind the Global Leaders United Nations Symposium. Learn about the experienced student and professional leaders guiding Model United Nations conferences in Kenya, across Africa, and internationally.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.PAYLOAD_URL || 'http://localhost:3000',
  ),

  openGraph: {
    title: 'The Secretariat – Leadership of GLUNS Model United Nations',
    description:
      'The GLUNS Secretariat is a dedicated leadership team overseeing Model United Nations conferences in Kenya, Africa, and internationally. Discover the individuals shaping diplomacy, debate, and youth leadership at GLUNS.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/the-secretariat`,
    images: [
      {
        url: '/seo/secretariat.jpg',
        width: 1200,
        height: 630,
        alt: 'GLUNS Secretariat – Leadership Team',
      },
    ],
    type: 'website',
    locale: 'en_KE',
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/the-secretariat`,
  },

  keywords: [
    // Brand
    'GLUNS',
    'Global Leaders United Nations Symposium',

    // Secretariat / Leadership
    'MUN Secretariat',
    'Model United Nations Secretariat',
    'MUN leadership team',
    'Model UN organizers',

    // Geography
    'Model United Nations Kenya',
    'MUN Kenya',
    'Model United Nations Africa',
    'MUN Africa',
    'International Model United Nations',

    // Authority
    'Youth leadership',
    'Student governance',
    'Diplomacy leadership',
    'International relations education',
  ],
}

export default async function page() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const {
    docs: [page],
  } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'the-secretariat' },
    },
  })

  if (!page) {
    return <div>Page not found</div>
  }

  // Render the page layout dynamically
  return (
    <>
      <SecHero />
      {page.layout?.map((block, index) => renderBlock(block, index))}
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderBlock(block: any, index: number) {
  switch (block.blockType) {
    case 'ourTeam':
      return <SecList key={index} block={block} />
    default:
      return null
  }
}
