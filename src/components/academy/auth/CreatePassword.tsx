'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import {
  RiUser3Line,
  RiAtLine,
  RiCakeLine,
  RiLockPasswordLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiRocketLine,
  RiCheckLine,
  RiShieldCheckLine,
} from 'react-icons/ri'
import { FaUserGraduate } from 'react-icons/fa'

interface PasswordStrength {
  score: number
  label: string
  textColor: string
  barColor: string
}

const STEPS = [
  { label: 'Name', Icon: RiUser3Line },
  { label: 'Username', Icon: FaUserGraduate },
  { label: 'Email', Icon: RiAtLine },
  { label: 'Age', Icon: RiCakeLine },
  { label: 'Password', Icon: RiLockPasswordLine },
]

function calculatePasswordStrength(pwd: string): PasswordStrength {
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^a-zA-Z0-9]/.test(pwd)) score++

  if (score <= 1)
    return { score, label: 'Too weak', textColor: 'text-red-500', barColor: 'bg-red-400' }
  if (score === 2)
    return { score, label: 'Weak', textColor: 'text-orange-500', barColor: 'bg-orange-400' }
  if (score === 3)
    return { score, label: 'Fair', textColor: 'text-yellow-500', barColor: 'bg-yellow-400' }
  if (score === 4)
    return { score, label: 'Good', textColor: 'text-blue-500', barColor: 'bg-blue-400' }
  if (score === 5)
    return { score, label: 'Strong', textColor: 'text-[#104179]', barColor: 'bg-blue-500' }
  return { score, label: 'Super strong!', textColor: 'text-green-600', barColor: 'bg-green-500' }
}

/* ─── Shared input class ─── */
const inputCls = [
  'w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-slate-50',
  'text-sm font-semibold text-slate-800 placeholder:text-slate-300 placeholder:font-medium',
  'outline-none transition-all duration-200',
  'focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

/* ─── Sub-components ─── */
function StepHeader({
  Icon,
  title,
  subtitle,
}: {
  Icon: React.ElementType
  title: string
  subtitle: string
}) {
  return (
    <div className="flex flex-col items-center text-center mb-7">
      <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 shadow-md shadow-blue-100">
        <Icon className="w-8 h-8 text-[#104179]" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1">
        {title}
      </h1>
      <p className="text-slate-500 text-sm font-semibold">{subtitle}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}

function NextButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full mt-7 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#104179] hover:bg-[#0d3a66] active:scale-[0.98] text-white font-black text-sm shadow-lg shadow-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
    >
      Next
      <RiArrowRightLine className="w-4 h-4" />
    </button>
  )
}

function NavButtons({
  onBack,
  onNext,
  disabled,
}: {
  onBack: () => void
  onNext: () => void
  disabled: boolean
}) {
  return (
    <div className="flex gap-3 mt-7">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-500 font-black text-sm hover:border-blue-400 hover:text-[#104179] transition-all"
      >
        <RiArrowLeftLine className="w-4 h-4" />
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#104179] hover:bg-[#0d3a66] active:scale-[0.98] text-white font-black text-sm shadow-lg shadow-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        Next
        <RiArrowRightLine className="w-4 h-4" />
      </button>
    </div>
  )
}

/* ─── Main component ─── */
export default function CreateStudent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const accessCode = searchParams.get('accessCode')

  const [currentStep, setCurrentStep] = useState(0)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [age, setAge] = useState<number | ''>('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [strength, setStrength] = useState<PasswordStrength>(calculatePasswordStrength(''))

  useEffect(() => {
    if (!accessCode) setError('Access code is missing. Please start from the beginning.')
  }, [accessCode])

  useEffect(() => {
    if (password) setStrength(calculatePasswordStrength(password))
  }, [password])

  const canProceed = () => {
    if (currentStep === 0) return fullName.trim().length > 0
    if (currentStep === 1) return username.trim().length > 0
    if (currentStep === 2) return email.trim().length > 0 && /\S+@\S+\.\S+/.test(email)
    if (currentStep === 3) return age !== '' && Number(age) > 0
    if (currentStep === 4) return password.length >= 8 && password === confirmPassword
    return false
  }

  const handleNext = () => {
    setError('')
    setCurrentStep((s) => s + 1)
  }
  const handleBack = () => {
    setError('')
    setCurrentStep((s) => s - 1)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!accessCode) return setError('Access code missing')

    const ageNumber = age === '' ? undefined : Number(age)
    if (!ageNumber) return setError('Age is required')

    setLoading(true)
    try {
      const response = await fetch('/api/academy/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentCode: accessCode,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          username: username.trim(),
          age: ageNumber,
          password: password.trim(),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to create student account')
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/academy'), 2500)
    } catch (err) {
      console.error('Error creating student:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  return (
    <>
      {/* Font import — only @import, zero layout/color rules */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');`}</style>

      <div
        className="min-h-screen bg-blue-50 flex items-center justify-center p-4"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Decorative bg blobs */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-80 h-80 bg-sky-100 rounded-full translate-y-1/3 -translate-x-1/4 opacity-50 pointer-events-none -z-10" />

        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/60 border border-blue-100 p-8 sm:p-10">
            {/* ── Success ── */}
            {success ? (
              <div className="flex flex-col items-center text-center gap-4 py-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  You&apos;re all set!
                </h2>
                <p className="text-slate-500 text-sm font-semibold">
                  Taking you to your dashboard…
                </p>
              </div>
            ) : (
              <>
                {/* ── Stepper ── */}
                <div className="flex items-center justify-center mb-8">
                  {STEPS.map(({ label, Icon }, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={[
                            'w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300',
                            i < currentStep
                              ? 'bg-[#104179] text-white shadow-md shadow-blue-200'
                              : i === currentStep
                                ? 'bg-blue-50 text-[#104179] ring-2 ring-blue-500 ring-offset-2'
                                : 'bg-slate-100 text-slate-400',
                          ].join(' ')}
                        >
                          {i < currentStep ? (
                            <RiCheckLine className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <span
                          className={[
                            'text-[0.62rem] font-black uppercase tracking-widest',
                            i === currentStep
                              ? 'text-[#104179]'
                              : i < currentStep
                                ? 'text-blue-400'
                                : 'text-slate-300',
                          ].join(' ')}
                        >
                          {label}
                        </span>
                      </div>

                      {i < STEPS.length - 1 && (
                        <div
                          className={[
                            'h-0.5 w-8 sm:w-10 mb-5 mx-1 rounded-full transition-all duration-500',
                            i < currentStep ? 'bg-blue-500' : 'bg-slate-200',
                          ].join(' ')}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* ── Error banner ── */}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-6">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-600 font-semibold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Step 0 — Full Name */}
                  {currentStep === 0 && (
                    <div key="step-0">
                      <StepHeader
                        Icon={RiUser3Line}
                        title="What's your name?"
                        subtitle="Tell us your full name to get started"
                      />
                      <Field label="Full Name">
                        <input
                          className={inputCls}
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Alex Johnson"
                          autoFocus
                          disabled={loading}
                        />
                      </Field>
                      <NextButton disabled={!canProceed()} onClick={handleNext} />
                    </div>
                  )}

                  {/* Step 1 — Username */}
                  {currentStep === 1 && (
                    <div key="step-1">
                      <StepHeader
                        Icon={RiAtLine}
                        title="Pick a username"
                        subtitle="This is how others will see you"
                      />
                      <Field label="Username">
                        <input
                          className={inputCls}
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. superalex42"
                          autoFocus
                          disabled={loading}
                        />
                      </Field>
                      <NavButtons
                        onBack={handleBack}
                        onNext={handleNext}
                        disabled={!canProceed()}
                      />
                    </div>
                  )}

                  {/* email */}
                  {currentStep === 2 && (
                    <div key="step-email">
                      <StepHeader
                        Icon={RiAtLine}
                        title="What's your email?"
                        subtitle="We'll use this to contact you"
                      />
                      <Field label="Email Address">
                        <input
                          className={inputCls}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. alex.johnson@example.com"
                          autoFocus
                          disabled={loading}
                        />
                      </Field>
                      <NavButtons
                        onBack={handleBack}
                        onNext={handleNext}
                        disabled={!canProceed()}
                      />
                    </div>
                  )}

                  {/* Step 3 — Age */}
                  {currentStep === 3 && (
                    <div key="step-3">
                      <StepHeader
                        Icon={RiCakeLine}
                        title="How old are you?"
                        subtitle="Just so we know you're the right age"
                      />
                      <Field label="Age">
                        <input
                          className={[inputCls, 'max-w-36'].join(' ')}
                          type="number"
                          value={age}
                          onChange={(e) => setAge(Number(e.target.value))}
                          placeholder="e.g. 10"
                          min={1}
                          autoFocus
                          disabled={loading}
                        />
                      </Field>
                      <NavButtons
                        onBack={handleBack}
                        onNext={handleNext}
                        disabled={!canProceed()}
                      />
                    </div>
                  )}

                  {/* Step 4 — Password */}
                  {currentStep === 4 && (
                    <div key="step-4">
                      <StepHeader
                        Icon={RiLockPasswordLine}
                        title="Create a password"
                        subtitle="Make it strong — at least 8 characters"
                      />

                      {/* Password field */}
                      <Field label="Password">
                        <div className="relative">
                          <input
                            className={[inputCls, 'pr-11'].join(' ')}
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            autoFocus
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Strength meter */}
                        {password && (
                          <div className="mt-2.5 space-y-1.5">
                            <div className="grid grid-cols-5 gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={[
                                    'h-1.5 rounded-full transition-all duration-300',
                                    i < strength.score ? strength.barColor : 'bg-slate-200',
                                  ].join(' ')}
                                />
                              ))}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <RiShieldCheckLine
                                className={['w-3.5 h-3.5', strength.textColor].join(' ')}
                              />
                              <span className={['text-xs font-bold', strength.textColor].join(' ')}>
                                {strength.label}
                              </span>
                            </div>
                          </div>
                        )}
                      </Field>

                      {/* Confirm password */}
                      <Field label="Confirm Password">
                        <div className="relative">
                          <input
                            className={[inputCls, 'pr-11'].join(' ')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Type it again"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {confirmPassword && (
                          <p
                            className={[
                              'flex items-center gap-1 text-xs font-bold mt-1.5',
                              passwordsMatch ? 'text-green-600' : 'text-red-500',
                            ].join(' ')}
                          >
                            {passwordsMatch ? (
                              <>
                                <RiCheckLine className="w-3.5 h-3.5" /> Passwords match!
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3.5 h-3.5" /> Passwords don&apos;t match
                                yet
                              </>
                            )}
                          </p>
                        )}
                      </Field>

                      {/* Submit row */}
                      <div className="flex gap-3 mt-7">
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={loading}
                          className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-500 font-black text-sm hover:border-blue-400 hover:text-[#104179] transition-all disabled:opacity-40"
                        >
                          <RiArrowLeftLine className="w-4 h-4" />
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={!canProceed() || loading}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#104179] hover:bg-[#0d3a66] active:scale-[0.98] text-white font-black text-sm shadow-lg shadow-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Creating…
                            </>
                          ) : (
                            <>
                              <RiRocketLine className="w-4 h-4" /> Create Account
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
