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
    const where: any = {
      delegation: { equals: delegationId },
    }

    // Teachers only see their own delegates’ assignments
    if (user.roles.includes('teacher')) {
      where['delegates.teacher'] = { equals: Number(user.id) }
    }

    const result = await payload.find({
      collection: 'committee-assignments',
      where,
      depth: 2, // delegates, committee, country, positionPaper
      sort: '-assignedAt',
      limit: 500,
    })

    return NextResponse.json({
      assignments: result.docs,
      total: result.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching committee assignments:', error)
    return NextResponse.json({ message: 'Failed to fetch committee assignments' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (!user.roles.includes('admin') && !user.roles.includes('teacher')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
  }

  const { delegation, delegates, committee, country } = body

  if (!delegation || !Array.isArray(delegates) || !committee || !country) {
    return NextResponse.json(
      { message: 'delegation, delegates[], committee, and country are required' },
      { status: 400 },
    )
  }

  if (delegates.length < 1 || delegates.length > 2) {
    return NextResponse.json({ message: 'Assignments must have 1 or 2 delegates' }, { status: 400 })
  }

  try {
    const assignment = await payload.create({
      collection: 'committee-assignments',
      data: {
        delegation,
        delegates,
        committee,
        country,
        assignedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ assignment })
  } catch (error: any) {
    console.error('Error creating assignment:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create assignment' },
      { status: 500 },
    )
  }
}

export async function PATCH(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (!user.roles.includes('admin') && !user.roles.includes('teacher')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
  }

  const { assignmentId, positionPaper } = body

  if (!assignmentId) {
    return NextResponse.json({ message: 'assignmentId is required' }, { status: 400 })
  }

  if (!positionPaper) {
    return NextResponse.json({ message: 'positionPaper is required' }, { status: 400 })
  }

  try {
    const updated = await payload.update({
      collection: 'committee-assignments',
      id: assignmentId,
      data: { positionPaper },
    })

    return NextResponse.json({ assignment: updated })
  } catch (error: any) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to update assignment' },
      { status: 500 },
    )
  }
}
