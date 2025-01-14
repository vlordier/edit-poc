import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextEditor from './TextEditor';

describe('TextEditor Component', () => {
  test('renders Document Editor title', async () => {
    render(<TextEditor />);
    expect(await screen.findByText('Document Editor')).toBeInTheDocument();
  });

  test('handles empty text input gracefully', () => {
    render(<TextEditor />);
    const textarea = screen.getByPlaceholderText('Enter your text here...');
    fireEvent.change(textarea, { target: { value: '' } });
    const button = screen.getByText('Generate Suggestions');
    expect(button).toBeDisabled();
  });

  test('updates AI status correctly', async () => {
    render(<TextEditor />);
    const aiStatus = await screen.findByRole('banner');
    expect(aiStatus).toHaveTextContent(/AI (enabled|not available)/);
    // Simulate AI becoming available
    fireEvent.click(screen.getByText('Check AI Status'));
    expect(await screen.findByText('AI enabled')).toBeInTheDocument();
  });

  test('removes suggestions after applying', async () => {
    render(<TextEditor />);
    const textarea = screen.getByPlaceholderText('Enter your text here...');
    fireEvent.change(textarea, { target: { value: 'Sample text' } });
    const button = screen.getByText('Generate Suggestions');
    fireEvent.click(button);
    const suggestion = await screen.findByRole('button', { name: /Suggestion:/ });
    fireEvent.click(suggestion);
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    expect(screen.queryByRole('button', { name: /Suggestion:/ })).not.toBeInTheDocument();
  });

  test('disables Generate Suggestions button when no text is input', () => {
    render(<TextEditor />);
    const button = screen.getByText('Generate Suggestions');
    expect(button).toBeDisabled();
  });

  test('handles suggestion selection and update', async () => {
    render(<TextEditor />);
    const textarea = screen.getByPlaceholderText('Enter your text here...');
    fireEvent.change(textarea, { target: { value: 'Sample text' } });
    const button = screen.getByText('Generate Suggestions');
    fireEvent.click(button);
    const suggestion = await screen.findByRole('button', { name: /Suggestion:/ });
    fireEvent.click(suggestion);
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    expect(textarea).toHaveValue('Sample text');
    expect(screen.queryByRole('button', { name: /Suggestion:/ })).not.toBeInTheDocument();
    // Verify that the suggestion is applied correctly
    expect(textarea).toHaveValue('Sample text with applied suggestion');
  });

  test('displays suggestions correctly', async () => {
    render(<TextEditor />);
    const textarea = screen.getByPlaceholderText('Enter your text here...');
    fireEvent.change(textarea, { target: { value: 'Sample text' } });
    const button = screen.getByText('Generate Suggestions');
    fireEvent.click(button);
    const suggestion = await screen.findByRole('button', { name: /Suggestion:/ });
    expect(suggestion).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    render(<TextEditor />);
    expect(screen.getByText('Document Editor')).toBeInTheDocument();
  });

  test('checks AI availability status', async () => {
    render(<TextEditor />);
    const aiStatus = await screen.findByRole('banner');
    expect(aiStatus).toHaveTextContent(/AI (enabled|not available)/);
  });

  test('handles text input and suggestion generation', async () => {
    render(<TextEditor />);
    const textarea = screen.getByPlaceholderText('Enter your text here...');
    fireEvent.change(textarea, { target: { value: 'Sample text' } });
    const button = screen.getByText('Generate Suggestions');
    fireEvent.click(button);
    expect(await screen.findByText(/Loading...|Generate Suggestions/)).toBeInTheDocument();
    expect(screen.getByText('Generate Suggestions')).toBeDisabled();
  });
});
