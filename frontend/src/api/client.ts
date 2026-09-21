const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function fetchClient(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  
  const config: RequestInit = {
    ...options,
    headers,
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, config)
  
  if (!response.ok) {
    let errorMessage = 'An error occurred'
    try {
      const errorData = await response.json()
      errorMessage = errorData.error?.message || errorMessage
    } catch {
      // Failed to parse JSON error
    }
    throw new Error(errorMessage)
  }
  
  // Return null for 204 No Content
  if (response.status === 204) return null
  
  return response.json()
}
