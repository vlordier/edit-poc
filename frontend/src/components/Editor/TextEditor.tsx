import React, { useState } from 'react';
import { API_URL } from '@/constants/api';

const TextEditor: React.FC = () => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError('Failed to analyze text');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Text Editor</h1>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-40 p-2 border rounded mb-4"
        placeholder="Enter text to analyze..."
      />
      
      <button
        onClick={handleAnalyze}
        disabled={isLoading || !text.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>

      {error && (
        <div className="text-red-500 mt-4">{error}</div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Suggestions</h2>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { TextEditor };
