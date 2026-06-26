import type { CollectionConfig } from 'payload'
import { AccessArgs } from 'payload'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAdmin = (req: any) => Array.isArray(req.user?.roles) && req.user.roles.includes('admin')

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
      return isAdmin(req)
    },
    delete: ({ req }: AccessArgs) => {
      return isAdmin(req)
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
        { label: 'Delegate', value: 'delegate' },
      ],
      defaultValue: ['teacher'],
    },
    {
      name: 'fullName',
      type: 'text',
      required: false,
    },

    {
      name: 'delegationName',
      type: 'text',
      required: false,
      saveToJWT: true,
      admin: {
        condition: (data, { user }) =>
          !!user && Array.isArray(user.roles) && user.roles.includes('teacher'),
      },
    },
  ],
}
