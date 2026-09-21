import { fetchClient } from './client'
import { AuthResponse, User } from '../types/domain'

export const authApi = {
  login: (credentials: Record<string, string>) => 
    fetchClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }) as Promise<AuthResponse>,
    
  register: (data: Record<string, string>) => 
    fetchClient('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }) as Promise<User>,
    
  me: () => 
    fetchClient('/api/auth/me') as Promise<User>
}
