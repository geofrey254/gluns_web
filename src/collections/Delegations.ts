import { CollectionConfig } from 'payload'
import { isAdmin } from './access/isAdmin'
import { isTeacher } from './access/isTeacher'

export const Delegations: CollectionConfig = {
  slug: 'delegations',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: (args) => isAdmin(args) || isTeacher(args),
    create: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'application',
      type: 'relationship',
      relationTo: 'delegation-applications',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'maxDelegates',
      type: 'number',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
  ],
}
