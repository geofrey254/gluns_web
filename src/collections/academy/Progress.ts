import { CollectionConfig } from 'payload'

export const Progress: CollectionConfig = {
  slug: 'progress',
  fields: [
    { name: 'student', type: 'relationship', relationTo: 'students' },
    { name: 'course', type: 'relationship', relationTo: 'courses' },
    { name: 'module', type: 'relationship', relationTo: 'modules' },
    { name: 'lesson', type: 'relationship', relationTo: 'lessons' },
    { name: 'section', type: 'relationship', relationTo: 'sections' },
    { name: 'completed', type: 'checkbox' },
    {
      name: 'completedLessons',
      type: 'relationship',
      relationTo: 'lessons',
      hasMany: true,
    },
    { name: 'completionDate', type: 'date' },
    { name: 'attempts', type: 'number' },
    { name: 'score', type: 'number' },
    { name: 'passed', type: 'checkbox' },
    { name: 'timeSpent', type: 'number' },
    { name: 'interactionsCount', type: 'number' },
    { name: 'lastInteraction', type: 'date' },
  ],
}
