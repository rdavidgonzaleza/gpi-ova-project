import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, RefreshCw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AIActivityRunnerProps {
  prompt: string;
}

export function AIActivityRunner({ prompt }: AIActivityRunnerProps) {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when feedback arrives
  useEffect(() => {
    if (feedback) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [feedback, isSubmitting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    // Simulate AI thinking delay (Apple Design: Provide clear determinate/indeterminate loading state without locking UI if possible, but here it's a sequential flow)
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback("¡Excelente análisis! Has identificado correctamente el impacto en la 'Triple Restricción'. Como bien mencionas, aceptar un nuevo módulo de analítica aumenta el alcance, y mantener el presupuesto y tiempo fijos comprometería seriamente la calidad o haría el proyecto inviable. Tu estrategia de negociar entregas por fases (fasear el módulo) o solicitar recursos adicionales demuestra un excelente criterio para la gestión de proyectos informáticos.");
    }, 2500);
  };

  const handleReset = () => {
    setInput('');
    setFeedback(null);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Activity Context Header */}
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
        <h3 className="text-sm font-semibold tracking-tight text-zinc-500 dark:text-zinc-400 mb-2 uppercase">Actividad Práctica</h3>
        <p className="text-zinc-900 dark:text-zinc-100 text-lg leading-relaxed">
          {prompt}
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* User Message */}
        {input && (isSubmitting || feedback) && (
          <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="max-w-[85%] bg-blue-500 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm">
              <p className="whitespace-pre-wrap">{input}</p>
            </div>
          </div>
        )}

        {/* AI Loading State */}
        {isSubmitting && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex items-center gap-3 max-w-[85%] bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-5 py-3.5 rounded-2xl rounded-tl-sm">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Analizando tu respuesta...</span>
            </div>
          </div>
        )}

        {/* AI Feedback */}
        {feedback && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="max-w-[85%] bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-zinc-200/50 dark:border-zinc-800/50">
              <p className="leading-relaxed">{feedback}</p>
              
              {/* Reset action */}
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Intentar otra respuesta
                </button>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area - Liquid Glass effect for floating sensation */}
      {!feedback && !isSubmitting && (
        <div className="p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="w-full min-h-[60px] max-h-[200px] resize-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              rows={3}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSubmitting}
              className="absolute right-2 bottom-2 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors shadow-sm"
              aria-label="Enviar respuesta"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-center text-zinc-400 mt-3">
            La inteligencia artificial analizará tu respuesta y te dará retroalimentación inmediata.
          </p>
        </div>
      )}
    </div>
  );
}
