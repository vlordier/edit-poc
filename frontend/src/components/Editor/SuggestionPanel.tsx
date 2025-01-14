import React, { FC } from 'react';

interface SuggestionPanelProps {
  loading: boolean;
  text: string;
  generateSuggestions: () => void;
}
import Button from '@/components/ui/button';
import { RefreshCw, MessageSquare } from 'lucide-react';

const SuggestionPanel: FC<SuggestionPanelProps> = ({ loading, text, generateSuggestions }) => (
  <footer className="flex justify-end mt-4">
    <Button
      onClick={generateSuggestions}
      disabled={loading || !text}
      className="ml-auto bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 rounded-lg px-4 py-2"
      aria-label="Generate Suggestions"
    >
      <span className="flex items-center">
        {loading ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" aria-label="Loading" />
        ) : (
          <MessageSquare className="mr-2 h-4 w-4" aria-label="Generate Suggestions" />
        )}
        {loading ? 'Loading...' : 'Generate Suggestions'}
      </span>
    </Button>
  </footer>
);

export default SuggestionPanel;
