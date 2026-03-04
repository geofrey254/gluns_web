import { CollectionConfig } from 'payload'

export const Students: CollectionConfig = {
  slug: 'students',
  auth: true,
  admin: {
    useAsTitle: 'fullName',
    group: 'GLUNS Academy',
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: false },
    { name: 'username', type: 'text' },
    { name: 'institution', type: 'relationship', relationTo: 'institutions' },
    { name: 'age', type: 'number' },
    {
      name: 'ageGroup',
      type: 'select',
      options: ['8-10', '11-13', '14-17', '18+'],
    },
    {
      name: 'enrolledCourses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'lastLogin', type: 'date' },
    { name: 'loginAttempts', type: 'number', defaultValue: 0 },
    { name: 'currentCourse', type: 'relationship', relationTo: 'courses' },
    { name: 'currentModule', type: 'relationship', relationTo: 'modules' },
    { name: 'currentLesson', type: 'relationship', relationTo: 'lessons' },
    { name: 'locked', type: 'checkbox', defaultValue: false },
  ],
}
