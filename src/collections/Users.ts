import type { CollectionConfig } from 'payload'
import { canUpdateUser } from './hooks/AccessHooks'

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
    delete: canUpdateUser,
    update: canUpdateUser,
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
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
      required: true,
    },
    {
      name: 'institution',
      type: 'relationship',
      relationTo: 'institutions',
      admin: {
        condition: (data) => data.role === 'student',
      },
    },

    {
      name: 'age',
      type: 'number',
      admin: {
        condition: (data) => data.role === 'student',
      },
    },

    {
      name: 'ageGroup',
      type: 'select',
      options: ['8-10', '11-13', '14-17', '18+'],
      admin: {
        condition: (data) => data.role === 'student',
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
