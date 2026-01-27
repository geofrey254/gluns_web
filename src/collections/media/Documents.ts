import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
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
    { name: 'title', type: 'text', required: false },
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
  upload: true,
}
