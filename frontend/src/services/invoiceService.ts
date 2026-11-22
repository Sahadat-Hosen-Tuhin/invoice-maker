import type {
  Invoice,
  InvoiceLineItem,
  InvoiceService,
} from '../types/invoice'

const storageKey = 'developer-station-invoices-v1'

function item(
  id: string,
  name: string,
  description: string,
  unitPrice: number,
  quantity = 1,
): InvoiceLineItem {
  return { id, name, description, unitPrice, quantity }
}

const demoInvoices: Invoice[] = [
  {
    invoiceNumber: 'DS-INV-2025-001',
    issueDate: '2025-11-01',
    dueDate: '2025-11-30',
    customer: {
      name: 'ABC Corporation',
      address: '123 Business Street, Dhaka-1200',
      email: 'client@abc.com',
      phone: '+880 1711 000000',
    },
    items: [
      item('website-development', 'Website Development', 'Modern and responsive website', 500),
      item('hosting-cost', 'Hosting Cost', 'Annual hosting plan', 50),
      item('cloudinary-subscription', 'Cloudinary Subscription', 'Media management service', 20),
      item('domain-registration', 'Domain Registration', 'example.com', 15),
      item('website-maintenance', 'Website Maintenance', 'Monthly support & updates', 30),
    ],
    discountRate: 0.1,
    taxRate: 0.05,
    payment: {
      accountType: 'Bank Transfer',
      accountName: 'Developer Station 25',
      accountNumber: '1234 5678 9012',
      bankName: 'Example Bank',
      transactionId: 'BK123456789',
      method: 'Bank Transfer',
      date: '2025-11-01',
    },
  },
  {
    invoiceNumber: 'DS-INV-2025-002',
    issueDate: '2025-11-05',
    dueDate: '2025-12-05',
    customer: {
      name: 'Bright Future Ltd.',
      address: '45 Banani Road, Dhaka-1213',
      email: 'accounts@brightfuture.com',
      phone: '+880 1812 345678',
    },
    items: [
      item('landing-page', 'Landing Page Design', 'Custom campaign landing page', 350),
      item('maintenance', 'Monthly Support', 'Updates and technical support', 40),
    ],
    discountRate: 0.05,
    taxRate: 0.05,
    payment: {
      accountType: 'Bank Transfer',
      accountName: 'Developer Station 25',
      accountNumber: '1234 5678 9012',
      bankName: 'Example Bank',
      transactionId: 'BK123456790',
      method: 'Bank Transfer',
      date: '2025-11-05',
    },
  },
  {
    invoiceNumber: 'DS-INV-2025-003',
    issueDate: '2025-11-09',
    dueDate: '2025-12-09',
    customer: {
      name: 'Green Leaf Media',
      address: 'House 18, Road 7, Dhanmondi, Dhaka',
      email: 'hello@greenleafmedia.com',
      phone: '+880 1912 111222',
    },
    items: [
      item('brand-kit', 'Brand Identity Kit', 'Logo and brand guidelines', 280),
      item('social-templates', 'Social Media Templates', '12 reusable post designs', 120),
      item('hosting', 'Hosting Plan', 'One year website hosting', 60),
    ],
    discountRate: 0,
    taxRate: 0.05,
    payment: {
      accountType: 'Bank Transfer',
      accountName: 'Developer Station 25',
      accountNumber: '1234 5678 9012',
      bankName: 'Example Bank',
      transactionId: 'BK123456791',
      method: 'Bank Transfer',
      date: '2025-11-09',
    },
  },
  {
    invoiceNumber: 'DS-INV-2025-004',
    issueDate: '2025-11-13',
    dueDate: '2025-12-13',
    customer: {
      name: 'Rahman Trading Co.',
      address: '88 Motijheel C/A, Dhaka-1000',
      email: 'office@rahmantrading.com',
      phone: '+880 1715 222333',
    },
    items: [
      item('company-site', 'Corporate Website', 'Up to 8 responsive pages', 700),
      item('domain', 'Domain Registration', 'One year domain registration', 18),
      item('email-setup', 'Business Email Setup', 'Five company email accounts', 45),
    ],
    discountRate: 0.08,
    taxRate: 0.05,
    payment: {
      accountType: 'Bank Transfer',
      accountName: 'Developer Station 25',
      accountNumber: '1234 5678 9012',
      bankName: 'Example Bank',
      transactionId: 'BK123456792',
      method: 'Bank Transfer',
      date: '2025-11-13',
    },
  },
  {
    invoiceNumber: 'DS-INV-2025-005',
    issueDate: '2025-11-17',
    dueDate: '2025-12-17',
    customer: {
      name: 'Nova Health Clinic',
      address: '22 Road 11, Uttara, Dhaka-1230',
      email: 'admin@novahealth.com',
      phone: '+880 1610 456789',
    },
    items: [
      item('appointment-app', 'Appointment Booking', 'Online booking integration', 420),
      item('website-care', 'Website Care', 'Monthly updates and backups', 55),
    ],
    discountRate: 0.05,
    taxRate: 0.05,
    payment: {
      accountType: 'Bank Transfer',
      accountName: 'Developer Station 25',
      accountNumber: '1234 5678 9012',
      bankName: 'Example Bank',
      transactionId: 'BK123456793',
      method: 'Bank Transfer',
      date: '2025-11-17',
    },
  },
  {
    invoiceNumber: 'DS-INV-2025-006',
    issueDate: '2025-11-21',
    dueDate: '2025-12-21',
    customer: {
      name: 'Skyline Architects',
      address: 'Plot 6, Road 2, Gulshan, Dhaka-1212',
      email: 'studio@skylinearchitects.com',
      phone: '+880 1811 777888',
    },
    items: [
      item('portfolio-site', 'Portfolio Website', 'Project portfolio and gallery', 540),
      item('photo-optimization', 'Image Optimization', 'Optimize 80 project photos', 90),
      item('analytics', 'Analytics Setup', 'Traffic tracking configuration', 35),
    ],
    discountRate: 0.1,
    taxRate: 0.05,
    payment: {
      accountType: 'Bank Transfer',
      accountName: 'Developer Station 25',
      accountNumber: '1234 5678 9012',
      bankName: 'Example Bank',
      transactionId: 'BK123456794',
      method: 'Bank Transfer',
      date: '2025-11-21',
    },
  },
  {
    invoiceNumber: 'DS-INV-2025-007',
    issueDate: '2025-11-24',
    dueDate: '2025-12-24',
    customer: {
      name: 'Horizon Education',
      address: '10 College Road, Chattogram-4000',
      email: 'info@horizonedu.com',
      phone: '+880 1911 222444',
    },
    items: [
      item('learning-portal', 'Learning Portal', 'Student and course portal', 850),
      item('training', 'Admin Training', 'Two-hour online training session', 75),
    ],
    discountRate: 0,
    taxRate: 0.05,
    payment: {
      accountType: 'Bank Transfer',
      accountName: 'Developer Station 25',
      accountNumber: '1234 5678 9012',
      bankName: 'Example Bank',
      transactionId: 'BK123456795',
      method: 'Bank Transfer',
      date: '2025-11-24',
    },
  },
  {
    invoiceNumber: 'DS-INV-2025-008',
    issueDate: '2025-11-28',
    dueDate: '2025-12-28',
    customer: {
      name: 'Pixel Craft Studio',
      address: '77 Station Road, Sylhet-3100',
      email: 'team@pixelcraft.studio',
      phone: '+880 1719 333555',
    },
    items: [
      item('ecommerce', 'E-commerce Website', 'Online store with product catalog', 960),
      item('payment-gateway', 'Payment Gateway', 'Secure checkout integration', 180),
      item('product-upload', 'Product Upload', 'Initial setup for 25 products', 100),
    ],
    discountRate: 0.1,
    taxRate: 0.05,
    payment: {
      accountType: 'Bank Transfer',
      accountName: 'Developer Station 25',
      accountNumber: '1234 5678 9012',
      bankName: 'Example Bank',
      transactionId: 'BK123456796',
      method: 'Bank Transfer',
      date: '2025-11-28',
    },
  },
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isInvoiceItem(value: unknown): value is InvoiceLineItem {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.name === 'string'
    && typeof value.description === 'string'
    && typeof value.quantity === 'number'
    && typeof value.unitPrice === 'number'
}

function isInvoice(value: unknown): value is Invoice {
  return isRecord(value)
    && typeof value.invoiceNumber === 'string'
    && typeof value.issueDate === 'string'
    && typeof value.dueDate === 'string'
    && isRecord(value.customer)
    && typeof value.customer.name === 'string'
    && typeof value.customer.address === 'string'
    && typeof value.customer.email === 'string'
    && typeof value.customer.phone === 'string'
    && Array.isArray(value.items)
    && value.items.every(isInvoiceItem)
    && typeof value.discountRate === 'number'
    && typeof value.taxRate === 'number'
    && isRecord(value.payment)
    && typeof value.payment.accountType === 'string'
    && typeof value.payment.accountName === 'string'
    && typeof value.payment.accountNumber === 'string'
    && typeof value.payment.bankName === 'string'
    && typeof value.payment.transactionId === 'string'
    && typeof value.payment.method === 'string'
    && typeof value.payment.date === 'string'
}

function readInvoices(): Invoice[] {
  const savedInvoices = localStorage.getItem(storageKey)
  if (savedInvoices === null) {
    localStorage.setItem(storageKey, JSON.stringify(demoInvoices))
    return demoInvoices
  }

  const parsed: unknown = JSON.parse(savedInvoices)
  if (!Array.isArray(parsed) || !parsed.every(isInvoice)) {
    throw new Error('Saved invoice data is invalid. Clear local invoice data and try again.')
  }
  return parsed
}

export const invoiceService: InvoiceService = {
  async listInvoices() {
    return readInvoices()
  },

  async getInvoice(invoiceNumber) {
    return readInvoices().find((invoice) => invoice.invoiceNumber === invoiceNumber) ?? null
  },

  async saveInvoice(invoice) {
    const invoices = readInvoices()
    const updatedInvoices = [
      invoice,
      ...invoices.filter((saved) => saved.invoiceNumber !== invoice.invoiceNumber),
    ]
    localStorage.setItem(storageKey, JSON.stringify(updatedInvoices))
    return invoice
  },
}
