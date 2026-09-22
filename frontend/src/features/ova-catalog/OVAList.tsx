import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Book, ChevronRight } from 'lucide-react';
import { contentApi } from '../../api/content';

export const OVAList: React.FC = () => {
  const { data: ovas, isLoading, error } = useQuery({
    queryKey: ['ovas'],
    queryFn: contentApi.getOvas
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-20 text-zinc-500">
        <span className="animate-pulse font-medium">Cargando catálogo...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-20">
        <p className="text-red-500 font-medium">No se pudo cargar el catálogo.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Catálogo de OVA
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Objetos Virtuales de Aprendizaje interactivos.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ovas?.filter(ova => ova.status === 'publicado').map((ova) => (
            <Link 
              key={ova.id}
              to={`/ovas/${ova.id}`}
              className="group block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 transition-all hover:shadow-lg hover:border-blue-500/50"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
                <Book className="w-6 h-6" strokeWidth={1.5} />
              </div>
              
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {ova.title}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-6">
                {ova.description}
              </p>
              
              <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                <span>Abrir OVA</span>
                <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </Link>
          ))}
          {(!ovas || ovas.filter(ova => ova.status === 'publicado').length === 0) && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <p className="text-zinc-500 dark:text-zinc-400">No hay OVAs publicados aún.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
