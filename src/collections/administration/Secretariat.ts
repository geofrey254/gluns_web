import { CollectionConfig } from 'payload'
import { AccessArgs } from 'payload'

export const Secretariat: CollectionConfig = {
  slug: 'secretariat',
  access: {
    read: () => true,
    create: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    update: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    delete: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
  },
  admin: {
    useAsTitle: 'full_name',
    description: 'Add Secretariat Member',
    group: 'Administration',
  },
  labels: {
    singular: 'Secretariat',
    plural: 'Secretariat',
  },
  fields: [
    {
      name: 'full_name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'portraits',
      required: false,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
    },
  ],
}
