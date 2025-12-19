import type { CollectionConfig } from 'payload'

export const Portraits: CollectionConfig = {
  slug: 'portraits',
  access: {
    read: () => true,
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
