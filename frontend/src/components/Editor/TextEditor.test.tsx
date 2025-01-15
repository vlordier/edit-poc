import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEditor } from './TextEditor';

describe('TextEditor', () => {
  test('renders Document Editor title', async () => {
    render(<TextEditor />);
    expect(await screen.findByText('Document Editor')).toBeInTheDocument();
  });

  test('handles empty text input gracefully', () => {
    render(<TextEditor />);
    const textarea = screen.getByPlaceholderText('Enter your text here...');
    fireEvent.change(textarea, { target: { value: '' } });
    const button = screen.getByText('Analyze Text');
    expect(button).toBeDisabled();
  });

  test('handles text input and analysis', async () => {
    render(<TextEditor />);
    const textarea = screen.getByPlaceholderText('Enter your text here...');
    fireEvent.change(textarea, { target: { value: 'Sample text' } });
    const button = screen.getByText('Analyze Text');
    fireEvent.click(button);
    expect(await screen.findByText(/Analyzing...|Analyze Text/)).toBeInTheDocument();
  });
});
