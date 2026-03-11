import { CollectionConfig } from 'payload'

export const Attempts: CollectionConfig = {
  slug: 'attempts',
  fields: [
    { name: 'student', type: 'relationship', relationTo: 'users' },
    { name: 'exercise', type: 'relationship', relationTo: 'exercises' },
    { name: 'answerSubmitted', type: 'json' },
    { name: 'correct', type: 'checkbox' },
    { name: 'score', type: 'number' },
    { name: 'attemptNumber', type: 'number' },
    { name: 'timeSpent', type: 'number' },
    { name: 'submittedAt', type: 'date' },
  ],
}
