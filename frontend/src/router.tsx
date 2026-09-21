import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LoginForm } from './features/auth/LoginForm'
import { OVAList } from './features/ova-catalog/OVAList'
import { OVAViewer } from './features/ova-viewer/OVAViewer'
import { useAuth } from './context/AuthContext'

const ProtectedRoute: React.FC<{ children: React.ReactNode, role?: string }> = ({ children, role }) => {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

// Dummy component for teacher dashboard until fully implemented
const ProgressTable = () => <div className="p-10 text-center"><h2 className="text-2xl font-semibold">Dashboard Docente</h2><p className="mt-4 text-[var(--color-content-secondary)]">Vista en construcción</p></div>

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <OVAList />
      },
      {
        path: 'ovas/:id',
        element: <OVAViewer />
      },
      {
        path: 'login',
        element: <LoginForm />
      },
      {
        path: 'docente/progreso',
        element: (
          <ProtectedRoute role="docente">
            <ProgressTable />
          </ProtectedRoute>
        )
      }
    ]
  }
])
