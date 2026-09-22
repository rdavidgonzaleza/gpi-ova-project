import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { contentApi } from '../../api/content';
import { AIActivityRunner } from '../ai-activity/AIActivityRunner';

export type SlideType = 'content' | 'quiz' | 'ai_activity';

export interface Slide {
  id: string;
  type: SlideType;
  title?: string;
  content?: string;
  imageUrl?: string;
  question?: string;
  options?: string[];
  correctOptionIndex?: number;
  prompt?: string;
}

export const OVAViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: ova, isLoading, error } = useQuery({
    queryKey: ['ova', id],
    queryFn: () => contentApi.getOva(id!)
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <span className="animate-pulse font-medium text-zinc-500">Cargando contenido...</span>
      </div>
    );
  }

  if (error || !ova) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 text-center">
        <p className="text-red-500 font-medium mb-4">No se pudo cargar el OVA.</p>
        <Link to="/" className="text-blue-600 font-medium hover:underline">Volver al catálogo</Link>
      </div>
    );
  }

  // Transform OVA blocks and activities to Slides
  const slides: Slide[] = [];
  
  if (ova.blocks) {
    const sortedBlocks = [...ova.blocks].sort((a, b) => a.position - b.position);
    for (const block of sortedBlocks) {
      if (block.type === 'texto') {
        slides.push({
          id: block.id,
          type: 'content',
          title: ova.title, // or infer title
          content: block.content,
        });
      } else if (block.type === 'imagen') {
        // If previous slide was content, maybe append image to it?
        // Let's just create a new slide for the image for simplicity.
        slides.push({
          id: block.id,
          type: 'content',
          title: ova.title,
          imageUrl: block.content,
        });
      }
    }
  }

  if (ova.activities) {
    for (const activity of ova.activities) {
      if (activity.is_ai) {
        slides.push({
          id: activity.id,
          type: 'ai_activity',
          title: activity.title,
          prompt: activity.description,
        });
      } else if (activity.type === 'quiz') {
        const config = activity.config as any;
        slides.push({
          id: activity.id,
          type: 'quiz',
          title: activity.title,
          question: config?.question || activity.description,
          options: config?.options || [],
          correctOptionIndex: config?.correctOptionIndex || 0,
        });
      } else {
        slides.push({
          id: activity.id,
          type: 'content',
          title: activity.title,
          content: activity.description,
        });
      }
    }
  }

  // Fallback if no slides
  if (slides.length === 0) {
    slides.push({
      id: 'empty',
      type: 'content',
      title: ova.title,
      content: 'Este OVA no tiene contenido aún.',
    });
  }

  const currentSlide = slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / slides.length) * 100;
  const isFirst = currentSlideIndex === 0;
  const isLast = currentSlideIndex === slides.length - 1;

  const nextSlide = () => {
    if (!isLast) setCurrentSlideIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (!isFirst) setCurrentSlideIndex(prev => prev - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-blue-200 dark:selection:bg-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm hidden sm:inline">Catálogo</span>
          </Link>
          <span className="font-semibold text-sm truncate max-w-[200px] sm:max-w-md text-center">{ova.title}</span>
          <div className="text-xs font-medium text-zinc-500 w-[60px] text-right">
            {currentSlideIndex + 1} / {slides.length}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-900">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Slide Area */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6 sm:p-8 md:p-12">
        <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SlideRenderer slide={currentSlide} />
        </div>

        {/* Navigation Controls */}
        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={isFirst}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>
          
          <button
            onClick={nextSlide}
            disabled={isLast}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-sm"
          >
            {isLast ? 'Finalizar' : 'Siguiente'}
            {!isLast && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </main>
    </div>
  );
};

// Component to render specific slide types
const SlideRenderer: React.FC<{ slide: Slide }> = ({ slide }) => {
  if (slide.type === 'content') {
    return (
      <div className="space-y-8 h-full flex flex-col">
        {slide.imageUrl && (
          <div className="w-full h-64 md:h-80 overflow-hidden rounded-3xl shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 flex-shrink-0">
            <img 
              src={slide.imageUrl} 
              alt={slide.title} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        )}
        {slide.content && (
          <div className="space-y-6 flex-1">
            {slide.title && <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{slide.title}</h2>}
            <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: slide.content }} />
          </div>
        )}
      </div>
    );
  }

  if (slide.type === 'quiz') {
    return <QuizSlide slide={slide} />;
  }

  if (slide.type === 'ai_activity') {
    return (
      <div className="space-y-6 h-full flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">{slide.title}</h2>
        <div className="flex-1 min-h-[500px]">
          <AIActivityRunner prompt={slide.prompt || ''} />
        </div>
      </div>
    );
  }

  return null;
};

// Sub-component for Multiple Choice Quizzes
const QuizSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when slide changes
  React.useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [slide.id]);

  const handleSubmit = () => {
    if (selectedOption !== null) setIsSubmitted(true);
  };

  const isCorrect = selectedOption === slide.correctOptionIndex;

  return (
    <div className="space-y-8 flex flex-col justify-center h-full max-w-2xl mx-auto w-full">
      <div className="space-y-3 text-center">
        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
          Quiz
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold leading-snug">{slide.question}</h2>
      </div>

      <div className="space-y-4">
        {slide.options?.map((option, idx) => {
          let buttonClass = "w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-200 ease-in-out ";
          
          if (!isSubmitted) {
            buttonClass += selectedOption === idx 
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-200" 
              : "border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50";
          } else {
            if (idx === slide.correctOptionIndex) {
              buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200";
            } else if (idx === selectedOption) {
              buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200";
            } else {
              buttonClass += "border-zinc-200 dark:border-zinc-800 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(idx)}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="text-base md:text-lg">{option}</span>
                {isSubmitted && idx === slide.correctOptionIndex && (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="w-full py-3.5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          Comprobar respuesta
        </button>
      ) : (
        <div className={`p-4 rounded-2xl text-center font-medium ${isCorrect ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
          {isCorrect 
            ? "¡Correcto! Muy bien hecho." 
            : "Incorrecto. Revisa el contenido anterior si tienes dudas."}
        </div>
      )}
    </div>
  );
};
