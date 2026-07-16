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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
      
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div 
        className="w-full max-w-md h-full bg-slate-900 border-l flex flex-col z-10 shadow-2xl animate-fade-in"
        style={{ 
          background: 'var(--bg-gradient)', 
          borderColor: 'var(--glass-border)',
          fontFamily: 'var(--font-secondary)'
        }}
      >
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--glass-border)' }}>
          <div>
            <h3 className="text-lg font-bold text-white" style={{ color: 'var(--text-primary)' }}>Saved Sessions</h3>
            <p className="text-xs text-secondary" style={{ color: 'var(--text-secondary)' }}>Reload previous study topics</p>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary p-2 border-0 rounded-full hover:bg-white/10 text-secondary hover:text-white"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {sessions.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center gap-3">
              <BookOpen size={40} className="text-muted" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm text-secondary" style={{ color: 'var(--text-secondary)' }}>No saved sessions yet.</p>
              <p className="text-xs text-muted max-w-xs" style={{ color: 'var(--text-muted)' }}>
                Your study materials are automatically saved to your local storage once forged.
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const formattedDate = new Date(session.timestamp).toLocaleDateString(undefined, {
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
                  className="glass-panel p-4 flex justify-between items-center cursor-pointer hover:border-purple-500/40 hover:bg-white/5 transition-all group"
                >
                  <div className="flex flex-col gap-1 pr-4 min-w-0">
                    <h4 className="font-semibold text-sm text-white truncate" style={{ color: 'var(--text-primary)' }}>
                      {session.data.topic}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-muted" style={{ color: 'var(--text-muted)' }}>
                      <Calendar size={10} />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent loading session when deleting
                      onDeleteSession(session.id);
                    }}
                    className="btn btn-secondary p-2 border-0 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 group-hover:opacity-100 transition-opacity"
                    title="Delete session"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="p-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
            <button
              onClick={onClearAll}
              className="btn btn-secondary w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 py-2.5 flex items-center justify-center gap-2"
              style={{ borderColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--error)' }}
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
