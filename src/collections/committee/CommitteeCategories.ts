import { CollectionConfig } from 'payload'
import { AccessArgs } from 'payload'

export const CommitteeCategories: CollectionConfig = {
  slug: 'committee-categories',
  admin: {
    useAsTitle: 'name',
    group: 'Committee Management',
  },
  access: {
    read: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    delete: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
