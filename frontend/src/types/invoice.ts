export interface InvoiceLineItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  customer: {
    name: string
    address: string
    email: string
    phone: string
  }
  items: InvoiceLineItem[]
  discountRate: number
  taxRate: number
  paymentStatus?: 'Paid' | 'Unpaid'
  payment: {
    accountType: string
    accountName: string
    accountNumber: string
    bankName: string
    transactionId: string
    method: string
    date: string
  }
}

export interface InvoiceService {
  listInvoices(): Promise<Invoice[]>
  getInvoice(invoiceNumber: string): Promise<Invoice | null>
  saveInvoice(invoice: Invoice): Promise<Invoice>
}
