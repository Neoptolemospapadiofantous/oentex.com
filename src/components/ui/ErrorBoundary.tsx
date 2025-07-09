// src/components/ui/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 mb-2">Something went wrong</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try again</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}