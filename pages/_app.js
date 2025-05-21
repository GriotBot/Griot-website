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
    
    // Apply theme from localStorage if it exists
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
  
  {/* PREDEFINE isInitialLoad to avoid runtime crash */}
  <script
    dangerouslySetInnerHTML={{
      __html: "if(typeof window!== 'undefined'){ window.isInitialLoad = false; }",
    }}
  />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  …
</Head>
      <ErrorBoundary>
        {/* Conditionally render the actual component only if on the client */}
        {isClient ? (
          <Component {...pageProps} isClient={isClient} />
        ) : (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h1>GriotBot</h1>
            <p>Loading your digital griot experience...</p>
          </div>
        )}
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
