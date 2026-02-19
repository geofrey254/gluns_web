import { CollectionConfig } from 'payload'

export const AccessCodes: CollectionConfig = {
  slug: 'access-codes',
  fields: [
    { name: 'code', type: 'text', required: true },
    { name: 'assignedStudent', type: 'relationship', relationTo: 'students' },
    {
      name: 'courseAccess',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },
    { name: 'usageLimit', type: 'number' },
    { name: 'usedCount', type: 'number', defaultValue: 0 },
    { name: 'expirationDate', type: 'date' },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
