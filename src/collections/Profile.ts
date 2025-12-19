import { CollectionConfig } from 'payload'

export const Profile: CollectionConfig = {
  slug: 'profile',
  admin: {
    hidden: true,
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'delegationName', label: 'Delegation Name', type: 'text', required: true },
    { name: 'email', label: 'Your Email', type: 'email', required: true },
  ],
}
