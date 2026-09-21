import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react'

export const Layout: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      {/* Top Navigation - Apple-style Tab Bar / Toolbar with Liquid Glass */}
      <header className="sticky top-0 z-50 liquid-glass px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-[var(--color-content)] hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--color-primary-500)] to-[var(--color-primary-300)] flex items-center justify-center text-white shadow-sm">
              <BookOpen size={18} />
            </div>
            <span className="font-semibold tracking-tight text-lg">GPI OVA</span>
          </Link>
          
          <nav className="hidden md:flex gap-4">
            <Link to="/" className="text-sm font-medium text-[var(--color-content-secondary)] hover:text-[var(--color-content)] transition-colors">Catálogo</Link>
            {user?.role === 'docente' && (
              <Link to="/docente/progreso" className="text-sm font-medium text-[var(--color-content-secondary)] hover:text-[var(--color-content)] transition-colors">Dashboard</Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-[var(--color-content-secondary)]">
                <div className="w-6 h-6 rounded-full bg-[var(--color-border)] flex items-center justify-center">
                  <UserIcon size={14} />
                </div>
                <span className="hidden sm:inline">{user.full_name}</span>
              </div>
              <button 
                onClick={logout}
                className="text-sm font-medium text-[var(--color-primary-600)] hover:opacity-80 transition-opacity"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="text-sm font-medium bg-[var(--color-primary-600)] text-white px-4 py-1.5 rounded-full hover:bg-[var(--color-primary-700)] transition-colors shadow-sm"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[var(--color-content-secondary)] border-t border-[var(--color-border)]">
        &copy; {new Date().getFullYear()} GPI OVA Project.
      </footer>
    </div>
  )
}
