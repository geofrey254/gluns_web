export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { ArrowLeft, Download, LockKeyhole } from 'lucide-react'
import type { Metadata } from 'next'

import config from '@/payload.config'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GuidePasswordForm } from '@/components/background-guides/GuidePasswordForm'
import {
  getGuideAuthCookieName,
  normalizeGuideRecord,
  verifyGuideAuthToken,
} from '@/lib/background-guides'
import { getSiteUrl } from '@/lib/utils'
import type { GuideRecord } from '@/types/background-guides'

async function fetchGuide(slug: string) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'background-guides',
    where: {
      and: [{ slug: { equals: slug } }, { published: { equals: true } }],
    },
    depth: 1,
    limit: 1,
    overrideAccess: true,
  })

  return normalizeGuideRecord(result.docs[0] as GuideRecord)
}

async function hasValidGuideAccess(guide: GuideRecord) {
  const cookieStore = await cookies()
  const token = cookieStore.get(getGuideAuthCookieName(guide.id))?.value

  return verifyGuideAuthToken(token, guide.id)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = await fetchGuide(slug)

  if (!guide) {
    return {
      title: 'Background Guide Not Found | GLUNS',
      description: 'This background guide could not be found.',
    }
  }

  const siteUrl = getSiteUrl()
  const url = `${siteUrl}/background-guides/${guide.slug}`

  return {
    title: `${guide.title} | GLUNS Background Guides`,
    description: 'Password-protected background guide download from GLUNS.',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${guide.title} | GLUNS Background Guides`,
      description: 'Password-protected background guide download from GLUNS.',
      url,
      siteName: 'GLUNS',
      type: 'article',
      locale: 'en_KE',
    },
  }
}

export default async function BackgroundGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = await fetchGuide(slug)

  if (!guide) {
    notFound()
  }

  const coverImage = typeof guide.coverImage === 'object' ? guide.coverImage : null
  const coverUrl = coverImage?.url || '/seo/homepage.jpg'
  const isUnlocked = await hasValidGuideAccess(guide)
  const downloadUrl = `/api/background-guides/download/${guide.id}`

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,65,121,0.08),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#ffffff_38%,#eff6ff_100%)] text-slate-900">
      <section className="relative overflow-hidden bg-[#103a63] text-white">
        <div className="container relative mx-auto px-4 py-4 md:py-12 sm:px-6 lg:px-8">
          <Link
            href="/background-guides"
            className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to guides
          </Link>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <article className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(16,65,121,0.10)]">
            <div className="relative aspect-16/10 bg-slate-100">
              <Image src={coverUrl} alt={guide.title} fill className="object-center" priority />
              <div className="absolute inset-0 bg-linear-to-t from-[#103a63]/80 via-[#103a63]/12 to-transparent" />
            </div>

            <div className="space-y-8 p-6 sm:p-8 lg:p-10">
              <div className="space-y-3">
                <Badge className="border border-[#103a63]/15 bg-[#103a63]/5 px-3 py-1.5 text-xs font-semibold text-[#103a63]">
                  <LockKeyhole className="mr-2 h-3.5 w-3.5" />
                  Password protected
                </Badge>
                <h1 className="text-3xl font-bold leading-tight text-[#103a63] sm:text-4xl">
                  {guide.title}
                </h1>
              </div>

              <div className="richtext rounded-xl border border-slate-200 bg-slate-50 p-6 mb-4 text-[15px] leading-7 text-slate-700">
                <p className="whitespace-pre-line p-6">
                  {guide.description || 'No description provided.'}
                </p>
              </div>

              {isUnlocked ? (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-emerald-600 p-2 text-white shadow-lg shadow-emerald-600/20">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-emerald-900">
                        Background Guide Available
                      </h2>
                      <p className="mt-1 text-sm leading-7 text-emerald-900/80">
                        Your delegate access has been verified. You may now download the official
                        committee background guide and begin preparing for committee sessions.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h2 className="text-xl font-bold text-[#103a63]">Enter the guide password</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Enter the access password provided by your committee director, school advisor,
                    or the GLUNS Secretariat to download this background guide.{' '}
                  </p>
                  <div className="mt-5">
                    <GuidePasswordForm guideSlug={guide.slug} guideTitle={guide.title} />
                  </div>
                </div>
              )}
            </div>
          </article>

          <aside className="space-y-6 lg:pt-16">
            <div className="rounded-4xl border border-[#103a63]/10 bg-[#103a63] p-6 text-white shadow-[0_20px_60px_rgba(16,65,121,0.18)]">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                Committee Resources
              </p>
              <h2 className="mt-3 text-2xl font-bold">Official Background Guide</h2>
              <p className="mt-4 text-sm leading-7 text-white/82">
                This background guide contains committee context, topic research, guiding questions,
                and preparation material designed to help delegates participate effectively during
                conference sessions.
              </p>

              {isUnlocked ? (
                <Button
                  asChild
                  className="mt-6 h-12 w-full rounded-2xl bg-[#85c226] px-6 text-base font-semibold text-[#103a63] hover:bg-[#8ed832] cursor-pointer"
                >
                  <Link href={downloadUrl} className="cursor-pointer">
                    <Download className="h-4 w-4" />
                    Download Background Guide
                  </Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled
                  className="mt-6 h-12 w-full rounded-2xl bg-[#85c226] px-6 text-base font-semibold text-[#103a63] opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Verify Access to Download{' '}
                </Button>
              )}
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(16,65,121,0.08)]">
              <h3 className="text-lg font-bold text-[#103a63]">Included in this Guide</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                <li>Official committee background and context</li>
                <li>Topic overviews and key research areas</li>
                <li>Questions and issues for delegate preparation</li>
                <li>Conference-specific guidance and expectations</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
