"use client";

import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../constants/api";
import { type Highlight } from "../types/highlights";
import { HighlightedText } from "../components/HighlightedText";
import { TextEditor } from "../components/Editor/TextEditor";
import { AnalysisControls } from "../components/AnalysisControls";
import { FeedbackPanel } from "../components/FeedbackPanel";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [text, setText] = useState("");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<number | null>(null);

const handleAnalyze = useCallback(async () => {
  try {
    // Input validation
    if (!text) {
      throw new Error("Please enter some text to analyze");
    }

    if (!text.trim()) {
      throw new Error("Please enter some actual text, not just whitespace");
    }

    if (text.length < 10) {
      throw new Error("Please enter at least 10 characters");
    }

    if (text.length > 5000) {
      throw new Error("Text is too long. Maximum length is 5000 characters");
    }

    setLoading(true);
    setError(null);
    setMessage("");

    let response;
    try {
      response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
    } catch (networkError) {
      throw new Error("Network error: Failed to reach the server. Please check your connection.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const formattedHighlights = data.suggestions.map((suggestion) => ({
      start: suggestion.span[0],
      end: suggestion.span[1],
      color: "yellow", // You can customize the color based on suggestion type
      critique: suggestion.rationale,
      suggestion: suggestion.improvements[0].text, // Assuming you want the first improvement
    }));
    setHighlights(formattedHighlights);
    setMessage("Text analysis completed successfully!");
  } catch (err) {
    setError(err instanceof Error ? err : new Error("Failed to analyze text"));
  } finally {
    setLoading(false);
  }
}, [text]);

  const handleAccept = useCallback(() => {
    if (selectedHighlight !== null) {
      const { start, end, suggestion } = highlights[selectedHighlight];
      const newText = text.slice(0, start) + suggestion + text.slice(end);
      setText(newText);
      setHighlights(highlights.filter((_, index) => index !== selectedHighlight));
    }
    // Logic to accept the suggestion
    setSelectedHighlight(null);
  }, [selectedHighlight, highlights, text]);

  const handleReject = useCallback(() => {
    if (selectedHighlight !== null) {
      setHighlights(highlights.filter((_, index) => index !== selectedHighlight));
    }
    // Logic to reject the suggestion
    setSelectedHighlight(null);
  }, [selectedHighlight, highlights]);

  const handleHighlightSelect = useCallback((index: number) => {
    setSelectedHighlight(index === selectedHighlight ? null : index);
  }, [selectedHighlight]);

  useEffect(() => {
    if (error) {
      const errorDetails = {
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        textLength: text.length,
        type: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      };
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error occurred:', {
          message: errorDetails.message,
          timestamp: errorDetails.timestamp,
          textLength: errorDetails.textLength,
          type: errorDetails.type
        });
      }
      
      // Track error event
      import('../utils/analytics').then(({ trackEvent }) => {
        try {
          trackEvent('error_occurred', errorDetails);
        } catch (trackingError) {
          console.error('Failed to track error event:', trackingError);
        }
      }).catch((importError) => {
        console.error('Failed to import analytics:', importError);
      });
    }
  }, [error, text]);

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

        <TextEditor 
          text={text}
          setText={setText}
          loading={loading}
        />

        <div className="bg-white shadow rounded p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <HighlightedText 
              text={text} 
              highlights={highlights}
              selectedHighlight={selectedHighlight}
              onHighlightSelect={handleHighlightSelect}
            />
          )}
        </div>

        <AnalysisControls
          loading={loading}
          onClear={() => setText("")}
          onAnalyze={handleAnalyze}
        />

        {message && (
          <div role="alert" className="text-green-500 mt-4 p-3 bg-green-50 rounded">
            {message}
          </div>
        )}
        {error && (
          <div role="alert" className="text-red-500 mt-4 p-3 bg-red-50 rounded">
            {error.message}
          </div>
        )}
      </div>
      
      {selectedHighlight !== null && (
        <FeedbackPanel
          highlight={highlights[selectedHighlight]}
          onAccept={handleAccept}
          onReject={handleReject}
          loading={loading}
        />
      )}
    </main>
  );
}
