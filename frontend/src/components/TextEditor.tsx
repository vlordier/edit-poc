import { cn } from "../lib/utils";

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  loading: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({ text, setText, loading }) => {
  return (
    <div className="bg-white shadow rounded p-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={cn(
          "min-h-[500px] text-lg w-full p-4 border rounded",
          "bg-white text-black", // Added explicit text and background colors
          "focus:ring-2 focus:ring-blue-500 focus:outline-none",
          loading && "opacity-50 cursor-not-allowed"
        )}
        placeholder="Paste or type your text here..."
        disabled={loading}
        aria-label="Text input for analysis"
        maxLength={5000}
      />
      <div className="text-sm text-gray-500 mt-2">
        {text.length}/5000 characters
      </div>
    </div>
  );
};
