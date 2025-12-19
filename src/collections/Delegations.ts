import { CollectionConfig } from 'payload'

export const Delegations: CollectionConfig = {
  slug: 'delegations',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req }) => req.user?.roles === 'admin' || req.user?.roles === 'teacher',
    create: ({ req }) => req.user?.roles === 'admin',
    update: ({ req }) => req.user?.roles === 'admin',
  },
  fields: [
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'application',
      type: 'relationship',
      relationTo: 'delegation-applications',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'maxDelegates',
      type: 'number',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
  ],
}
