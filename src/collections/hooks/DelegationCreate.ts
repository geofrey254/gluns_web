import type { CollectionAfterChangeHook } from 'payload'

export const createDelegationOnApproval: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (doc.status === 'approved' && previousDoc?.status !== 'approved') {
    await req.payload.create({
      collection: 'delegations',
      data: {
        teacher: doc.user,
        application: doc.id,
        name: doc.delegationName,
        maxDelegates: doc.numberOfDelegates,
        year: new Date().getFullYear(),
      },
    })
  }
}
