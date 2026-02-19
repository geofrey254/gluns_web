import { CollectionConfig } from 'payload'

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  fields: [
    { name: 'student', type: 'relationship', relationTo: 'students' },
    { name: 'badge', type: 'relationship', relationTo: 'badges' },
    { name: 'earnedDate', type: 'date' },
    { name: 'triggerSource', type: 'text' },
    { name: 'courseContext', type: 'relationship', relationTo: 'courses' },
  ],
}
