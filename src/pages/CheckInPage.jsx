import { useState } from 'react'
import { queueAPI } from '../services/api'
import BranchSelector from '../components/BranchSelector'
import toast from 'react-hot-toast'

const SERVICES = [
  'Account Opening', 'Cash Deposit', 'Cash Withdrawal',
  'Loan Enquiry', 'Fund Transfer', 'General Enquiry',
]

export default function CheckInPage() {
  const [name,    setName]    = useState('')
  const [service, setService] = useState('')
  const [branch,  setBranch]  = useState('')
  const [phone,   setPhone]   = useState('')
  const [email,   setEmail]   = useState('')
  const [ticket,  setTicket]  = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return toast.error('Please enter your name')
    if (!service)     return toast.error('Please select a service')
    if (!branch)      return toast.error('Please select a branch')
    setLoading(true)
    try {
      const res = await queueAPI.checkIn(name.trim(), service, branch, phone.trim(), email.trim())
      setTicket(res.data)
      toast.success('Checked in successfully!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Check-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (ticket) return (
    <div className="ticket-wrapper fade-in-up">
      <div className="ticket-card">
        <div className="ticket-icon">🎫</div>
        <h2 className="ticket-title">You're in Queue!</h2>
        <p className="ticket-subtitle">Please wait for your token to be called</p>
        <div className="ticket-token-box">
          <div className="ticket-token-label">Your Token Number</div>
          <div className="ticket-token-value">{ticket.tokenNumber}</div>
        </div>
        <div className="ticket-details">
          <div className="ticket-row"><span className="ticket-row-label">Name</span><span className="ticket-row-value">{ticket.customerName}</span></div>
          <div className="ticket-row"><span className="ticket-row-label">Branch</span><span className="ticket-row-value">{ticket.branchName}</span></div>
          <div className="ticket-row"><span className="ticket-row-label">Service</span><span className="ticket-row-value">{ticket.serviceType}</span></div>
          <div className="ticket-row"><span className="ticket-row-label">Position</span><span className="ticket-row-value">#{ticket.position}</span></div>
          <div className="ticket-row"><span className="ticket-row-label">Checked In</span><span className="ticket-row-value">{new Date(ticket.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
        </div>
        {ticket.customerEmail && (
          <div style={{ background: '#ebfbee', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '0.82rem', color: '#2b8a3e', marginBottom: '8px' }}>
            📧 You'll get an email notification when your turn is near at <strong>{ticket.customerEmail}</strong>
          </div>
        )}
        <p className="ticket-note">Save your token to track status in "My Status" tab</p>
        <button className="btn btn-primary btn-full" style={{ marginTop: '20px' }}
          onClick={() => { setTicket(null); setName(''); setService(''); setBranch(''); setPhone(''); setEmail('') }}>
          New Check-In
        </button>
      </div>
    </div>
  )

  return (
    <div className="checkin-wrap fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Check In</h1>
        <p className="page-subtitle">Join the queue and receive your token number</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <BranchSelector value={branch} onChange={setBranch} label="Select Branch *" />
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Service Type *</label>
            <select className="form-select" value={service} onChange={e => setService(e.target.value)}>
              <option value="">Select a service…</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '16px', marginTop: '4px' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginBottom: '12px' }}>
              📧 <strong>Optional:</strong> Add your contact info to get notified when your turn is near
            </p>
            <div className="form-group">
              <label className="form-label">Email (for notification)</label>
              <input className="form-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Checking In…' : '🎫 Get My Token'}
          </button>
        </form>
      </div>
    </div>
  )
}