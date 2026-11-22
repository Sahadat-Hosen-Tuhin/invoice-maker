import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { invoiceService } from '../services/invoiceService'
import type { Invoice } from '../types/invoice'
import { formatCurrency, formatInvoiceDate, getInvoiceTotals } from '../utils/invoice'

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to load invoices.'
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    invoiceService.listInvoices().then(
      (data) => {
        if (active) {
          setInvoices(data)
          setLoading(false)
        }
      },
      (reason: unknown) => {
        if (active) {
          setError(errorMessage(reason))
          setLoading(false)
        }
      },
    )
    return () => {
      active = false
    }
  }, [])

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return invoices
    return invoices.filter((invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(query)
      || invoice.customer.name.toLowerCase().includes(query),
    )
  }, [invoices, search])

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <Link aria-label="Developer Station 25 home" className="workspace-brand" to="/">
          <BrandLogo className="workspace-brand-logo" includeTagline={false} />
        </Link>
        <Link className="text-back-link" to="/">← Home</Link>
      </header>

      <section className="workspace-content">
        <div className="page-title-row">
          <div>
            <p className="page-eyebrow">INVOICE MANAGEMENT</p>
            <h1>See Invoices</h1>
            <p className="page-subtitle">Browse your saved invoices and open a preview.</p>
          </div>
          <Link className="small-primary-button" to="/invoices/new">＋ Make Invoice</Link>
        </div>

        <label className="invoice-search">
          <span className="visually-hidden">Search invoices</span>
          <span aria-hidden="true">⌕</span>
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by invoice number or customer"
            type="search"
            value={search}
          />
        </label>

        {loading && <p className="page-message">Loading invoices…</p>}
        {error && <p className="page-error" role="alert">{error}</p>}
        {!loading && !error && filteredInvoices.length === 0 && (
          <p className="page-message">No invoices found. Try another search.</p>
        )}

        {!loading && !error && filteredInvoices.length > 0 && (
          <div className="invoice-list-wrap">
            <table className="invoice-list-table">
              <thead>
                <tr>
                  <th>Invoice number</th>
                  <th>Customer</th>
                  <th>Issue date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th><span className="visually-hidden">Preview</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.invoiceNumber}>
                    <td data-label="Invoice number">
                      <Link
                        className="invoice-number-link"
                        to={`/invoices/${encodeURIComponent(invoice.invoiceNumber)}`}
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td data-label="Customer">{invoice.customer.name}</td>
                    <td data-label="Issue date">{formatInvoiceDate(invoice.issueDate)}</td>
                    <td data-label="Total">{formatCurrency(getInvoiceTotals(invoice).total)}</td>
                    <td data-label="Status">
                      <span className={`paid-status ${invoice.paymentStatus === 'Unpaid' ? 'unpaid-status' : ''}`}>
                        {invoice.paymentStatus ?? 'Paid'}
                      </span>
                    </td>
                    <td data-label="Preview">
                      <Link
                        className="preview-link"
                        to={`/invoices/${encodeURIComponent(invoice.invoiceNumber)}`}
                      >
                        Preview <span aria-hidden="true">→</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
