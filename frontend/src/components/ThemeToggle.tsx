import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { applyTheme, currentTheme } from '../lib/theme'

/** Switches between light (default) and dark appearance. */
export function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme)
  const dark = theme === 'dark'

  function toggle() {
    const next = dark ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label="Modo oscuro"
      title={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="grid size-9 place-items-center rounded-full text-label-2 transition-colors hover:bg-surface-2 hover:text-label"
    >
      {dark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  )
}
