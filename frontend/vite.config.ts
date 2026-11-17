import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// While the KrakenD gateway is not deployed, the dev/preview server plays its
// role: it routes each /api prefix to the owning microservice (spec section 6).
function gatewayProxy(env: Record<string, string>) {
  const routes: Record<string, string> = {
    '/api/auth': env.SERVICE_IDENTITY_URL || 'http://localhost:8081',
    '/api/ovas': env.SERVICE_CONTENT_URL || 'http://localhost:8082',
    '/api/activities': env.SERVICE_ACTIVITY_URL || 'http://localhost:8083',
    '/api/ai-activities': env.SERVICE_AI_URL || 'http://localhost:8084',
    '/api/ai-interactions': env.SERVICE_AI_URL || 'http://localhost:8084',
    '/api/evaluations': env.SERVICE_EVALUATION_URL || 'http://localhost:8085',
    '/api/progress': env.SERVICE_TRACKING_URL || 'http://localhost:8086',
    '/api/reports': env.SERVICE_TRACKING_URL || 'http://localhost:8086',
  }
  return Object.fromEntries(
    Object.entries(routes).map(([prefix, target]) => [prefix, { target, changeOrigin: true }]),
  )
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = env.VITE_API_BASE_URL ? undefined : gatewayProxy(env)
  return {
    plugins: [react(), tailwindcss()],
    server: { port: 5173, proxy },
    preview: { port: 4173, proxy },
  }
})
