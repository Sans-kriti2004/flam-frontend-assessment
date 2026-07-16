import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

const LOADING_STEPS = [
  "Parsing and reading notes...",
  "Extracting core concepts and definitions...",
  "Structuring learning roadmap modules...",
  "Drafting conceptual flashcards...",
  "Formulating multiple-choice quiz questions...",
  "Formatting structured study materials...",
  "Finalizing interactive dashboard view..."
];

export default function LoadingState({ onCancel }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 text-center animate-fade-in">
      <div className="glass-panel p-8 flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-cyan-500/10 animate-pulse pointer-events-none" />
        
        {/* Spinner Icon */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-purple-500 border-r-cyan-400 rounded-full animate-spin" />
          <Sparkles className="text-purple-400 animate-pulse" size={30} style={{ color: 'var(--accent-primary)' }} />
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Forging Study Materials</h3>
          <p className="text-sm text-secondary" style={{ color: 'var(--text-secondary)' }}>
            This might take a moment. The AI is crafting structured, interactive resources.
          </p>
        </div>

        {/* Step-by-Step Progress Indicators */}
        <div className="w-full mt-4 flex flex-col gap-3 text-left">
          {LOADING_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-3 transition-opacity duration-300"
                style={{ 
                  opacity: isActive ? 1 : isCompleted ? 0.6 : 0.25 
                }}
              >
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                    isCompleted 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                      : isActive 
                        ? 'bg-purple-500/20 border-purple-500 text-purple-400 animate-pulse' 
                        : 'border-gray-700 text-gray-500'
                  }`}
                  style={{
                    borderColor: isCompleted ? 'var(--success)' : isActive ? 'var(--accent-primary)' : 'var(--glass-border)',
                    color: isCompleted ? 'var(--success)' : isActive ? 'var(--accent-primary)' : 'var(--text-muted)'
                  }}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span 
                  className={`text-sm ${isActive ? 'font-medium text-white' : 'text-secondary'}`}
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Abort button */}
        <button
          onClick={onCancel}
          className="btn btn-secondary w-full mt-4 flex items-center justify-center gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
          style={{ borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)' }}
        >
          <X size={16} />
          Cancel Generation
        </button>
      </div>
    </div>
  );
}
