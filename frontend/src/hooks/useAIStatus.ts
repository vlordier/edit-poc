import { useState, useEffect } from 'react';

export const useAIStatus = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAIStatus = async () => {
      try {
        const response = await fetch('/api/ai/status');
        if (!response.ok) throw new Error('AI service unavailable');
        const { available } = await response.json();
        setIsAvailable(available);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check AI status'));
        setIsAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAIStatus();
    const interval = setInterval(checkAIStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { isAvailable, isLoading, error };
};
