import { CollectionConfig } from 'payload'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  fields: [
    { name: 'student', type: 'relationship', relationTo: 'users' },
    { name: 'course', type: 'relationship', relationTo: 'courses' },
    { name: 'issuedDate', type: 'date' },
    { name: 'certificateID', type: 'text' },
    { name: 'verificationCode', type: 'text' },
  ],
}
