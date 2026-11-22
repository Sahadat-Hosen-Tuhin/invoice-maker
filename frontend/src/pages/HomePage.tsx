import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-card">
        <BrandLogo className="home-brand" />
        <h1>Invoice Maker</h1>
        <p className="home-description">Create, manage and download your invoices.</p>
        <div className="home-actions">
          <Link className="home-action home-action-primary" to="/invoices/new">
            <span className="home-action-icon" aria-hidden="true">＋</span>
            <span>Make Invoice</span>
            <span className="home-action-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="home-action home-action-secondary" to="/invoices">
            <span className="home-action-icon list-icon" aria-hidden="true">▤</span>
            <span>See Invoices</span>
            <span className="home-action-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
