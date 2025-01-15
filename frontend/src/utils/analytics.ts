export type EventName = 
  | 'analyze_shortcut_used'
  | 'clear_shortcut_used'
  | 'suggestion_action'
  | 'error_occurred';

export type SuggestionAction = 'accept' | 'reject' | 'edit';

export type EventProperties = {
  action?: 'accept' | 'reject' | 'edit';
  type?: string;
  error?: string;
  stack?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
};

export const trackEvent = (eventName: EventName, properties?: EventProperties) => {
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
