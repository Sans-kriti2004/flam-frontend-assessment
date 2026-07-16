import React, { useState } from 'react';
import { Check, Compass, BookOpen } from 'lucide-react';

export default function RoadmapViewer({ roadmap = [], summary = '' }) {
  const [completedSteps, setCompletedSteps] = useState(new Set());

  if (roadmap.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary" style={{ color: 'var(--text-secondary)' }}>No roadmap steps available.</p>
      </div>
    );
  }

  const toggleStep = (id) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const progressPercent = Math.round((completedSteps.size / roadmap.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in">
      
      {/* Topic Summary Block */}
      {summary && (
        <div className="glass-panel p-6 border-l-4 border-purple-500" style={{ borderLeftColor: 'var(--accent-primary)' }}>
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white" style={{ color: 'var(--text-primary)' }}>
            <BookOpen size={18} className="text-purple-400" style={{ color: 'var(--accent-primary)' }} />
            Core Concept Summary
          </h3>
          <p className="text-sm text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {summary}
          </p>
        </div>
      )}

      {/* Progress Section */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold flex items-center gap-2">
            <Compass size={18} className="text-cyan-400" style={{ color: 'var(--accent-secondary)' }} />
            Learning Path Checklist
          </h3>
          <span className="text-sm font-semibold text-cyan-400" style={{ color: 'var(--accent-secondary)' }}>
            {progressPercent}% Completed ({completedSteps.size}/{roadmap.length})
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden mb-6" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
            style={{ 
              width: `${progressPercent}%`,
              background: 'var(--accent-gradient)'
            }}
          />
        </div>

        {/* Roadmap Steps Checklist */}
        <div className="flex flex-col gap-4">
          {roadmap.map((step, index) => {
            const isDone = completedSteps.has(step.id);
            return (
              <div 
                key={step.id} 
                className="flex items-start gap-4 p-4 rounded-xl border transition-all"
                style={{ 
                  background: isDone ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: isDone ? 'var(--glass-border-focus)' : 'var(--glass-border)',
                  opacity: isDone ? 0.75 : 1
                }}
              >
                {/* Circle Checkbox */}
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    isDone 
                      ? 'bg-purple-600 border-purple-500 text-white' 
                      : 'border-gray-600 hover:border-purple-400 text-transparent'
                  }`}
                  style={{
                    backgroundColor: isDone ? 'var(--accent-primary)' : 'transparent',
                    borderColor: isDone ? 'var(--accent-primary)' : 'var(--text-muted)'
                  }}
                >
                  <Check size={14} className={isDone ? 'scale-100' : 'scale-0'} />
                </button>

                {/* Step Description */}
                <div>
                  <h4 
                    className={`font-semibold text-base mb-1 ${isDone ? 'line-through text-muted' : 'text-white'}`}
                    style={{ color: isDone ? 'var(--text-muted)' : 'var(--text-primary)' }}
                  >
                    Phase {index + 1}: {step.title}
                  </h4>
                  <p 
                    className={`text-sm ${isDone ? 'text-muted' : 'text-secondary'} leading-relaxed`}
                    style={{ color: isDone ? 'var(--text-muted)' : 'var(--text-secondary)' }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
