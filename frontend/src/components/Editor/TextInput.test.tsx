import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextInput from './TextInput';

jest.useFakeTimers();

describe('TextInput', () => {
  test('renders text input and updates text after debounce', async () => {
    const setText = jest.fn();
    render(<TextInput text="" setText={setText} />);
    const textarea = screen.getByPlaceholderText('Enter your text here...');
    
    fireEvent.change(textarea, { target: { value: 'New text' } });
    
    // Fast-forward debounce timeout
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(setText).toHaveBeenCalledWith('New text');
  });

  test('renders with initial text', () => {
    render(<TextInput text="Initial text" setText={jest.fn()} />);
    const textarea = screen.getByPlaceholderText('Enter your text here...');
    expect(textarea).toHaveValue('Initial text');
  });
});
