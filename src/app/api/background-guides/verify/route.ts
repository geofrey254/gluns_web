import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'

import {
  createGuideAuthToken,
  getGuideAuthCookieName,
  getGuideRateLimitKey,
  logFailedGuideAttempt,
  takeGuideVerificationSlot,
} from '@/lib/background-guides'

const DUMMY_PASSWORD_HASH = bcrypt.hashSync('background-guides-placeholder', 10)

function getOrigin(req: Request) {
  return req.headers.get('origin') || ''
}

function getExpectedOrigin(req: Request) {
  const allowedOrigins = new Set<string>()

  for (const candidate of [process.env.NEXT_PUBLIC_PAYLOAD_URL, process.env.PAYLOAD_URL, req.url]) {
    if (!candidate) continue

    try {
      allowedOrigins.add(new URL(candidate).origin)
    } catch {
      continue
    }
  }

  return allowedOrigins
}

export async function POST(req: Request) {
  const origin = getOrigin(req)
  const expectedOrigins = getExpectedOrigin(req)

  if (origin && !expectedOrigins.has(origin)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  let body: { slug?: string; password?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }

  const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!slug || !password) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }

  const rateLimitKey = getGuideRateLimitKey(req, slug)
  const rateLimitState = takeGuideVerificationSlot(rateLimitKey)

  if (!rateLimitState.allowed) {
    return NextResponse.json(
      { message: 'Too many attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': `${rateLimitState.retryAfterSeconds}`,
        },
      },
    )
  }

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const guideResult = await payload.find({
    collection: 'background-guides',
    limit: 1,
    depth: 0,
    overrideAccess: true,
    where: {
      and: [{ slug: { equals: slug } }, { published: { equals: true } }],
    },
  })

  const guide = guideResult.docs[0]
  const passwordHash =
    typeof guide?.passwordHash === 'string' ? guide.passwordHash : DUMMY_PASSWORD_HASH

  const passwordMatches = await bcrypt.compare(password, passwordHash)

  if (!guide || !passwordMatches) {
    logFailedGuideAttempt({
      slug,
      ip: rateLimitKey.split(':')[0] || 'unknown',
      reason: guide ? 'password-mismatch' : 'guide-not-found',
    })

    return NextResponse.json({ message: 'Invalid guide credentials' }, { status: 401 })
  }

  const token = createGuideAuthToken(guide.id)
  const response = NextResponse.json({ success: true }, { status: 200 })

  response.cookies.set(getGuideAuthCookieName(guide.id), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60,
  })

  return response
}
