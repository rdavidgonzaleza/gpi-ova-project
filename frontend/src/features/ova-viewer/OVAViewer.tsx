import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { contentApi } from '../../api/content'
import { ArrowLeft } from 'lucide-react'

export const OVAViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  const { data: ova, isLoading, error } = useQuery({
    queryKey: ['ova', id],
    queryFn: () => contentApi.getOva(id!),
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-20 text-[var(--color-content-secondary)]">
        <span className="animate-pulse font-medium">Cargando OVA...</span>
      </div>
    )
  }

  if (error || !ova) {
    return (
      <div className="text-center p-20">
        <p className="text-red-500 font-medium">No se pudo cargar el OVA.</p>
        <Link to="/" className="text-[var(--color-primary-600)] mt-4 inline-block font-medium">Volver al catálogo</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="space-y-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-[var(--color-content-secondary)] hover:text-[var(--color-content)] transition-colors">
          <ArrowLeft size={16} className="mr-1.5" />
          Volver al catálogo
        </Link>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight leading-tight">{ova.title}</h1>
          <p className="mt-4 text-lg text-[var(--color-content-secondary)] leading-relaxed">
            {ova.description}
          </p>
        </div>
      </header>

      <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8">
        <h2 className="text-xl font-semibold tracking-tight mb-4 text-[var(--color-primary-800)] dark:text-[var(--color-primary-200)]">Resultado de Aprendizaje</h2>
        <p className="leading-relaxed">{ova.learning_outcome}</p>
      </section>

      <section className="space-y-10">
        {ova.blocks?.sort((a, b) => a.position - b.position).map((block) => (
          <div key={block.id} className="prose prose-lg max-w-none dark:prose-invert">
            {block.type === 'texto' && (
              <div dangerouslySetInnerHTML={{ __html: block.content }} />
            )}
            {block.type === 'imagen' && (
              <figure>
                <img src={block.content} alt="Contenido del OVA" className="rounded-2xl mx-auto border border-[var(--color-border)]" />
              </figure>
            )}
            {/* Additional block types can be handled here */}
          </div>
        ))}
        {(!ova.blocks || ova.blocks.length === 0) && (
          <p className="text-center text-[var(--color-content-secondary)] italic">No hay bloques de contenido en este OVA.</p>
        )}
      </section>
      
      {ova.activities && ova.activities.length > 0 && (
        <section className="border-t border-[var(--color-border)] pt-12 space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Actividades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ova.activities.map(activity => (
              <div key={activity.id} className="border border-[var(--color-border)] rounded-2xl p-6 bg-white dark:bg-[var(--color-background)]">
                <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
                <p className="text-sm text-[var(--color-content-secondary)] mb-4">{activity.description}</p>
                <button className="text-sm font-medium bg-[var(--color-surface)] text-[var(--color-content)] px-4 py-2 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-700)] hover:border-[var(--color-primary-200)] transition-all">
                  Iniciar Actividad
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
