import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UnauthorizedPage() {
  const navigate  = useNavigate()
  const { user } = useAuth()

  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚫</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--navy-950)', marginBottom: '8px' }}>
        Access Denied
      </h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: '32px' }}>
        You don't have permission to access this page.
        {user && ` Your role is: ${user.role}`}
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          🏠 Go to Dashboard
        </button>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    </div>
  )
}