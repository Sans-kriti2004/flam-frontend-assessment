import React from 'react';
import { Sun, Moon, History, GraduationCap } from 'lucide-react';

export default function Header({ theme, onToggleTheme, onOpenHistory, historyCount }) {
  return (
    <header className="glass-panel w-full px-6 py-4 flex justify-between items-center mb-8 border-t-0 border-x-0 rounded-t-none rounded-b-2xl">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-purple-600 to-cyan-500 p-2.5 rounded-xl flex items-center justify-center text-white" style={{ background: 'var(--accent-gradient)' }}>
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent" style={{ 
            fontSize: '1.4rem', 
            fontWeight: '700',
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            StudyForge AI
          </h1>
          <p className="text-xs text-secondary" style={{ color: 'var(--text-secondary)' }}>
            AI-Native Study Copilot
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Session History Button */}
        <button 
          onClick={onOpenHistory}
          className="btn btn-secondary relative"
          title="Saved Study Sessions"
        >
          <History size={18} />
          <span className="hidden md:inline">Sessions</span>
          {historyCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}>
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
