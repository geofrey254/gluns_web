import type { Endpoint } from 'payload'
import { assignCountriesRandomly } from '../app/utils/assignCountriesRandomly'

export const assignCountriesEndpoint: Endpoint = {
  path: '/assign-countries',
  method: 'post',
  handler: async (req) => {
    const payload = req.payload
    const user = req.user

    if (!user || user.roles !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
    }

    let body = {}
    try {
      body = await req.json?.()
    } catch {
      body = {}
    }
    const { delegateId } = body as { delegateId?: string }

    try {
      const result = await assignCountriesRandomly(payload, delegateId)
      return new Response(JSON.stringify(result), { status: 200 })
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 400 })
    }
  },
}
