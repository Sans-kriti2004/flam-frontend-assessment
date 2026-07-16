import React from 'react';
import { Sun, Moon, History, GraduationCap } from 'lucide-react';

export default function Header({ theme, onToggleTheme, onOpenHistory, historyCount }) {
  return (
    <header className="glass-panel header-container">
      <div className="logo-section">
        <div className="logo-icon-wrapper">
          <GraduationCap size={24} />
        </div>
        <div className="logo-title-group">
          <h1 className="logo-title">StudyForge AI</h1>
          <p className="logo-subtitle">AI-Native Study Copilot</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Session History Button */}
        <button 
          onClick={onOpenHistory}
          className="btn btn-secondary relative"
          title="Saved Study Sessions"
        >
          <History size={18} />
          <span>Sessions</span>
          {historyCount > 0 && (
            <span className="sessions-badge" style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: 'var(--accent-primary)',
              color: 'white',
              fontSize: '10px',
              fontWeight: '700',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--glass-bg)'
            }}>
              {historyCount}
            </span>
          )}
        </button>

        {/* Light/Dark Mode Toggle */}
        <button 
          onClick={onToggleTheme}
          className="btn btn-secondary"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
