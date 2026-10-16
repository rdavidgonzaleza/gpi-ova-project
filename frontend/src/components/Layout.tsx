import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { LogOut } from 'lucide-react'
import { useAuth } from '../features/auth/useAuth'
import { cn } from '../lib/cn'
import { ROLE_LABEL, initials } from '../lib/roles'
import { NAV_ITEMS, type NavItem } from '../navigation'
import { BrandMark } from './BrandMark'
import { ButtonLink } from './Button'
import { ThemeToggle } from './ThemeToggle'

export function Layout() {
  const { user } = useAuth()
  const items = NAV_ITEMS.filter((item) => !item.roles || (user && item.roles.includes(user.role)))
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>

      <header className="glass sticky top-0 z-40 border-b border-separator">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <NavLink to="/" aria-label="Hito, inicio" className="rounded-lg">
            <BrandMark />
          </NavLink>
          {items.length > 1 && (
            <nav aria-label="Secciones" className="hidden md:block">
              <ul className="flex items-center gap-1">
                {items.map((item) => (
                  <li key={item.to}>
                    <TopNavLink item={item} />
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <AccountMenu />
            ) : (
              location.pathname !== '/login' && (
                <ButtonLink to="/login" size="sm" variant="secondary">
                  Iniciar sesión
                </ButtonLink>
              )
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="contenido" className={cn('flex-1', items.length > 1 && 'pb-20 md:pb-0')}>
        <Outlet />
      </main>

      <footer className="border-t border-separator px-4 py-8 text-center text-footnote text-label-2">
        Universidad de Cartagena · Gestión de Proyectos Informáticos
      </footer>

      {items.length > 1 && <TabBar items={items} />}
    </div>
  )
}

function TopNavLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'inline-flex h-9 items-center rounded-full px-3.5 text-subhead font-medium transition-colors',
          isActive ? 'bg-surface-2 text-label' : 'text-label-2 hover:text-label',
        )
      }
    >
      {item.label}
    </NavLink>
  )
}

/** Compact widths: top-level sections live in a bottom tab bar (HIG tab-bars.md). */
function TabBar({ items }: { items: NavItem[] }) {
  return (
    <nav
      aria-label="Secciones"
      className="glass fixed inset-x-0 bottom-0 z-40 border-t border-separator pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto flex max-w-md">
        {items.map(({ to, end, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex h-14 flex-col items-center justify-center gap-0.5 text-caption font-medium',
                  isActive ? 'text-accent' : 'text-label-2',
                )
              }
            >
              <Icon className="size-6" strokeWidth={1.8} aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function AccountMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) return null
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Cuenta de ${user.full_name}`}
        className="flex h-11 items-center gap-2.5 rounded-full pr-1 pl-3 transition-colors hover:bg-surface-2"
      >
        <span className="hidden text-right sm:block">
          <span className="block text-footnote leading-tight font-semibold">{user.full_name}</span>
          <span className="block text-caption leading-tight text-label-2">{ROLE_LABEL[user.role]}</span>
        </span>
        <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-footnote font-semibold text-accent">
          {initials(user.full_name)}
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="glass animate-fade absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border shadow-raised"
        >
          <div className="border-b border-separator px-4 py-3">
            <p className="truncate text-subhead font-semibold">{user.full_name}</p>
            <p className="truncate text-footnote text-label-2">{user.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              logout()
            }}
            className="flex h-11 w-full items-center gap-3 px-4 text-left text-subhead text-danger hover:bg-danger-soft"
          >
            <LogOut className="size-4" aria-hidden />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
