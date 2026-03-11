import { CollectionConfig } from 'payload'
import { AccessArgs } from 'payload'

export const CommitteeTeam: CollectionConfig = {
  slug: 'committee-team',
  admin: {
    useAsTitle: 'name',
    group: 'Committee Management',
  },
  access: {
    read: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    create: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    update: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    delete: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      required: true,
    },
    {
      name: 'rank',
      type: 'number',
      required: true,
      unique: true,
      admin: {
        description: 'Lower numbers appear first',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'portraits',
      required: false,
    },
    {
      name: 'committee',
      type: 'relationship',
      relationTo: 'committees',
      required: true,
    },
  ],
}
