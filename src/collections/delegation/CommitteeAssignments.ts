import { CollectionConfig } from 'payload'

export const CommitteeAssignments: CollectionConfig = {
  slug: 'committee-assignments',
  admin: {
    useAsTitle: 'id',
    group: 'Delegation Management',
  },

  fields: [
    {
      name: 'delegate',
      type: 'relationship',
      relationTo: 'delegates',
      required: true,
      unique: true,
    },
    {
      name: 'committee',
      type: 'relationship',
      relationTo: 'committees',
      required: true,
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      unique: true,
    },
    {
      name: 'assignedAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
}
