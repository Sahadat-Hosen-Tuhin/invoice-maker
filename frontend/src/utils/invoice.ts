import type { Invoice } from '../types/invoice'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function formatCurrency(amount: number) {
  return currency.format(amount)
}

export function formatInvoiceDate(value: string) {
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date)
}

export function getInvoiceTotals(invoice: Invoice) {
  const subtotal = invoice.items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  )
  const discount = subtotal * invoice.discountRate
  const tax = (subtotal - discount) * invoice.taxRate
  return { subtotal, discount, tax, total: subtotal - discount + tax }
}
