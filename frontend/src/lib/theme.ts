export type Theme = 'light' | 'dark'

const KEY = 'gpi.theme'

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/** Applies the appearance to <html> and remembers it (light is the default). */
export function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') root.dataset.theme = 'dark'
  else delete root.dataset.theme
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#000000' : '#f5f5f7')
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
}
