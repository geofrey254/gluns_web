// app/blog/page.tsx or pages/blog/index.tsx
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogList({ post }: { post: any }) {
  return (
    <div className="flex flex-col border-2 border-[#104179] rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div className="relative h-48 w-full">
        {post.coverImage?.url && (
          <Image src={post.coverImage.url} alt={post.title} fill className="object-cover" />
        )}
      </div>

      <div className="flex flex-col grow p-4 sm:p-6">
        <div className="grow">
          <div className="flex justify-between items-center mb-3 gap-2">
            <Badge variant="outline" className="bg-[#104179] border-[#85c226]"></Badge>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={14} className="mr-1" />
              {new Date(post.publishedDate).toLocaleDateString()}
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold mb-3 hover:text-[#104179] transition-colors">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <div className="mb-4">
            <p className="l line-clamp-3">{post.excerpt}</p>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100">
          <Link
            href={`/blog/${post.slug}`}
            className="text-[#104179] font-medium text-sm flex items-center hover:text-[#0c4780]"
          >
            Read more <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
