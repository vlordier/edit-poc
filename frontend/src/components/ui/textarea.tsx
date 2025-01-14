import React, { FC } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: FC<TextareaProps> = (props) => {
  return <textarea {...props} />;
};

export default Textarea;
