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
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.age) {
          if (data.age <= 10) data.ageGroup = '8-10'
          else if (data.age <= 13) data.ageGroup = '11-13'
          else if (data.age <= 17) data.ageGroup = '14-17'
          else data.ageGroup = '18+'
        }
      },
    ],
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
        { label: 'Student', value: 'student' },
      ],
      defaultValue: 'student',
    },
    {
      name: 'fullName',
      type: 'text',
      required: false,
      admin: {
        condition: (data) => data.roles === 'student',
      },
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      saveToJWT: true,
      admin: {
        condition: (data) => data.roles === 'student',
      },
    },
    {
      name: 'institution',
      type: 'relationship',
      relationTo: 'institutions',
      admin: {
        condition: (data) => data.roles === 'student',
      },
    },

    {
      name: 'age',
      type: 'number',
      admin: {
        condition: (data) => data.roles === 'student',
      },
    },

    {
      name: 'delegationName',
      type: 'text',
      required: true,
      saveToJWT: true,
      admin: {
        condition: (data, { user }) => !!user && user.roles === 'teacher',
      },
    },
  ],
}
