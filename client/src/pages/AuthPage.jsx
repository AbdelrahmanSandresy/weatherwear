import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './AuthPage.css'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '',
  })

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function validateLogin() {
    const e = {}
    if (!loginForm.email.trim()) e.email = 'Email is required'
    else if (!isValidEmail(loginForm.email)) e.email = 'Enter a valid email address'
    if (!loginForm.password) e.password = 'Password is required'
    return e
  }

  function validateRegister() {
    const e = {}
    if (!registerForm.firstName.trim()) e.firstName = 'First name is required'
    if (!registerForm.lastName.trim()) e.lastName = 'Last name is required'
    if (!registerForm.username.trim()) e.username = 'Username is required'
    if (!registerForm.email.trim()) e.email = 'Email is required'
    else if (!isValidEmail(registerForm.email)) e.email = 'Enter a valid email address'
    if (!registerForm.password) e.password = 'Password is required'
    if (registerForm.password !== registerForm.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = mode === 'login' ? validateLogin() : validateRegister()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setSubmitError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(loginForm.email, loginForm.password)
        navigate('/')
      } else {
        await register(registerForm.email, registerForm.password, {
          first_name: registerForm.firstName,
          last_name: registerForm.lastName,
          username: registerForm.username,
        })
        navigate('/')
      }
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function switchMode(newMode) {
    setMode(newMode)
    setErrors({})
    setSubmitError('')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🌤</span>
          <span className="auth-logo-text">Weatherwear</span>
        </div>

        {mode === 'login' ? (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            {submitError && <p className="submit-error">{submitError}</p>}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <p className="auth-toggle">
              Don't have an account?{' '}
              <button type="button" onClick={() => switchMode('register')}>Register</button>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="First"
                  value={registerForm.firstName}
                  onChange={e => setRegisterForm(f => ({ ...f, firstName: e.target.value }))}
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Last"
                  value={registerForm.lastName}
                  onChange={e => setRegisterForm(f => ({ ...f, lastName: e.target.value }))}
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="@username"
                value={registerForm.username}
                onChange={e => setRegisterForm(f => ({ ...f, username: e.target.value }))}
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={registerForm.email}
                onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={registerForm.password}
                onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={registerForm.confirmPassword}
                onChange={e => setRegisterForm(f => ({ ...f, confirmPassword: e.target.value }))}
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
            {submitError && <p className="submit-error">{submitError}</p>}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            <p className="auth-toggle">
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')}>Sign In</button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
