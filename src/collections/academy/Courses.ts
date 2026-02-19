import { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    {
      name: 'difficultyLevel',
      type: 'select',
      options: ['beginner', 'intermediate', 'advanced'],
    },
    { name: 'estimatedDuration', type: 'text' },
    {
      name: 'ageGroupsAllowed',
      type: 'select',
      hasMany: true,
      options: ['8-10', '11-13', '14-17', '18+'],
    },
    {
      name: 'modules',
      type: 'relationship',
      relationTo: 'modules',
      hasMany: true,
    },
    { name: 'isPublished', type: 'checkbox', defaultValue: false },
  ],
}
