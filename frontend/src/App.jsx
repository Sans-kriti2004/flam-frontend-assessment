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
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  // App States
  const [studyData, setStudyData] = useState(null); // The active study JSON
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cachedNotes, setCachedNotes] = useState(''); // Stores input text for retry capability
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
    <div className="min-h-screen flex flex-col pb-12">
      {/* Top Header */}
      <Header 
        theme={theme} 
        onToggleTheme={handleToggleTheme} 
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={sessions.length}
      />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center py-4 px-4 w-full">
        {/* API key check banner */}
        {!sessions.length && !studyData && !isLoading && (
          <div className="w-full max-w-3xl mb-4 glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
            <span className="text-secondary" style={{ color: 'var(--text-secondary)' }}>
              🔑 Make sure to configure your <strong>GEMINI_API_KEY</strong> in the root <code>.env</code> file before launching.
            </span>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="w-full max-w-2xl alert-box alert-error flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" style={{ color: 'var(--error)' }} />
              <div>
                <p className="font-semibold text-sm">Operation Failed</p>
                <p className="text-xs text-secondary mt-0.5" style={{ color: 'var(--text-secondary)' }}>{error}</p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {cachedNotes && (
                <button 
                  onClick={() => handleGenerate(cachedNotes)}
                  className="btn btn-secondary flex-1 md:flex-none text-xs py-1.5 px-3 flex items-center gap-1"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  <RefreshCw size={12} />
                  Retry
                </button>
              )}
              <button 
                onClick={handleGoBack}
                className="btn btn-secondary flex-1 md:flex-none text-xs py-1.5 px-3 flex items-center gap-1"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
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
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 px-2 md:px-4 animate-fade-in">
            
            {/* Dashboard Header Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4" style={{ borderColor: 'var(--glass-border)' }}>
              <div>
                <button 
                  onClick={handleGoBack}
                  className="btn btn-secondary text-xs py-1.5 px-3 mb-2 flex items-center gap-1"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  <ArrowLeft size={12} />
                  Back to Editor
                </button>
                <h2 className="text-2xl font-bold text-white leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Topic: {studyData.topic}
                </h2>
              </div>

              {/* View Selector Tabs */}
              <div className="tab-list w-full md:w-auto min-w-[280px]">
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
            <div className="min-h-[350px]">
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

            {/* Refinement Prompt Bar (Refinement Loop) */}
            <div className="glass-panel p-5 mt-4" style={{ borderColor: 'var(--glass-border-focus)' }}>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                <Sparkles size={14} className="text-purple-400" style={{ color: 'var(--accent-primary)' }} />
                Refine Study Materials
              </h4>
              <p className="text-xs text-secondary mb-3" style={{ color: 'var(--text-secondary)' }}>
                Instruct the AI to customize the generated quiz or flashcards (e.g. "make questions harder", "add more code examples", or "simplify details").
              </p>

              <form onSubmit={handleRefine} className="flex gap-2">
                <input 
                  type="text"
                  value={refineInput}
                  onChange={(e) => setRefineInput(e.target.value)}
                  placeholder="Ask the assistant to modify this study session..."
                  className="flex-grow bg-black/25 text-white border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-all"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderColor: 'var(--glass-border)',
                    color: 'var(--text-primary)'
                  }}
                  disabled={isRefining}
                />
                <button
                  type="submit"
                  disabled={isRefining || !refineInput.trim()}
                  className="btn btn-primary px-5 py-2.5 text-sm"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  {isRefining ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={14} />
                      <span className="hidden sm:inline">Refine</span>
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
