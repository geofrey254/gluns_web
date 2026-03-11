import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  try {
    const { fullName, email, username, password, age, ageGroup, enrollmentCode } = await req.json()

    if (!fullName || !email || !password || !enrollmentCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const normalizedCode = enrollmentCode.trim().toUpperCase()
    const normalizedEmail = email.trim().toLowerCase()

    // 1️⃣ Lookup institution
    const institutions = await payload.find({
      collection: 'institutions',
      where: { enrollmentCode: { equals: normalizedCode }, active: { equals: true } },
      limit: 1,
    })

    if (!institutions.docs || institutions.docs.length === 0) {
      return NextResponse.json({ error: 'Invalid or inactive access code' }, { status: 404 })
    }

    const institution = institutions.docs[0]

    // 2️⃣ Expiry check
    if (institution.expiresAt && new Date(institution.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This access code has expired' }, { status: 403 })
    }

    // 3️⃣ Seat availability
    const studentCount = await payload.find({
      collection: 'users',
      where: { institution: { equals: institution.id }, roles: { equals: 'student' } },
      limit: 1,
    })

    if (institution.maxStudents && studentCount.totalDocs >= institution.maxStudents) {
      return NextResponse.json(
        { error: 'No seats remaining for this access code' },
        { status: 403 },
      )
    }

    // 4️⃣ Prevent duplicate email for same institution
    const existingStudent = await payload.find({
      collection: 'users',
      where: { email: { equals: normalizedEmail }, institution: { equals: institution.id } },
      limit: 1,
    })

    if (existingStudent.totalDocs > 0) {
      return NextResponse.json(
        { error: 'Email already registered for this institution' },
        { status: 409 },
      )
    }

    // 5️⃣ Create student (Payload auth handles password hashing)
    const response = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
        fullName,
        username,
        roles: 'student',
        age: age || null,
        ageGroup: ageGroup,
        institution: institution.id,
      }),
    })

    const student = await response.json()

    // 6️⃣ Increment currentStudents
    await payload.update({
      collection: 'institutions',
      id: institution.id,
      data: { currentStudents: (institution.currentStudents || 0) + 1 },
    })

    return NextResponse.json({ success: true, studentId: student.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating student account:', error)
    console.error('Payload create error:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json({ error: 'Failed to create student account' }, { status: 500 })
  }
}
