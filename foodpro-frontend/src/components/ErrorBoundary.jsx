import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
          <h1 className="font-bold text-2xl text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 text-sm mb-6">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-green-600 text-white font-semibold py-3 px-6 rounded-xl text-sm hover:bg-green-700 transition"
          >
            Back to Home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary