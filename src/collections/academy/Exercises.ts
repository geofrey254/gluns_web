import { CollectionConfig } from 'payload'

export const Exercises: CollectionConfig = {
  slug: 'exercises',
  fields: [
    { name: 'question', type: 'textarea' },
    { name: 'instructions', type: 'textarea' },
    {
      name: 'type',
      type: 'select',
      options: [
        'multipleChoice',
        'trueFalse',
        'shortAnswer',
        'matching',
        'ordering',
        'scenarioDecision',
        'dragDrop',
        'roleplayResponse',
        'caseAnalysis',
      ],
    },
    { name: 'options', type: 'array', fields: [{ name: 'option', type: 'text' }] },
    { name: 'correctAnswer', type: 'text' },
    { name: 'acceptableAnswers', type: 'array', fields: [{ name: 'value', type: 'text' }] },
    { name: 'explanation', type: 'textarea' },
    { name: 'hint', type: 'textarea' },
    { name: 'retryAllowed', type: 'checkbox', defaultValue: true },
    { name: 'maxAttempts', type: 'number' },
    { name: 'points', type: 'number' },
    { name: 'passingScore', type: 'number' },
    { name: 'penaltyPerAttempt', type: 'number' },
    {
      name: 'ageVariants',
      type: 'select',
      hasMany: true,
      options: ['8-10', '11-13', '14-17', '18+'],
    },
    { name: 'difficulty', type: 'text' },
  ],
}
