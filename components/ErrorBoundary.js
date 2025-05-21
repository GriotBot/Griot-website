// components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Client-side error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          maxWidth: '600px', 
          margin: '0 auto', 
          textAlign: 'center',
          fontFamily: 'Montserrat, system-ui, sans-serif' 
        }}>
          <h1 style={{ 
            color: '#c49a6c', 
            fontSize: '1.5rem', 
            marginBottom: '1rem' 
          }}>
            Something went wrong
          </h1>
          <p style={{ marginBottom: '1.5rem' }}>
            We apologize for the inconvenience. Please try refreshing the page or contact support if the issue persists.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#d7722c',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Refresh the page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
