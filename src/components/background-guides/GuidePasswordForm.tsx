'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, LockKeyhole, Shield } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type GuidePasswordFormProps = {
  guideSlug: string
  guideTitle: string
}

export function GuidePasswordForm({ guideSlug, guideTitle }: GuidePasswordFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/background-guides/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ slug: guideSlug, password }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null
        setErrorMessage(data?.message || 'Unable to unlock this guide right now.')
        return
      }

      setPassword('')
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="guide-password" className="text-sm font-semibold text-slate-700">
          Guide password
        </Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="guide-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={`Enter the password for ${guideTitle}`}
            className={cn('h-12 rounded-2xl border-slate-200 bg-white pl-11 text-base')}
            required
          />
        </div>
      </div>

      {errorMessage ? (
        <Alert variant="destructive" className="rounded-2xl border-rose-200 bg-rose-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access denied</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-2xl bg-[#104179] px-6 text-base font-semibold text-white shadow-lg shadow-[#104179]/20 transition hover:bg-[#0c325b]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            Unlock Guide
          </>
        )}
      </Button>
    </form>
  )
}
