import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  try {
    const { code } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Access code is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Normalize code (trim + uppercase)
    const normalizedCode = code.trim().toUpperCase()

    // Lookup institution
    const result = await payload.find({
      collection: 'institutions',
      where: {
        enrollmentCode: { equals: normalizedCode },
        active: { equals: true },
      },
    })

    if (!result.docs || result.docs.length === 0) {
      return NextResponse.json({ error: 'Invalid or inactive access code' }, { status: 404 })
    }

    const institution = result.docs[0]

    // Expiry check
    if (institution.expiresAt && new Date(institution.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This access code has expired' }, { status: 403 })
    }

    // Compute current students dynamically to avoid race conditions
    const studentCount = await payload.find({
      collection: 'users',
      where: {
        institution: { equals: institution.id },
        role: { equals: 'student' },
      },
    })

    if (institution.maxStudents && studentCount.totalDocs >= institution.maxStudents) {
      return NextResponse.json(
        { error: 'This access code has reached its student limit' },
        { status: 403 },
      )
    }

    // Return minimal info for UX only
    return NextResponse.json(
      {
        active: true,
        institutionName: institution.name,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error validating access code:', error)
    return NextResponse.json({ error: 'Failed to validate access code' }, { status: 500 })
  }
}
