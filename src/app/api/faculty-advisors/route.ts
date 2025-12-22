// app/api/faculty-advisors/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await payload.find({
      collection: 'faculty-advisors',
      where: {
        teacher: {
          equals: user.id,
        },
      },
    })

    return NextResponse.json({
      facultyAdvisor: result.docs[0] || null,
    })
  } catch (error) {
    console.error('Error fetching faculty advisor:', error)
    return NextResponse.json({ message: 'Failed to fetch faculty advisor' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (user.roles !== 'teacher') {
    return NextResponse.json(
      { message: 'Only teachers can create faculty advisors' },
      { status: 403 },
    )
  }

  try {
    const body = await req.json()

    // Check if teacher already has a faculty advisor
    const existing = await payload.find({
      collection: 'faculty-advisors',
      where: {
        teacher: {
          equals: user.id,
        },
      },
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { message: 'Faculty advisor already exists. Use PATCH to update.' },
        { status: 400 },
      )
    }

    const facultyAdvisor = await payload.create({
      collection: 'faculty-advisors',
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        teacher: user.id, // Enforce server-side
      },
    })

    return NextResponse.json(facultyAdvisor, { status: 201 })
  } catch (error: any) {
    console.error('Error creating faculty advisor:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create faculty advisor' },
      { status: 400 },
    )
  }
}
