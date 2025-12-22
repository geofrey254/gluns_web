import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// delegates collection
export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const result = await payload.find({
    collection: 'delegates',
    where: {
      user: {
        equals: user.id,
      },
    },
  })

  return NextResponse.json({
    delegates: result.docs || [],
  })
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const delegate = await payload.create({
    collection: 'delegates',
    data: {
      ...body,
      user: user.id, // enforced server-side
    },
  })

  return NextResponse.json(delegate)
}

export async function DELETE(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const delegateId = searchParams.get('id')

  if (!delegateId) {
    return NextResponse.json({ message: 'Delegate ID is required' }, { status: 400 })
  }

  try {
    await payload.delete({
      collection: 'delegates',
      id: delegateId,
    })

    return NextResponse.json({ message: 'Delegate deleted successfully' })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete delegate' }, { status: 400 })
  }
}

export async function PATCH(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id, ...updateData } = body

  if (!id) {
    return NextResponse.json({ message: 'Delegate ID is required' }, { status: 400 })
  }

  try {
    const updatedDelegate = await payload.update({
      collection: 'delegates',
      id: id,
      data: updateData,
    })

    return NextResponse.json(updatedDelegate)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update delegate' }, { status: 400 })
  }
}
