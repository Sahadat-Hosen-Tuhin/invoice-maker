import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { invoiceService } from '../services/invoiceService'
import type { Invoice, InvoiceLineItem } from '../types/invoice'

interface ItemDraft {
  id: string
  name: string
  description: string
  quantity: string
  unitPrice: string
}

function toInputDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDefaultDates() {
  const issueDate = new Date()
  const dueDate = new Date(issueDate)
  dueDate.setDate(dueDate.getDate() + 30)
  return { issueDate: toInputDate(issueDate), dueDate: toInputDate(dueDate) }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to save invoice.'
}

function newItem(): ItemDraft {
  return { id: crypto.randomUUID(), name: '', description: '', quantity: '1', unitPrice: '' }
}

export default function InvoiceFormPage() {
  const navigate = useNavigate()
  const dates = getDefaultDates()
  const [invoiceNumber] = useState(
    () => `DS-INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
  )
  const [issueDate, setIssueDate] = useState(dates.issueDate)
  const [dueDate, setDueDate] = useState(dates.dueDate)
  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  })
  const [items, setItems] = useState<ItemDraft[]>([newItem()])
  const [discountPercent, setDiscountPercent] = useState('10')
  const [taxPercent, setTaxPercent] = useState('5')
  const [payment, setPayment] = useState({
    accountName: 'Developer Station 25',
    accountNumber: '1234 5678 9012',
    bankName: 'Example Bank',
    transactionId: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateItem(id: string, field: keyof Omit<ItemDraft, 'id'>, value: string) {
    setItems((current) =>
      current.map((item) => item.id === id ? { ...item, [field]: value } : item),
    )
  }

  function updateCustomer(field: keyof typeof customer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  function updatePayment(field: keyof typeof payment, value: string) {
    setPayment((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const invoiceItems: InvoiceLineItem[] = items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
    }))

    const invoice: Invoice = {
      invoiceNumber,
      issueDate,
      dueDate,
      customer,
      items: invoiceItems,
      discountRate: Number(discountPercent) / 100,
      taxRate: Number(taxPercent) / 100,
      paymentStatus: payment.transactionId.trim() ? 'Paid' : 'Unpaid',
      payment: {
        accountType: 'Bank Transfer',
        accountName: payment.accountName,
        accountNumber: payment.accountNumber,
        bankName: payment.bankName,
        transactionId: payment.transactionId || 'Pending',
        method: 'Bank Transfer',
        date: issueDate,
      },
    }

    try {
      await invoiceService.saveInvoice(invoice)
      navigate(`/invoices/${encodeURIComponent(invoice.invoiceNumber)}`)
    } catch (reason: unknown) {
      setError(errorMessage(reason))
      setSaving(false)
    }
  }

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <Link aria-label="Developer Station 25 home" className="workspace-brand" to="/">
          <BrandLogo className="workspace-brand-logo" includeTagline={false} />
        </Link>
        <Link className="text-back-link" to="/">← Home</Link>
      </header>

      <section className="workspace-content form-content">
        <div className="page-title-row">
          <div>
            <p className="page-eyebrow">NEW DOCUMENT</p>
            <h1>Make Invoice</h1>
            <p className="page-subtitle">Fill in the details below, then save your invoice.</p>
          </div>
          <Link className="text-back-link" to="/invoices">See invoices →</Link>
        </div>

        <form className="invoice-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <div className="form-section-heading">
              <span>01</span>
              <div><h2>Invoice details</h2><p>Invoice number and dates</p></div>
            </div>
            <div className="form-grid form-grid-three">
              <label className="form-field">
                <span>Invoice number</span>
                <input readOnly value={invoiceNumber} />
              </label>
              <label className="form-field">
                <span>Issue date</span>
                <input required onChange={(event) => setIssueDate(event.target.value)} type="date" value={issueDate} />
              </label>
              <label className="form-field">
                <span>Due date</span>
                <input required onChange={(event) => setDueDate(event.target.value)} type="date" value={dueDate} />
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <span>02</span>
              <div><h2>Bill to</h2><p>Customer contact information</p></div>
            </div>
            <div className="form-grid form-grid-two">
              <label className="form-field">
                <span>Customer / company name</span>
                <input autoComplete="organization" onChange={(event) => updateCustomer('name', event.target.value)} required value={customer.name} />
              </label>
              <label className="form-field">
                <span>Email address</span>
                <input autoComplete="email" onChange={(event) => updateCustomer('email', event.target.value)} required type="email" value={customer.email} />
              </label>
              <label className="form-field">
                <span>Billing address</span>
                <input autoComplete="street-address" onChange={(event) => updateCustomer('address', event.target.value)} required value={customer.address} />
              </label>
              <label className="form-field">
                <span>Phone number</span>
                <input autoComplete="tel" onChange={(event) => updateCustomer('phone', event.target.value)} required type="tel" value={customer.phone} />
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <span>03</span>
              <div><h2>Services &amp; items</h2><p>Add the items you are invoicing for</p></div>
            </div>
            <div className="item-fields-header" aria-hidden="true">
              <span>Description</span><span>Qty</span><span>Unit price ($)</span><span />
            </div>
            <div className="item-fields-list">
              {items.map((item, index) => (
                <div className="item-fields-row" key={item.id}>
                  <label className="form-field">
                    <span className="mobile-field-label">Item {index + 1} name</span>
                    <input
                      aria-label={`Item ${index + 1} name`}
                      onChange={(event) => updateItem(item.id, 'name', event.target.value)}
                      placeholder="e.g. Website Development"
                      required
                      value={item.name}
                    />
                    <input
                      aria-label={`Item ${index + 1} description`}
                      className="item-description-input"
                      onChange={(event) => updateItem(item.id, 'description', event.target.value)}
                      placeholder="Short description"
                      value={item.description}
                    />
                  </label>
                  <label className="form-field">
                    <span className="mobile-field-label">Quantity</span>
                    <input
                      aria-label={`Item ${index + 1} quantity`}
                      min="0.01"
                      onChange={(event) => updateItem(item.id, 'quantity', event.target.value)}
                      required
                      step="any"
                      type="number"
                      value={item.quantity}
                    />
                  </label>
                  <label className="form-field">
                    <span className="mobile-field-label">Unit price ($)</span>
                    <input
                      aria-label={`Item ${index + 1} unit price`}
                      min="0"
                      onChange={(event) => updateItem(item.id, 'unitPrice', event.target.value)}
                      required
                      step="0.01"
                      type="number"
                      value={item.unitPrice}
                    />
                  </label>
                  <button
                    aria-label={`Remove item ${index + 1}`}
                    className="remove-item-button"
                    disabled={items.length === 1}
                    onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button className="add-item-button" onClick={() => setItems((current) => [...current, newItem()])} type="button">
              ＋ Add another item
            </button>
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <span>04</span>
              <div><h2>Payment &amp; totals</h2><p>Payment account and invoice tax</p></div>
            </div>
            <div className="form-grid form-grid-two">
              <label className="form-field">
                <span>Account name</span>
                <input onChange={(event) => updatePayment('accountName', event.target.value)} required value={payment.accountName} />
              </label>
              <label className="form-field">
                <span>Account number</span>
                <input onChange={(event) => updatePayment('accountNumber', event.target.value)} required value={payment.accountNumber} />
              </label>
              <label className="form-field">
                <span>Bank name</span>
                <input onChange={(event) => updatePayment('bankName', event.target.value)} required value={payment.bankName} />
              </label>
              <label className="form-field">
                <span>Transaction ID <small>(optional)</small></span>
                <input onChange={(event) => updatePayment('transactionId', event.target.value)} value={payment.transactionId} />
              </label>
              <label className="form-field">
                <span>Discount (%)</span>
                <input max="100" min="0" onChange={(event) => setDiscountPercent(event.target.value)} required step="0.01" type="number" value={discountPercent} />
              </label>
              <label className="form-field">
                <span>Tax (%)</span>
                <input max="100" min="0" onChange={(event) => setTaxPercent(event.target.value)} required step="0.01" type="number" value={taxPercent} />
              </label>
            </div>
          </section>

          {error && <p className="page-error form-error" role="alert">{error}</p>}

          <div className="form-actions">
            <Link className="cancel-button" to="/">Cancel</Link>
            <button className="small-primary-button" disabled={saving} type="submit">
              {saving ? 'Saving…' : 'Save invoice'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
