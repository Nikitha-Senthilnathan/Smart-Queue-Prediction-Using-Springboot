import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on app start
  useEffect(() => {
    const saved = localStorage.getItem('smartqueue_user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {
        localStorage.removeItem('smartqueue_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('smartqueue_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('smartqueue_user')
  }

  const isAdmin = () => user?.role === 'ADMIN'
  const isStaff = () => user?.role === 'STAFF' || user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isStaff, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}