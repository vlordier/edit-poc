import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Check, X, Edit2, MessageSquare } from 'lucide-react';

// Types of improvements that the LLM can suggest
const IMPROVEMENT_TYPES = {
  CLARITY: 'Clarity',
  GRAMMAR: 'Grammar',
  STYLE: 'Style',
  TECHNICAL: 'Technical Accuracy',
  CONSISTENCY: 'Consistency'
};

const TextEditor = () => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to request suggestions from LangGraph
  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Editor</CardTitle>
          <CardDescription>
            Edit your text and receive AI-powered suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="min-h-[200px]"
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={generateSuggestions}
            disabled={loading || !text}
            className="ml-auto"
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="mr-2 h-4 w-4" />
            )}
            Generate Suggestions
          </Button>
        </CardFooter>
      </Card>

      <SuggestionsList
        suggestions={suggestions}
        onAccept={(id, suggestionIndex) => {
          // Apply the selected suggestion
          const suggestion = suggestions.find(s => s.id === id);
          if (suggestion) {
            const before = text.substring(0, suggestion.span[0]);
            const after = text.substring(suggestion.span[1]);
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
    </div>
  );
};

const SuggestionsList = ({ suggestions, onAccept, onDelete, onEdit }) => {
  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => (
        <SuggestionCard
          key={suggestion.id}
          suggestion={suggestion}
          onAccept={onAccept}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

const SuggestionCard = ({ suggestion, onAccept, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSuggestion, setEditedSuggestion] = useState(suggestion);

  const handleSave = () => {
    onEdit(suggestion.id, editedSuggestion);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant={suggestion.type.toLowerCase()}>
            {IMPROVEMENT_TYPES[suggestion.type]}
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(suggestion.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select
                value={editedSuggestion.type}
                onValueChange={(value) => 
                  setEditedSuggestion({...editedSuggestion, type: value})
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
              <label className="text-sm font-medium">Rationale</label>
              <Textarea
                value={editedSuggestion.rationale}
                onChange={(e) => 
                  setEditedSuggestion({
                    ...editedSuggestion,
                    rationale: e.target.value
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Improvements</label>
              {editedSuggestion.improvements.map((improvement, index) => (
                <div key={index} className="mt-2">
                  <Input
                    value={improvement.text}
                    onChange={(e) => {
                      const newImprovements = [...editedSuggestion.improvements];
                      newImprovements[index] = {
                        ...improvement,
                        text: e.target.value
                      };
                      setEditedSuggestion({
                        ...editedSuggestion,
                        improvements: newImprovements
                      });
                    }}
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        ) : (
          <>
            <p className="text-sm mb-4">{suggestion.rationale}</p>
            <div className="space-y-2">
              {suggestion.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <p className="text-sm">{improvement.text}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAccept(suggestion.id, index)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TextEditor;