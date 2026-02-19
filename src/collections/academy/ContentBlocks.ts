import { CollectionConfig } from 'payload'

export const ContentBlocks: CollectionConfig = {
  slug: 'content-blocks',
  fields: [
    {
      name: 'blockType',
      type: 'select',
      options: [
        'text',
        'video',
        'image',
        'scenario',
        'simulation',
        'dialogue',
        'timeline',
        'roleplay',
        'example',
        'infographic',
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'bodyContent', type: 'richText' },
    { name: 'media', type: 'upload', relationTo: 'media' },
    { name: 'orderIndex', type: 'number' },
    {
      name: 'visibleForAgeGroups',
      type: 'select',
      hasMany: true,
      options: ['8-10', '11-13', '14-17', '18+'],
    },
    { name: 'difficulty', type: 'text' },
    { name: 'language', type: 'text' },
    { name: 'requiresCompletionAction', type: 'checkbox' },
    { name: 'completionType', type: 'text' },
    { name: 'interactionConfig', type: 'json' },
    { name: 'estimatedReadTime', type: 'number' },
    { name: 'pointsAwarded', type: 'number' },
    { name: 'isOptional', type: 'checkbox' },
  ],
}
