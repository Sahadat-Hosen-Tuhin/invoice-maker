import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './pages.css'
import HomePage from './pages/HomePage'
import InvoiceDetailPage from './pages/InvoiceDetailPage'
import InvoiceFormPage from './pages/InvoiceFormPage'
import InvoicesPage from './pages/InvoicesPage'

function NotFoundPage() {
  return (
    <main className="page-message">
      <h1>Page not found</h1>
      <Link className="small-primary-button" to="/">Back home</Link>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<InvoiceFormPage />} path="/invoices/new" />
        <Route element={<InvoicesPage />} path="/invoices" />
        <Route element={<InvoiceDetailPage />} path="/invoices/:invoiceNumber" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
