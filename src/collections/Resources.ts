import { CollectionConfig } from 'payload'

export const Resources: CollectionConfig = {
  slug: 'resources',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'resource_file',
      type: 'upload',
      relationTo: 'documents',
      required: true,
    },
  ],
}
