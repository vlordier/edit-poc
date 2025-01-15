import { cn } from "../lib/utils";
import { useEffect } from "react";
import { trackEvent } from "../utils/analytics";

interface AnalysisControlsProps {
  loading: boolean;
  onClear: () => void;
  onAnalyze: () => void;
  disabled?: boolean;
}

export const AnalysisControls: React.FC<AnalysisControlsProps> = ({
  disabled = false,
  loading,
  onClear,
  onAnalyze,
}) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (loading || disabled) return;
      
      // Ctrl/Cmd + Enter to analyze
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onAnalyze();
        trackEvent('analyze_shortcut_used');
      }
      
      // Escape to clear
      if (e.key === 'Escape') {
        e.preventDefault();
        onClear();
        trackEvent('clear_shortcut_used');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [loading, disabled, onAnalyze, onClear]);

  return (
    <div className="flex justify-end mt-4" role="toolbar" aria-label="Text analysis controls">
      <button 
        className={cn(
          "text-lg p-2 px-4 rounded transition-colors",
          "bg-blue-500 hover:bg-blue-600 text-white",
          (loading || disabled) && "opacity-50 cursor-not-allowed"
        )}
        onClick={onAnalyze}
        disabled={loading || disabled}
        aria-label="Analyze text"
        aria-busy={loading}
      >
        {loading ? "Analyzing..." : "Analyze Text"}
      </button>
    </div>
  );
};
