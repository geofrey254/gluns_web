import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const result = await payload.find({
    collection: 'delegation-applications',
    where: {
      user: {
        equals: user.id,
      },
    },
    limit: 1,
  })

  return NextResponse.json({
    delegation: result.docs[0] || null,
  })
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const delegation = await payload.create({
    collection: 'delegation-applications',
    data: {
      ...body,
      user: user.id, // enforced server-side
    },
  })

  return NextResponse.json(delegation)
}
