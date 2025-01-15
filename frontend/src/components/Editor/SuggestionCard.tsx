import React, { useState, memo, useCallback, KeyboardEvent } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { Check, Edit2, X } from 'lucide-react';
import { type Suggestion, IMPROVEMENT_TYPES } from '@/types/suggestions';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onAccept: (id: string, suggestionIndex: number) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Suggestion>) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = memo(({ suggestion, onAccept, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSuggestion, setEditedSuggestion] = useState<Suggestion>({ ...suggestion });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleSave = useCallback(async () => {
    if (!editedSuggestion.rationale.trim() || !editedSuggestion.improvements.length) {
      return;
    }
    
    setIsSaving(true);
    try {
      await onEdit(suggestion.id, editedSuggestion);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save suggestion:', error);
      // Show error state
      setError('Failed to save changes. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [editedSuggestion, onEdit, suggestion.id]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  return (
    <Card 
      role="article" 
      aria-label={`Suggestion: ${IMPROVEMENT_TYPES[suggestion.type]}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-expanded={isEditing}
      aria-controls={`suggestion-content-${suggestion.id}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className={`badge ${suggestion.type.toLowerCase()}`}>
            {IMPROVEMENT_TYPES[suggestion.type]}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              aria-label={`${isEditing ? 'Save changes to' : 'Edit'} suggestion for ${IMPROVEMENT_TYPES[suggestion.type]}`}
              aria-pressed={isEditing}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                setIsDeleting(true);
                try {
                  await onDelete(suggestion.id);
                } catch (error) {
                  setError('Failed to delete suggestion');
                  setTimeout(() => setError(null), 3000);
                } finally {
                  setIsDeleting(false);
                }
              }}
              disabled={isDeleting}
              aria-label="Delete suggestion"
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div 
            className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded"
            role="alert"
          >
            {error}
          </div>
        )}
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
                    id={`improvement-${index}`}
                    name={`improvement-${index}`}
                  />
                </div>
              ))}
            </div>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
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
});

SuggestionCard.displayName = 'SuggestionCard';

export default SuggestionCard;
