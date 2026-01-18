import { CollectionConfig } from 'payload'
import { enforceDelegateOwnership } from './hooks/DelegateOwnership'
import { ensurePaidSlots } from './hooks/EnsurePaidSlots'
import { isAdmin } from './access/isAdmin'
import { isTeacher } from './access/isTeacher'
import { adminOrOwnTeacher } from './access/isAdminOrOwnTeacher'

export const Delegates: CollectionConfig = {
  slug: 'delegates',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: (args) => isAdmin(args) || isTeacher(args),

    create: isTeacher,

    update: adminOrOwnTeacher,
  },
  hooks: {
    beforeChange: [enforceDelegateOwnership, ensurePaidSlots],
  },
  fields: [
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'delegation',
      type: 'relationship',
      relationTo: 'delegations',
      required: true,
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
    },
    {
      name: 'phoneNumber',
      type: 'number',
      required: true,
    },
  ],
}
