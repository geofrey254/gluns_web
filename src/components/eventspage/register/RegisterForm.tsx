/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  CheckCircle,
  AlertCircle,
  School,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  LoaderCircle,
} from 'lucide-react'

interface FormData {
  id: number
  schoolName: string
  contactPerson: string
  email: string
  phone: string
  event: string
  numStudents: string
}

interface Errors {
  schoolName?: string
  contactPerson?: string
  email?: string
  phone?: string
  numStudents?: string
  form?: string
}

export default function RegisterForm({ event }: { event: string }) {
  const [loading, setLoading] = useState(false)
  const [submitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    schoolName: '',
    contactPerson: '',
    email: '',
    phone: '',
    event: event,
    numStudents: '',
  })
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    setFormData((prev) => ({ ...prev, event }))
  }, [event])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (elements: HTMLFormControlsCollection): boolean => {
    const newErrors: Errors = {}
    let isValid = true

    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required'
      isValid = false
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required'
      isValid = false
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
      isValid = false
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
      isValid = false
    }
    if (!formData.numStudents || Number(formData.numStudents) < 1) {
      newErrors.numStudents = 'Please enter the number of students'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget as HTMLFormElement

    if (!validateForm(formEl.elements)) return

    const payload = {
      form: formData.id,
      submissionData: Array.from(formEl.elements)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((el: any) => el.name)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((el: any) => ({ field: el.name, value: el.value })),
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setIsSubmitted(true)
        formEl.reset()
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ form: 'There was a problem submitting your form. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl border border-green-200 dark:border-green-800"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
        </motion.div>
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4">
          Registration Successful!
        </h3>
        <p className="text-green-700 dark:text-green-400 text-center max-w-sm">
          Thank you for registering your school. We{"'"}ll be in touch with further details within
          24 hours.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      id="register-form"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#104179] dark:text-white mb-4">
          Register Your School
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Fill out the form below to secure your school{"'"}s spot at our upcoming event. We look
          forward to welcoming you and your students!
        </p>
      </motion.div>

      <motion.form onSubmit={handleSubmit} variants={containerVariants} className="space-y-6">
        {/* School Name & Contact Person Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* School Name */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              School Name *
            </label>
            <div className="relative">
              <School className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                  ${
                    errors.schoolName
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 dark:border-gray-700 focus:border-[#85c226]'
                  } focus:outline-none`}
                placeholder="Greenwood High School"
              />
              {errors.schoolName && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-red-500 text-sm mt-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.schoolName}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Contact Person */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Contact Person *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                  ${
                    errors.contactPerson
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 dark:border-gray-700 focus:border-[#85c226]'
                  } focus:outline-none`}
                placeholder="Jane Smith"
              />
              {errors.contactPerson && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-red-500 text-sm mt-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.contactPerson}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Email & Phone Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Email */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                  ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 dark:border-gray-700 focus:border-[#85c226]'
                  } focus:outline-none`}
                placeholder="jane@greenwood.edu"
              />
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-red-500 text-sm mt-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#85c226] transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                placeholder="+254 700 000 000"
              />
            </div>
          </motion.div>
        </div>

        {/* Event Title — read-only */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Event
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="event"
              value={formData.event}
              readOnly
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#85c226] bg-[#85c226]/10 px-2 py-1 rounded-full">
              Pre-filled
            </span>
          </div>
        </motion.div>

        {/* Number of Students */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Number of Students *
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="numStudents"
              value={formData.numStudents}
              onChange={handleChange}
              min={1}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                ${
                  errors.numStudents
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:border-[#85c226]'
                } focus:outline-none`}
              placeholder="e.g. 30"
            />
            {errors.numStudents && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-red-500 text-sm mt-2"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.numStudents}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Global form error */}
        {errors.form && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.form}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg cursor-pointer
              ${
                loading
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-[#104179] text-white hover:bg-[#0d3563]'
              }`}
          >
            {loading ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" />
                Submitting Registration...
              </>
            ) : (
              <>
                Register Now
                <Send className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}
