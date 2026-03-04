'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface AccessCodeProps {
  onSuccess?: (institutionName: string) => void
  hideRedirect?: boolean
}

export default function AccessCode({ onSuccess, hideRedirect = false }: AccessCodeProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validatedData, setValidatedData] = useState<{ institutionName: string } | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!code.trim()) {
      setError('Please enter an access code')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/academy/validate-access-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to validate access code')
        return
      }

      setSuccess(true)
      setValidatedData(data)

      if (onSuccess) {
        onSuccess(data.institutionName)
      } else if (!hideRedirect) {
        // SPA redirect after short delay
        setTimeout(() => {
          router.push(`/academy/auth/create-password?accessCode=${encodeURIComponent(code.trim())}`)
        }, 1000)
      }
    } catch (err) {
      console.error('Error validating access code:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Code</h1>
            <p className="text-slate-600">Enter your access code to get started</p>
          </div>

          {/* Success State */}
          {success && validatedData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Access Code Verified!</h2>
                <p className="text-slate-600 mb-4">
                  {!hideRedirect && 'Redirecting to password creation...'}
                </p>
              </div>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Input Field */}
              <div className="space-y-2">
                <label htmlFor="accessCode" className="block text-sm font-medium text-slate-900">
                  Access Code
                </label>
                <Input
                  id="accessCode"
                  type="text"
                  placeholder="Enter your access code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loading || success}
                  autoComplete="off"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !code.trim() || success}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Verify Access Code'
                )}
              </Button>

              {/* Helper Text */}
              <p className="text-xs text-slate-500 text-center">
                Contact your administrator if you don{"'"}t have an access code
              </p>
            </form>
          )}
        </div>
      </Card>
    </div>
  )
}
