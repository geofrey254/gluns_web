// app/api/me/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || ''

  const res = await fetch(`${process.env.PAYLOAD_URL}/api/users/me`, {
    headers: { cookie },
  })

  if (!res.ok) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  const user = await res.json()
  return NextResponse.json({ user })
}
