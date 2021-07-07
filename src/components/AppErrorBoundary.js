import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(errorInfo) {
    this.setState({ hasError: true, errorInfo: errorInfo });
  }

  render() {
    const { hasError, errorInfo } = this.state;
    const { children } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h5 style={{ color: 'tomato' }}>Failed to render data table. Please try again later.</h5>
          {errorInfo && <p>{JSON.stringify(errorInfo)}</p>}
        </div>
      );
    }

    return children;
  }
}
