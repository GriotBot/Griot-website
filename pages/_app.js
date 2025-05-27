// pages/_app.js - Updated with GriotBot favicon integration
import { useEffect, useState } from 'react'
import Head from 'next/head'
import ErrorBoundary from '../components/ErrorBoundary'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('griotbot-theme') || 'light'
      document.documentElement.setAttribute('data-theme', t)
    }
  }, [])
  
  return (
    <>
      <Head>
        {/* Viewport and responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* 🌿 GriotBot Favicon Integration - ADDED */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#d7722c" />
        
        {/* GriotBot Meta Tags - ADDED */}
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="AI-powered digital griot providing culturally rich wisdom and guidance for the African diaspora" />
        
        {/* Existing Google Fonts - KEPT AS IS */}
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
              padding: '2rem',
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <h1>GriotBot</h1>
            <p>Loading your digital griot experience…</p>
          </div>
        )}
      </ErrorBoundary>
    </>
  )
}
