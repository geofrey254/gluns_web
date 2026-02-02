import { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Committees: CollectionConfig = {
  slug: 'committees',
  admin: {
    useAsTitle: 'title',
    group: 'Committee Management',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.roles === 'admin',
    update: ({ req }) => req.user?.roles === 'admin',
    delete: ({ req }) => req.user?.roles === 'admin',
  },
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
      name: 'committee_photo',
      label: 'Committee BG',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      admin: {
        position: 'sidebar',
        description:
          'This field is auto-generated from the Title field. Please do not edit manually.',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.title) return slugify(data.title, { lower: true, strict: true })
          },
        ],
      },
    },
    {
      name: 'committee_category',
      label: 'Committee Category',
      type: 'relationship',
      relationTo: 'committee-categories',
      required: true,
    },
    {
      name: 'committee_code',
      label: 'Committee Code',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'summary',
      type: 'richText',
      required: true,
    },
  ],
}
