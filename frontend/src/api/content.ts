import { fetchClient } from './client'
import type { OVA } from '../types/domain'

export const contentApi = {
  getOvas: () => 
    fetchClient('/api/ovas') as Promise<OVA[]>,
    
  getOva: (id: string) => 
    fetchClient(`/api/ovas/${id}`) as Promise<OVA>,
    
  createOva: (data: Partial<OVA>) => 
    fetchClient('/api/ovas', {
      method: 'POST',
      body: JSON.stringify(data)
    }) as Promise<OVA>
}
