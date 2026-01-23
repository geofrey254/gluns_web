import config from '@/payload.config'
import { getPayload } from 'payload'

export async function fetchCommittee() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'committees', // required
    depth: 2,
    pagination: false,
  })

  return {
    committee: result.docs.map((committee) => ({
      id: committee.id,
      name: committee.title,
      slug: committee.slug,
      description: committee.description,
      photo: committee.committee_photo,
      code: committee.committee_code,
      category:
        typeof committee.committee_category === 'object' && committee.committee_category
          ? {
              id: committee.committee_category.id,
              name: committee.committee_category.name,
            }
          : null,
    })),
  }
}

export async function fetchCommitteeTeam(committeeId: number | string) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'committee-team',
    depth: 1,
    pagination: false,
    where: {
      committee: {
        equals: committeeId,
      },
    },
    sort: 'rank',
  })

  return result.docs.map((member) => ({
    id: member.id,
    name: member.name,
    position: member.position,
    photo: member.photo,
    rank: member.rank,
  }))
}
