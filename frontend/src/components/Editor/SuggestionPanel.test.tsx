import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestionPanel from './SuggestionPanel';

test('renders generate suggestions button', () => {
  const generateSuggestions = jest.fn();
  render(<SuggestionPanel loading={false} text="Sample text" generateSuggestions={generateSuggestions} />);
  const button = screen.getByRole('button', { name: /Generate Suggestions/i });
  fireEvent.click(button);
  expect(generateSuggestions).toHaveBeenCalled();
});

test('button is disabled when loading or text is empty', () => {
  const generateSuggestions = jest.fn();
  render(<SuggestionPanel loading={true} text="" generateSuggestions={generateSuggestions} />);
  const button = screen.getByRole('button', { name: /Generate Suggestions/i });
  expect(button).toBeDisabled();
});

test('displays loading state', () => {
  const generateSuggestions = jest.fn();
  render(<SuggestionPanel loading={true} text="Sample text" generateSuggestions={generateSuggestions} />);
  expect(screen.getByRole('button', { name: /Generate Suggestions/i })).toBeDisabled();
});
