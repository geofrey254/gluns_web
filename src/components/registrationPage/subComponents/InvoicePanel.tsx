import { InvoiceData } from '@/types/registrationTypes'
import { motion } from 'framer-motion'
import { CheckCircle, PlusCircle, Printer } from 'lucide-react'

export default function InvoicePanel({
  invoice,
  onReset,
}: {
  invoice: InvoiceData
  onReset: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-900 border-2 border-[#85cc26] rounded-3xl p-6 sm:p-8 shadow-lg"
    >
      {/* Success badge */}
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

      {/* Invoice header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <p className="text-base font-bold text-[#104179] dark:text-white">
            Event<span className="text-[#85cc26]">Hub</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Official registration invoice</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{invoice.invoiceNo}</p>
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
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{invoice.eventName}</p>
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
                ${item.unit.toFixed(2)}
              </td>
              <td className="py-2.5 text-right font-medium text-gray-900 dark:text-white">
                ${item.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-between items-center py-3 border-t-2 border-[#104179] dark:border-[#104179] font-bold text-[#104179] dark:text-white text-base">
        <span>Total due</span>
        <span>${invoice.totalAmt.toFixed(2)}</span>
      </div>

      {/* Note */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-xs text-[#104179] dark:text-blue-300 leading-relaxed">
        Payment instructions will be sent to your email. Keep this invoice number for reference.
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.print()}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-[#104179] text-[#104179] dark:text-white dark:border-white text-sm font-semibold hover:bg-[#104179] hover:text-white dark:hover:bg-white dark:hover:text-[#104179] transition-all duration-300"
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
    </motion.div>
  )
}
