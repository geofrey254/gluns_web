'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegistrationSchema, RegistrationFormData } from '@/schemas/registration.schema'
import { Event } from '@/types/event'
import { useEffect, useState } from 'react'
import { InvoiceData } from '@/types/registrationTypes'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  School,
  Hash,
  Calendar,
  Send,
  AlertCircle,
  LoaderCircle,
} from 'lucide-react'

// subcomponents
import {
  StepIndicator,
  SectionLabel,
  FieldError,
  IconInput,
  IconSelect,
} from './subComponents/subComponents'

// ─── Animation variants (mirrors ContactForm) ────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

interface RegistrationFormProps {
  events?: Event[]
}

export default function RegistrationForm({ events: propEvents }: RegistrationFormProps) {
  const [eventsList, setEventsList] = useState<Event[]>(Array.isArray(propEvents) ? propEvents : [])
  const [submitting, setSubmitting] = useState(false)
  const [invoice, setInvoice] = useState<InvoiceData | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: { registrationType: 'individual' },
  })

  const registrationType = watch('registrationType')

  useEffect(() => {
    if (propEvents && propEvents.length > 0) return
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events')
        const data = await response.json()

        console.log('Events from API:', data.docs)

        const r = data.docs.map((event: Event) => ({
          id: event.id,
          title: event.title,
        }))

        setEventsList(r)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEvents()
  }, [propEvents])

  async function onSubmit(data: RegistrationFormData) {
    setSubmitting(true)
    setGlobalError(null)

    console.log('eventId:', data.eventId)
    console.log('typeof:', typeof data.eventId)
    console.log(JSON.stringify(data))

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',

        body: JSON.stringify({
          registrationType: data.registrationType,

          fullName: data.registrationType === 'individual' ? data.fullName : undefined,

          grade: data.registrationType === 'individual' ? data.grade : undefined,

          schoolName: data.schoolName,

          contactPerson: data.registrationType === 'school' ? data.contactPerson : undefined,

          numOfStudents: data.registrationType === 'school' ? data.numOfStudents : undefined,

          email: data.email,

          phoneNumber: data.phoneNumber,

          event: Number(data.eventId),
        }),
      })

      if (!res.ok) {
        const error = await res.json()

        console.error('Registration Error:', error)

        throw new Error(JSON.stringify(error))
      }
    } catch (error) {
      console.error('Registration submission error:', error)
      setGlobalError('There was a problem submitting your registration. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    reset({ registrationType: 'individual' })
    setInvoice(null)
    setStep(1)
    setGlobalError(null)
  }

  // Narrow errors for discriminated union fields
  const indErrors = errors as {
    fullName?: { message?: string }
    grade?: { message?: string }
    schoolName?: { message?: string }
  }
  const schErrors = errors as {
    schoolName?: { message?: string }
    contactPerson?: { message?: string }
    numOfStudents?: { message?: string }
  }

  return (
    <motion.div
      id="registration-form"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Heading */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#104179] dark:text-white mb-4">
          Register for an Event
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Secure your spot — fill in your details below and we{"'"}ll generate your invoice
          instantly.
        </p>
      </motion.div>

      <StepIndicator step={step} />

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Registration type toggle */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Registration type
          </label>
          <div className="flex border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="individual"
                className="sr-only"
                {...register('registrationType')}
              />
              <span
                className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-300 ${
                  registrationType === 'individual'
                    ? 'bg-[#104179] text-white'
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <User className="w-4 h-4" />
                Individual
              </span>
            </label>
            <label className="flex-1 cursor-pointer border-l-2 border-gray-200 dark:border-gray-700">
              <input
                type="radio"
                value="school"
                className="sr-only"
                {...register('registrationType')}
              />
              <span
                className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-300 ${
                  registrationType === 'school'
                    ? 'bg-[#104179] text-white'
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <School className="w-4 h-4" />
                School / Group
              </span>
            </label>
          </div>
        </motion.div>

        {/* ── Individual fields ── */}
        {registrationType === 'individual' && (
          <>
            <SectionLabel>Personal details</SectionLabel>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full name *
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  {...register('fullName')}
                  className="w-full px-4 py-4 rounded-2xl border border-gray-300"
                />
                <FieldError message={indErrors.fullName?.message} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Grade / Year *
                </label>
                <IconInput
                  icon={Hash}
                  type="number"
                  placeholder="10"
                  min={1}
                  max={13}
                  hasError={!!indErrors.grade}
                  {...register('grade', { valueAsNumber: true })}
                />
                <FieldError message={indErrors.grade?.message} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                School name *
              </label>
              <IconInput
                icon={School}
                type="text"
                placeholder="Lincoln High School"
                hasError={!!indErrors.schoolName}
                {...register('schoolName')}
              />
              <FieldError message={indErrors.schoolName?.message} />
            </div>
          </>
        )}

        {/* ── School fields ── */}
        {registrationType === 'school' && (
          <>
            <SectionLabel>School details</SectionLabel>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  School name *
                </label>
                <input
                  type="text"
                  placeholder="Lincoln High School"
                  {...register('schoolName')}
                  className="w-full px-4 py-4 rounded-2xl border border-gray-300"
                />

                <FieldError message={schErrors.schoolName?.message} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Contact person *
                </label>
                <input
                  type="text"
                  placeholder="Contact person"
                  {...register('contactPerson')}
                  className="w-full px-4 py-4 rounded-2xl border border-gray-300"
                />
                <FieldError message={schErrors.contactPerson?.message} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Number of students *
              </label>
              <input
                type="number"
                placeholder="30"
                {...register('numOfStudents', { valueAsNumber: true })}
                className="w-full px-4 py-4 rounded-2xl border border-gray-300"
              />
              <FieldError message={schErrors.numOfStudents?.message} />
            </div>
          </>
        )}

        <div className="border-t-2 border-dashed border-gray-100 dark:border-gray-800 pt-2">
          <SectionLabel>Contact &amp; event</SectionLabel>
        </div>

        {/* Email + Phone */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email address *
            </label>
            <IconInput
              icon={Mail}
              type="email"
              placeholder="jane@example.com"
              hasError={!!errors.email}
              {...register('email')}
            />
            <FieldError message={errors.email?.message} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Phone number *
            </label>
            <IconInput
              icon={Phone}
              type="tel"
              placeholder="+15555555555"
              hasError={!!errors.phoneNumber}
              {...register('phoneNumber')}
            />
            <FieldError message={errors.phoneNumber?.message} />
          </motion.div>
        </div>

        {/* Event select */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select event *
          </label>
          <IconSelect icon={Calendar} hasError={!!errors.eventId} {...register('eventId')}>
            <option value="">— Choose an event —</option>
            {eventsList.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </IconSelect>
          <FieldError message={errors.eventId?.message} />
        </motion.div>

        {/* Global error */}
        {globalError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {globalError}
          </motion.div>
        )}

        {/* Submit */}
        <motion.div variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.02, y: submitting ? 0 : -2 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg cursor-pointer ${
              submitting
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-[#104179] hover:bg-[#0d3563] text-white'
            }`}
          >
            {submitting ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                Complete registration &amp; generate invoice
                <Send className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}
