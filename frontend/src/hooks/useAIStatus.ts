import { useState, useEffect } from 'react';

interface AIStatusState {
  isAvailable: boolean;
  isLoading: boolean;
  error: Error | null;
  lastCheck: Date | null;
}

interface AIStatusResponse {
  available: boolean;
}

export const useAIStatus = (checkInterval = 30000) => {
  const [state, setState] = useState<AIStatusState>({
    isAvailable: true,
    isLoading: true,
    error: null,
    lastCheck: null,
    retryCount: 0,
    retryDelay: 1000
  });

  useEffect(() => {
    const controller = new AbortController();

    const checkAIStatus = async () => {
      try {
        const response = await fetch('/api/ai/status', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`AI service error: ${response.status}`);
        }
        
        const { available } = await response.json();
        setState(prev => ({
          ...prev,
          isAvailable: available,
          error: null,
          lastCheck: new Date()
        }));
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        const errorMessage = err instanceof Error ? err.message : 'Failed to check AI status';
        console.error('AI Status check failed:', errorMessage);
        setState(prev => {
          const newRetryCount = (prev.retryCount || 0) + 1;
          const shouldRetry = newRetryCount < 3;
          
          if (shouldRetry) {
            setTimeout(checkAIStatus, 1000 * newRetryCount);
          }
          
          return {
            ...prev,
            error: new Error(errorMessage),
            isAvailable: false,
            lastCheck: new Date(),
            isLoading: !shouldRetry,
            retryCount: newRetryCount
          };
        });
      } finally {
        setState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    };

    checkAIStatus();
    const interval = setInterval(checkAIStatus, checkInterval);
    
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [checkInterval]);

  return { 
    isAvailable: state.isAvailable,
    isLoading: state.isLoading,
    error: state.error,
    lastCheck: state.lastCheck 
  };
};
