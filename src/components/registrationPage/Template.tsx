'use client'
import { useState, useEffect } from 'react'

// ── Types ────────────────────────────────────────────────────────
interface PayloadEvent {
  id: string
  title: string
  subtitle?: string
  location: string
  date: string
  cost?: number
  currency?: string
}

interface SchoolForm {
  school_name: string
  contact_person: string
  email: string
  phone_number: string
  event_id: string
  students: string
}

interface IndividualForm {
  full_name: string
  email: string
  phone_number: string
  id_number: string
  grade: string
  event_id: string
}

interface Errors {
  [key: string]: string
}

// ── Helpers ──────────────────────────────────────────────────────
function generateInvoiceNumber() {
  return `INV-${Date.now().toString().slice(-8)}`
}

function formatCurrency(amount: number, currency = 'KES') {
  return `${currency} ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ── PDF invoice generator ────────────────────────────────────────
function generateInvoicePDF(
  data: SchoolForm | IndividualForm,
  mode: 'school' | 'individual',
  event: PayloadEvent,
  invoiceNo: string,
) {
  const currency = event.currency || 'KES'
  const unitFee = event.cost ?? 0
  const isSchool = mode === 'school'
  const qty = isSchool ? Number((data as SchoolForm).students || 1) : 1
  const subtotal = unitFee * qty
  const vat = Math.round(subtotal * 0.16)
  const total = subtotal + vat

  const today = new Date().toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const dueDate = new Date(Date.now() + 7 * 86_400_000).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const sd = data as SchoolForm
  const id = data as IndividualForm

  const billTo = isSchool
    ? `<strong>${sd.school_name}</strong><br/>${sd.contact_person}<br/>${sd.email}${sd.phone_number ? `<br/>${sd.phone_number}` : ''}`
    : `<strong>${id.full_name}</strong><br/>${id.email}${id.phone_number ? `<br/>${id.phone_number}` : ''}${id.id_number ? `<br/>ID: ${id.id_number}` : ''}`

  const description = isSchool
    ? `School group registration — ${event.title}`
    : `Individual registration — ${event.title}`

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Invoice ${invoiceNo}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#1f2937;padding:44px 48px;background:#fff;}
    .page{max-width:720px;margin:0 auto;}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;}
    .brand-name{font-size:26px;font-weight:800;color:#104179;letter-spacing:-1px;}
    .brand-sub{font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#85cc26;margin-top:3px;}
    .inv-label{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:6px;}
    .inv-number{font-size:20px;font-weight:700;color:#104179;margin-bottom:8px;}
    .inv-meta{font-size:12px;color:#6b7280;line-height:1.9;}
    .bar{height:3px;border-radius:2px;background:#104179;margin-bottom:32px;position:relative;}
    .bar::after{content:'';position:absolute;right:0;top:0;width:22%;height:100%;background:#85cc26;border-radius:2px;}
    .two-col{display:flex;gap:48px;margin-bottom:28px;}
    .addr h4{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:8px;}
    .addr p{font-size:13px;line-height:1.9;color:#374151;}
    .event-card{background:#f0f7e6;border-left:4px solid #85cc26;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:28px;}
    .event-card .ev-eyebrow{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6aaa1e;margin-bottom:4px;}
    .event-card .ev-title{font-size:15px;font-weight:700;color:#104179;margin-bottom:4px;}
    .event-card .ev-detail{font-size:12px;color:#6b7280;}
    table{width:100%;border-collapse:collapse;margin-bottom:24px;}
    thead th{background:#104179;color:#fff;padding:10px 10px;font-size:11px;font-weight:600;letter-spacing:.4px;text-align:left;}
    thead th:nth-child(2),thead th:nth-child(3){text-align:center;}
    thead th:nth-child(4){text-align:right;}
    tbody td{padding:12px 10px;border-bottom:1px solid #f3f4f6;font-size:13px;vertical-align:top;}
    tbody td:nth-child(2),tbody td:nth-child(3){text-align:center;}
    tbody td:nth-child(4){text-align:right;font-weight:500;}
    .totals-wrap{display:flex;justify-content:flex-end;margin-bottom:40px;}
    .totals{width:260px;}
    .totals table{margin-bottom:0;}
    .totals td{padding:5px 8px;font-size:13px;border-bottom:none;}
    .totals td:last-child{text-align:right;}
    .totals .t-muted{color:#6b7280;}
    .totals .total-row td{font-size:15px;font-weight:700;color:#104179;border-top:2px solid #104179;padding-top:10px;}
    .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;margin-left:6px;}
    .badge-unpaid{background:#fef3c7;color:#b45309;}
    .badge-school{background:#dbeafe;color:#1d4ed8;}
    .badge-ind{background:#ede9fe;color:#6d28d9;}
    .footer{border-top:1px solid #e5e7eb;padding-top:20px;display:flex;justify-content:space-between;align-items:flex-end;}
    .payment-note{font-size:11px;color:#9ca3af;line-height:1.9;}
    .payment-note strong{color:#6b7280;}
    .amount-block{text-align:right;}
    .amount-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;}
    .amount-value{font-size:22px;font-weight:800;color:#104179;margin-top:2px;}
    @media print{body{padding:20px;}@page{margin:12mm;size:A4;}}
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div>
      <div class="brand-name">EventsHub</div>
      <div class="brand-sub">Registration Portal</div>
    </div>
    <div style="text-align:right;">
      <div class="inv-label">Invoice</div>
      <div class="inv-number">${invoiceNo}</div>
      <div class="inv-meta">
        Issued: ${today}<br/>
        Due: ${dueDate}<br/>
        Status: <span class="badge badge-unpaid">Unpaid</span><span class="badge ${isSchool ? 'badge-school' : 'badge-ind'}">${isSchool ? 'School' : 'Individual'}</span>
      </div>
    </div>
  </div>

  <div class="bar"></div>

  <div class="two-col">
    <div class="addr">
      <h4>From</h4>
      <p><strong>EventsHub Ltd</strong><br/>Upperhill Towers, 4th Floor<br/>Nairobi, Kenya<br/>info@eventshub.co.ke<br/>KRA PIN: P051234567M</p>
    </div>
    <div class="addr">
      <h4>Bill to</h4>
      <p>${billTo}</p>
    </div>
  </div>

  <div class="event-card">
    <div class="ev-eyebrow">Event</div>
    <div class="ev-title">${event.title}</div>
    <div class="ev-detail">${formatEventDate(event.date)}&nbsp;&nbsp;·&nbsp;&nbsp;${event.location}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:52%">Description</th>
        <th style="width:13%">Qty</th>
        <th style="width:17.5%">Unit price</th>
        <th style="width:17.5%">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${description}</td>
        <td style="text-align:center">${qty}</td>
        <td style="text-align:center">${formatCurrency(unitFee, currency)}</td>
        <td>${formatCurrency(subtotal, currency)}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals-wrap">
    <div class="totals">
      <table>
        <tr><td class="t-muted">Subtotal</td><td>${formatCurrency(subtotal, currency)}</td></tr>
        <tr><td class="t-muted">VAT (16%)</td><td>${formatCurrency(vat, currency)}</td></tr>
        <tr class="total-row"><td>Total due</td><td>${formatCurrency(total, currency)}</td></tr>
      </table>
    </div>
  </div>

  <div class="footer">
    <div class="payment-note">
      <strong>Payment instructions</strong><br/>
      Bank: Equity Bank Kenya &nbsp;·&nbsp; Account: 0012345678901<br/>
      Paybill: 247247 &nbsp;·&nbsp; Account no.: ${invoiceNo}<br/>
      Please quote the invoice number when making payment.
    </div>
    <div class="amount-block">
      <div class="amount-label">Amount due</div>
      <div class="amount-value">${formatCurrency(total, currency)}</div>
    </div>
  </div>
</div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank')
  if (win) {
    win.onload = () => setTimeout(() => win.print(), 400)
  }
}

// ── Sub-components ───────────────────────────────────────────────
function Field({
  label,
  icon,
  error,
  required,
  children,
}: {
  label: string
  icon?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          letterSpacing: '.3px',
        }}
      >
        {label}
        {required && <span style={{ color: '#e24b4a', marginLeft: 3 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: 11,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-secondary)',
              fontSize: 15,
              pointerEvents: 'none',
              lineHeight: 1,
            }}
          >
            <i className={`ti ti-${icon}`} aria-hidden="true" />
          </span>
        )}
        {children}
      </div>
      {error && (
        <span
          style={{
            fontSize: 12,
            color: '#e24b4a',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 1,
          }}
        >
          <i className="ti ti-alert-circle" style={{ fontSize: 13 }} aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  )
}

function TextInput({
  hasIcon,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasIcon?: boolean; error?: string }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      onFocus={(e) => {
        setFocused(true)
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        setFocused(false)
        props.onBlur?.(e)
      }}
      style={{
        width: '100%',
        padding: hasIcon ? '9px 12px 9px 34px' : '9px 12px',
        borderRadius: 9,
        border: `1.5px solid ${error ? '#e24b4a' : focused ? '#85cc26' : 'var(--color-border-tertiary)'}`,
        background: 'var(--color-background-primary)',
        color: 'var(--color-text-primary)',
        fontSize: 14,
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color .15s',
      }}
    />
  )
}

// ── Main component ───────────────────────────────────────────────
export default function RegistrationPage({ event: eventProp }: { event?: string }) {
  const [mode, setMode] = useState<'school' | 'individual'>('school')
  const [step, setStep] = useState<1 | 2>(1)
  const [events, setEvents] = useState<PayloadEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [invoiceNo, setInvoiceNo] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const [schoolForm, setSchoolForm] = useState<SchoolForm>({
    school_name: '',
    contact_person: '',
    email: '',
    phone_number: '',
    event_id: '',
    students: '',
  })
  const [individualForm, setIndividualForm] = useState<IndividualForm>({
    full_name: '',
    email: '',
    phone_number: '',
    id_number: '',
    grade: '',
    event_id: '',
  })

  // Fetch events from Payload CMS
  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data: { events: PayloadEvent[] }) => {
        if (data.events?.length) {
          setEvents(data.events)
          // Pre-select: use prop if provided, otherwise first event
          const preselect = eventProp
            ? (data.events.find((e) => e.id === eventProp || e.title === eventProp)?.id ??
              data.events[0].id)
            : data.events[0].id
          setSchoolForm((p) => ({ ...p, event_id: preselect }))
          setIndividualForm((p) => ({ ...p, event_id: preselect }))
        }
      })
      .catch(() => setGlobalError('Could not load events. Please refresh.'))
      .finally(() => setEventsLoading(false))
  }, [eventProp])

  const form = mode === 'school' ? schoolForm : individualForm
  const setForm =
    mode === 'school'
      ? (v: Partial<SchoolForm>) => setSchoolForm((p) => ({ ...p, ...v }))
      : (v: Partial<IndividualForm>) => setIndividualForm((p) => ({ ...p, ...v }))

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    if (mode === 'school') setSchoolForm((p) => ({ ...p, [name]: value }))
    else setIndividualForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  function validate() {
    const e: Errors = {}
    if (mode === 'school') {
      if (!schoolForm.school_name.trim()) e.school_name = 'School name is required'
      if (!schoolForm.contact_person.trim()) e.contact_person = 'Contact person is required'
      if (!schoolForm.email.trim()) e.email = 'Email is required'
      else if (!/^\S+@\S+\.\S+$/.test(schoolForm.email)) e.email = 'Enter a valid email'
      if (!schoolForm.students || Number(schoolForm.students) < 1)
        e.students = 'Enter number of students (min 1)'
      if (!schoolForm.event_id) e.event_id = 'Select an event'
    } else {
      if (!individualForm.full_name.trim()) e.full_name = 'Full name is required'
      if (!individualForm.email.trim()) e.email = 'Email is required'
      else if (!/^\S+@\S+\.\S+$/.test(individualForm.email)) e.email = 'Enter a valid email'
      if (!individualForm.id_number.trim()) e.id_number = 'ID / passport number is required'
      if (!individualForm.event_id) e.event_id = 'Select an event'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')
    if (!validate()) return
    setSubmitting(true)

    // Build Payload form-submissions payload
    const formFields =
      mode === 'school'
        ? [
            { field: 'school_name', value: schoolForm.school_name },
            { field: 'contact_person', value: schoolForm.contact_person },
            { field: 'email', value: schoolForm.email },
            { field: 'phone_number', value: schoolForm.phone_number },
            { field: 'event', value: schoolForm.event_id },
            { field: 'students', value: schoolForm.students },
            { field: 'registration_type', value: 'school' },
          ]
        : [
            { field: 'full_name', value: individualForm.full_name },
            { field: 'email', value: individualForm.email },
            { field: 'phone_number', value: individualForm.phone_number },
            { field: 'id_number', value: individualForm.id_number },
            { field: 'grade', value: individualForm.grade },
            { field: 'event', value: individualForm.event_id },
            { field: 'registration_type', value: 'individual' },
          ]

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionData: formFields }),
      })
      if (!res.ok) throw new Error('Submission failed')
      const inv = generateInvoiceNumber()
      setInvoiceNo(inv)
      setStep(2)
    } catch {
      setGlobalError('There was a problem submitting your registration. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedEvent = events.find((ev) => ev.id === form.event_id)
  const unitFee = selectedEvent?.cost ?? 0
  const currency = selectedEvent?.currency ?? 'KES'
  const qty = mode === 'school' ? Number(schoolForm.students || 0) : 1
  const subtotal = unitFee * qty
  const vat = Math.round(subtotal * 0.16)
  const total = subtotal + vat

  // ── Success screen ────────────────────────────────────────────
  if (step === 2 && selectedEvent) {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '2rem 1rem' }}>
        <div
          style={{
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 16,
            padding: '2.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#f0f7e6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <i
              className="ti ti-circle-check"
              style={{ fontSize: 30, color: '#85cc26' }}
              aria-hidden="true"
            />
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 500,
              margin: '0 0 8px',
              color: 'var(--color-text-primary)',
            }}
          >
            Registration confirmed
          </h2>
          <p
            style={{
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              margin: '0 0 24px',
              lineHeight: 1.7,
            }}
          >
            {mode === 'school'
              ? `${schoolForm.school_name} has been registered. A confirmation will be sent to ${schoolForm.email}.`
              : `${individualForm.full_name} has been registered. A confirmation will be sent to ${individualForm.email}.`}
          </p>

          {/* Receipt summary */}
          <div
            style={{
              background: 'var(--color-background-secondary)',
              borderRadius: 10,
              padding: '14px 16px',
              marginBottom: 20,
              textAlign: 'left',
            }}
          >
            {[
              ['Invoice', invoiceNo],
              ['Event', selectedEvent.title],
              ['Date', formatEventDate(selectedEvent.date)],
              ...(mode === 'school' ? [['Students', schoolForm.students]] : []),
              ['Registration type', mode === 'school' ? 'School group' : 'Individual'],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                  fontSize: 13,
                }}
              >
                <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                <span
                  style={{
                    color: 'var(--color-text-primary)',
                    fontWeight: label === 'Invoice' ? 600 : 400,
                    maxWidth: 260,
                    textAlign: 'right',
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 10,
                marginTop: 4,
                borderTop: '0.5px solid var(--color-border-tertiary)',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <span style={{ color: 'var(--color-text-primary)' }}>Total due (incl. VAT)</span>
              <span style={{ color: '#104179' }}>{formatCurrency(total, currency)}</span>
            </div>
          </div>

          <button
            onClick={() =>
              generateInvoicePDF(
                mode === 'school' ? schoolForm : individualForm,
                mode,
                selectedEvent,
                invoiceNo,
              )
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: '#104179',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 10,
            }}
          >
            <i className="ti ti-download" style={{ fontSize: 16 }} aria-hidden="true" />
            Download invoice
          </button>
          <button
            onClick={() => {
              setStep(1)
              setSchoolForm({
                school_name: '',
                contact_person: '',
                email: '',
                phone_number: '',
                event_id: events[0]?.id ?? '',
                students: '',
              })
              setIndividualForm({
                full_name: '',
                email: '',
                phone_number: '',
                id_number: '',
                grade: '',
                event_id: events[0]?.id ?? '',
              })
              setErrors({})
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              border: '0.5px solid var(--color-border-secondary)',
              background: 'transparent',
              color: 'var(--color-text-primary)',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Register another
          </button>
        </div>
      </div>
    )
  }

  // ── Loading ───────────────────────────────────────────────────
  if (eventsLoading) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
        <i
          className="ti ti-loader-2"
          style={{ fontSize: 28, color: '#104179', animation: 'spin 1s linear infinite' }}
          aria-hidden="true"
        />
        <p style={{ marginTop: 12, fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Loading registration form…
        </p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  // ── Main form ─────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <h2 className="sr-only">Event registration — school or individual</h2>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: '#104179',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i
              className="ti ti-calendar-event"
              style={{ fontSize: 17, color: '#fff' }}
              aria-hidden="true"
            />
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
            }}
          >
            EventsHub
          </span>
        </div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            margin: '0 0 6px',
          }}
        >
          Register for an event
        </h1>
        <p
          style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.7 }}
        >
          Register your school or sign up as an individual participant. You{"'"}ll receive an
          invoice after completing registration.
        </p>
      </div>

      {/* Mode toggle */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginBottom: '1.5rem',
          background: 'var(--color-background-secondary)',
          padding: 4,
          borderRadius: 11,
        }}
      >
        {(
          [
            { key: 'school', icon: 'building', label: 'School registration' },
            { key: 'individual', icon: 'user', label: 'Individual registration' },
          ] as const
        ).map(({ key, icon, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setMode(key)
              setErrors({})
            }}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: mode === key ? 600 : 400,
              fontSize: 14,
              background: mode === key ? 'var(--color-background-primary)' : 'transparent',
              color: mode === key ? '#104179' : 'var(--color-text-secondary)',
              boxShadow: mode === key ? '0 1px 3px rgba(0,0,0,.07)' : 'none',
              transition: 'all .15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <i className={`ti ti-${icon}`} style={{ fontSize: 16 }} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* Two-column layout: form + summary */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: 16, alignItems: 'start' }}
      >
        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 14,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* Section: registrant details */}
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)',
                  margin: '0 0 14px',
                }}
              >
                {mode === 'school' ? 'School details' : 'Personal details'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {mode === 'school' ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <Field
                        label="School name"
                        icon="building"
                        error={errors.school_name}
                        required
                      >
                        <TextInput
                          hasIcon
                          name="school_name"
                          value={schoolForm.school_name}
                          onChange={handleChange}
                          placeholder="Greenwood High School"
                          error={errors.school_name}
                        />
                      </Field>
                      <Field
                        label="Contact person"
                        icon="user"
                        error={errors.contact_person}
                        required
                      >
                        <TextInput
                          hasIcon
                          name="contact_person"
                          value={schoolForm.contact_person}
                          onChange={handleChange}
                          placeholder="Jane Mwangi"
                          error={errors.contact_person}
                        />
                      </Field>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <Field label="Email address" icon="mail" error={errors.email} required>
                        <TextInput
                          hasIcon
                          type="email"
                          name="email"
                          value={schoolForm.email}
                          onChange={handleChange}
                          placeholder="jane@school.ac.ke"
                          error={errors.email}
                        />
                      </Field>
                      <Field label="Phone number" icon="phone">
                        <TextInput
                          hasIcon
                          type="tel"
                          name="phone_number"
                          value={schoolForm.phone_number}
                          onChange={handleChange}
                          placeholder="+254 700 000 000"
                        />
                      </Field>
                    </div>
                    <Field label="Number of students" icon="users" error={errors.students} required>
                      <TextInput
                        hasIcon
                        type="number"
                        min={1}
                        name="students"
                        value={schoolForm.students}
                        onChange={handleChange}
                        placeholder="e.g. 30"
                        error={errors.students}
                      />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Full name" icon="user" error={errors.full_name} required>
                      <TextInput
                        hasIcon
                        name="full_name"
                        value={individualForm.full_name}
                        onChange={handleChange}
                        placeholder="John Kamau"
                        error={errors.full_name}
                      />
                    </Field>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <Field label="Email address" icon="mail" error={errors.email} required>
                        <TextInput
                          hasIcon
                          type="email"
                          name="email"
                          value={individualForm.email}
                          onChange={handleChange}
                          placeholder="john@email.com"
                          error={errors.email}
                        />
                      </Field>
                      <Field label="Phone number" icon="phone">
                        <TextInput
                          hasIcon
                          type="tel"
                          name="phone_number"
                          value={individualForm.phone_number}
                          onChange={handleChange}
                          placeholder="+254 700 000 000"
                        />
                      </Field>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <Field
                        label="National ID / passport"
                        icon="id-badge"
                        error={errors.id_number}
                        required
                      >
                        <TextInput
                          hasIcon
                          name="id_number"
                          value={individualForm.id_number}
                          onChange={handleChange}
                          placeholder="12345678"
                          error={errors.id_number}
                        />
                      </Field>
                      <Field label="Year / grade">
                        <TextInput
                          name="grade"
                          value={individualForm.grade}
                          onChange={handleChange}
                          placeholder="e.g. Form 4 / Year 3"
                        />
                      </Field>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Section: event selection */}
            <div style={{ borderTop: '0.5px solid var(--color-border-tertiary)', paddingTop: 18 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)',
                  margin: '0 0 12px',
                }}
              >
                Select event
              </p>

              {events.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  No events available at this time.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {events.map((ev) => {
                    const selected = form.event_id === ev.id
                    return (
                      <label
                        key={ev.id}
                        style={{
                          display: 'flex',
                          gap: 12,
                          padding: '12px 14px',
                          borderRadius: 10,
                          cursor: 'pointer',
                          border: `1.5px solid ${selected ? '#104179' : 'var(--color-border-tertiary)'}`,
                          background: selected
                            ? 'rgba(16,65,121,.05)'
                            : 'var(--color-background-primary)',
                          transition: 'all .15s',
                        }}
                      >
                        <input
                          type="radio"
                          name="event_id"
                          value={ev.id}
                          checked={selected}
                          onChange={handleChange}
                          style={{ accentColor: '#104179', marginTop: 3, flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: 'var(--color-text-primary)',
                              marginBottom: 3,
                            }}
                          >
                            {ev.title}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: 'var(--color-text-secondary)',
                              display: 'flex',
                              gap: 12,
                              flexWrap: 'wrap',
                            }}
                          >
                            <span>
                              <i
                                className="ti ti-calendar"
                                style={{ fontSize: 12, marginRight: 4 }}
                                aria-hidden="true"
                              />
                              {formatEventDate(ev.date)}
                            </span>
                            <span>
                              <i
                                className="ti ti-map-pin"
                                style={{ fontSize: 12, marginRight: 4 }}
                                aria-hidden="true"
                              />
                              {ev.location}
                            </span>
                          </div>
                        </div>
                        {ev.cost != null && (
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#104179' }}>
                              {formatCurrency(ev.cost, ev.currency ?? 'KES')}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                              per person
                            </div>
                          </div>
                        )}
                      </label>
                    )
                  })}
                </div>
              )}
              {errors.event_id && (
                <span
                  style={{
                    fontSize: 12,
                    color: '#e24b4a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 8,
                  }}
                >
                  <i className="ti ti-alert-circle" style={{ fontSize: 13 }} aria-hidden="true" />
                  {errors.event_id}
                </span>
              )}
            </div>

            {/* Global error */}
            {globalError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '0.5px solid #fca5a5',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontSize: 13,
                  color: '#b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <i
                  className="ti ti-alert-triangle"
                  style={{ fontSize: 15, flexShrink: 0 }}
                  aria-hidden="true"
                />
                {globalError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || events.length === 0}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 10,
                border: 'none',
                background:
                  submitting || events.length === 0
                    ? 'var(--color-background-secondary)'
                    : '#104179',
                color: submitting || events.length === 0 ? 'var(--color-text-secondary)' : '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: submitting || events.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'background .15s',
              }}
            >
              {submitting ? (
                <>
                  <i
                    className="ti ti-loader-2"
                    style={{ fontSize: 17, animation: 'spin 1s linear infinite' }}
                    aria-hidden="true"
                  />
                  Submitting…
                </>
              ) : (
                <>
                  <i className="ti ti-send" style={{ fontSize: 15 }} aria-hidden="true" />
                  Complete registration
                </>
              )}
            </button>
          </div>
        </form>

        {/* ── Order summary ── */}
        <div style={{ position: 'sticky', top: 16 }}>
          <div
            style={{
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 14,
              padding: '1.25rem',
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: 'var(--color-text-secondary)',
                margin: '0 0 14px',
              }}
            >
              Order summary
            </p>

            {selectedEvent ? (
              <>
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      marginBottom: 4,
                    }}
                  >
                    {selectedEvent.title}
                  </div>
                  <div
                    style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
                  >
                    <i
                      className="ti ti-calendar"
                      style={{ fontSize: 12, marginRight: 4 }}
                      aria-hidden="true"
                    />
                    {formatEventDate(selectedEvent.date)}
                    <br />
                    <i
                      className="ti ti-map-pin"
                      style={{ fontSize: 12, marginRight: 4 }}
                      aria-hidden="true"
                    />
                    {selectedEvent.location}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '0.5px solid var(--color-border-tertiary)',
                    paddingTop: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {[
                    ['Fee per person', formatCurrency(unitFee, currency)],
                    ...(mode === 'school' ? [['× Students', schoolForm.students || '0']] : []),
                    ['Subtotal', formatCurrency(subtotal, currency)],
                    ['VAT (16%)', formatCurrency(vat, currency)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}
                    >
                      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 15,
                      fontWeight: 600,
                      paddingTop: 10,
                      marginTop: 2,
                      borderTop: '0.5px solid var(--color-border-tertiary)',
                    }}
                  >
                    <span style={{ color: 'var(--color-text-primary)' }}>Total due</span>
                    <span style={{ color: '#104179' }}>{formatCurrency(total, currency)}</span>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                Select an event to see pricing.
              </p>
            )}

            <div
              style={{
                marginTop: 14,
                background: '#f0f7e6',
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 12,
                color: '#3B6D11',
                lineHeight: 1.6,
              }}
            >
              <i
                className="ti ti-receipt"
                style={{ fontSize: 13, marginRight: 4 }}
                aria-hidden="true"
              />
              Invoice PDF generated on registration.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
      `}</style>
    </div>
  )
}
