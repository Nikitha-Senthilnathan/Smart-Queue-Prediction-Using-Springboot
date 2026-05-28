import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import HomePage        from './pages/HomePage'
import CheckInPage     from './pages/CheckInPage'
import StatusPage      from './pages/StatusPage'
import StaffPage       from './pages/StaffPage'
import LoginPage       from './pages/LoginPage'
import AdminPage       from './pages/AdminPage'
import UnauthorizedPage from './pages/UnauthorizedPage'

export default function App() {
  return (
    <AuthProvider>
      <div className="app-wrapper">
        <Routes>
          {/* Login page — no navbar */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin page — no navbar, full layout */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          } />

          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* All other pages — with navbar */}
          <Route path="/*" element={
            <div>
              <Navbar />
              <main className="page-main">
                <Routes>
                  <Route path="/"        element={<HomePage />} />
                  <Route path="/checkin" element={<CheckInPage />} />
                  <Route path="/status"  element={<StatusPage />} />
                  <Route path="/staff"   element={
                    <ProtectedRoute>
                      <StaffPage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}