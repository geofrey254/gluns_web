'use client'

import React from 'react'

type SignUpFormProps = {
  onSwitchToSignIn: () => void
}

function Field({
  label,
  type,
  placeholder,
  autoComplete,
}: {
  label: string
  type: string
  placeholder: string
  autoComplete?: string
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#104179]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full border border-[#104179]/15 bg-white px-4 py-3.5 text-[#104179] placeholder:text-[#104179]/35 shadow-sm outline-none transition duration-300 focus:border-[#85c226] focus:ring-4 focus:ring-[#85c226]/15"
      />
    </div>
  )
}

export default function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  return (
    <section id="signup" className="relative isolate overflow-hidden  px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative order-2 overflow-hidden border border-[#104179]/70 bg-white p-5 shadow-[0_24px_70px_rgba(16,65,121,0.12)] sm:p-8 lg:order-1">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#85c226]">
                Create account
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#104179]">Join the portal</h2>
            </div>

            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="inline-flex items-center border border-[#104179]/15 bg-[#104179]/5 px-4 py-2 text-sm font-semibold text-[#104179] transition hover:border-[#85c226] hover:bg-[#85c226]/10"
            >
              Switch to sign in
            </button>
          </div>

          <div className="mb-6 grid grid-cols-2 bg-[#104179]/5 p-1.5 text-sm font-semibold text-[#104179]">
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="px-4 py-3 text-center text-[#104179]/60 transition hover:text-[#104179]"
            >
              Sign in
            </button>
            <div className="bg-white px-4 py-3 text-center shadow-sm">Sign up</div>
          </div>

          <form className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" type="text" placeholder="Jane Doe" autoComplete="name" />
              <Field
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <Field
              label="Organization / School"
              type="text"
              placeholder="GLUNS Academy"
              autoComplete="organization"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
              />
              <Field
                label="Confirm password"
                type="password"
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center bg-[#85c226] px-5 py-3.5 text-base font-semibold text-[#104179] shadow-lg shadow-[#85c226]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#74ac1f]"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#104179]/70">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="font-semibold text-[#104179] hover:text-[#85c226]"
            >
              Sign in here
            </button>
          </p>
        </div>

        <div className="order-1 relative overflow-hidden border border-white/70 bg-[#104179] px-6 py-8 text-white sm:px-8 sm:py-10 lg:order-2">
          <div className="relative space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                Get started
              </p>
              <h1 className="max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl">
                Create a polished GLUNS account in a few steps.
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/78 sm:text-lg">
                The form is styled to match the rest of the website, with strong contrast, soft
                surfaces, and a clear path back to sign in.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {['Simple setup', 'Brand aligned', 'Easy switching'].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
