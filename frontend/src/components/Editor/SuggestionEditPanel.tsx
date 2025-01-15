import React, { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { type Suggestion, IMPROVEMENT_TYPES } from '@/types/suggestions';

interface SuggestionEditPanelProps {
  suggestion: Suggestion;
  onUpdate: (suggestion: Suggestion) => void;
  onClose: () => void;
}

const SuggestionEditPanel: FC<SuggestionEditPanelProps> = ({ 
  suggestion, 
  onUpdate,
  onClose 
}) => {
  const [editedSuggestion, setEditedSuggestion] = React.useState(suggestion);

  return (
    <div className="side-panel p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Edit Suggestion</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Select
            value={editedSuggestion.type}
            onValueChange={(value) =>
              setEditedSuggestion({ ...editedSuggestion, type: value })
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
          <label className="block text-sm font-medium mb-1">Rationale</label>
          <Textarea
            value={editedSuggestion.rationale}
            onChange={(e) =>
              setEditedSuggestion({
                ...editedSuggestion,
                rationale: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Improvements</label>
          {editedSuggestion.improvements.map((improvement, index) => (
            <Input
              key={index}
              value={improvement.text}
              onChange={(e) => {
                const newImprovements = [...editedSuggestion.improvements];
                newImprovements[index] = {
                  ...improvement,
                  text: e.target.value,
                };
                setEditedSuggestion({
                  ...editedSuggestion,
                  improvements: newImprovements,
                });
              }}
              className="mt-2"
            />
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              onUpdate(editedSuggestion);
              onClose();
            }}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionEditPanel;
