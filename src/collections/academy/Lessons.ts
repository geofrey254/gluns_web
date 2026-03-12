import { CollectionConfig } from 'payload'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'title',
    group: 'GLUNS Academy',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'module', type: 'relationship', relationTo: 'modules', required: true },
    { name: 'objective', type: 'textarea' },
    { name: 'orderIndex', type: 'number' },
    {
      name: 'sections',
      type: 'relationship',
      relationTo: 'sections',
      hasMany: true,
    },
    { name: 'requiredToComplete', type: 'checkbox', defaultValue: true },
    { name: 'isPublished', type: 'checkbox', defaultValue: false },
  ],
}
