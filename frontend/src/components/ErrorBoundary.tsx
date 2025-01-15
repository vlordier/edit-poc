'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Import trackEvent at the top level to avoid issues with circular dependencies
    import('../utils/analytics').then(({ trackEvent }) => {
      trackEvent('error_occurred', {
        error: error.message,
        stack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        location: window.location.href,
        userAgent: navigator.userAgent
      });
      
      // Log to monitoring service if in production
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/log-error', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Error-Source': 'client'
          },
          body: JSON.stringify({ 
            error, 
            errorInfo,
            location: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          })
        }).catch(console.error);
      }
    }).catch(console.error);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try again or refresh the page.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => this.setState({ hasError: false })}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
