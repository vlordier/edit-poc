export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      // Implement your analytics tracking here
      console.log('Analytics event:', eventName, properties);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }
};

export const trackSuggestionEvent = (action: 'accept' | 'reject' | 'edit', suggestionType: string) => {
  trackEvent('suggestion_action', {
    action,
    type: suggestionType,
    timestamp: new Date().toISOString(),
  });
};
