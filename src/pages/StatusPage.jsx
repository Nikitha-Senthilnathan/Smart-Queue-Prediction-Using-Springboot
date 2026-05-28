import { useState } from 'react'
import { queueAPI } from '../services/api'
import toast from 'react-hot-toast'

const STATUS_META = {
  WAITING:   { label: 'Waiting',           cls: 'waiting',   icon: '⏳' },
  SERVING:   { label: 'Being Served Now!', cls: 'serving',   icon: '✅' },
  COMPLETED: { label: 'Service Completed', cls: 'completed', icon: '🏁' },
  CANCELLED: { label: 'Cancelled',         cls: 'cancelled', icon: '❌' },
}

export default function StatusPage() {
  const [token,   setToken]   = useState('')
  const [entry,   setEntry]   = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!token.trim()) return
    setLoading(true)
    try {
      const res = await queueAPI.checkStatus(token.trim().toUpperCase())
      setEntry(res.data)
    } catch {
      toast.error('Token not found. Please check and try again.')
      setEntry(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your queue position?')) return
    try {
      await queueAPI.cancelByToken(entry.tokenNumber)
      toast.success('Queue position cancelled')
      setEntry(null)
      setToken('')
    } catch {
      toast.error('Could not cancel. Please try again.')
    }
  }

  const meta = entry ? (STATUS_META[entry.status] || STATUS_META['WAITING']) : null

  return (
    <div className="checkin-wrap fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Track My Status</h1>
        <p className="page-subtitle">Enter your token number to see your position in the queue</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="input-row" style={{ marginBottom: '24px' }}>
        <input
          className="form-input"
          style={{ fontFamily: 'var(--font-mono)' }}
          placeholder="e.g. TKN-0001"
          value={token}
          onChange={e => setToken(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '…' : 'Search'}
        </button>
      </form>

      {/* Result Card */}
      {entry && meta && (
        <div className={`status-result ${meta.cls}`}>
          <div className="status-header">
            <span className="status-icon">{meta.icon}</span>
            <div>
              <div className="status-label-tiny">Status</div>
              <div className={`status-label-big ${meta.cls}`}>{meta.label}</div>
            </div>
          </div>

          <div className="status-rows">
            <div className="status-row">
              <span className="status-key">Token</span>
              <span className="status-val" style={{ fontFamily: 'var(--font-mono)', color: 'var(--navy-800)' }}>
                {entry.tokenNumber}
              </span>
            </div>
            <div className="status-row">
              <span className="status-key">Name</span>
              <span className="status-val">{entry.customerName}</span>
            </div>
            <div className="status-row">
              <span className="status-key">Service</span>
              <span className="status-val">{entry.serviceType}</span>
            </div>
            <div className="status-row">
              <span className="status-key">Queue Position</span>
              <span className="status-val">#{entry.position}</span>
            </div>
            <div className="status-row">
              <span className="status-key">Checked In At</span>
              <span className="status-val">
                {new Date(entry.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {entry.status === 'WAITING' && (
            <button
              className="btn btn-danger btn-full"
              style={{ marginTop: '20px' }}
              onClick={handleCancel}
            >
              Cancel My Position
            </button>
          )}
        </div>
      )}
    </div>
  )
}
