import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { queueAPI } from '../services/api'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [stats,   setStats]   = useState(null)
  const [users,   setUsers]   = useState([])
  const [tab,     setTab]     = useState('dashboard') // dashboard | staff
  const [loading, setLoading] = useState(false)

  // New staff form
  const [form, setForm] = useState({ username: '', password: '', fullName: '', email: '' })
  const [showForm, setShowForm] = useState(false)

  const fetchStats = async () => {
    try {
      const res = await queueAPI.getStats()
      setStats(res.data)
    } catch { /* ignore */ }
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/auth/users')
      setUsers(res.data)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    fetchStats()
    fetchUsers()
    const id = setInterval(fetchStats, 15000)
    return () => clearInterval(id)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const handleCreateStaff = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password || !form.fullName)
      return toast.error('Please fill all required fields')
    setLoading(true)
    try {
      await axios.post('/api/auth/staff/create', form)
      toast.success('Staff account created!')
      setForm({ username: '', password: '', fullName: '', email: '' })
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create staff')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id) => {
    try {
      const res = await axios.put(`/api/auth/users/${id}/toggle`)
      toast.success(res.data.message)
      fetchUsers()
    } catch {
      toast.error('Failed to update user status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return
    try {
      await axios.delete(`/api/auth/users/${id}`)
      toast.success('User deleted')
      fetchUsers()
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const crowdColor = { LOW: '#2f9e44', MEDIUM: '#e67700', HIGH: '#c92a2a' }

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">🏦 SmartQueue</div>
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="sidebar-name">{user?.fullName}</div>
            <span className="badge badge-high" style={{ fontSize: '0.65rem' }}>ADMIN</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-link ${tab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`sidebar-link ${tab === 'staff' ? 'active' : ''}`}
            onClick={() => setTab('staff')}
          >
            👤 Manage Staff
          </button>
          <button className="sidebar-link" onClick={() => navigate('/staff')}>
            ⚙️ Staff Panel
          </button>
          <button className="sidebar-link" onClick={() => navigate('/')}>
            🏠 Public View
          </button>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">

        {/* ---- DASHBOARD TAB ---- */}
        {tab === 'dashboard' && (
          <div className="fade-in-up">
            <div className="page-header">
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">Overview of the queue system</p>
            </div>

            {stats && (
              <>
                <div className="crowd-banner" style={{ marginBottom: '24px' }}>
                  <div className="crowd-banner-left">
                    <h3>Current Crowd Level</h3>
                    <span className={`badge badge-${stats.crowdLevel?.toLowerCase()}`}>
                      {stats.crowdLevel === 'LOW' ? '🟢' : stats.crowdLevel === 'MEDIUM' ? '🟡' : '🔴'} {stats.crowdLevel}
                    </span>
                  </div>
                  <div className="crowd-banner-center">
                    <div className="wait-minutes">{stats.estimatedWaitMinutes}</div>
                    <div className="wait-label">min estimated wait</div>
                  </div>
                  <div className="crowd-banner-right">
                    Avg service time: {stats.avgServiceTimeMinutes} min
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-top"><span className="stat-label">Total in Queue</span><span className="stat-icon">👥</span></div>
                    <div className="stat-value" style={{ color: '#3b5bdb' }}>{stats.totalInQueue}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-top"><span className="stat-label">Currently Serving</span><span className="stat-icon">⚙️</span></div>
                    <div className="stat-value" style={{ color: '#2f9e44' }}>{stats.currentlyServing}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-top"><span className="stat-label">Waiting</span><span className="stat-icon">⏳</span></div>
                    <div className="stat-value" style={{ color: '#e67700' }}>{stats.totalInQueue - stats.currentlyServing}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-top"><span className="stat-label">Staff Accounts</span><span className="stat-icon">👤</span></div>
                    <div className="stat-value" style={{ color: '#ae3ec9' }}>{users.filter(u => u.role === 'STAFF').length}</div>
                  </div>
                </div>
              </>
            )}

            {/* Users summary */}
            <div className="section-title" style={{ marginTop: '16px' }}>All System Users</div>
            <div className="table-wrap">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="name-cell">{u.fullName}</td>
                      <td className="token-cell">{u.username}</td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-high' : 'badge-blue'}`}
                          style={{ fontSize: '0.72rem' }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.active ? 'badge-low' : 'badge-gray'}`}
                          style={{ fontSize: '0.72rem' }}>
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="time-cell">{u.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---- STAFF MANAGEMENT TAB ---- */}
        {tab === 'staff' && (
          <div className="fade-in-up">
            <div className="staff-header">
              <div className="page-header" style={{ marginBottom: 0 }}>
                <h1 className="page-title">Manage Staff</h1>
                <p className="page-subtitle">Create and manage staff accounts</p>
              </div>
              <button className="btn btn-success" onClick={() => setShowForm(f => !f)}>
                {showForm ? '✕ Cancel' : '+ Add Staff'}
              </button>
            </div>

            {/* Create staff form */}
            {showForm && (
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px', color: 'var(--navy-950)' }}>
                  New Staff Account
                </h3>
                <form onSubmit={handleCreateStaff}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" placeholder="John Smith"
                        value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" placeholder="john@bank.com" type="email"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Username *</label>
                      <input className="form-input" placeholder="johnsmith"
                        value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password *</label>
                      <input className="form-input" placeholder="Set a password" type="password"
                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating…' : '✓ Create Staff Account'}
                  </button>
                </form>
              </div>
            )}

            {/* Staff list */}
            <div className="table-wrap">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role === 'STAFF').map(u => (
                    <tr key={u.id}>
                      <td className="name-cell">{u.fullName}</td>
                      <td className="token-cell">{u.username}</td>
                      <td className="time-cell">{u.email}</td>
                      <td>
                        <span className={`badge ${u.active ? 'badge-low' : 'badge-gray'}`}
                          style={{ fontSize: '0.72rem' }}>
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className={`btn ${u.active ? 'btn-ghost' : 'btn-success'}`}
                            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                            onClick={() => handleToggle(u.id)}
                          >
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                            onClick={() => handleDelete(u.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.filter(u => u.role === 'STAFF').length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state">
                          <div className="empty-icon">👤</div>
                          No staff accounts yet. Create one above.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}