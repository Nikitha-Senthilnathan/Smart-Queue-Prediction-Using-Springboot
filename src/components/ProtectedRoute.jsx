import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Protects a route — redirects to login if not authenticated or wrong role
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If route requires ADMIN role
  if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}