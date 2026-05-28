const STATUS_BADGE = {
  WAITING:   { cls: 'badge badge-blue', label: 'Waiting'   },
  SERVING:   { cls: 'badge badge-low',  label: 'Serving'   },
  COMPLETED: { cls: 'badge badge-gray', label: 'Completed' },
  CANCELLED: { cls: 'badge badge-high', label: 'Cancelled' },
}

export default function QueueTable({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          No customers in queue right now
        </div>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="queue-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Token</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Status</th>
            <th>Checked In</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => {
            const sb = STATUS_BADGE[e.status] || STATUS_BADGE['WAITING']
            return (
              <tr key={e.id}>
                <td style={{ color: 'var(--gray-400)' }}>{i + 1}</td>
                <td className="token-cell">{e.tokenNumber}</td>
                <td className="name-cell">{e.customerName}</td>
                <td style={{ color: 'var(--gray-600)' }}>{e.serviceType}</td>
                <td>
                  <span className={sb.cls} style={{ padding: '3px 10px', fontSize: '0.75rem' }}>
                    {sb.label}
                  </span>
                </td>
                <td className="time-cell">
                  {new Date(e.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
