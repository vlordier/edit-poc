import { type Highlight } from "../types/highlights";

interface HighlightedTextProps {
  text: string;
  highlights: Highlight[];
  selectedHighlight: number | null;
  onHighlightSelect: (index: number) => void;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  highlights,
  selectedHighlight,
  onHighlightSelect
}) => {
  if (!text) return null;

  const parts = [];
  let lastIndex = 0;

  (highlights || []).forEach(({ start, end, color, critique, suggestion }, index) => {
    if (lastIndex < start) {
      parts.push(<span key={`text-${index}`}>{text.slice(lastIndex, start)}</span>);
    }
    parts.push(
      <span
        key={`highlight-${index}`}
        style={{ backgroundColor: color, position: 'relative', cursor: 'pointer' }}
        onClick={() => onHighlightSelect(index)}
      >
        {text.slice(start, end)}
        {selectedHighlight === index && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '8px',
              zIndex: 10,
              width: '200px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p className="text-sm text-black"><strong>Critique:</strong> {critique}</p>
            <p className="text-sm text-black"><strong>Suggestion:</strong> {suggestion}</p>
          </div>
        )}
      </span>
    );
    lastIndex = end;
  });

  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
  }
  return <>{parts}</>;
};
