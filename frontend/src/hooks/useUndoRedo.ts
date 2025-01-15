import { useState, useCallback, useRef, useEffect } from 'react';

export function useUndoRedo<T>(initialState: T): {
  state: T;
  setState: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
} {
  const [states, setStates] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const setState = useCallback((newState: T) => {
    setStates(prev => [...prev.slice(0, currentIndex + 1), newState]);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < states.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, states.length]);

  return {
    state: states[currentIndex],
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < states.length - 1,
  };
}
