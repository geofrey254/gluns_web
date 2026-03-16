import type { CollectionConfig } from 'payload'
import { AccessArgs } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },
  auth: true,
  access: {
    create: () => true,
    read: () => true,
    update: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    delete: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Secretariat', value: 'secretariat' },
        { label: 'Editor', value: 'editor' },
        { label: 'Teacher', value: 'teacher' },
      ],
      defaultValue: 'teacher',
    },
    {
      name: 'fullName',
      type: 'text',
      required: false,
    },

    {
      name: 'delegationName',
      type: 'text',
      required: true,
      saveToJWT: true,
      admin: {
        condition: (data, { user }) => !!user && user.roles.includes('teacher'),
      },
    },
  ],
}
