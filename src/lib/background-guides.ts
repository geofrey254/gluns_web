import crypto from 'crypto'

import type { GuideRecord } from '@/types/background-guides'

const COOKIE_TTL_SECONDS = 60 * 60
const GUIDE_AUTH_COOKIE_PREFIX = 'bg-guide-auth-'
const SIGNATURE_SEPARATOR = '.'

function getSigningSecret() {
  const secret = process.env.PAYLOAD_SECRET || process.env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error('Missing signing secret for background guide downloads')
  }

  return secret
}

export function getGuideAuthCookieName(guideId: string | number) {
  return `${GUIDE_AUTH_COOKIE_PREFIX}${guideId}`
}

export function createGuideAuthToken(guideId: string | number) {
  const expiresAt = Date.now() + COOKIE_TTL_SECONDS * 1000
  const payload = `${guideId}:${expiresAt}`
  const signature = crypto
    .createHmac('sha256', getSigningSecret())
    .update(payload)
    .digest('base64url')

  return `${payload}${SIGNATURE_SEPARATOR}${signature}`
}

export function verifyGuideAuthToken(token: string | undefined, guideId: string | number) {
  if (!token) return false

  const parts = token.split(SIGNATURE_SEPARATOR)
  if (parts.length !== 2) return false

  const [payload, signature] = parts
  const [tokenGuideId, expiresAtString] = payload.split(':')

  if (`${tokenGuideId}` !== `${guideId}`) return false

  const expiresAt = Number(expiresAtString)
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false

  const expectedSignature = crypto
    .createHmac('sha256', getSigningSecret())
    .update(payload)
    .digest('base64url')

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (signatureBuffer.length !== expectedBuffer.length) return false

  return crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
}

type GuideVerificationState = {
  attempts: number
  resetAt: number
}

const verificationAttempts = new Map<string, GuideVerificationState>()
const VERIFICATION_LIMIT = 5
const VERIFICATION_WINDOW_MS = 15 * 60 * 1000

export function getGuideClientIp(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return realIp || 'unknown'
}

export function getGuideRateLimitKey(req: Request, slug: string) {
  return `${getGuideClientIp(req)}:${slug}`
}

export function takeGuideVerificationSlot(key: string) {
  const now = Date.now()
  const state = verificationAttempts.get(key)

  if (!state || state.resetAt <= now) {
    verificationAttempts.set(key, { attempts: 1, resetAt: now + VERIFICATION_WINDOW_MS })

    return { allowed: true as const, retryAfterSeconds: VERIFICATION_WINDOW_MS / 1000 }
  }

  if (state.attempts >= VERIFICATION_LIMIT) {
    return { allowed: false as const, retryAfterSeconds: Math.ceil((state.resetAt - now) / 1000) }
  }

  state.attempts += 1
  verificationAttempts.set(key, state)

  return { allowed: true as const, retryAfterSeconds: Math.ceil((state.resetAt - now) / 1000) }
}

export function logFailedGuideAttempt(details: { slug: string; ip: string; reason: string }) {
  console.warn('[background-guides] failed verification attempt', details)
}

export function isAllowedGuideFileMimeType(mimeType?: string | null) {
  return mimeType === 'application/pdf' || mimeType === 'application/zip'
}

export function normalizeGuideRecord(guide: GuideRecord) {
  return guide
}
