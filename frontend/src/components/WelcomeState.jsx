import React, { useState } from 'react';
import { Sparkles, FileText, HelpCircle } from 'lucide-react';

const SUGGESTIONS = [
  {
    title: "React Hooks Basics",
    description: "useState, useEffect, and rules of hooks.",
    content: "React Hooks allow functional components to manage state and side effects. The useState hook declares state variables: const [state, setState] = useState(initialValue). The useEffect hook handles side effects like fetching data, sub-scribing to events, or mutating the DOM: useEffect(() => { ... return () => cleanup() }, [dependencies]). Rules of hooks dictate that hooks must only be called at the top level of functions (not inside loops or conditions) and only from React function components or custom hooks."
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
    <div className="w-full max-w-3xl mx-auto px-4 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent" style={{
          fontSize: '2.2rem',
          fontWeight: '800',
          background: 'var(--accent-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2'
        }}>
          What are we studying today?
        </h2>
        <p className="text-secondary max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Paste your messy lecture notes, a textbook chapter, or simply type a topic. We'll forge custom flashcards, quizzes, and learning roadmaps instantly.
        </p>
      </div>

      <div className="glass-panel p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="Paste your notes here, or type a topic (e.g., 'Quantum Computing Basics' or 'How Git works')..."
              className="w-full min-h-[200px] p-4 bg-black/25 text-white border rounded-xl focus:outline-none focus:ring-2 resize-none transition-all"
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderColor: 'var(--glass-border)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)'
              }}
              maxLength={10000}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted" style={{ color: 'var(--text-muted)' }}>
              {input.length} / 10,000
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm flex items-center gap-1.5" style={{ color: 'var(--error)' }}>
              <HelpCircle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn btn-primary w-full py-4 text-base font-semibold"
            style={{ padding: '14px 20px' }}
          >
            <Sparkles size={20} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Forging Study Materials...' : 'Forge Study Materials'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3 px-1" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Or try a quick suggestion:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUGGESTIONS.map((sug, idx) => (
            <div
              key={idx}
              onClick={() => handleSuggestionClick(sug.content)}
              className="glass-panel p-4 cursor-pointer hover:border-purple-500/50 hover:translate-y-[-2px] transition-all flex flex-col justify-between"
              style={{ padding: '16px' }}
            >
              <div>
                <h4 className="font-semibold text-sm mb-1 text-white" style={{ color: 'var(--text-primary)' }}>{sug.title}</h4>
                <p className="text-xs text-secondary line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{sug.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-purple-400 font-medium mt-3" style={{ color: 'var(--accent-primary)' }}>
                <FileText size={12} />
                Load Text
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
