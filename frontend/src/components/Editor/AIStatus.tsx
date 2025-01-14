import React, { memo } from 'react';

type AIStatusProps = {
  aiAvailable: boolean;
  className?: string;
};

/**
 * Displays the current AI availability status with a visual indicator
 * @param {AIStatusProps} props - Component properties
 * @returns {JSX.Element} Status indicator with icon and text
 */
const AIStatus: React.FC<AIStatusProps> = memo(({ aiAvailable, className = '' }) => (
  <header 
    className={`flex items-center justify-center mb-4 ${className}`}
    role="status"
    aria-live="polite"
    data-testid="ai-status"
  >
    {aiAvailable ? (
      <span 
        className="text-green-500 transition duration-300 flex items-center gap-2"
        data-testid="ai-status-enabled"
      >
        <span className="sr-only">AI is </span>
        {/* Using semantic checkmark character instead of emoji */}
        <span aria-hidden="true">✓</span>
        AI enabled
      </span>
    ) : (
      <span 
        className="text-red-500 transition duration-300 flex items-center gap-2"
        data-testid="ai-status-disabled"
      >
        <span className="sr-only">AI is </span>
        {/* Using semantic X character instead of emoji */}
        <span aria-hidden="true">×</span>
        AI not available
      </span>
    )}
  </header>
));

AIStatus.displayName = 'AIStatus';

export default AIStatus;
