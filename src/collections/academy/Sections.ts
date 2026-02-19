import { CollectionConfig } from 'payload'

export const Sections: CollectionConfig = {
  slug: 'sections',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'lesson', type: 'relationship', relationTo: 'lessons', required: true },
    { name: 'orderIndex', type: 'number' },
    {
      name: 'contentBlocks',
      type: 'relationship',
      relationTo: 'content-blocks',
      hasMany: true,
    },
    { name: 'exercise', type: 'relationship', relationTo: 'exercises' },
    { name: 'estimatedDuration', type: 'text' },
    { name: 'required', type: 'checkbox', defaultValue: true },
    { name: 'completionRule', type: 'text' },
    { name: 'isPublished', type: 'checkbox', defaultValue: false },
  ],
}
