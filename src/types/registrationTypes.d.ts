export interface InvoiceData {
  invoiceNo: string
  date: string
  registrantName: string
  email: string
  phone: string
  eventName: string
  eventDetail: string
  lineItems: { desc: string; qty: number; unit: number; total: number }[]
  totalAmt: number
  priceKnown: boolean
  currency: string // add this
}
