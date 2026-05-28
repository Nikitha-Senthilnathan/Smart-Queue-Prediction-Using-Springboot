import { useState, useEffect } from 'react'
import { queueAPI } from '../services/api'
import StatsCard from '../components/StatsCard'
import CrowdBadge from '../components/CrowdBadge'
import QueueTable from '../components/QueueTable'
import BranchSelector from '../components/BranchSelector'
import toast from 'react-hot-toast'

export default function HomePage() {
  const [branch,  setBranch]  = useState('')
  const [stats,   setStats]   = useState(null)
  const [waiting, setWaiting] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async (b) => {
    if (!b) return
    setLoading(true)
    try {
      const [s, w] = await Promise.all([
        queueAPI.getStats(b),
        queueAPI.getWaiting(b),
      ])
      setStats(s.data)
      setWaiting(w.data)
    } catch {
      toast.error('Failed to load queue data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (branch) {
      fetchData(branch)
      const id = setInterval(() => fetchData(branch), 15000)
      return () => clearInterval(id)
    }
  }, [branch])

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Queue Dashboard</h1>
        <p className="page-subtitle">Select a branch to view real-time queue status</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <BranchSelector value={branch} onChange={setBranch} label="Select Branch to View" />
        {!branch && (
          <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '4px' }}>
            Please select a branch to see queue information
          </p>
        )}
      </div>

      {loading && (
        <>
          <div className="skeleton skeleton-h24" />
          <div className="skeleton skeleton-h24" />
        </>
      )}

      {!loading && stats && branch && (
        <>
          <div className="crowd-banner">
            <div className="crowd-banner-left">
              <h3>Crowd Level</h3>
              <CrowdBadge level={stats.crowdLevel} />
            </div>
            <div className="crowd-banner-center">
              <div className="wait-minutes">{stats.estimatedWaitMinutes}</div>
              <div className="wait-label">min estimated wait</div>
            </div>
            <div className="crowd-banner-right">
              Avg. service: {stats.avgServiceTimeMinutes} min/customer
            </div>
          </div>

          <div className="stats-grid">
            <StatsCard label="Total in Queue"    value={stats.totalInQueue}                           icon="👥" color="#3b5bdb" />
            <StatsCard label="Currently Serving" value={stats.currentlyServing}                       icon="⚙️" color="#2f9e44" />
            <StatsCard label="Waiting"           value={stats.totalInQueue - stats.currentlyServing}  icon="⏳" color="#e67700" />
            <StatsCard label="Avg Wait (min)"    value={stats.avgServiceTimeMinutes}                  icon="🕐" color="#ae3ec9" />
          </div>

          <div className="section-title">
            Waiting Queue
            <button className="refresh-btn" onClick={() => fetchData(branch)}>↻ Refresh</button>
          </div>
          <QueueTable entries={waiting} />
        </>
      )}
    </div>
  )
}