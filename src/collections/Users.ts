import type { CollectionConfig } from 'payload'
import { canUpdateUser } from './hooks/AccessHooks'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: canUpdateUser,
    create: canUpdateUser,
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
        { label: 'Teacher', value: 'teacher' },
      ],
      defaultValue: 'teacher',
    },
  ],
  hooks: {},
}
