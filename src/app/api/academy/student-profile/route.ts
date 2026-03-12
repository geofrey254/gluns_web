import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const headersList = await headers()

    const { user } = await payload.auth({
      headers: headersList,
    })

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (!user.roles?.includes('student')) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          username: user.username,
          institution: user.institution,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching student profile:', error)

    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
