import { useState, useEffect } from 'react'
import { branchAPI } from '../services/api'

export default function BranchSelector({ value, onChange, label = 'Select Branch' }) {
  const [branches, setBranches] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    branchAPI.getAll()
      .then(res => setBranches(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="skeleton" style={{ height: '44px' }} />
    </div>
  )

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">— Choose a branch —</option>
        {branches.map(b => (
          <option key={b.id} value={b.branchCode}>
            {b.branchName} — {b.city}
          </option>
        ))}
      </select>
    </div>
  )
}