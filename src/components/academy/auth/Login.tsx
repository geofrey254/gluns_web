'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { RiAtLine, RiLockPasswordLine, RiArrowRightLine, RiLoginCircleLine } from 'react-icons/ri'
import { useAcademyStore } from '@/app/store/academyStore'

const inputCls = [
  'w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-slate-50',
  'text-sm font-semibold text-slate-800 placeholder:text-slate-300 placeholder:font-medium',
  'outline-none transition-all duration-200',
  'focus:border-[#104179] focus:bg-white focus:ring-4 focus:ring-[#104179]/20',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="mb-5">
      <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      {children}
    </div>
  )
}

export default function Login() {
  const router = useRouter()
  const setUser = useAcademyStore((state) => state.setUser)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      setUser(data.user)
      router.replace('/academy')
    } catch (err) {
      console.error('Error logging in:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !loading

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Decorative blobs */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-80 h-80 bg-sky-100 rounded-full translate-y-1/3 -translate-x-1/4 opacity-50 pointer-events-none -z-10" />

        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/60 border border-blue-100 p-8 sm:p-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 shadow-md shadow-blue-100">
                <RiLoginCircleLine className="w-8 h-8 text-[#85c226]" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1">
                Welcome back!
              </h1>
              <p className="text-slate-500 text-sm font-semibold">
                Sign in to your GLUNS Academy account
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-6">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600 font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <Field label="Email" icon={RiAtLine}>
                <input
                  className={inputCls}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  autoFocus
                />
              </Field>

              {/* Password */}
              <Field label="Password" icon={RiLockPasswordLine}>
                <div className="relative">
                  <input
                    className={[inputCls, 'pr-11'].join(' ')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#85c226] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#104179] hover:bg-[#0e3562] cursor-pointer active:scale-[0.98] text-white font-black text-sm shadow-lg shadow-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  <>
                    Sign In <RiArrowRightLine className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Sign up link */}
              <p className="text-center text-sm text-slate-500 font-semibold mt-6">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/academy/auth')}
                  className="text-[#85c226] hover:text-[#0e3562] cursor-pointer font-black underline-offset-2 hover:underline transition-colors"
                >
                  Sign up with access code
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
