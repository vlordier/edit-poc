import React, { useState, useEffect, useCallback, useMemo, FC } from 'react';
import { useForm } from 'react-hook-form';
import { API_URL } from '../../constants/api';
import AIStatus from './AIStatus';
import TextInput from './TextInput';
import SuggestionPanel from './SuggestionPanel';
import SuggestionsList from './SuggestionsList';
import { CardDescription, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import Input from "@/components/ui/input";
import Select, { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { type Suggestion, IMPROVEMENT_TYPES } from '@/types/suggestions';


interface FormData {
  text: string;
}

const TextEditor: FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAIAvailable, setIsAIAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { handleSubmit, watch } = useForm<FormData>({
    defaultValues: { text: '' }
  });

  const currentText = watch('text');

  // Improved error handling in useEffect
  useEffect(() => {
    let isSubscribed = true;

    const checkAiAvailability = async () => {
      try {
        setError(null);
        const response = await fetch(API_URL, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000) // 5s timeout
        });
        
        if (isSubscribed) {
          setIsAIAvailable(response.ok);
        }
      } catch {
        if (isSubscribed) {
          setIsAIAvailable(false);
          setError(error instanceof Error ? error.message : 'Failed to connect to AI service');
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    checkAiAvailability();
    const intervalId = setInterval(checkAiAvailability, 60000);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [error]);

  const generateSuggestions = useCallback(async (data: FormData) => {
    if (!data.text.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.text }),
      });
      
      if (!response.ok) throw new Error('Failed to generate suggestions');
      
      const responseData = await response.json();
      const { suggestions: newSuggestions } = responseData;
      setSuggestions(newSuggestions || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setIsAIAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle click on highlighted text to select a suggestion
  const handleHighlightClick = useCallback((suggestion: Suggestion): void => {
    setSelectedSuggestion(suggestion);
  }, []);

  // Update text with the selected suggestion
  const handleUpdateText = useCallback((): void => {
    if (selectedSuggestion) {
      setSuggestions(suggestions.filter(s => s.id !== selectedSuggestion.id));
      setSelectedSuggestion(null);
    }
  }, [selectedSuggestion, suggestions]);

  // Memoize highlighted text to improve performance
  const highlightedText = useMemo(() => {
    return suggestions.map(suggestion => (
      <button
        key={suggestion.id}
        onClick={() => handleHighlightClick(suggestion)}
        className="highlighted-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
        aria-label={`Suggestion: ${suggestion.rationale}`}
        role="button"
      >
        {currentText.substring(suggestion.span[0], suggestion.span[1])}
      </button>
    ));
  }, [suggestions, currentText, handleHighlightClick]);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6 bg-white shadow-lg rounded-lg">
      <header className="text-center mb-4">
        <CardTitle className="text-2xl font-bold">Document Editor</CardTitle>
        <CardDescription className="text-gray-600">
          Edit your text and receive AI-powered suggestions
        </CardDescription>
      </header>
      <AIStatus aiAvailable={isAIAvailable} />
      <form onSubmit={handleSubmit(generateSuggestions)}>
        <TextInput text={currentText} setText={(newText) => setText(newText)} />
        <div className="my-4 p-4 bg-gray-100 rounded-lg">{highlightedText}</div>
        <SuggestionPanel loading={isLoading} text={currentText} generateSuggestions={generateSuggestions} />
      </form>
      <SuggestionsList
        suggestions={suggestions}
        onAccept={(id, suggestionIndex) => {
          // Apply the selected suggestion
          const suggestion = suggestions.find(s => s.id === id);
          if (suggestion) {
            const before = currentText.substring(0, suggestion.span[0]);
            const after = currentText.substring(suggestion.span[1]);
            setText(before + suggestion.improvements[suggestionIndex].text + after);
            // Remove the applied suggestion
            setSuggestions(suggestions.filter(s => s.id !== id));
          }
        }}
        onDelete={(id) => {
          setSuggestions(suggestions.filter(s => s.id !== id));
        }}
        onEdit={(id, updates) => {
          setSuggestions(suggestions.map(s => 
            s.id === id ? { ...s, ...updates } : s
          ));
        }}
      />
    {selectedSuggestion && (
        <div className="side-panel">
          <h2>Edit Suggestion</h2>
          <div>
            <label>Type</label>
            <Select
              value={selectedSuggestion.type}
              onValueChange={(value) =>
                setSelectedSuggestion({ ...selectedSuggestion, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(IMPROVEMENT_TYPES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label>Rationale</label>
            <Textarea
              value={selectedSuggestion.rationale}
              onChange={(e) =>
                setSelectedSuggestion({
                  ...selectedSuggestion,
                  rationale: e.target.value,
                })
              }
              id="text-editor"
              name="text-editor"
            />
          </div>
          <div>
            <label>Improvements</label>
            {selectedSuggestion.improvements.map((improvement, index) => (
              <Input
                key={index}
                value={improvement.text}
                onChange={(e) => {
                  const newImprovements = [...selectedSuggestion.improvements];
                  newImprovements[index] = {
                    ...improvement,
                    text: e.target.value,
                  };
                  setSelectedSuggestion({
                    ...selectedSuggestion,
                    improvements: newImprovements,
                  });
                }}
                id={`improvement-${index}`}
                name={`improvement-${index}`}
              />
            ))}
          </div>
          <Button onClick={handleUpdateText}>Update</Button>
        </div>
      )}
    </main>
  );
};

export default TextEditor;
