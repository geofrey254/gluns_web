import type { CollectionConfig } from 'payload'

export const Portraits: CollectionConfig = {
  slug: 'portraits',
  admin: {
    description: 'Media',
    group: 'Media & File Uploads',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
