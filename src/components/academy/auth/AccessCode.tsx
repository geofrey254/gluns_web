'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { RiKey2Line, RiArrowRightLine, RiShieldCheckLine } from 'react-icons/ri'

interface AccessCodeProps {
  onSuccess?: (institutionName: string) => void
  hideRedirect?: boolean
}

const inputCls = [
  'w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-slate-50',
  'text-sm font-semibold text-slate-800 placeholder:text-slate-300 placeholder:font-medium',
  'outline-none transition-all duration-200 tracking-widest',
  'focus:border-[#104179] focus:bg-white focus:ring-4 focus:ring-[#104179]/20',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

export default function AccessCode({ onSuccess, hideRedirect = false }: AccessCodeProps) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validatedData, setValidatedData] = useState<{ institutionName: string } | null>(null)

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
        headers: { 'Content-Type': 'application/json' },
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
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');`}</style>

      <div
        className="min-h-screen bg-blue-50 flex items-center justify-center p-4"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Decorative blobs */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-80 h-80 bg-sky-100 rounded-full translate-y-1/3 -translate-x-1/4 opacity-50 pointer-events-none -z-10" />

        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/60 border border-blue-100 p-8 sm:p-10">
            {success && validatedData ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center text-center gap-4 py-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Code Verified!
                </h2>
                {!hideRedirect && (
                  <p className="text-slate-500 text-sm font-semibold">Setting up your account…</p>
                )}
              </div>
            ) : (
              <>
                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 shadow-md shadow-blue-100">
                    <RiKey2Line className="w-8 h-8 text-[#104179]" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1">
                    Enter Access Code
                  </h1>
                  <p className="text-slate-500 text-sm font-semibold">
                    You&apos;ll need a code from your teacher to join
                  </p>
                </div>

                {/* ── Error ── */}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-6">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-600 font-semibold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Code input */}
                  <div className="mb-6">
                    <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                      <RiShieldCheckLine className="w-3.5 h-3.5" />
                      Access Code
                    </label>
                    <input
                      className={inputCls}
                      type="text"
                      placeholder="e.g. GLNS-2024"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      disabled={loading || success}
                      autoComplete="off"
                      autoFocus
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !code.trim() || success}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#104179] hover:bg-[#0e3562] cursor-pointer active:scale-[0.98] text-white font-black text-sm shadow-lg shadow-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Verifying…
                      </>
                    ) : (
                      <>
                        Verify Code <RiArrowRightLine className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-400 font-semibold text-center mt-5">
                    Don&apos;t have a code? Ask your teacher or administrator
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
