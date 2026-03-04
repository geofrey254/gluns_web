import { CollectionConfig } from 'payload'
import { randomBytes } from 'crypto'

function generateInstitutionCode() {
  return 'GL-' + randomBytes(4).toString('hex').toUpperCase()
}

export const Institutions: CollectionConfig = {
  slug: 'institutions',
  admin: { useAsTitle: 'name', group: 'GLUNS Academy' },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.enrollmentCode = generateInstitutionCode()
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'contactEmail', type: 'email' },

    {
      name: 'enrollmentCode',
      type: 'text',
      unique: true,
      required: true,
    },

    {
      name: 'maxStudents',
      type: 'number',
      required: true,
    },

    {
      name: 'currentStudents',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'expiresAt',
      type: 'date',
    },

    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
