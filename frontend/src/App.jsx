import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WelcomeState from './components/WelcomeState';
import LoadingState from './components/LoadingState';
import FlashcardViewer from './components/FlashcardViewer';
import QuizViewer from './components/QuizViewer';
import RoadmapViewer from './components/RoadmapViewer';
import SessionHistory from './components/SessionHistory';
import { api } from './utils/api';
import { AlertCircle, ArrowLeft, RefreshCw, Send, Sparkles } from 'lucide-react';

export default function App() {
  // Theme state - defaults to Light theme for the cute pastel look
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  // App States
  const [studyData, setStudyData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cachedNotes, setCachedNotes] = useState(''); 
  const [activeTab, setActiveTab] = useState('roadmap'); // Tabs: 'roadmap', 'flashcards', 'quiz'
  
  // Session History State
  const [sessions, setSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('study_sessions')) || [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Refinement loop state
  const [refineInput, setRefineInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Synchronize sessions list to localStorage
  useEffect(() => {
    localStorage.setItem('study_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Toggle Theme handler
  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Trigger main study material generation
  const handleGenerate = async (content) => {
    setCachedNotes(content);
    setIsLoading(true);
    setError(null);
    setStudyData(null);
    
    try {
      const data = await api.generate(content);
      
      // Safety check: Validate returned structure
      if (!data.topic || !data.flashcards || !data.quiz || !data.roadmap) {
        throw new Error("AI returned data in an invalid format. Please try again.");
      }

      setStudyData(data);
      setActiveTab('roadmap'); // Default view
      
      // Save session
      const newSession = {
        id: `sess-${Date.now()}`,
        timestamp: new Date().toISOString(),
        data: data,
        originalNotes: content
      };
      setSessions(prev => [newSession, ...prev]);

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Generation aborted.');
      } else {
        setError(err.message || 'Something went wrong while generating study materials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Refinement handler
  const handleRefine = async (e) => {
    e.preventDefault();
    if (!refineInput.trim() || !studyData) return;

    const instructions = refineInput;
    setRefineInput('');
    setIsRefining(true);
    setError(null);

    try {
      const refinedData = await api.refine(studyData, instructions);

      if (!refinedData.topic || !refinedData.flashcards || !refinedData.quiz || !refinedData.roadmap) {
        throw new Error("Refinement returned an invalid response structure.");
      }

      setStudyData(refinedData);

      // Update current session's study material
      setSessions(prev => {
        return prev.map(sess => {
          if (sess.data.topic === studyData.topic) {
            return {
              ...sess,
              timestamp: new Date().toISOString(),
              data: refinedData
            };
          }
          return sess;
        });
      });

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Refinement aborted.');
      } else {
        setError(`Refinement failed: ${err.message}`);
      }
    } finally {
      setIsRefining(false);
    }
  };

  // Session selection handler
  const handleSelectSession = (session) => {
    setStudyData(session.data);
    setCachedNotes(session.originalNotes || '');
    setError(null);
    setActiveTab('roadmap');
  };

  // Session deletion handler
  const handleDeleteSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // Clear all sessions
  const handleClearAllSessions = () => {
    if (window.confirm("Are you sure you want to clear all saved study sessions?")) {
      setSessions([]);
    }
  };

  // Cancel pending API requests
  const handleCancelRequest = () => {
    api.cancelAll();
    setIsLoading(false);
    setIsRefining(false);
    setError('Generation was cancelled by the user.');
  };

  // Reset to initial state
  const handleGoBack = () => {
    setStudyData(null);
    setError(null);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header 
        theme={theme} 
        onToggleTheme={handleToggleTheme} 
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={sessions.length}
      />

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* API key check banner */}
        {!sessions.length && !studyData && !isLoading && !error && (
          <div className="glass-panel alert-box alert-success" style={{
            maxWidth: '720px',
            borderLeft: '4px solid var(--accent-primary)',
            background: 'var(--glass-bg)',
            color: 'var(--text-secondary)',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '0.85rem' }}>
              🔑 Make sure to configure your <strong>GEMINI_API_KEY</strong> or <strong>OPENROUTER_API_KEY</strong> in the root <code>.env</code> file before launching.
            </span>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="alert-box alert-error animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={20} style={{ color: 'var(--error)', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Operation Failed</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>{error}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              {cachedNotes && (
                <button 
                  onClick={() => handleGenerate(cachedNotes)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px' }}
                >
                  <RefreshCw size={12} />
                  Retry
                </button>
              )}
              <button 
                onClick={handleGoBack}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px' }}
              >
                <ArrowLeft size={12} />
                Back
              </button>
            </div>
          </div>
        )}

        {/* 1. Loading State */}
        {isLoading && (
          <LoadingState onCancel={handleCancelRequest} />
        )}

        {/* 2. Welcome/Input State */}
        {!isLoading && !studyData && !error && (
          <WelcomeState onSubmit={handleGenerate} isLoading={isLoading} />
        )}

        {/* 3. Study Materials Dashboard */}
        {!isLoading && studyData && (
          <div className="dashboard-container animate-fade-in">
            
            {/* Dashboard Header Bar */}
            <div className="dashboard-header">
              <div>
                <button 
                  onClick={handleGoBack}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px', marginBottom: '8px' }}
                >
                  <ArrowLeft size={12} />
                  Back to Editor
                </button>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Topic: {studyData.topic}
                </h2>
              </div>

              {/* View Selector Tabs */}
              <div className="tab-list">
                <button 
                  onClick={() => setActiveTab('roadmap')}
                  className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                >
                  Roadmap Path
                </button>
                <button 
                  onClick={() => setActiveTab('flashcards')}
                  className={`tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
                >
                  Flashcards
                </button>
                <button 
                  onClick={() => setActiveTab('quiz')}
                  className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                >
                  Interactive Quiz
                </button>
              </div>
            </div>

            {/* Dashboard Content */}
            <div style={{ minHeight: '300px', width: '100%' }}>
              {activeTab === 'roadmap' && (
                <RoadmapViewer roadmap={studyData.roadmap} summary={studyData.summary} />
              )}
              {activeTab === 'flashcards' && (
                <FlashcardViewer flashcards={studyData.flashcards} />
              )}
              {activeTab === 'quiz' && (
                <QuizViewer quiz={studyData.quiz} />
              )}
            </div>

            {/* Refinement Prompt Bar */}
            <div className="glass-panel refine-card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
                Refine Study Materials
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Customize the generated quiz or flashcards (e.g. "make quiz harder", "add more code examples", or "simplify card concepts").
              </p>

              <form onSubmit={handleRefine} className="refine-form">
                <input 
                  type="text"
                  value={refineInput}
                  onChange={(e) => setRefineInput(e.target.value)}
                  placeholder="Ask the assistant to modify this study session..."
                  className="refine-input"
                  disabled={isRefining}
                />
                <button
                  type="submit"
                  disabled={isRefining || !refineInput.trim()}
                  className="btn btn-primary"
                  style={{ padding: '8px 16px' }}
                >
                  {isRefining ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Refine</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        )}
      </main>

      {/* History Drawer Slider Overlay */}
      <SessionHistory 
        sessions={sessions}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAllSessions}
        onClose={() => setIsHistoryOpen(false)}
        isOpen={isHistoryOpen}
      />
    </div>
  );
}
