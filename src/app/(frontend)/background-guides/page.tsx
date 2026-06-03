export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ArrowRight, Download, FileText } from 'lucide-react'

import config from '@/payload.config'
import type { GuideRecord } from '@/types/background-guides'
import { Badge } from '@/components/ui/badge'

async function fetchPublishedGuides() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'background-guides',
    where: { published: { equals: true } },
    sort: '-createdAt',
    depth: 1,
    limit: 0,
  })

  return result.docs as GuideRecord[]
}

export const metadata = {
  title: 'Background Guides | GLUNS',
  description: 'Download password-protected committee background guides for GLUNS delegates.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),
}

export default async function BackgroundGuidesPage() {
  const guides = await fetchPublishedGuides()

  return (
    <div className="min-h-screen text-slate-900">
      <section className="py-8 md:py-16 px-8 md:px-12 bg-[#104179] dark:border-t dark:border-white relative z-30 shadow-2xl overflow-hidden flex flex-col items-start justify-center gap-4 md:gap-2">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2">
          <div className="w-2 h-2 bg-[#85c226] rounded-full animate-pulse"></div>
          <span className="text-white text-xs font-semibold tracking-wider uppercase">Guides</span>
        </div>
        <h2 className="text-white text-4xl md:text-8xl">
          Background <span className="text-[#85c226]">Guides</span> & Resources for GLUNS Delegates
        </h2>
      </section>

      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {guides.length ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => {
              const coverImage = typeof guide.coverImage === 'object' ? guide.coverImage : null
              const coverUrl = coverImage?.url || '/seo/homepage.jpg'

              return (
                <article
                  key={guide.id}
                  className="group overflow-hidden rounded-4xl border border-[#85c226] bg-white shadow-[0_20px_60px_rgba(16,65,121,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(16,65,121,0.14)]"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <Image
                      src={coverUrl}
                      alt={guide.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#103a63]/80 via-[#103a63]/10 to-transparent" />
                    <div className="absolute left-5 top-5">
                      <Badge className="bg-[#85c226] px-3 py-1.5 text-xs font-semibold text-[#103a63]">
                        <FileText className="mr-2 h-3.5 w-3.5" />
                        Published Guide
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-[#103a63]">{guide.title}</h2>
                      <div className="richtext text-[15px] leading-7 text-slate-600">
                        <p>{guide.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/background-guides/${guide.slug}`}
                        className="bg-[#104179] flex gap-2 text-center text-white py-2 px-4 rounded-2xl items-center cursor-pointer"
                      >
                        Download Guide
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#103a63] text-white shadow-lg">
              <Download className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-[#103a63]">No published guides yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Published background guides will appear here once the admin team marks them live.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
