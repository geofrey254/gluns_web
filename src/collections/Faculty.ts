// collections/Faculty.ts
import { CollectionConfig } from 'payload'
import { isTeacher } from './access/isTeacher'
import { adminOrOwnTeacher } from './access/isAdminOrOwnTeacher'

export const Faculty: CollectionConfig = {
  slug: 'faculty-advisors',
  labels: {
    singular: 'Faculty Advisor',
    plural: 'Faculty Advisors',
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: adminOrOwnTeacher,
    update: adminOrOwnTeacher,
    delete: adminOrOwnTeacher,
    create: isTeacher,
  },

  fields: [
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        condition: () => false,
      },
    },

    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
