/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SOURCE_IDENTITY?: 'remote' | 'local'
  readonly VITE_SOURCE_CONTENT?: 'remote' | 'local'
  readonly VITE_SOURCE_ACTIVITY?: 'remote' | 'local'
  readonly VITE_SOURCE_EVALUATION?: 'remote' | 'local'
  readonly VITE_SOURCE_TRACKING?: 'remote' | 'local'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
