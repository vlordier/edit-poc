"use client";

import { useState } from "react";

const HighlightedText = ({ text, highlights }) => {
  const parts = [];
  let lastIndex = 0;

  highlights.forEach(({ start, end, color, critique, suggestion }, index) => {
    if (lastIndex < start) {
      parts.push(<span key={`text-${index}`}>{text.slice(lastIndex, start)}</span>);
    }
    parts.push(
      <span key={`highlight-${index}`} style={{ backgroundColor: color }}>
        {text.slice(start, end)}
      </span>,
      <div className="ml-4 mt-2">
        <p className="text-sm text-gray-700"><strong>Critique:</strong> {critique}</p>
        <p className="text-sm text-gray-700"><strong>Suggestion:</strong> {suggestion}</p>
      </div>
    );
    lastIndex = end;
  });

  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [text, setText] = useState("");
  const [highlights, setHighlights] = useState([]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // Simulate an API call
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setHighlights(data.highlights);
      setMessage("Text analysis completed successfully!");
    } catch (err) {
      setError("Failed to analyze text. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-background">
      <div className="w-full max-w-6xl space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-4xl font-bold">Text Analyzer</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Paste or type your text below to get suggestions and analysis
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded p-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[500px] text-lg w-full"
              placeholder="Paste or type your text here..."
            ></textarea>
        </div>

        <div className="bg-white shadow rounded p-6">
            <HighlightedText text={text} highlights={highlights} />
        </div>

        <div className="flex justify-between mt-4">
          <button className="text-lg p-2 bg-blue-500 text-white rounded" onClick={() => setText("")} disabled={loading}>
            Clear
          </button>
          <button className="text-lg p-2 bg-blue-500 text-white rounded" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Text"}
          </button>
        </div>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </main>
  );
}
