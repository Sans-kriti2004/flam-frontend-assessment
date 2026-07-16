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
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-container animate-fade-in">
      <div className="glass-panel loader-card">
        {/* Spinner Icon */}
        <div className="spinner-wrapper">
          <div className="spinner-outer" />
          <div className="spinner-inner" />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)'
          }}>
            <Sparkles size={26} className="animate-pulse" />
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>Forging Study Materials</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            This might take a moment. The AI is crafting structured resources.
          </p>
        </div>

        {/* Step-by-Step Progress Indicators */}
        <div className="progress-list">
          {LOADING_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            
            let dotStyle = {
              borderColor: 'var(--glass-border)',
              color: 'var(--text-muted)'
            };
            if (isCompleted) {
              dotStyle = {
                borderColor: 'var(--success)',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)'
              };
            } else if (isActive) {
              dotStyle = {
                borderColor: 'var(--accent-primary)',
                backgroundColor: 'rgba(99,102,241,0.1)',
                color: 'var(--accent-primary)',
                boxShadow: '0 0 8px rgba(99,102,241,0.2)'
              };
            }

            return (
              <div 
                key={idx} 
                className="progress-item"
                style={{ 
                  opacity: isActive ? 1 : isCompleted ? 0.75 : 0.35,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <div className="progress-dot" style={dotStyle}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span style={{ 
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="btn btn-secondary"
          style={{ 
            width: '100%', 
            borderColor: 'rgba(244, 63, 94, 0.2)', 
            color: 'var(--error)' 
          }}
        >
          <X size={16} />
          Cancel Generation
        </button>
      </div>
    </div>
  );
}
