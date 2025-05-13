// File: /pages/feedback.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Feedback() {
  // State to ensure we can access DOM elements after mounting
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Initialize theme from localStorage or user preference
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
        <title>GriotBot Feedback</title>
        <meta name="description" content="Provide feedback for GriotBot" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      {/* HEADER + CONTROLS */}
      <div id="header" role="banner">
        <Link href="/" aria-label="Return to chat">
          <span style={{ position: 'absolute', left: '1rem', fontSize: '1.5rem' }}>←</span>
        </Link>
        <div className="logo-container">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          <span>GriotBot</span>
        </div>
      </div>

      <main style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        fontFamily: 'var(--body-font)',
        padding: '1.5rem',
        margin: '0 auto',
        maxWidth: '960px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: 'var(--bot-bubble-start)',
          fontFamily: 'var(--heading-font)',
          fontSize: '2rem',
          marginBottom: '0.5rem'
        }}>We'd Love Your Feedback</h1>
        
        <p style={{ marginBottom: '1.5rem' }}>
          GriotBot is growing, and your voice helps shape the journey.
        </p>
        
        <div style={{ 
          background: 'var(--card-bg)',
          borderRadius: '12px',
          boxShadow: '0 3px 10px var(--shadow-color)',
          overflow: 'hidden',
          marginBottom: '1.5rem'
        }}>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdTfuVK9qk0lfin5xMfTQoakoZOPrcbrCQTswt3oDSTyp4i0w/viewform?embedded=true"
            style={{
              width: '100%',
              height: '70vh',
              border: 'none'
            }}
            loading="lazy"
            title="GriotBot Feedback Form"
          >Loading…</iframe>
        </div>
        
        <Link 
          href="/" 
          style={{
            color: 'var(--accent-color)',
            display: 'inline-block',
            marginTop: '1rem',
            textDecoration: 'none',
            fontWeight: '500',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(215, 114, 44, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ← Back to GriotBot
        </Link>
      </main>

      {/* FOOTER */}
      <div id="copyright" style={{ 
        position: 'relative', 
        marginTop: '1rem', 
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: 0.6
      }}>
        © 2025 GriotBot. All rights reserved.
      </div>
    </>
  );
}
