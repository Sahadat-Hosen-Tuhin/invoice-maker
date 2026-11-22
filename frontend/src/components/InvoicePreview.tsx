import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import type { Invoice, InvoiceLineItem } from '../types/invoice'
import { formatCurrency, formatInvoiceDate, getInvoiceTotals } from '../utils/invoice'
import '../App.css'

function Icon({
  name,
}: {
  name: 'building' | 'mail' | 'phone' | 'globe' | 'check' | 'clock'
}) {
  const paths = {
    building: <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" />,
    mail: <path d="M3 5h18v14H3zM3 6l9 7 9-7" />,
    phone: <path d="M7 3h4l2 5-3 2a15 15 0 0 0 4 4l2-3 5 2v4c0 1.1-.9 2-2 2C10 19 5 14 5 5c0-1.1.9-2 2-2Z" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  }

  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none">
      {paths[name]}
    </svg>
  )
}

function InvoiceTable({ items }: { items: InvoiceLineItem[] }) {
  return (
    <div className="table-wrap">
      <table className="invoice-table">
        <thead>
          <tr>
            <th className="number-column">#</th>
            <th className="description-column">Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td className="row-number">{index + 1}</td>
              <td className="description-cell">
                <strong>{item.name}</strong>
                <span>{item.description}</span>
              </td>
              <td>{item.quantity}</td>
              <td>{formatCurrency(item.unitPrice)}</td>
              <td>{formatCurrency(item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

async function rasterizeLogos(element: HTMLElement) {
  const images = Array.from(element.querySelectorAll<HTMLImageElement>('.brand-mark'))
  const originalSources: Array<{ image: HTMLImageElement; src: string }> = []

  try {
    for (const image of images) {
      await image.decode()
      if (!image.naturalWidth || !image.naturalHeight) {
        throw new Error('The invoice logo could not be loaded.')
      }

      const logoCanvas = document.createElement('canvas')
      logoCanvas.width = image.naturalWidth * 2
      logoCanvas.height = image.naturalHeight * 2
      const context = logoCanvas.getContext('2d')
      if (!context) throw new Error('The invoice logo could not be prepared for PDF export.')
      context.drawImage(image, 0, 0, logoCanvas.width, logoCanvas.height)

      originalSources.push({ image, src: image.src })
      image.src = logoCanvas.toDataURL('image/png')
      await image.decode()
    }
  } catch (reason: unknown) {
    originalSources.forEach(({ image, src }) => { image.src = src })
    throw reason
  }

  return () => {
    originalSources.forEach(({ image, src }) => { image.src = src })
  }
}

export default function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const { subtotal, discount, tax, total } = getInvoiceTotals(invoice)
  const isPaid = (invoice.paymentStatus ?? 'Paid') === 'Paid'
  const invoiceRef = useRef<HTMLElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  async function downloadPdf() {
    const invoiceElement = invoiceRef.current
    if (!invoiceElement) {
      setDownloadError('Invoice preview is not ready. Please try again.')
      return
    }

    setDownloading(true)
    setDownloadError(null)
    let restoreLogos = () => {}
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])
      restoreLogos = await rasterizeLogos(invoiceElement)
      const canvas = await html2canvas(invoiceElement, {
        backgroundColor: '#ffffff',
        logging: false,
        scale: 2,
        useCORS: true,
        windowHeight: Math.max(window.innerHeight, 1123),
        windowWidth: Math.max(window.innerWidth, 794),
      })
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      })
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.96), 'JPEG', 0, 0, 210, 297)
      const fileName = invoice.invoiceNumber.replace(/[^a-zA-Z0-9._-]/g, '-')
      const pdfUrl = URL.createObjectURL(pdf.output('blob'))
      const downloadLink = document.createElement('a')
      downloadLink.href = pdfUrl
      downloadLink.download = `${fileName}.pdf`
      downloadLink.hidden = true
      document.body.append(downloadLink)
      downloadLink.click()
      downloadLink.remove()
      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000)
    } catch (reason: unknown) {
      setDownloadError(
        reason instanceof Error ? `PDF download failed: ${reason.message}` : 'PDF download failed. Please try again.',
      )
    } finally {
      restoreLogos()
      setDownloading(false)
    }
  }

  return (
    <div className="preview-page">
      <nav className="invoice-toolbar" aria-label="Invoice actions">
        <Link className="toolbar-back" to="/invoices">← Back to invoices</Link>
        <span className="toolbar-invoice-number">{invoice.invoiceNumber}</span>
        <button
          aria-busy={downloading}
          className="download-button"
          disabled={downloading}
          onClick={downloadPdf}
          type="button"
        >
          {downloading ? 'Preparing PDF…' : 'Download PDF'}
        </button>
      </nav>
      {downloadError && <p className="download-error" role="alert">{downloadError}</p>}

      <main className="invoice-paper" aria-label={`Invoice ${invoice.invoiceNumber}`} ref={invoiceRef}>
        <div className="top-corner" aria-hidden="true">
          <span className="corner-orange" />
          <span className="corner-charcoal" />
          <span className="corner-cut" />
          <span className="corner-edge" />
        </div>
        <header className="invoice-header">
          <BrandLogo className="invoice-brand" />

          <section className="invoice-heading" aria-label="Invoice details">
            <h1>INVOICE</h1>
            <div className="orange-rule" />
            <dl className="invoice-meta">
              <div><dt>Invoice No:</dt><dd>{invoice.invoiceNumber}</dd></div>
              <div><dt>Issue Date:</dt><dd>{formatInvoiceDate(invoice.issueDate)}</dd></div>
              <div><dt>Due Date:</dt><dd>{formatInvoiceDate(invoice.dueDate)}</dd></div>
            </dl>
          </section>
        </header>

        <section className="parties">
          <div className="bill-to">
            <h2>Bill To</h2>
            <h3>{invoice.customer.name}</h3>
            <p><Icon name="building" />{invoice.customer.address}</p>
            <p><Icon name="mail" />{invoice.customer.email}</p>
            <p><Icon name="phone" />{invoice.customer.phone}</p>
          </div>
          <div className="thank-you">
            <p className="thank-you-title">Thank you for choosing<br /><strong>Developer Station 25!</strong></p>
            <p className="thank-you-copy">We appreciate your business and trust in our services.</p>
            <div className="small-rule" />
          </div>
        </section>

        <InvoiceTable items={invoice.items} />

        <section className="payment-summary">
          <div className="payment-column">
            <h2>Payment Information</h2>
            <div className="payment-card">
              <div className="payment-entry">
                <img
                  alt=""
                  aria-hidden="true"
                  className="payment-entry-image"
                  src="/bank.png"
                />
                <p>
                  <strong>{invoice.payment.accountType}</strong><br />
                  <b>Account Name:</b> {invoice.payment.accountName}<br />
                  <b>Account Number:</b> {invoice.payment.accountNumber}<br />
                  <b>Bank:</b> {invoice.payment.bankName}
                </p>
              </div>
              <div className="payment-divider" />
              <div className="payment-entry">
                <img
                  alt=""
                  aria-hidden="true"
                  className="payment-entry-image"
                  src="/wallet-filled-money-tool.png"
                />
                <p>
                  <b>Transaction ID:</b> {invoice.payment.transactionId}<br />
                  <b>Payment Method:</b> {invoice.payment.method}<br />
                  <b>Payment Date:</b> {formatInvoiceDate(invoice.payment.date)}
                </p>
              </div>
            </div>
          </div>

          <div className="summary-column">
            <dl className="totals">
              <div><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
              <div><dt>Discount ({invoice.discountRate * 100}%)</dt><dd className="discount">-{formatCurrency(discount)}</dd></div>
              <div><dt>Tax ({invoice.taxRate * 100}%)</dt><dd>{formatCurrency(tax)}</dd></div>
              <div className="grand-total"><dt>Total Amount</dt><dd>{formatCurrency(total)}</dd></div>
            </dl>
            <div className={`paid-banner ${isPaid ? '' : 'unpaid-banner'}`}>
              <strong>
                <span className="check-icon"><Icon name={isPaid ? 'check' : 'clock'} /></span>
                {isPaid ? 'Paid (100%)' : 'Payment Pending'}
              </strong>
              <span>{isPaid ? 'Thank you for your payment!' : 'Payment has not been recorded.'}</span>
            </div>
          </div>
        </section>

        <section className="closing">
          <div className="terms">
            <h2>Terms &amp; Conditions</h2>
            <ol>
              <li>This invoice is valid for 30 days from the issue date.</li>
              <li>Late payment may incur additional charges.</li>
              <li>For any queries, please contact us.</li>
            </ol>
          </div>
        </section>

        <footer className="invoice-footer">
          <div className="footer-contacts">
            <span><Icon name="mail" />hello@developerstation25.com</span>
            <i />
            <span><Icon name="globe" />www.developerstation25.com</span>
            <i />
            <span><Icon name="phone" />+880 1711 000000</span>
          </div>
          <div className="footer-tagline">
            <strong>Developer Station 25</strong>
            <span>Your Trusted Tech Partner</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
