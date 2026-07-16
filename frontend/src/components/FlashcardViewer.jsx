import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, CheckCircle2, RefreshCw, Keyboard } from 'lucide-react';

export default function FlashcardViewer({ flashcards = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState(new Set());
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Keyboard navigation setup
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ': // Spacebar
          e.preventDefault();
          setIsFlipped(prev => !prev);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handlePrev();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMastery();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, flashcards.length]);

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary" style={{ color: 'var(--text-secondary)' }}>No flashcards available.</p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const isCurrentMastered = masteredIds.has(currentCard.id);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
    }, 150); // Small delay to let card un-flip first if needed
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
    }, 150);
  };

  const toggleMastery = () => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id);
      } else {
        next.add(currentCard.id);
      }
      return next;
    });
  };

  const resetMastery = () => {
    setMasteredIds(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const percentMastered = Math.round((masteredIds.size / flashcards.length) * 100);

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      {/* Progress & Mastery Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-secondary" style={{ color: 'var(--text-secondary)' }}>
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span className="font-medium text-purple-400" style={{ color: 'var(--accent-primary)' }}>
            {masteredIds.size} / {flashcards.length} Mastered ({percentMastered}%)
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-black/25 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
            style={{ 
              width: `${percentMastered}%`,
              background: 'var(--accent-gradient)'
            }}
          />
        </div>
      </div>

      {/* 3D Flashcard */}
      <div className="flashcard-scene relative" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`flashcard-card ${isFlipped ? 'is-flipped' : ''}`}>
          
          {/* Front Side */}
          <div className="flashcard-side flashcard-front">
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-400 mb-4" style={{ color: 'var(--accent-primary)' }}>
              Concept / Term
            </span>
            <h3 className="text-xl md:text-2xl font-bold leading-relaxed max-w-md">
              {currentCard.front}
            </h3>
            
            {/* Mastered Badge */}
            {isCurrentMastered && (
              <div 
                className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                style={{ color: 'var(--success)', background: 'var(--success-bg)', borderColor: 'rgba(16, 185, 129, 0.2)' }}
              >
                <CheckCircle2 size={12} />
                Mastered
              </div>
            )}
            
            <div className="absolute bottom-4 text-xs text-muted flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <RotateCw size={12} /> Click to reveal definition
            </div>
          </div>

          {/* Back Side */}
          <div className="flashcard-side flashcard-back">
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 mb-4" style={{ color: 'var(--accent-secondary)' }}>
              Explanation / Definition
            </span>
            <p className="text-base md:text-lg leading-relaxed max-w-md">
              {currentCard.back}
            </p>
            
            <div className="absolute bottom-4 text-xs text-muted flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <RotateCw size={12} /> Click to show term
            </div>
          </div>

        </div>
      </div>

      {/* Navigation and Mastery Controls */}
      <div className="flex justify-between items-center mt-6 gap-4">
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="btn btn-secondary flex-1"
        >
          <ArrowLeft size={16} />
          <span>Prev</span>
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); toggleMastery(); }}
          className={`btn flex-1 ${
            isCurrentMastered 
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30' 
              : 'btn-secondary hover:border-emerald-500/40 hover:text-emerald-400'
          }`}
          style={{
            borderColor: isCurrentMastered ? 'var(--success)' : 'var(--glass-border)',
            color: isCurrentMastered ? 'var(--success)' : 'var(--text-primary)',
            background: isCurrentMastered ? 'var(--success-bg)' : 'transparent'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{isCurrentMastered ? 'Mastered' : 'Mark Learned'}</span>
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="btn btn-secondary flex-1"
        >
          <span>Next</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Reset & Keyboard Info Controls */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <button 
          onClick={resetMastery}
          className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <RefreshCw size={12} />
          Reset Mastery
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
            className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <Keyboard size={12} />
            Keyboard Shortcuts
          </button>
          
          {showKeyboardHelp && (
            <div 
              className="absolute right-0 bottom-10 w-64 p-4 glass-panel text-left text-xs flex flex-col gap-2 z-10"
              style={{ fontSize: '0.75rem' }}
            >
              <h4 className="font-semibold text-white mb-1" style={{ color: 'var(--text-primary)' }}>Keyboard Shortcuts</h4>
              <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span>Flip Card</span>
                <kbd className="bg-black/40 px-1.5 py-0.5 rounded border border-gray-700">Space</kbd>
              </div>
              <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span>Next Card</span>
                <kbd className="bg-black/40 px-1.5 py-0.5 rounded border border-gray-700">➜ or D</kbd>
              </div>
              <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span>Previous Card</span>
                <kbd className="bg-black/40 px-1.5 py-0.5 rounded border border-gray-700">⬅ or A</kbd>
              </div>
              <div className="flex justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span>Toggle Mastery</span>
                <kbd className="bg-black/40 px-1.5 py-0.5 rounded border border-gray-700">M</kbd>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
