import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  // 1️⃣ Create user
  const signupRes = await fetch(`${process.env.PAYLOAD_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
      delegationName: body.delegationName, // your extra field
    }),
  })

  const signupData = await signupRes.json()

  if (!signupRes.ok) {
    return NextResponse.json(
      { message: signupData.errors?.[0]?.message || 'Signup failed' },
      { status: 400 },
    )
  }

  // 2️⃣ Log in the new user to get the HTTP-only cookie
  const loginRes = await fetch(`${process.env.PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email: body.email, password: body.password }),
  })

  const loginData = await loginRes.json()

  if (!loginRes.ok) {
    return NextResponse.json(
      { message: loginData.errors?.[0]?.message || 'Login after signup failed' },
      { status: 400 },
    )
  }

  // Grab the HTTP-only cookie from Payload CMS response
  const cookie = loginRes.headers.get('set-cookie')
  const response = NextResponse.json(loginData)
  if (cookie) response.headers.set('set-cookie', cookie)

  return response
}
