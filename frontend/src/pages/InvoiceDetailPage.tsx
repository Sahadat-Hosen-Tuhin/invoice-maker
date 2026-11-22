import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import InvoicePreview from '../components/InvoicePreview'
import { invoiceService } from '../services/invoiceService'
import type { Invoice } from '../types/invoice'

export default function InvoiceDetailPage() {
  const { invoiceNumber = '' } = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    invoiceService.getInvoice(invoiceNumber).then(
      (data) => {
        if (active) {
          setInvoice(data)
          setLoading(false)
        }
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : 'Unable to load invoice.')
          setLoading(false)
        }
      },
    )
    return () => {
      active = false
    }
  }, [invoiceNumber])

  if (loading) return <p className="page-message">Loading invoice…</p>
  if (error) return <p className="page-error page-message" role="alert">{error}</p>
  if (!invoice) {
    return (
      <main className="page-message">
        <p>Invoice not found.</p>
        <Link className="small-primary-button" to="/invoices">Back to invoices</Link>
      </main>
    )
  }
  return <InvoicePreview invoice={invoice} />
}
