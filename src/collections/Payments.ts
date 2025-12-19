import { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'reference',
  },
  access: {
    read: ({ req }) => req.user?.roles === 'admin',
    create: () => false, // webhook only
    update: () => false,
  },
  fields: [
    {
      name: 'delegate',
      type: 'relationship',
      relationTo: 'delegates',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'KES',
    },
    {
      name: 'reference',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
      ],
    },
  ],
}
