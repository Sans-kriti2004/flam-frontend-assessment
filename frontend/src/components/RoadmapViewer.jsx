import React, { useState } from 'react';
import { Check, Compass, BookOpen } from 'lucide-react';

export default function RoadmapViewer({ roadmap = [], summary = '' }) {
  const [completedSteps, setCompletedSteps] = useState(new Set());

  if (roadmap.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No roadmap steps available.</p>
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
    <div className="roadmap-container animate-fade-in">
      
      {/* Summary Block */}
      {summary && (
        <div className="glass-panel summary-card">
          <h3 className="summary-title" style={{ color: 'var(--text-primary)' }}>
            <BookOpen size={18} style={{ color: 'var(--accent-primary)' }} />
            Core Topic Summary
          </h3>
          <p className="summary-text">{summary}</p>
        </div>
      )}

      {/* Checklist Block */}
      <div className="glass-panel checklist-card">
        <div className="checklist-header">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} style={{ color: 'var(--accent-secondary)' }} />
            Learning Checklist
          </h3>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>
            {progressPercent}% Complete ({completedSteps.size}/{roadmap.length})
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps */}
        <div className="roadmap-steps">
          {roadmap.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            return (
              <div 
                key={step.id} 
                className={`roadmap-step-item ${isCompleted ? 'completed' : ''}`}
                onClick={() => toggleStep(step.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="step-checkbox">
                  {isCompleted && <Check size={12} />}
                </div>

                <div className="step-info">
                  <h4 className="step-title">
                    Phase {index + 1}: {step.title}
                  </h4>
                  <p className="step-desc">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
