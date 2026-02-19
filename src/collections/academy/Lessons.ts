import { CollectionConfig } from 'payload'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'module', type: 'relationship', relationTo: 'modules', required: true },
    { name: 'objective', type: 'textarea' },
    { name: 'orderIndex', type: 'number' },
    { name: 'duration', type: 'text' },
    {
      name: 'sections',
      type: 'relationship',
      relationTo: 'sections',
      hasMany: true,
    },
    { name: 'passingScore', type: 'number' },
    { name: 'isPreviewable', type: 'checkbox' },
    { name: 'requiredToComplete', type: 'checkbox', defaultValue: true },
    { name: 'isPublished', type: 'checkbox', defaultValue: false },
  ],
}
