// pages/_app.js - Updated with GriotBot favicon integration and improvements
import { useEffect, useState } from 'react'
import Head from 'next/head'
import ErrorBoundary from '../components/ErrorBoundary'
import '../styles/globals.css'

// Constants for theme management
const THEME_STORAGE_KEY = 'griotbot-theme';
const DEFAULT_THEME = 'light';

export default function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    
    // Apply saved theme - no need for window check in useEffect
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch (error) {
      // Fallback if localStorage is not available
      console.warn('Could not access localStorage for theme:', error);
      document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
    }
  }, [])
  
  return (
    <>
      <Head>
        {/* Viewport and responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* 🌿 GriotBot Favicon Integration */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#d7722c" />
        
        {/* SEO Meta Tags - Enhanced */}
        <title>GriotBot - Your Digital Griot</title>
        <meta 
          name="description" 
          content="AI-powered digital griot providing culturally rich wisdom and guidance for the African diaspora. Experience storytelling, history, and cultural knowledge through AI." 
        />
        <meta name="keywords" content="griot, African culture, AI assistant, storytelling, African diaspora, cultural wisdom" />
        <meta name="author" content="GriotBot Team" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GriotBot - Your Digital Griot" />
        <meta property="og:description" content="AI-powered digital griot providing culturally rich wisdom and guidance for the African diaspora" />
        <meta property="og:site_name" content="GriotBot" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="GriotBot - Your Digital Griot" />
        <meta name="twitter:description" content="AI-powered digital griot providing culturally rich wisdom and guidance" />
        
        {/* Google Fonts - Optimized loading */}
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
          <Component {...pageProps} />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              padding: '2rem',
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              backgroundColor: '#f8f5f0',
              color: '#33302e',
            }}
          >
            {/* Logo placeholder during loading */}
            <div
              style={{
                fontSize: '3rem',
                marginBottom: '1rem',
              }}
              aria-hidden="true"
            >
              🌿
            </div>
            <h1 
              style={{
                fontSize: '2rem',
                margin: '0 0 0.5rem 0',
                fontWeight: '600',
                color: '#6b4226'
              }}
            >
              GriotBot
            </h1>
            <p 
              style={{
                fontSize: '1.1rem',
                margin: '0',
                opacity: 0.8,
                fontStyle: 'italic'
              }}
            >
              Loading your digital griot experience…
            </p>
            
            {/* Simple loading indicator */}
            <div
              style={{
                marginTop: '2rem',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#d7722c',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#d7722c',
                  animation: 'pulse 1.5s ease-in-out 0.1s infinite',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#d7722c',
                  animation: 'pulse 1.5s ease-in-out 0.2s infinite',
                }}
              />
            </div>
          </div>
        )}
      </ErrorBoundary>
      
      {/* Loading animation styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 70%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          35% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
}
