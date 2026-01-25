import { CollectionConfig } from 'payload'

export const PositionPapers: CollectionConfig = {
  slug: 'position-papers',

  fields: [
    {
      name: 'delegate',
      type: 'relationship',
      relationTo: 'delegates',
      required: true,
    },
    {
      name: 'committeeAssignment',
      type: 'relationship',
      relationTo: 'committee-assignments',
      required: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'submittedAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Submitted', value: 'submitted' },
        { label: 'Reviewed', value: 'reviewed' },
      ],
      defaultValue: 'submitted',
    },
  ],
}
