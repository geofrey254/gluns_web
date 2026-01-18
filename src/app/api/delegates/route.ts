/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const delegationIdStr = new URL(req.url).searchParams.get('delegationId')
  const delegationId = Number(delegationIdStr)

  if (!delegationId || isNaN(delegationId)) {
    return NextResponse.json({ message: 'Invalid delegation ID' }, { status: 400 })
  }

  try {
    const result = await payload.find({
      collection: 'delegates',
      where: {
        teacher: { equals: user.id },
        delegation: { equals: delegationId },
      },
      sort: 'createdAt',
    })

    return NextResponse.json({
      delegates: result.docs,
      total: result.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching delegates:', error)
    return NextResponse.json({ message: 'Failed to fetch delegates' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  // Authenticate user
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  if (user.collection !== 'users') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // Now TypeScript knows `roles` exists
  if (user.roles !== 'teacher') {
    return NextResponse.json({ message: 'Only teachers can add delegates' }, { status: 403 })
  }

  // 2️⃣ Parse body
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
  }

  try {
    // 3️⃣ Fetch approved delegation
    const delegationResult = await payload.find({
      collection: 'delegation-applications',
      where: {
        user: { equals: user.id },
        status: { equals: 'approved' },
      },
      limit: 1,
    })

    if (!delegationResult.docs.length) {
      return NextResponse.json(
        { message: 'No approved delegation application found' },
        { status: 400 },
      )
    }

    const delegation = delegationResult.docs[0]
    const teacherId = Number(user.id)
    const delegationId = Number(delegation.id)

    if (isNaN(teacherId) || isNaN(delegationId)) {
      return NextResponse.json({ message: 'Invalid teacher or delegation ID' }, { status: 400 })
    }

    // 4️⃣ Count existing delegates for this teacher + delegation
    const existingDelegates = await payload.find({
      collection: 'delegates',
      where: {
        teacher: { equals: teacherId },
        delegation: { equals: delegationId },
      },
      limit: 0,
    })

    // 5️⃣ Fetch total paid slots
    const payments = await payload.find({
      collection: 'payments',
      where: {
        teacher: { equals: teacherId },
        delegation: { equals: delegationId },
        status: { equals: 'paid' },
      },
      limit: 0,
    })

    const totalPaidSlots = payments.docs.reduce(
      (acc, p) => acc + (p.delegateSlotsPurchased || 0),
      0,
    )

    if (existingDelegates.totalDocs >= totalPaidSlots) {
      return NextResponse.json(
        {
          message: `You can only add ${totalPaidSlots} delegate(s). Please purchase more slots.`,
        },
        { status: 400 },
      )
    }

    // 6️⃣ Create new delegate
    const newDelegate = await payload.create({
      collection: 'delegates',
      data: {
        ...body,
        teacher: teacherId,
        delegation: delegationId,
      },
    })

    return NextResponse.json(newDelegate)
  } catch (error: any) {
    console.error('Error creating delegate:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create delegate' },
      { status: 500 },
    )
  }
}
