import type { Payload } from 'payload'

function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export async function assignCountriesRandomly(payload: Payload, delegateId?: string) {
  // 1. Get delegates
  let delegates: any[] = []

  if (delegateId) {
    const res = await payload.find({
      collection: 'delegates',
      where: { id: { equals: delegateId } },
      limit: 1,
    })

    if (!res.docs.length) {
      throw new Error('Delegate not found')
    }

    if (res.docs[0].country) {
      throw new Error('Delegate already has a country')
    }

    delegates = res.docs
  } else {
    const res = await payload.find({
      collection: 'delegates',
      where: { country: { equals: null } },
      limit: 0,
    })

    delegates = res.docs
  }

  if (!delegates.length) {
    return { assigned: 0 }
  }

  // 2. Get all countries
  const countriesRes = await payload.find({
    collection: 'countries',
    limit: 0,
  })

  // 3. Find already assigned country IDs
  const allDelegates = await payload.find({
    collection: 'delegates',
    limit: 0,
  })

  const assignedCountryIds = new Set(
    allDelegates.docs
      .map((d) => (typeof d.country === 'object' ? d.country?.id : d.country))
      .filter(Boolean),
  )

  const availableCountries = countriesRes.docs.filter((c) => !assignedCountryIds.has(c.id))

  if (availableCountries.length < delegates.length) {
    throw new Error('Not enough available countries')
  }

  shuffle(availableCountries)

  // 4. Assign
  for (let i = 0; i < delegates.length; i++) {
    await payload.update({
      collection: 'delegates',
      id: delegates[i].id,
      data: { country: availableCountries[i].id },
    })
  }

  return { assigned: delegates.length }
}
