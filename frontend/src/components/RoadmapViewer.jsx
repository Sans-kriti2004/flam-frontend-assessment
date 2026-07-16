import React, { useState } from 'react';
import { Check, Compass, BookOpen, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export default function RoadmapViewer({ roadmap = [], summary = '' }) {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [expandedStepId, setExpandedStepId] = useState(null);

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

  const toggleExpand = (id) => {
    setExpandedStepId((prev) => (prev === id ? null : id));
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
            Learning Checklist & Study Guide
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

        {/* Informational Help Alert */}
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px', fontStyle: 'italic' }}>
          💡 Click on any phase below to expand AI-generated detailed study notes and tutorials!
        </p>

        {/* Steps */}
        <div className="roadmap-steps">
          {roadmap.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isExpanded = expandedStepId === step.id;

            return (
              <div 
                key={step.id} 
                className="flex flex-col"
                style={{ 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--glass-border)',
                  background: isCompleted ? 'rgba(16, 185, 129, 0.02)' : 'rgba(255, 255, 255, 0.15)',
                  borderColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'var(--glass-border)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {/* Step Item Row */}
                <div 
                  className={`roadmap-step-item ${isCompleted ? 'completed' : ''}`}
                  onClick={() => toggleExpand(step.id)}
                  style={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    border: 'none',
                    borderRadius: 0,
                    background: 'transparent',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1, minWidth: 0 }}>
                    {/* Checkbox button */}
                    <div 
                      className="step-checkbox"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent toggling expand when checking box
                        toggleStep(step.id);
                      }}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: '2px solid var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: isCompleted ? 'var(--success)' : 'transparent',
                        borderColor: isCompleted ? 'var(--success)' : 'var(--text-muted)',
                        color: 'white',
                        flexShrink: 0
                      }}
                    >
                      {isCompleted && <Check size={12} />}
                    </div>

                    <div className="step-info" style={{ flex: 1, minWidth: 0 }}>
                      <h4 className="step-title" style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        marginBottom: '4px',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)'
                      }}>
                        Phase {index + 1}: {step.title}
                      </h4>
                      <p className="step-desc" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Expand Chevron */}
                  <div style={{ color: 'var(--text-muted)', paddingLeft: '12px' }}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expanded Study Notes Section */}
                {isExpanded && (
                  <div 
                    className="animate-fade-in"
                    style={{
                      borderTop: '1px solid var(--glass-border)',
                      background: 'rgba(255, 255, 255, 0.4)',
                      padding: '20px',
                      fontSize: '0.9rem',
                      lineHeight: '1.6'
                    }}
                  >
                    <h5 style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      color: 'var(--accent-primary)',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      <FileText size={14} />
                      Study Notes & Guide
                    </h5>
                    
                    {/* Render paragraphs cleanly */}
                    <div style={{ color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {step.content.split('\n\n').map((para, pIdx) => (
                        <p key={pIdx} style={{ margin: 0 }}>{para}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
