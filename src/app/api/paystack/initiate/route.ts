import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const PRICE_PER_DELEGATE_NGN = 10

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  /**
   * 1. Authenticate & narrow to Users collection
   */
  const { user } = await payload.auth({ headers: req.headers })

  if (!user || user.collection !== 'users') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (!user.email) {
    return NextResponse.json({ message: 'User email missing' }, { status: 400 })
  }

  const teacherId = Number(user.id)
  if (Number.isNaN(teacherId)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 })
  }

  /**
   * 2. Environment validation
   */
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ message: 'Paystack key missing' }, { status: 500 })
  }

  /**
   * 3. Parse & validate request body
   */
  let body: {
    delegateSlotsPurchased?: number
    delegationId?: number
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const { delegateSlotsPurchased, delegationId } = body

  if (typeof delegateSlotsPurchased !== 'number' || delegateSlotsPurchased <= 0) {
    return NextResponse.json({ message: 'Invalid delegate slots' }, { status: 400 })
  }

  if (typeof delegationId !== 'number') {
    return NextResponse.json({ message: 'Delegation ID required' }, { status: 400 })
  }

  /**
   * 4. Initialize Paystack transaction
   */
  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',

      body: JSON.stringify({
        email: user.email,
        amount: delegateSlotsPurchased * PRICE_PER_DELEGATE_NGN * 100,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paystack/verify`,
        metadata: {
          teacherId,
          delegationId,
          delegateSlotsPurchased,
        },
      }),
    })

    const data = await response.json()

    if (!data?.status) {
      return NextResponse.json(
        { message: data?.message || 'Paystack initialization failed' },
        { status: 400 },
      )
    }

    return NextResponse.json(data.data)
  } catch (error) {
    console.error('Paystack initiate error:', error)
    return NextResponse.json({ message: 'Payment initialization failed' }, { status: 500 })
  }
}
