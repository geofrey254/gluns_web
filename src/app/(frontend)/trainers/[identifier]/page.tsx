export const dynamic = 'force-dynamic'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import {
  BadgeCheck,
  CheckCircle2,
  Home,
  IdCard,
  QrCode,
  ShieldCheck,
  SlashIcon,
} from 'lucide-react'

import config from '@/payload.config'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type TrainerRecord = {
  id: number | string
  full_name: string
  organ: string
  gender: string
  verification_code?: string | null
  photo?:
    | string
    | {
        url?: string | null
        alt?: string | null
      }
    | null
}

async function findTrainer(identifier: string) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'trainers',
    depth: 1,
    limit: 1,
    where: {
      or: [{ verification_code: { equals: identifier } }, { id: { equals: identifier } }],
    },
  })

  return result.docs[0] as TrainerRecord | undefined
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ identifier: string }>
}): Promise<Metadata> {
  const { identifier } = await params
  const trainer = await findTrainer(identifier)

  if (!trainer) {
    return {
      title: 'Trainer Verification Not Found | GLUNS',
      description: 'This trainer verification QR code could not be resolved.',
    }
  }

  const url = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/trainers/${identifier}`
  const title = `${trainer.full_name} | GLUNS Trainer Verification`

  return {
    title,
    description: `Verify ${trainer.full_name} as an official GLUNS trainer for ${trainer.organ}.`,
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: `Verify ${trainer.full_name} as an official GLUNS trainer for ${trainer.organ}.`,
      url,
      siteName: 'GLUNS',
      type: 'profile',
      locale: 'en_KE',
    },
  }
}

export default async function TrainerVerificationPage({
  params,
}: {
  params: Promise<{ identifier: string }>
}) {
  const { identifier } = await params
  const trainer = await findTrainer(identifier)

  if (!trainer) {
    notFound()
  }

  const photo = typeof trainer.photo === 'object' ? trainer.photo : null
  const photoUrl = photo?.url || ''
  const photoAlt = photo?.alt || trainer.full_name
  const publicReference = trainer.verification_code || trainer.id

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="inline-flex items-center gap-2 text-[#104179]">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon className="h-4 w-4 text-[#85c226]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-[#104179]">
                  Trainer Verification
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <section className="relative overflow-hidden bg-[#104179]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(133,194,38,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />
        <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-[#85c226]/20 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl space-y-6 text-white">
            <Badge className="border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Official GLUNS Trainer
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                {trainer.full_name}
              </h1>
              <p className="max-w-2xl text-lg text-white/85 sm:text-xl">
                This badge has been scanned — this page is the official GLUNS verification record
                for the trainer shown. Please confirm the person presenting the badge matches the
                name, photo, organ, and verification code below. If any detail does not match,
                consider the badge unverified and report it to the GLUNS team.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge className="bg-[#85c226] px-4 py-1.5 text-sm text-[#104179] hover:bg-[#85c226]">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verified in GLUNS
              </Badge>
              <Badge
                variant="outline"
                className="border-white/30 bg-white/10 px-4 py-1.5 text-white"
              >
                <QrCode className="mr-2 h-4 w-4" />
                Badge reference: {publicReference}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto -mt-10 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="relative aspect-4/3 bg-slate-100">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={photoAlt}
                  fill
                  className="object-cover object-top"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-linear-to-br from-slate-100 via-white to-slate-200">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#104179] text-white shadow-xl">
                      <IdCard className="h-12 w-12" />
                    </div>
                    <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
                      Trainer verification record
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#104179]/90 via-[#104179]/60 to-transparent p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#85c226] p-2 text-[#104179] shadow-lg">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-white/80">
                      GLUNS verification
                    </p>
                    <p className="text-xl font-semibold">Badge scan successful</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Trainer</p>
                  <p className="mt-1 text-lg font-bold text-[#104179]">{trainer.full_name}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Organ</p>
                  <p className="mt-1 text-lg font-bold text-[#104179]">{trainer.organ}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Gender</p>
                  <p className="mt-1 text-lg font-bold text-[#104179]">{trainer.gender}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Verification code</p>
                  <p className="mt-1 break-all text-lg font-bold text-[#104179]">
                    {publicReference}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#85c226]/30 bg-[#85c226]/10 p-5">
                <p className="font-semibold text-[#104179]">Why this page is trusted</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  This page is a public GLUNS trainer record. If the name, organ, or photo does not
                  match the person presenting the badge, the badge should be treated as invalid.
                </p>
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl mt-20 border border-[#104179]/10 bg-[#104179] p-6 text-white shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3 text-[#85c226]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Status</p>
                  <h2 className="text-2xl font-bold">Verified Trainer</h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-white/85">
                This QR route confirms that the badge belongs to a trainer stored in the GLUNS
                trainer registry.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-[#104179]">What to check</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                <li>Confirm the trainer name matches the badge holder.</li>
                <li>Confirm the organ and photo match the physical badge.</li>
                <li>Use the verification code when reporting a badge issue to GLUNS.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-[#104179]">Need the main website?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Return to the GLUNS homepage or continue browsing the public site after checking the
                badge.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#104179] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2f57]"
              >
                <Home className="h-4 w-4" />
                Back to home
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
