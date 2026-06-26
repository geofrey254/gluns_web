import { AlertCircle, CheckCircle } from 'lucide-react'

import { motion } from 'framer-motion'

export function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all ${
          step === 2 ? 'bg-[#85cc26] text-white' : 'bg-[#104179] text-white'
        }`}
      >
        {step === 2 ? <CheckCircle className="w-5 h-5" /> : '1'}
      </div>
      <div
        className={`flex-1 h-0.5 transition-colors duration-500 ${
          step === 2 ? 'bg-[#85cc26]' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      />
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all ${
          step === 2 ? 'bg-[#104179] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
        }`}
      >
        2
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 ml-1 whitespace-nowrap">
        {step === 1 ? 'Fill in your details' : 'Invoice ready'}
      </span>
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-3">
      {children}
    </p>
  )
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 text-red-500 text-sm mt-2"
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      {message}
    </motion.div>
  )
}

export function IconInput({
  icon: Icon,
  hasError,
  ...props
}: { icon: React.ElementType; hasError?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      <input
        {...props}
        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none
          ${
            hasError
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-200 dark:border-gray-700 focus:border-[#85cc26]'
          }`}
      />
    </div>
  )
}

export function IconSelect({
  icon: Icon,
  hasError,
  children,
  ...props
}: {
  icon: React.ElementType
  hasError?: boolean
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
      <select
        {...props}
        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 appearance-none
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none
          ${
            hasError
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-200 dark:border-gray-700 focus:border-[#85cc26]'
          }`}
      >
        {children}
      </select>
    </div>
  )
}
