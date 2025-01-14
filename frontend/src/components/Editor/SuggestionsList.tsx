import React from 'react';
import SuggestionCard from './SuggestionCard';
import { type Suggestion } from '@/types/suggestions';

interface SuggestionsListProps {
  suggestions: Suggestion[];
  onAccept: (id: string, suggestionIndex: number) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Suggestion>) => void;
  isLoading?: boolean;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ 
  suggestions, 
  onAccept, 
  onDelete, 
  onEdit,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-busy="true">
        <p className="text-gray-500">Loading suggestions...</p>
      </div>
    );
  }

  if (!suggestions.length) {
    return (
      <div className="space-y-4" role="status">
        <p className="text-gray-500">No suggestions available</p>
      </div>
    );
  }

  return (
    <div 
      className="space-y-4" 
      role="feed" 
      aria-label="Suggestions list"
    >
      {suggestions.map((suggestion) => (
        <SuggestionCard
          key={suggestion.id}
          suggestion={suggestion}
          onAccept={onAccept}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default SuggestionsList;
