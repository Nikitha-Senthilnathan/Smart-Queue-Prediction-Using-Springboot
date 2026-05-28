import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { queueAPI } from '../services/api'
import QueueTable from '../components/QueueTable'
import BranchSelector from '../components/BranchSelector'
import toast from 'react-hot-toast'

export default function StaffPage() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [branch,  setBranch]  = useState('')
  const [waiting, setWaiting] = useState([])
  const [serving, setServing] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async (b) => {
    if (!b) return
    try {
      const [w, s] = await Promise.all([queueAPI.getWaiting(b), queueAPI.getServing(b)])
      setWaiting(w.data)
      setServing(s.data)
    } catch { toast.error('Failed to fetch queue data') }
  }

  useEffect(() => { if (branch) fetchData(branch) }, [branch])

  const handleLogout = () => { logout(); navigate('/login'); toast.success('Logged out') }

  const handleServeNext = async () => {
    if (!branch) return toast.error('Please select a branch first')
    setLoading(true)
    try {
      const res = await queueAPI.serveNext(branch)
      if (res.data?.tokenNumber) toast.success(`Now serving: ${res.data.tokenNumber} — ${res.data.customerName}`)
      else toast('No customers waiting', { icon: 'ℹ️' })
      fetchData(branch)
    } catch { toast.error('Error calling next customer') }
    finally { setLoading(false) }
  }

  const handleComplete = async (id) => {
    try { await queueAPI.completeService(id); toast.success('Completed!'); fetchData(branch) }
    catch { toast.error('Failed to complete') }
  }

  return (
    <div className="fade-in-up">
      <div className="staff-auth-bar">
        <div className="staff-auth-info">
          <span className="staff-auth-avatar">{user?.fullName?.charAt(0) || 'S'}</span>
          <div>
            <span className="staff-auth-name">{user?.fullName}</span>
            <span className={`badge ${user?.role === 'ADMIN' ? 'badge-high' : 'badge-blue'}`} style={{ fontSize: '0.65rem', marginLeft: '8px' }}>{user?.role}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isAdmin() && <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: '0.85rem' }} onClick={() => navigate('/admin')}>⚙️ Admin Panel</button>}
          <button className="btn btn-danger" style={{ padding: '7px 14px', fontSize: '0.85rem' }} onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      <div className="staff-header" style={{ marginTop: '20px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">Staff Panel</h1>
          <p className="page-subtitle">Select your branch and manage the queue</p>
        </div>
        <button className="btn btn-success btn-lg" onClick={handleServeNext} disabled={loading || !branch}>
          {loading ? 'Processing…' : '➡️ Serve Next Customer'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '20px', marginTop: '20px' }}>
        <BranchSelector value={branch} onChange={setBranch} label="Your Branch" />
      </div>

      {branch && (
        <>
          {serving.length > 0 && (
            <div className="serving-section">
              <div className="serving-title">⚙️ Currently Serving</div>
              {serving.map(e => (
                <div key={e.id} className="serving-item">
                  <div className="serving-info">
                    <span className="serving-token">{e.tokenNumber}</span>
                    <span className="serving-name">{e.customerName}</span>
                    <span className="serving-service">— {e.serviceType}</span>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.85rem' }} onClick={() => handleComplete(e.id)}>✓ Complete</button>
                </div>
              ))}
            </div>
          )}
          <div className="section-title">
            Waiting Queue ({waiting.length})
            <button className="refresh-btn" onClick={() => fetchData(branch)}>↻ Refresh</button>
          </div>
          <QueueTable entries={waiting} />
        </>
      )}
    </div>
  )
}