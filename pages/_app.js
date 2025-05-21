// pages/_app.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Apply theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ErrorBoundary>
        {isClient ? (
          <Component {...pageProps} isClient={isClient} />
        ) : (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <h1>GriotBot</h1>
            <p>Loading your digital griot experience...</p>
          </div>
        )}
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
