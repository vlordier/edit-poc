import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestionsList from './SuggestionsList';
import { type Suggestion, ImprovementType } from '@/types/suggestions';

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    type: ImprovementType.GRAMMAR,
    rationale: 'Test rationale',
    improvements: [{ id: '1', text: 'Test improvement' }],
    createdAt: new Date().toISOString()
  }
];

describe('SuggestionsList', () => {
  const mockHandlers = {
    onAccept: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn()
  };

  test('renders loading state', () => {
    render(<SuggestionsList {...mockHandlers} suggestions={[]} isLoading={true} />);
    expect(screen.getByText(/loading suggestions/i)).toBeInTheDocument();
  });

  test('renders empty state', () => {
    render(<SuggestionsList {...mockHandlers} suggestions={[]} />);
    expect(screen.getByText(/no suggestions available/i)).toBeInTheDocument();
  });

  test('renders suggestions list', () => {
    render(<SuggestionsList {...mockHandlers} suggestions={mockSuggestions} />);
    expect(screen.getByRole('feed')).toBeInTheDocument();
  });
});
