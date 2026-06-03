import { NextResponse } from 'next/server'

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.PAYLOAD_URL || '').replace(
    /\/$/,
    '',
  )
  const sitemap = base ? `${base}/sitemap.xml` : '/sitemap.xml'

  const lines = [
    'User-agent: *',
    'Disallow: /api/',
    'Disallow: /admin/',

    'Allow: /',
    '',
    `Sitemap: ${sitemap}`,
  ]

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
