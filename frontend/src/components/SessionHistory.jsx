import React from 'react';
import { X, Trash2, Calendar, BookOpen, Trash } from 'lucide-react';

export default function SessionHistory({ 
  sessions = [], 
  onSelectSession, 
  onDeleteSession, 
  onClearAll,
  onClose, 
  isOpen 
}) {
  if (!isOpen) return null;

  return (
    <div className="history-drawer">
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Content drawer */}
      <div className="drawer-content animate-fade-in">
        
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Saved Sessions</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Reload previous study topics</p>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ border: 'none', padding: '6px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* List Body */}
        <div className="drawer-body">
          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={36} style={{ color: 'var(--text-muted)' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No saved sessions yet.</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '240px', lineHeight: '1.4' }}>
                Study modules are automatically saved to your browser local storage when forged.
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const date = new Date(session.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session);
                    onClose();
                  }}
                  className="glass-panel session-card"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, pr: '10px' }}>
                    <h4 style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {session.data.topic}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      <Calendar size={10} />
                      <span>{date}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="btn btn-secondary"
                    style={{ border: 'none', padding: '6px', borderRadius: '8px', color: 'var(--text-muted)' }}
                    title="Delete session"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="drawer-footer">
            <button
              onClick={onClearAll}
              className="btn btn-secondary"
              style={{ 
                width: '100%', 
                borderColor: 'rgba(244, 63, 94, 0.2)', 
                color: 'var(--error)',
                fontSize: '0.8rem'
              }}
            >
              <Trash size={14} />
              Clear All Sessions
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
