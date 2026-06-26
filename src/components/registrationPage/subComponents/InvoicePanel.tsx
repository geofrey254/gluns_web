import { InvoiceData } from '@/types/registrationTypes'
import { motion } from 'framer-motion'
import { CheckCircle, FileText, LoaderCircle, PlusCircle, Printer, Send } from 'lucide-react'
import Image from 'next/image'

export default function InvoicePanel({
  invoice,
  confirmed, // true = registration went through
  submitting,
  onConfirm,
  onEdit,
  onReset,
}: {
  invoice: InvoiceData
  confirmed: boolean
  submitting: boolean
  onConfirm: () => void
  onEdit: () => void
  onReset: () => void
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-[#85cc26] rounded-3xl p-6 sm:p-8 shadow-lg">
      <div id="invoice-print-area" className="no-print-border">
        {/* Success / preview badge */}
        {confirmed ? (
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-10 h-10 text-[#85cc26]" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-[#104179] dark:text-white">
                Registration confirmed!
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your invoice has been generated.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-10 h-10 text-[#104179] dark:text-white" />
            <div>
              <h3 className="text-lg font-bold text-[#104179] dark:text-white">
                Review your invoice
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please confirm the details before registering.
              </p>
            </div>
          </div>
        )}

        {/* Printed header — only visible on print */}
        <div className="hidden print:flex justify-between items-center mb-6 pb-3 border-b-2 border-[#104179]">
          <div>
            <Image
              src="/logos/bluelogo.png"
              alt="GLUNS Logo"
              width={500}
              height={500}
              priority
              className="w-32 md:w-32 2xl:w-36"
            />{' '}
            <p className="text-lg font-semibold text-gray-500">Official Registration Invoice</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{invoice.invoiceNo}</p>
            <p className="text-xs text-gray-500">{invoice.date}</p>
          </div>
        </div>

        {/* Invoice header */}
        <div className="print:hidden flex justify-between items-start mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <Image
              src="/logos/bluelogo.png"
              alt="GLUNS Logo"
              width={500}
              height={500}
              priority
              className="w-32 md:w-32 2xl:w-36"
            />{' '}
            <p className="text-lg font-semibold text-gray-500">Official registration invoice</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {invoice.invoiceNo}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{invoice.date}</p>
          </div>
        </div>

        {/* Registrant + Event */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1 font-semibold">
              Registrant
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {invoice.registrantName}
            </p>
            <p className="text-sm text-gray-500">{invoice.email}</p>
            <p className="text-sm text-gray-500">{invoice.phone}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1 font-semibold">
              Event
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {invoice.eventName}
            </p>
            <p className="text-sm text-gray-500 whitespace-pre-line">{invoice.eventDetail}</p>
          </div>
        </div>

        {/* Line items */}
        <table className="w-full text-sm border-collapse mb-3">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {['Description', 'Qty', 'Unit', 'Total'].map((h) => (
                <th
                  key={h}
                  className={`text-[11px] uppercase tracking-wider text-gray-400 font-semibold py-2 ${
                    h !== 'Description' ? 'text-right' : 'text-left'
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, i) => (
              <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                <td className="py-2.5 text-gray-700 dark:text-gray-300">{item.desc}</td>
                <td className="py-2.5 text-right text-gray-700 dark:text-gray-300">{item.qty}</td>
                <td className="py-2.5 text-right text-gray-700 dark:text-gray-300">
                  {item.unit != null ? `${invoice.currency} ${item.unit.toFixed(2)}` : '—'}
                </td>
                <td className="py-2.5 text-right font-medium text-gray-900 dark:text-white">
                  {item.total != null ? `${invoice.currency} ${item.total.toFixed(2)}` : 'TBD'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-between items-center py-3 border-t-2 border-[#104179] dark:border-[#104179] font-bold text-[#104179] dark:text-white text-base">
          <span>Total due</span>
          <span>
            {invoice.totalAmt != null
              ? `${invoice.currency} ${invoice.totalAmt.toFixed(2)}`
              : 'Contact us for pricing'}
          </span>{' '}
        </div>

        {/* Note */}
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-xs text-[#104179] dark:text-blue-300 leading-relaxed">
          Please use the payment details below and quote your invoice number{' '}
          <span className="font-bold">{invoice.invoiceNo}</span> as your payment reference. An email
          will been sent to {invoice.email}.
        </div>

        {/* Payment details */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Bank transfer */}
          <div className="p-3 rounded-2xl border border-gray-100 dark:border-gray-800 print:border-gray-300">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
              Bank Transfer
            </p>
            <div className="space-y-0.5 text-xs text-gray-700 dark:text-gray-300">
              <p>
                <span className="text-gray-400">Account name</span>
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">GLUNS INTERNATIONAL MUN</p>
              <p className="mt-1.5">
                <span className="text-gray-400">Bank</span>
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                Co-op Bank — Karen Branch
              </p>
              <p className="mt-1.5">
                <span className="text-gray-400">Account number</span>
              </p>
              <p className="font-semibold text-gray-900 dark:text-white tracking-wider">
                01102989614001
              </p>
            </div>
          </div>

          {/* M-Pesa */}
          <div className="p-3 rounded-2xl border border-gray-100 dark:border-gray-800 print:border-gray-300">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
              M-Pesa Paybill
            </p>
            <div className="space-y-0.5 text-xs text-gray-700 dark:text-gray-300">
              <p>
                <span className="text-gray-400">Paybill number</span>
              </p>
              <p className="font-semibold text-gray-900 dark:text-white tracking-wider">400200</p>
              <p className="mt-1.5">
                <span className="text-gray-400">Account number</span>
              </p>
              <p className="font-semibold text-gray-900 dark:text-white tracking-wider">1164385</p>
              <p className="mt-1.5">
                <span className="text-gray-400">Account name</span>
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">Name of your school</p>
            </div>
          </div>
        </div>

        {/* Stamp — only on print */}
        <div className="hidden print:flex justify-end mt-2">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#85cc26] font-semibold">
              Status
            </p>
            <p className="text-sm font-bold text-[#104179]">Pending Payment</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {confirmed ? (
        // ── Success state ──
        <div className="flex gap-3 mt-5">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-[#104179] text-[#104179] dark:text-white dark:border-white text-sm font-semibold hover:bg-[#104179] hover:text-white transition-all duration-300"
          >
            <Printer className="w-4 h-4" />
            Print / save PDF
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#85cc26] text-white text-sm font-semibold hover:bg-[#6faa1e] transition-all duration-300"
          >
            <PlusCircle className="w-4 h-4" />
            New registration
          </motion.button>
        </div>
      ) : (
        // ── Preview state ──
        <div className="flex gap-3 mt-5">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-gray-300 text-gray-600 dark:text-white dark:border-gray-600 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
          >
            ← Edit details
          </motion.button>
          <motion.button
            type="button"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.02, y: submitting ? 0 : -1 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            onClick={onConfirm}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              submitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#104179] text-white hover:bg-[#0d3563]'
            }`}
          >
            {submitting ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" /> Registering…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Confirm & register
              </>
            )}
          </motion.button>
        </div>
      )}
    </div>
  )
}
