import { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    description: 'Add Course',
    group: 'GLUNS Academy',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated from title if left blank',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.title && !data.slug) {
              return slugify(data.title, { lower: true, strict: true })
            }
          },
        ],
      },
    },
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
