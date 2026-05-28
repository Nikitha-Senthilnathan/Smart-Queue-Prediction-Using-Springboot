const map = {
  LOW:    { label: 'Low Crowd',    cls: 'badge badge-low',    icon: '🟢' },
  MEDIUM: { label: 'Medium Crowd', cls: 'badge badge-medium', icon: '🟡' },
  HIGH:   { label: 'High Crowd',   cls: 'badge badge-high',   icon: '🔴' },
}

export default function CrowdBadge({ level }) {
  const { label, cls, icon } = map[level] || map['LOW']
  return (
    <span className={cls}>
      {icon} {label}
    </span>
  )
}
