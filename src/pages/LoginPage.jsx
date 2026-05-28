import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) return toast.error('Please enter username and password')

    setLoading(true)
    try {
      const res = await axios.post('/api/auth/login', {
        username: username.trim(),
        password,
      })
      login(res.data)
      toast.success(`Welcome, ${res.data.fullName}!`)

      // Redirect based on role
      if (res.data.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/staff')
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">🏦</div>
          <h1 className="login-title">SmartQueue</h1>
          <p className="login-subtitle">Staff & Admin Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="show-pass-btn"
                onClick={() => setShowPass(p => !p)}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Signing In…' : '🔐 Sign In'}
          </button>
        </form>

        {/* Default credentials hint
        <div className="login-hint">
          <p className="hint-title">Default Credentials</p>
          <div className="hint-row">
            <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>ADMIN</span>
            <span>admin / admin123</span>
          </div>
          <div className="hint-row">
            <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>STAFF</span>
            <span>staff / staff123</span>
          </div>
        </div> */}

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: 'var(--navy-800)', fontSize: '0.85rem' }}>
            ← Back to Public Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}