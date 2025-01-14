import React, { FC, useCallback } from 'react';
import Textarea from '@/components/ui/textarea';

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
  maxLength?: number;
}

const TextInput: FC<TextInputProps> = ({ text, setText, maxLength = 5000 }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (maxLength && newText.length > maxLength) {
      return;
    }
    setText(newText);
  }, [setText, maxLength]);

  return (
    <section>
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
        <div className="text-sm text-gray-500 mt-2">
          {text.length}/{maxLength} characters
        </div>
      )}
    </section>
  );
};

export default React.memo(TextInput);
