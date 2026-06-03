import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'

import { getGuideAuthCookieName, verifyGuideAuthToken } from '@/lib/background-guides'

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return undefined

  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim())

  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.slice(name.length + 1))
    }
  }

  return undefined
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const cookieName = getGuideAuthCookieName(id)
  const token = getCookieValue(req.headers.get('cookie'), cookieName)

  if (!verifyGuideAuthToken(token, id)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const guideResult = await payload.find({
    collection: 'background-guides',
    limit: 1,
    depth: 1,
    overrideAccess: true,
    where: {
      and: [{ id: { equals: id } }, { published: { equals: true } }],
    },
  })

  const guide = guideResult.docs[0]
  const guideFile = typeof guide?.guideFile === 'object' ? guide.guideFile : null

  if (!guide || !guideFile?.url) {
    return NextResponse.json({ message: 'Guide not found' }, { status: 404 })
  }

  const fileUrl = new URL(guideFile.url, process.env.NEXT_PUBLIC_PAYLOAD_URL || req.url)
  const upstream = await fetch(fileUrl, {
    headers: {
      Accept: '*/*',
    },
  })

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ message: 'Unable to stream file' }, { status: 502 })
  }

  const headers = new Headers()
  const contentType =
    upstream.headers.get('content-type') || guideFile.mimeType || 'application/octet-stream'
  const filename = guideFile.filename || `${guide.slug}.pdf`

  headers.set('Content-Type', contentType)
  headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate')
  headers.set('Content-Disposition', `attachment; filename="${filename.replace(/\"/g, '')}"`)

  const contentLength = upstream.headers.get('content-length')
  if (contentLength) {
    headers.set('Content-Length', contentLength)
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers,
  })
}
