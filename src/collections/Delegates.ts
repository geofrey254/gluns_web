import { CollectionConfig } from 'payload'
import { enforceDelegateOwnership } from './hooks/DelegateOwnership'

export const Delegates: CollectionConfig = {
  slug: 'delegates',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req }) => req.user?.roles === 'admin' || req.user?.roles === 'teacher',
    create: ({ req }) => req.user?.roles === 'teacher',
    update: ({ req, data }) => req.user?.roles === 'admin' || req.user?.id === data?.teacher,
  },
  hooks: {
    beforeChange: [enforceDelegateOwnership],
  },
  fields: [
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'delegation',
      type: 'relationship',
      relationTo: 'delegations',

      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'unpaid',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
      ],
    },
  ],
}
