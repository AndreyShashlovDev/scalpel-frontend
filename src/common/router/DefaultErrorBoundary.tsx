import { ErrorBoundaryProps } from 'flexdi/react'
import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
}

class DefaultErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(e: Error): ErrorBoundaryState {
    console.error(e)
    return {hasError: true}
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary: ', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback as ReactNode || <h2>Something went wrong.</h2>
    }

    return this.props.children as ReactNode
  }
}

export default DefaultErrorBoundary
