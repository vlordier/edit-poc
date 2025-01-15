import React from 'react';
import SuggestionCard from './SuggestionCard';
import { type Suggestion } from '@/types/suggestions';

interface SuggestionHandlers {
  onAccept: (id: string, suggestionIndex: number) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Suggestion>) => void;
}

interface SuggestionsListProps extends SuggestionHandlers {
  suggestions: Suggestion[];
  isLoading?: boolean;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ 
  suggestions, 
  onAccept, 
  onDelete, 
  onEdit,
  isLoading = false 
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div 
          className="space-y-4 animate-pulse" 
          role="status" 
          aria-busy="true"
        >
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <p className="text-gray-500 text-center">Loading suggestions...</p>
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

    return suggestions.map((suggestion) => (
      <SuggestionCard
        key={suggestion.id}
        suggestion={suggestion}
        onAccept={onAccept}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    ));
  };

  return (
    <div 
      className="space-y-4" 
      role="feed" 
      aria-label="Suggestions list"
    >
      {renderContent()}
    </div>
  );
};

export default SuggestionsList;
