import NavBar from '../components/NavBar'
import './ContactPage.css'

export default function ContactPage() {
  return (
    <div className="page">
      <NavBar />
      <main className="contact-main">
        <h1 className="contact-title">Ways to reach us</h1>

        <div className="contact-sections">
          <section className="contact-section">
            <h2 className="contact-section-title">As a user</h2>
            <ul className="contact-list">
              <li className="contact-item">
                <span className="contact-icon">✉️</span>
                <div className="contact-detail">
                  <span className="contact-label">Email</span>
                  <a href="mailto:hello@outfitapp.com" className="contact-value">hello@outfitapp.com</a>
                </div>
              </li>
              <li className="contact-item">
                <span className="contact-icon">📞</span>
                <div className="contact-detail">
                  <span className="contact-label">Phone</span>
                  <a href="tel:5555555555" className="contact-value">555-555-5555</a>
                </div>
              </li>
              <li className="contact-item">
                <span className="contact-icon">📝</span>
                <div className="contact-detail">
                  <span className="contact-label">Contact form</span>
                  <span className="contact-value contact-muted">Submit a support request</span>
                </div>
              </li>
            </ul>
          </section>

          <div className="contact-divider" />

          <section className="contact-section">
            <h2 className="contact-section-title">As a developer</h2>
            <ul className="contact-list">
              <li className="contact-item">
                <span className="contact-icon">🐙</span>
                <div className="contact-detail">
                  <span className="contact-label">GitHub</span>
                  <a href="https://github.com/outfitweather" target="_blank" rel="noreferrer" className="contact-value">
                    github.com/outfitweather
                  </a>
                </div>
              </li>
              <li className="contact-item">
                <span className="contact-icon">💼</span>
                <div className="contact-detail">
                  <span className="contact-label">LinkedIn</span>
                  <a href="https://linkedin.com/company/outfitweather" target="_blank" rel="noreferrer" className="contact-value">
                    linkedin.com/company/outfitweather
                  </a>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
