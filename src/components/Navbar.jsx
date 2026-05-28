import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/',        label: 'Dashboard' },
  { to: '/checkin', label: 'Check In'  },
  { to: '/status',  label: 'My Status' },
  { to: '/staff',   label: 'Staff Panel' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          🏦 SmartQueue
        </div>
        <div className="navbar-links">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link${pathname === l.to ? ' active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
