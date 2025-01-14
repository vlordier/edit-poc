import { type Highlight } from "../types/highlights";
import { cn } from "../lib/utils";

interface FeedbackPanelProps {
  highlight: Highlight;
  onAccept: () => void;
  onReject: () => void;
  loading?: boolean;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  highlight,
  onAccept,
  onReject,
  loading = false
}) => {
  return (
    <div className="side-panel fixed right-4 top-4 bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 className="text-xl font-bold mb-4">Feedback</h2>
      <p className="mb-2"><strong>Critique:</strong> {highlight.critique}</p>
      <p className="mb-4"><strong>Suggestion:</strong> {highlight.suggestion}</p>
      <div className="flex justify-between gap-4">
        <button 
          className={cn(
            "flex-1 p-2 rounded transition-colors",
            "bg-green-500 hover:bg-green-600 text-white",
            loading && "opacity-50 cursor-not-allowed"
          )}
          onClick={onAccept}
          disabled={loading}
        >
          Accept
        </button>
        <button 
          className={cn(
            "flex-1 p-2 rounded transition-colors",
            "bg-red-500 hover:bg-red-600 text-white",
            loading && "opacity-50 cursor-not-allowed"
          )}
          onClick={onReject}
          disabled={loading}
        >
          Reject
        </button>
      </div>
    </div>
  );
};
