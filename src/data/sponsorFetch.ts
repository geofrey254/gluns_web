import config from '@/payload.config'
import { getPayload } from 'payload'
import type { Portrait } from '@/payload-types'

export async function fetchSponsor() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'sponsors',
    depth: 2,
    pagination: false,
  })

  const sponsors = result.docs.map((doc) => {
    const photo = typeof doc.logo === 'object' && doc.logo !== null ? (doc.logo as Portrait) : null

    return {
      id: doc.id,
      name: doc.name,
      photoUrl: photo?.url ?? '',
      photoAlt: photo?.alt,
    }
  })

  return { sponsors }
}
