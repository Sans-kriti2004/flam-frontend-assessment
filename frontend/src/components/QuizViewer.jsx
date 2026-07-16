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
      <div className="glass-panel p-8 text-center max-w-lg mx-auto">
        <AlertCircle size={40} className="text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">No quiz questions generated</h3>
        <p className="text-secondary mb-4">Try generating again with more detailed study notes.</p>
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
    // Keep wrongQuestionIds, but reset for the re-test run
    setWrongQuestionIds(new Set());
    setIsCompleted(false);
    setIsReTesting(true);
  };

  const percentScore = Math.round((score / questions.length) * 100);

  // Render Completion Screen
  if (isCompleted) {
    return (
      <div className="glass-panel p-8 text-center max-w-lg mx-auto animate-fade-in">
        <Award size={48} className="text-purple-400 mx-auto mb-4 animate-bounce" style={{ color: 'var(--accent-primary)' }} />
        <h3 className="text-2xl font-bold mb-1">
          {isReTesting ? 'Re-Test Completed!' : 'Quiz Finished!'}
        </h3>
        <p className="text-sm text-secondary mb-6" style={{ color: 'var(--text-secondary)' }}>
          Here are your results for this session:
        </p>

        <div className="bg-black/20 p-6 rounded-xl border mb-6" style={{ background: 'rgba(0,0,0,0.15)', borderColor: 'var(--glass-border)' }}>
          <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent" style={{ 
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.8rem'
          }}>
            {percentScore}%
          </div>
          <div className="text-sm text-secondary mt-1" style={{ color: 'var(--text-secondary)' }}>
            You scored {score} out of {questions.length} questions correctly.
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Re-test Wrong Answers Button (Only if there are mistakes) */}
          {!isReTesting && wrongQuestionIds.size > 0 && (
            <button
              onClick={handleReTestWrongs}
              className="btn btn-primary w-full py-3.5 flex items-center justify-center gap-2"
              style={{ background: 'var(--accent-gradient)' }}
            >
              <RefreshCcw size={16} />
              Re-Test Wrong Answers ({wrongQuestionIds.size})
            </button>
          )}

          {/* Restart Full Quiz */}
          <button
            onClick={handleRestartFull}
            className="btn btn-secondary w-full py-3.5 flex items-center justify-center gap-2"
          >
            <Play size={16} />
            Retake Entire Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Quiz Progress Header */}
      <div className="flex justify-between items-center text-sm mb-4">
        <span className="text-secondary" style={{ color: 'var(--text-secondary)' }}>
          Question {currentIndex + 1} of {questions.length} {isReTesting && '(Re-Testing Mistakes)'}
        </span>
        <span className="font-semibold text-purple-400" style={{ color: 'var(--accent-primary)' }}>
          Score: {score} / {currentIndex + (isAnswered ? 1 : 0)}
        </span>
      </div>

      <div className="glass-panel p-6 flex flex-col gap-6">
        {/* Question Text */}
        <h3 className="text-lg md:text-xl font-bold leading-relaxed text-white" style={{ color: 'var(--text-primary)' }}>
          {currentQuestion.question}
        </h3>

        {/* Options List */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentQuestion.correctAnswer;
            
            let optionStyle = {
              background: 'rgba(0, 0, 0, 0.15)',
              borderColor: 'var(--glass-border)',
              color: 'var(--text-primary)',
            };
            
            if (isAnswered) {
              if (isCorrectOption) {
                // Correct option is always green once answered
                optionStyle = {
                  background: 'var(--success-bg)',
                  borderColor: 'var(--success)',
                  color: 'var(--text-primary)',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.1)'
                };
              } else if (isSelected && !isCorrectOption) {
                // Selected incorrect option is red
                optionStyle = {
                  background: 'var(--error-bg)',
                  borderColor: 'var(--error)',
                  color: 'var(--text-primary)',
                };
              }
            } else if (isSelected) {
              // Highlight selected option before submitting
              optionStyle = {
                background: 'rgba(168, 85, 247, 0.1)',
                borderColor: 'var(--accent-primary)',
                color: 'var(--text-primary)',
              };
            }

            return (
              <div
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  isAnswered ? 'cursor-default' : 'hover:bg-white/5 hover:translate-x-1'
                }`}
                style={optionStyle}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-xs rounded-full w-6 h-6 flex items-center justify-center border" style={{
                    borderColor: isSelected ? 'transparent' : 'rgba(255,255,255,0.1)',
                    background: isSelected ? 'var(--accent-gradient)' : 'rgba(0,0,0,0.2)',
                    color: isSelected ? 'white' : 'var(--text-secondary)'
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm md:text-base font-medium">{option}</span>
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
        <div className="flex justify-end mt-4">
          {!isAnswered ? (
            <button
              onClick={handleAnswerSubmit}
              disabled={selectedOption === null}
              className="btn btn-primary px-8 py-3 font-semibold"
              style={{ background: 'var(--accent-gradient)' }}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn btn-primary px-8 py-3 font-semibold"
              style={{ background: 'var(--accent-gradient)' }}
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Explanation Block */}
        {isAnswered && (
          <div className="bg-black/20 p-5 rounded-xl border border-dashed text-sm leading-relaxed mt-2 animate-fade-in" style={{
            background: 'rgba(0,0,0,0.15)',
            borderColor: 'var(--glass-border)'
          }}>
            <h4 className="font-semibold text-purple-400 mb-1 flex items-center gap-1.5" style={{ color: 'var(--accent-primary)' }}>
              <AlertCircle size={14} />
              Explanation
            </h4>
            <p className="text-secondary" style={{ color: 'var(--text-secondary)' }}>
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
