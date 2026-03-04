import { CollectionConfig } from 'payload'
import { enforceDelegateOwnership } from '../hooks/DelegateOwnership'
import { ensurePaidSlots } from '../hooks/EnsurePaidSlots'
import { AccessArgs } from 'payload'

export const Delegates: CollectionConfig = {
  slug: 'delegates',
  admin: {
    useAsTitle: 'email',
    group: 'Delegation Management',
    defaultColumns: ['firstName', 'lastName', 'email', 'delegation'],
    enableRichTextLink: false,
  },
  access: {
    read: ({ req }: AccessArgs) => !!req.user,
    create: ({ req }: AccessArgs) => {
      return !!(
        req.user &&
        'roles' in req.user &&
        (req.user.roles.includes('admin') || req.user.roles.includes('teacher'))
      )
    },
    update: ({ req, data }: AccessArgs) => {
      return !!(
        req.user &&
        'roles' in req.user &&
        (req.user.roles.includes('admin') || req.user.id === data?.teacher)
      )
    },
    delete: ({ req, data }: AccessArgs) => {
      return !!(
        req.user &&
        'roles' in req.user &&
        (req.user.roles.includes('admin') || req.user.id === data?.teacher)
      )
    },
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
      unique: true,
    },
    {
      name: 'gradeLevel',
      type: 'select',
      options: Array.from({ length: 12 }, (_, i) => ({
        label: `Grade ${i + 1}`,
        value: `Grade ${i + 1}`,
      })),
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'number',
      required: true,
    },
  ],
}
