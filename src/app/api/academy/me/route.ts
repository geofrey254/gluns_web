import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config })

    const { user } = await payload.auth({
      headers: req.headers,
    })

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json({ user }, { status: 200 })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
}
