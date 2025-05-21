// components/ErrorBoundary.js
import React from 'react';
import styles from '../styles/components/ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Client-side error caught:', error, errorInfo);
  }

  handleReload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <h1 className={styles.heading}>Something went wrong</h1>
          <p className={styles.message}>
            We apologize for the inconvenience. Please try refreshing the page or contact support if the issue persists.
          </p>
          <button onClick={this.handleReload} className={styles.button}>
            Refresh the page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
