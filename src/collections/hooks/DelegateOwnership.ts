import type { CollectionBeforeChangeHook } from 'payload'

export const enforceDelegateOwnership: CollectionBeforeChangeHook = async ({
  req,
  data,
  originalDoc,
}) => {
  if (!req.user) return data

  // Always enforce teacher ownership
  data.teacher = req.user.id

  // Resolve delegation ID safely
  const delegationId = data.delegation ?? originalDoc?.delegation

  if (!delegationId) {
    throw new Error('Delegation is required')
  }

  const delegation = await req.payload.findByID({
    collection: 'delegations',
    id: typeof delegationId === 'object' ? delegationId.id : delegationId,
  })

  // Ownership check first
  if (delegation.teacher !== req.user.id && !req.user.roles?.includes('admin')) {
    throw new Error('You do not own this delegation')
  }

  // Approval check
  if (delegation.application) {
    const applicationId =
      typeof delegation.application === 'object'
        ? delegation.application.id
        : delegation.application

    const application = await req.payload.findByID({
      collection: 'delegation-applications',
      id: applicationId,
    })

    if (application.status !== 'approved') {
      throw new Error('Delegation is not approved yet')
    }
  }

  return data
}
