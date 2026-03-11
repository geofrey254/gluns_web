import type { CollectionConfig } from 'payload'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    group: 'GLUNS Academy',
  },
  fields: [
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },

    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
    },
    { name: 'currentLesson', type: 'relationship', relationTo: 'lessons' },
    {
      name: 'enrolledAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
}
