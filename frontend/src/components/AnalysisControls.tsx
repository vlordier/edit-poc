import { cn } from "../lib/utils";

interface AnalysisControlsProps {
  loading: boolean;
  onClear: () => void;
  onAnalyze: () => void;
}

export const AnalysisControls: React.FC<AnalysisControlsProps> = ({
  loading,
  onClear,
  onAnalyze,
}) => {
  return (
    <div className="flex justify-between mt-4">
      <button 
        className={cn(
          "text-lg p-2 px-4 rounded transition-colors",
          "bg-gray-200 hover:bg-gray-300 text-gray-800",
          loading && "opacity-50 cursor-not-allowed"
        )}
        onClick={onClear}
        disabled={loading}
        aria-label="Clear text"
      >
        Clear
      </button>
      <button 
        className={cn(
          "text-lg p-2 px-4 rounded transition-colors",
          "bg-blue-500 hover:bg-blue-600 text-white",
          loading && "opacity-50 cursor-not-allowed"
        )}
        onClick={onAnalyze}
        disabled={loading}
        aria-label="Analyze text"
      >
        {loading ? "Analyzing..." : "Analyze Text"}
      </button>
    </div>
  );
};
