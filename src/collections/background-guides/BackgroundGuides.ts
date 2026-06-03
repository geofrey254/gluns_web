import bcrypt from 'bcryptjs'
import type { AccessArgs, CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import slugify from 'slugify'

import { isAllowedGuideFileMimeType } from '@/lib/background-guides'

type BackgroundGuideInput = {
  title?: string
  slug?: string
  description?: unknown
  organ?: string
  committee?: string
  guideFile?: number | string | { id?: number | string } | null
  password?: string | null
  passwordHash?: string | null
  published?: boolean
}

const ADMIN_ONLY = ({ req }: AccessArgs) => {
  return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
}

const backgroundGuidesBeforeChange: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
  operation,
}) => {
  const nextData = { ...(data as BackgroundGuideInput) }

  if (typeof nextData.title === 'string' && nextData.title.trim()) {
    nextData.slug = slugify(nextData.slug || nextData.title, { lower: true, strict: true })
  }

  const passwordInput = typeof nextData.password === 'string' ? nextData.password.trim() : ''

  if (passwordInput) {
    nextData.passwordHash = await bcrypt.hash(passwordInput, 12)
  } else if (operation === 'create' && !originalDoc?.passwordHash) {
    throw new Error('A download password is required for background guides')
  } else if (originalDoc?.passwordHash && !nextData.passwordHash) {
    nextData.passwordHash = originalDoc.passwordHash
  }

  delete nextData.password

  const guideFileId =
    nextData.guideFile && typeof nextData.guideFile === 'object'
      ? nextData.guideFile.id
      : nextData.guideFile

  if (guideFileId) {
    const guideFile = await req.payload.findByID({
      collection: 'media',
      id: guideFileId,
      overrideAccess: true,
    })

    if (!isAllowedGuideFileMimeType(guideFile?.mimeType)) {
      throw new Error('Background guides must use a PDF or ZIP file')
    }
  }

  return nextData as never
}

export const BackgroundGuides: CollectionConfig = {
  slug: 'background-guides',
  labels: {
    singular: 'Background Guide',
    plural: 'Background Guides',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Resources',
    defaultColumns: ['title', 'slug', 'published', 'createdAt'],
    description: 'Publish password-protected committee background guides for delegates.',
  },
  access: {
    read: () => true,
    create: ADMIN_ONLY,
    update: ADMIN_ONLY,
    delete: ADMIN_ONLY,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from the title, but can be customized if needed.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return slugify(value, { lower: true, strict: true })
            if (data?.title) return slugify(data.title, { lower: true, strict: true })
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
    {
      name: 'organ',
      type: 'text',
      required: false,
    },
    {
      name: 'committee',
      type: 'text',
      required: false,
      label: 'Committee Name (only applies if this guide is for a specific committee)',
    },
    {
      name: 'guideFile',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'password',
      label: 'Download Password',
      type: 'text',
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Enter a new password to replace the existing one.',
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (typeof value === 'string') return value.trim()
            return value
          },
        ],
      },
    },
    {
      name: 'passwordHash',
      type: 'text',
      required: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  hooks: {
    beforeChange: [backgroundGuidesBeforeChange],
  },
}
