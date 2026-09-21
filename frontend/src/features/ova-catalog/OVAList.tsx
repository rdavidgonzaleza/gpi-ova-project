import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { contentApi } from '../../api/content'
import { Book, ChevronRight } from 'lucide-react'

export const OVAList: React.FC = () => {
  const { data: ovas, isLoading, error } = useQuery({
    queryKey: ['ovas'],
    queryFn: contentApi.getOvas
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-20 text-[var(--color-content-secondary)]">
        <span className="animate-pulse font-medium">Cargando catálogo...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-20">
        <p className="text-red-500 font-medium">No se pudo cargar el catálogo.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Catálogo de OVA</h1>
        <p className="mt-2 text-[var(--color-content-secondary)]">Objetos Virtuales de Aprendizaje para Gestión de Proyectos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ovas?.filter(ova => ova.status === 'publicado').map((ova) => (
          <Link 
            key={ova.id} 
            to={`/ovas/${ova.id}`}
            className="group block bg-[var(--color-background)] border border-[var(--color-border)] rounded-3xl p-6 transition-all hover:shadow-md hover:border-[var(--color-primary-200)]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-primary-600)] mb-5">
              <Book size={24} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-xl font-semibold tracking-tight mb-2 group-hover:text-[var(--color-primary-700)] transition-colors">{ova.title}</h2>
            <p className="text-sm text-[var(--color-content-secondary)] line-clamp-3 leading-relaxed mb-6">
              {ova.description}
            </p>
            
            <div className="flex items-center text-[var(--color-primary-600)] text-sm font-medium">
              <span>Abrir OVA</span>
              <ChevronRight size={16} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </Link>
        ))}
        {(!ovas || ovas.length === 0) && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-3xl">
            <p className="text-[var(--color-content-secondary)]">No hay OVAs publicados aún.</p>
          </div>
        )}
      </div>
    </div>
  )
}
