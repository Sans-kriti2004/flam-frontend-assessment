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
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No flashcards available.</p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const isCurrentMastered = masteredIds.has(currentCard.id);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
    }, 150);
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
    <div className="flashcards-container animate-fade-in">
      {/* Progress & Mastery Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
            {masteredIds.size} / {flashcards.length} Learned ({percentMastered}%)
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-bar-bg" style={{ marginBottom: 0 }}>
          <div 
            className="progress-bar-fill"
            style={{ width: `${percentMastered}%` }}
          />
        </div>
      </div>

      {/* 3D Flashcard */}
      <div className="flashcard-scene" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`flashcard-card ${isFlipped ? 'is-flipped' : ''}`}>
          
          {/* Front Side */}
          <div className="flashcard-side flashcard-front">
            <span className="flashcard-badge Front" style={{ color: 'var(--accent-primary)' }}>Concept / Term</span>
            <h3 className="flashcard-text">{currentCard.front}</h3>
            
            {isCurrentMastered && (
              <div className="flashcard-mastered-tag">
                <CheckCircle2 size={12} style={{ marginRight: '4px', display: 'inline' }} />
                Learned
              </div>
            )}
            
            <div className="flashcard-hint">
              <RotateCw size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Click to flip and read details
            </div>
          </div>

          {/* Back Side */}
          <div className="flashcard-side flashcard-back">
            <span className="flashcard-badge Back" style={{ color: 'var(--accent-secondary)' }}>Explanation / Definition</span>
            <p className="flashcard-text" style={{ fontSize: '1.05rem', fontWeight: 500 }}>
              {currentCard.back}
            </p>
            
            <div className="flashcard-hint">
              <RotateCw size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Click to see term
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flashcard-controls">
        <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="btn btn-secondary" style={{ flex: 1 }}>
          <ArrowLeft size={16} />
          <span>Prev</span>
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); toggleMastery(); }} 
          className={`btn ${isCurrentMastered ? 'btn-primary' : 'btn-secondary'}`}
          style={{ 
            flex: 1.2, 
            borderColor: isCurrentMastered ? 'transparent' : 'var(--glass-border)',
            background: isCurrentMastered ? 'var(--success)' : 'rgba(255,255,255,0.4)',
            color: isCurrentMastered ? 'white' : 'var(--text-primary)'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{isCurrentMastered ? 'Learned!' : 'Mark Learned'}</span>
        </button>

        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="btn btn-secondary" style={{ flex: 1 }}>
          <span>Next</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Shortcuts Footer */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '32px', 
        paddingTop: '16px', 
        borderTop: '1px solid var(--glass-border)' 
      }}>
        <button 
          onClick={resetMastery}
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px' }}
        >
          <RefreshCw size={12} />
          Reset Progress
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px' }}
          >
            <Keyboard size={12} />
            Hotkeys
          </button>
          
          {showKeyboardHelp && (
            <div 
              className="glass-panel"
              style={{
                position: 'absolute',
                right: 0,
                bottom: '36px',
                width: '200px',
                padding: '12px',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.75rem',
                textAlign: 'left'
              }}
            >
              <h5 style={{ fontWeight: 700 }}>Keyboard Hotkeys</h5>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Flip Card</span>
                <kbd style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.2)' }}>Space</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Next</span>
                <kbd style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.2)' }}>➜ / D</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Prev</span>
                <kbd style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.2)' }}>⬅ / A</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Mark Learned</span>
                <kbd style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.2)' }}>M</kbd>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
