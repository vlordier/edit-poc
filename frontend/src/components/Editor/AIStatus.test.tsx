import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIStatus from './AIStatus';

test('renders AI enabled status', () => {
  render(<AIStatus aiAvailable={true} />);
  expect(screen.getByTestId('ai-status-enabled')).toBeInTheDocument();
});

test('renders AI status with correct role', () => {
  render(<AIStatus aiAvailable={true} />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});

test('renders AI not available status', () => {
  render(<AIStatus aiAvailable={false} />);
  expect(screen.getByTestId('ai-status-disabled')).toBeInTheDocument();
});
