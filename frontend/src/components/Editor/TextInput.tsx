import React, { FC, useCallback } from 'react';
import debounce from 'lodash/debounce';
import Textarea from '@/components/ui/textarea';

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
  maxLength?: number;
}

const TextInput: FC<TextInputProps> = ({ text, setText, maxLength = 5000 }) => {
  const debouncedSetText = useCallback(
    debounce((value: string) => setText(value), 300),
    [setText]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const newText = e.target.value;
      
      // Early validation checks
      if (maxLength && newText.length > maxLength) {
        throw new Error('Text exceeds maximum length');
      }
      
      if (newText !== '' && !newText.trim()) {
        throw new Error('Input contains only whitespace');
      }
      
      if (/[\u200B-\u200D\uFEFF]/.test(newText)) {
        throw new Error('Input contains invalid characters');
      }
      
      debouncedSetText(newText);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error handling text input';
      console.error(message);
      // Could dispatch to error boundary or show user feedback here
    }
  }, [debouncedSetText, maxLength]);

  const characterCount = text.length;
  const isNearLimit = maxLength && characterCount > maxLength * 0.9;

  return (
    <section aria-label="Text input section">
      <Textarea
        value={text}
        onChange={handleChange}
        placeholder="Enter your text here..."
        className="textarea w-full h-64"
        id="text-editor"
        name="text-editor"
        maxLength={maxLength}
        aria-label="Text editor input"
      />
      {maxLength && (
        <div 
          className={`text-sm mt-2 ${isNearLimit ? 'text-amber-500' : 'text-gray-500'}`}
          role="status"
          aria-live="polite"
        >
          {text.length}/{maxLength} characters
          {isNearLimit && ' (approaching limit)'}
        </div>
      )}
    </section>
  );
};

export default React.memo(TextInput);
