import React, { useState } from 'react';
import { Award, AlertCircle, CheckCircle, RefreshCcw, ArrowRight, Play } from 'lucide-react';

export default function QuizViewer({ quiz = [] }) {
  const [questions, setQuestions] = useState(quiz);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongQuestionIds, setWrongQuestionIds] = useState(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReTesting, setIsReTesting] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="glass-panel quiz-card text-center" style={{ maxWidth: '440px', margin: '0 auto' }}>
        <AlertCircle size={40} className="text-amber-500 mx-auto" style={{ color: 'var(--warning)', margin: '0 auto' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '12px' }}>No quiz questions generated</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Try generating again with more detailed study notes.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    
    const correct = selectedOption === currentQuestion.correctAnswer;
    if (correct) {
      setScore(prev => prev + 1);
    } else {
      setWrongQuestionIds(prev => {
        const next = new Set(prev);
        next.add(currentQuestion.id);
        return next;
      });
    }

    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestartFull = () => {
    setQuestions(quiz);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setWrongQuestionIds(new Set());
    setIsCompleted(false);
    setIsReTesting(false);
  };

  const handleReTestWrongs = () => {
    const wrongQuestions = quiz.filter(q => wrongQuestionIds.has(q.id));
    setQuestions(wrongQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setWrongQuestionIds(new Set());
    setIsCompleted(false);
    setIsReTesting(true);
  };

  const percentScore = Math.round((score / questions.length) * 100);

  // Render Completion Screen
  if (isCompleted) {
    return (
      <div className="glass-panel quiz-card text-center" style={{ maxWidth: '440px', margin: '0 auto' }}>
        <Award size={48} style={{ color: 'var(--accent-primary)', margin: '0 auto 12px auto' }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
          {isReTesting ? 'Re-Test Completed!' : 'Quiz Finished!'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Here are your results for this session:
        </p>

        <div style={{ 
          background: 'rgba(0,0,0,0.03)', 
          border: '1px solid var(--glass-border)', 
          borderRadius: '12px', 
          padding: '20px', 
          marginBottom: '20px' 
        }}>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {percentScore}%
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            You scored {score} out of {questions.length} questions correctly.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!isReTesting && wrongQuestionIds.size > 0 && (
            <button onClick={handleReTestWrongs} className="btn btn-primary" style={{ width: '100%' }}>
              <RefreshCcw size={16} />
              Re-Test Wrong Answers ({wrongQuestionIds.size})
            </button>
          )}

          <button onClick={handleRestartFull} className="btn btn-secondary" style={{ width: '100%' }}>
            <Play size={16} />
            Retake Entire Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '12px' }}>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
          Question {currentIndex + 1} of {questions.length} {isReTesting && '(Mistakes Drill)'}
        </span>
        <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
          Score: {score} / {currentIndex + (isAnswered ? 1 : 0)}
        </span>
      </div>

      <div className="glass-panel quiz-card">
        {/* Question Text */}
        <h3 className="quiz-question">{currentQuestion.question}</h3>

        {/* Options List */}
        <div className="option-list">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentQuestion.correctAnswer;
            
            let itemStyle = {};
            let letterStyle = {};

            if (isAnswered) {
              if (isCorrectOption) {
                // Correct answer in green
                itemStyle = {
                  background: 'var(--success-bg)',
                  borderColor: 'var(--success)',
                  color: 'var(--text-primary)',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.05)'
                };
                letterStyle = {
                  background: 'var(--success)',
                  borderColor: 'var(--success)',
                  color: 'white'
                };
              } else if (isSelected) {
                // Wrong choice in red
                itemStyle = {
                  background: 'var(--error-bg)',
                  borderColor: 'var(--error)',
                  color: 'var(--text-primary)'
                };
                letterStyle = {
                  background: 'var(--error)',
                  borderColor: 'var(--error)',
                  color: 'white'
                };
              }
            } else if (isSelected) {
              // Pre-submit selection
              itemStyle = {
                borderColor: 'var(--accent-primary)',
                background: 'rgba(99, 102, 241, 0.05)',
                boxShadow: '0 0 8px rgba(99,102,241,0.1)'
              };
              letterStyle = {
                background: 'var(--accent-gradient)',
                borderColor: 'transparent',
                color: 'white'
              };
            }

            return (
              <div
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`option-item ${isAnswered ? 'answered' : ''}`}
                style={itemStyle}
              >
                <div className="option-left">
                  <span className="option-letter" style={letterStyle}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="option-text">{option}</span>
                </div>
                
                {isAnswered && isCorrectOption && (
                  <CheckCircle size={18} className="text-emerald-400" style={{ color: 'var(--success)' }} />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <AlertCircle size={18} className="text-red-400" style={{ color: 'var(--error)' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Submit / Next Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          {!isAnswered ? (
            <button
              onClick={handleAnswerSubmit}
              disabled={selectedOption === null}
              className="btn btn-primary"
              style={{ padding: '10px 24px' }}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ padding: '10px 24px' }}
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Explanation Block */}
        {isAnswered && (
          <div className="explanation-card animate-fade-in">
            <h4 style={{ 
              fontWeight: 700, 
              color: 'var(--accent-primary)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginBottom: '4px' 
            }}>
              <AlertCircle size={14} />
              Pedagogical Explanation
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
