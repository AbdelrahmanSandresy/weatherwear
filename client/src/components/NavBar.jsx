import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './NavBar.css'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/auth')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="navbar-logo-icon">🌤</span>
        <span className="navbar-logo-text">Weatherwear</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Home
        </NavLink>
        <NavLink to="/closet" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          My Outfits
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Contact
        </NavLink>
      </div>
      <div className="navbar-right">
        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        )}
      </div>
    </nav>
  )
}
