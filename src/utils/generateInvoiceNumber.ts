export function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `INV-GLUNS-${timestamp}-${randomPart}`
}
