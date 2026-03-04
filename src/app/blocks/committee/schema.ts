import { Block } from 'payload'

export const OurTeam: Block = {
  slug: 'ourTeam',
  admin: { group: 'About Page' },

  fields: [
    {
      name: 'team_profiles',
      label: 'Secretariat Profiles',
      type: 'relationship',
      relationTo: 'secretariat',
      hasMany: true,
    },
  ],
}
