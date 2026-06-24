import { useNavigate } from 'react-router-dom'
import './ErrorPage.css'

export default function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="error-page">
      <div className="error-card">
        <span className="error-icon">⚠️</span>
        <h1 className="error-title">Oops! Something went wrong.</h1>
        <p className="error-message">
          We've been notified and will work diligently on fixing it. Sorry for the inconvenience!
        </p>
        <button className="error-home-btn" onClick={() => navigate('/')}>
          ← Home
        </button>
      </div>
    </div>
  )
}
