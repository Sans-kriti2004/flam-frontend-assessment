import React, { useState } from 'react';
import { Sparkles, FileText, AlertCircle } from 'lucide-react';

const SUGGESTIONS = [
  {
    title: "React Hooks Basics",
    description: "useState, useEffect, and rules of hooks.",
    content: "React Hooks allow functional components to manage state and side effects. The useState hook declares state variables: const [state, setState] = useState(initialValue). The useEffect hook handles side effects like fetching data, subscribing to events, or mutating the DOM: useEffect(() => { ... return () => cleanup() }, [dependencies]). Rules of hooks dictate that hooks must only be called at the top level of functions (not inside loops or conditions) and only from React function components or custom hooks."
  },
  {
    title: "Photosynthesis",
    description: "Light reactions and the Calvin cycle.",
    content: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. It involves green pigment chlorophyll and generates oxygen as a byproduct. The reaction is split into: Light-dependent reactions (which capture solar energy to produce ATP and NADPH in the thylakoid membranes) and Light-independent reactions (or the Calvin Cycle, which takes place in the stroma to synthesize glucose using carbon dioxide, ATP, and NADPH)."
  },
  {
    title: "REST APIs vs GraphQL",
    description: "Compare API architectural styles.",
    content: "REST (Representational State Transfer) is an architectural style based on standard HTTP verbs (GET, POST, PUT, DELETE) where resources are identified by URLs. It often returns complete resources, which can lead to over-fetching or under-fetching. GraphQL is a query language for APIs that allows clients to request exactly the data they need from a single endpoint. GraphQL uses schemas, queries, mutations, and resolvers. REST is simpler to cache, while GraphQL is excellent for complex, nested data structures."
  }
];

export default function WelcomeState({ onSubmit, isLoading }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Please enter some notes, text, or a topic first.');
      return;
    }
    setError('');
    onSubmit(input);
  };

  const handleSuggestionClick = (content) => {
    setInput(content);
    setError('');
  };

  return (
    <div className="welcome-container animate-fade-in">
      <div className="welcome-header">
        <h2 className="welcome-title">What are we studying today?</h2>
        <p className="welcome-subtitle">
          Paste your lecture notes, textbook chapters, or simply type a topic. We'll forge interactive roadmaps, flashcards, and quizzes instantly.
        </p>
      </div>

      <div className="glass-panel form-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="textarea-wrapper">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="Paste your notes here, or type a topic (e.g., 'Quantum Computing' or 'How Git works')..."
              className="textarea-editor"
              maxLength={10000}
            />
            <div className="char-counter">
              {input.length.toLocaleString()} / 10,000
            </div>
          </div>

          {error && (
            <div className="alert-box alert-error" style={{ margin: 0, padding: '10px 14px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} style={{ color: 'var(--error)' }} />
                <span style={{ fontSize: '0.85rem' }}>{error}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn btn-primary"
            style={{ padding: '14px 20px', width: '100%', fontSize: '1rem' }}
          >
            <Sparkles size={20} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Forging Study Materials...' : 'Forge Study Materials'}
          </button>
        </form>
      </div>

      <div className="suggestions-section">
        <h3 className="suggestions-title">Or try a quick suggestion:</h3>
        <div className="suggestions-grid">
          {SUGGESTIONS.map((sug, idx) => (
            <div
              key={idx}
              onClick={() => handleSuggestionClick(sug.content)}
              className="glass-panel suggestion-card"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 className="suggestion-card-title">{sug.title}</h4>
                <p className="suggestion-card-desc">{sug.description}</p>
              </div>
              <div className="suggestion-card-action">
                <FileText size={12} />
                <span>Load Suggestion</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
