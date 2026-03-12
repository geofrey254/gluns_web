import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { RiFileTextLine, RiLightbulbFlashLine, RiImageLine, RiVideoLine } from 'react-icons/ri'
import type { ContentBlockWithMedia } from '@/payload-types'

const BLOCK_TYPE_ICONS: Record<string, JSX.Element> = {
  text: <RiFileTextLine className="w-4 h-4" />,
  image: <RiImageLine className="w-4 h-4" />,
  video: <RiVideoLine className="w-4 h-4" />,
}

type ContentBlockWithMedia = ContentBlock & {
  media?: number | Media | null
}

function isMediaObject(media: number | Media | null | undefined): media is Media {
  return typeof media === 'object' && media !== null
}

export default function BlockCard({
  block,
  index,
}: {
  block: ContentBlockWithMedia
  index: number
}) {
  const media = block.media
  const mediaObj = isMediaObject(media) ? media : null
  const mediaUrl = mediaObj?.url || ''
  const mediaAlt = mediaObj?.alt || block.title || 'Lesson media'
  const icon = BLOCK_TYPE_ICONS[block.blockType] || <RiFileTextLine className="w-4 h-4" />

  return (
    <article
      className="rounded-2xl border-2 border-black bg-white overflow-hidden"
      style={{
        boxShadow: '4px 4px 0px #000',
        animation: `fadeSlideIn 0.4s ease ${index * 0.1}s both`,
      }}
    >
      {block.title && (
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#104179] text-white text-xs">
            {icon}
          </span>
          <h3 className="text-base font-black text-black tracking-tight">{block.title}</h3>
        </div>
      )}

      <div className="px-4 pb-4">
        {block.blockType === 'image' && mediaUrl ? (
          <div className="relative w-full overflow-hidden rounded-xl border-2 border-black mt-2">
            <Image
              src={mediaUrl}
              alt={mediaAlt}
              width={1400}
              height={900}
              className="w-full h-auto object-cover"
              unoptimized
            />
          </div>
        ) : block.blockType === 'video' && mediaUrl ? (
          <div className="relative rounded-xl border-2 border-black overflow-hidden mt-2">
            <video controls className="w-full">
              <source src={mediaUrl} />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : block.bodyContent ? (
          <div className="prose prose-sm max-w-none text-black mt-2 [&_p]:font-medium [&_strong]:font-black">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <RichText data={block.bodyContent as any} />
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-semibold">
            <RiLightbulbFlashLine className="w-4 h-4 text-[#85c226]" />
            Content coming soon!
          </div>
        )}
      </div>
    </article>
  )
}
