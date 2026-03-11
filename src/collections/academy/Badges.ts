import { CollectionConfig } from 'payload'

export const Badges: CollectionConfig = {
  slug: 'badges',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'icon', type: 'upload', relationTo: 'media' },
    { name: 'criteriaType', type: 'text' },
    { name: 'criteriaValue', type: 'text' },
    { name: 'pointsReward', type: 'number' },
    { name: 'rarity', type: 'text' },
    { name: 'visible', type: 'checkbox' },
  ],
}
