import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const result = await payload.login({
      collection: 'students',
      data: {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      },
    })

    const response = NextResponse.json(
      {
        user: result.user,
        exp: result.exp,
      },
      { status: 200 },
    )

    // Properly set auth cookie
    if (result.token) {
      response.cookies.set({
        name: 'payload-token',
        value: result.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }

    return response
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid credentials' }, { status: 401 })
  }
}
